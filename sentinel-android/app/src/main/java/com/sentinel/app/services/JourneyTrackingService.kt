package com.sentinel.app.services

import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.app.Service
import android.content.Intent
import android.content.pm.ServiceInfo
import android.location.Location
import android.os.Build
import android.os.Handler
import android.os.IBinder
import android.os.Looper
import android.util.Log

import com.google.android.gms.location.*
import com.sentinel.app.utils.GeoUtils
import com.sentinel.app.utils.SosHelper

/**
 * Foreground journey monitor.
 *
 * While a journey is active it tracks GPS and watches for two danger signals:
 *  1. Route deviation  — off the planned route for > DEVIATION_TIME.
 *  2. Unexpected stop  — stationary in one spot for > STATIONARY_TIME.
 *
 * Either one pops a heads-up "Are you safe?" notification (I'm Safe / Send SOS).
 * If the user ignores it for > IGNORE_TIMEOUT, an SMS SOS with the live
 * location is sent to all saved emergency contacts.
 */
class JourneyTrackingService : Service() {

    companion object {
        const val ACTION_START = "com.sentinel.app.JOURNEY_START"
        const val ACTION_STOP = "com.sentinel.app.JOURNEY_STOP"
        const val ACTION_USER_SAFE = "com.sentinel.app.USER_SAFE"
        const val ACTION_USER_SOS = "com.sentinel.app.USER_SOS"

        const val EXTRA_ROUTE = "extra_route"          // interleaved lat,lng
        const val EXTRA_CONTACTS = "extra_contacts"    // ArrayList<String>
        const val EXTRA_EMAIL = "extra_email"
        const val EXTRA_DEST = "extra_dest"

        // Tunables
        const val DEVIATION_DISTANCE_M = 80f
        const val DEVIATION_TIME_MS = 10 * 60 * 1000L     // 10 min off route
        const val STATIONARY_RADIUS_M = 40f
        const val STATIONARY_TIME_MS = 5 * 60 * 1000L     // 5 min stopped
        const val IGNORE_TIMEOUT_MS = 5 * 60 * 1000L      // 5 min to respond
        const val LOCATION_INTERVAL_MS = 15000L

        private const val ONGOING_ID = 1001
        private const val SAFETY_ID = 2002
        private const val CH_ONGOING = "journey_channel"
        private const val CH_SAFETY = "safety_check_channel"
        private const val TAG = "SENTINEL_MONITOR"
    }

    private lateinit var fusedLocationClient: FusedLocationProviderClient
    private var locationCallback: LocationCallback? = null

    private val handler = Handler(Looper.getMainLooper())
    private var ignoreRunnable: Runnable? = null

    private var route: DoubleArray? = null
    private var contacts: List<String> = emptyList()
    private var userEmail: String? = null
    private var destination: String? = null

    private var started = false
    private var bubble: HoverBubble? = null

    // last known position (for SOS coords)
    private var lastLat = 0.0
    private var lastLng = 0.0
    private var hasFix = false

    // detection state
    private var deviationSince = 0L
    private var anchorLat = 0.0
    private var anchorLng = 0.0
    private var stationarySince = 0L
    private var hasAnchor = false

    // safety-check state
    private var safetyActive = false
    private var safetyReason = ""

    override fun onCreate() {
        super.onCreate()
        createChannels()
        fusedLocationClient =
            LocationServices.getFusedLocationProviderClient(this)
    }

    override fun onStartCommand(
        intent: Intent?,
        flags: Int,
        startId: Int
    ): Int {
        when (intent?.action) {
            ACTION_USER_SAFE -> onUserSafe()
            ACTION_USER_SOS -> fireSos("manual")
            ACTION_STOP -> {
                stopMonitoring()
                stopSelf()
            }
            else -> {
                // ACTION_START or system restart
                intent?.let { readExtras(it) }
                startMonitoring()
            }
        }
        return START_STICKY
    }

    private fun readExtras(intent: Intent) {
        intent.getDoubleArrayExtra(EXTRA_ROUTE)?.let { route = it }
        intent.getStringArrayListExtra(EXTRA_CONTACTS)?.let { contacts = it }
        intent.getStringExtra(EXTRA_EMAIL)?.let { userEmail = it }
        intent.getStringExtra(EXTRA_DEST)?.let { destination = it }
    }

    private fun startMonitoring() {
        if (started) return
        started = true

        startForegroundCompat(buildOngoingNotification())

        bubble = HoverBubble(this).also { it.show() }

        val request = LocationRequest.Builder(
            Priority.PRIORITY_HIGH_ACCURACY,
            LOCATION_INTERVAL_MS
        ).build()

        locationCallback = object : LocationCallback() {
            override fun onLocationResult(result: LocationResult) {
                result.lastLocation?.let { processLocation(it) }
            }
        }

        try {
            fusedLocationClient.requestLocationUpdates(
                request,
                locationCallback!!,
                Looper.getMainLooper()
            )
        } catch (e: SecurityException) {
            Log.e(TAG, "Location permission missing", e)
        }
    }

