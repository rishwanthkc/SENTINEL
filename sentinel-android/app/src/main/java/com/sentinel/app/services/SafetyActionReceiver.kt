package com.sentinel.app.services

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import androidx.core.content.ContextCompat

/**
 * Receives the "I'm Safe" / "Send SOS" actions tapped on the safety-check
 * notification and forwards them to the already-running monitor service.
 */
class SafetyActionReceiver : BroadcastReceiver() {

    override fun onReceive(context: Context, intent: Intent) {
        val action = intent.action ?: return
        val forward = Intent(context, JourneyTrackingService::class.java)
        forward.action = action
        ContextCompat.startForegroundService(context, forward)
    }
}