    private fun processLocation(loc: Location) {
        val now = System.currentTimeMillis()
        lastLat = loc.latitude
        lastLng = loc.longitude
        hasFix = true

        // ---- Stationary detection ----
        if (!hasAnchor) {
            anchorLat = loc.latitude
            anchorLng = loc.longitude
            stationarySince = now
            hasAnchor = true
        } else {
            val moved = GeoUtils.distanceMeters(
                anchorLat, anchorLng, loc.latitude, loc.longitude
            )
            if (moved > STATIONARY_RADIUS_M) {
                anchorLat = loc.latitude
                anchorLng = loc.longitude
                stationarySince = now
            } else if (
                !safetyActive &&
                now - stationarySince >= STATIONARY_TIME_MS
            ) {
                triggerSafetyCheck("stop")
            }
        }

        // ---- Deviation detection (needs a route) ----
        val routeArr = route
        if (routeArr != null && routeArr.size >= 2) {
            val offBy = GeoUtils.distanceToRouteMeters(
                loc.latitude, loc.longitude, routeArr
            )
            if (offBy > DEVIATION_DISTANCE_M) {
                if (deviationSince == 0L) deviationSince = now
                if (
                    !safetyActive &&
                    now - deviationSince >= DEVIATION_TIME_MS
                ) {
                    triggerSafetyCheck("deviation")
                }
            } else {
                deviationSince = 0L
            }
        }
    }

    private fun triggerSafetyCheck(reason: String) {
        if (safetyActive) return
        safetyActive = true
        safetyReason = reason

        notify(SAFETY_ID, buildSafetyNotification(reason))

        ignoreRunnable = Runnable {
            if (safetyActive) fireSos(reason)
        }
        handler.postDelayed(ignoreRunnable!!, IGNORE_TIMEOUT_MS)
    }

    private fun onUserSafe() {
        safetyActive = false
        ignoreRunnable?.let { handler.removeCallbacks(it) }
        ignoreRunnable = null
        // reset timers so the same condition does not retrigger immediately
        val now = System.currentTimeMillis()
        deviationSince = 0L
        stationarySince = now
        anchorLat = lastLat
        anchorLng = lastLng
        cancelNotification(SAFETY_ID)
        notify(ONGOING_ID, buildOngoingNotification("You're marked safe. Still monitoring."))
    }

    private fun fireSos(reason: String) {
        safetyActive = false
        ignoreRunnable?.let { handler.removeCallbacks(it) }
        ignoreRunnable = null
        cancelNotification(SAFETY_ID)

        if (hasFix && contacts.isNotEmpty()) {
            contacts.forEach { phone ->
                try {
                    SosHelper.sendSOS(phone, lastLat, lastLng)
                } catch (e: Exception) {
                    Log.e(TAG, "SOS SMS failed for $phone", e)
                }
            }
        }
        Log.d(TAG, "SOS fired ($reason) to ${contacts.size} contacts")
        notify(
            ONGOING_ID,
            buildOngoingNotification("SOS sent to your contacts.")
        )
        // allow re-detection after this event
        deviationSince = 0L
        stationarySince = System.currentTimeMillis()
    }

    private fun stopMonitoring() {
        started = false
        ignoreRunnable?.let { handler.removeCallbacks(it) }
        ignoreRunnable = null
        locationCallback?.let {
            fusedLocationClient.removeLocationUpdates(it)
        }
        locationCallback = null
        bubble?.hide()
        bubble = null
    }

    override fun onDestroy() {
        stopMonitoring()
        super.onDestroy()
    }

    override fun onBind(intent: Intent?): IBinder? = null

    // ---------------- Notifications ----------------

    private fun createChannels() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val manager = getSystemService(NotificationManager::class.java)
            manager.createNotificationChannel(
                NotificationChannel(
                    CH_ONGOING,
                    "Journey Tracking",
                    NotificationManager.IMPORTANCE_LOW
                )
            )
            val safety = NotificationChannel(
                CH_SAFETY,
                "Safety Checks",
                NotificationManager.IMPORTANCE_HIGH
            ).apply {
                enableVibration(true)
                description = "Asks if you are safe during a journey"
            }
            manager.createNotificationChannel(safety)
        }
    }

    private fun startForegroundCompat(notification: Notification) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
            startForeground(
                ONGOING_ID,
                notification,
                ServiceInfo.FOREGROUND_SERVICE_TYPE_LOCATION
            )
        } else {
            startForeground(ONGOING_ID, notification)
        }
    }

    private fun buildOngoingNotification(
        text: String = "Monitoring your safe route"
    ): Notification {
        return Notification.Builder(this, CH_ONGOING)
            .setContentTitle("Sentinel Journey Active")
            .setContentText(text)
            .setSmallIcon(android.R.drawable.ic_dialog_map)
            .setOngoing(true)
            .build()
    }

    private fun buildSafetyNotification(reason: String): Notification {
        val title = "Are you safe?"
        val body =
            if (reason == "deviation")
                "You've been off your route for a while. Tap to confirm you're okay."
            else
                "You've been stopped for a while. Tap to confirm you're okay."

        return Notification.Builder(this, CH_SAFETY)
            .setContentTitle(title)
            .setContentText(body)
            .setStyle(Notification.BigTextStyle().bigText(body))
            .setSmallIcon(android.R.drawable.ic_dialog_alert)
            .setCategory(Notification.CATEGORY_ALARM)
            .setAutoCancel(false)
            .setOngoing(true)
            .addAction(
                android.R.drawable.ic_menu_mylocation,
                "I'M SAFE",
                actionPendingIntent(ACTION_USER_SAFE)
            )
            .addAction(
                android.R.drawable.ic_menu_send,
                "SEND SOS",
                actionPendingIntent(ACTION_USER_SOS)
            )
            .build()
    }

    private fun actionPendingIntent(action: String): PendingIntent {
        val intent = Intent(this, SafetyActionReceiver::class.java)
        intent.action = action
        return PendingIntent.getBroadcast(
            this,
            action.hashCode(),
            intent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )
    }

    private fun notify(id: Int, notification: Notification) {
        getSystemService(NotificationManager::class.java)
            .notify(id, notification)
    }

    private fun cancelNotification(id: Int) {
        getSystemService(NotificationManager::class.java).cancel(id)
    }
}
