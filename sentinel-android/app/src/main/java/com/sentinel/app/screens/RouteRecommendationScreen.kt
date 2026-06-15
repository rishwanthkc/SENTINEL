package com.sentinel.app.screens

import android.content.Intent
import android.net.Uri
import android.provider.Settings
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.viewmodel.compose.viewModel

import com.sentinel.app.services.JourneyTrackingService
import com.sentinel.app.ui.theme.*
import com.sentinel.app.utils.NavigationHelper
import com.sentinel.app.utils.SessionManager
import com.sentinel.app.viewmodel.MainViewModel

@Composable
fun RouteRecommendationScreen(
    viewModel: MainViewModel = viewModel()
) {
    val context = LocalContext.current
    val journey = viewModel.currentJourney

    val loading = viewModel.safeRouteLoading
    val safe = viewModel.safeRoute
    val best = safe?.routes?.getOrNull(safe.safest_index)
    val score = best?.safety_score

    val riskLevel = when {
        score == null -> "—"
        score >= 75 -> "LOW"
        score >= 45 -> "MEDIUM"
        else -> "HIGH"
    }
    val scoreColor = when {
        score == null -> TextGray
        score >= 75 -> SuccessGreen
        score >= 45 -> WarningAmber
        else -> EmergencyRed
    }

    // Ask the backend to score Google's alternative routes against the
    // crime dataset + user reports and return the safest one.
    LaunchedEffect(journey.source, journey.destination) {
        if (journey.source.isNotBlank() && journey.destination.isNotBlank()) {
            viewModel.fetchSafeRoute(journey.source, journey.destination)
        }
    }

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(
                Brush.verticalGradient(
                    listOf(BackgroundBlack, DarkBlue, DeepNavy)
                )
            )
    ) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(24.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {

            Spacer(Modifier.height(56.dp))

            Text(
                text = "SAFEST ROUTE ANALYSIS",
                color = NeonBlue,
                style = MaterialTheme.typography.headlineMedium
            )

            Spacer(Modifier.height(28.dp))

            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(20.dp),
                colors = CardDefaults.cardColors(containerColor = DarkBlue)
            ) {
                Column(modifier = Modifier.padding(20.dp)) {
                    when {
                        loading -> {
                            Row(
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                CircularProgressIndicator(
                                    color = NeonBlue,
                                    strokeWidth = 2.dp,
                                    modifier = Modifier.size(20.dp)
                                )
                                Spacer(Modifier.width(12.dp))
                                Text(
                                    text = "Analyzing safest route…",
                                    color = NeonBlue
                                )
                            }
                        }
                        best == null -> {
                            Text(
                                text = "Couldn't compute a safe route. " +
                                    "Check your connection and try again.",
                                color = EmergencyRed
                            )
                        }
                        else -> {
                            Text(
                                text = "Safety Score : ${score}%",
                                color = scoreColor,
                                fontSize = 22.sp,
                                fontWeight = FontWeight.Bold
                            )
                            Spacer(Modifier.height(8.dp))
                            Text(
                                text = "Risk Level : $riskLevel",
                                color = scoreColor
                            )
                            Spacer(Modifier.height(8.dp))
                            Text(
                                text = "Distance : ${best.distance}   •   " +
                                    "ETA : ${best.duration}",
                                color = Color.White
                            )
                            Spacer(Modifier.height(8.dp))
                            Text(
                                text = "Chosen as the safest of " +
                                    "${safe.routes.size} route(s).",
                                color = Color.White
                            )
                            Spacer(Modifier.height(8.dp))
                            Text(
                                text = "Risk zones avoided : " +
                                    "${safe.risk_points.size} " +
                                    "(crime data + community reports)",
                                color = EmergencyRed
                            )
                        }
                    }
                }
            }

            Spacer(Modifier.height(24.dp))

            Text(text = "From : ${journey.source}", color = TextWhite)
            Text(text = "To : ${journey.destination}", color = TextWhite)

            Spacer(Modifier.height(24.dp))

            Button(
                onClick = { startMonitoredJourney(viewModel, context) },
                enabled = best != null,
                modifier = Modifier
                    .fillMaxWidth()
                    .height(60.dp),
                shape = RoundedCornerShape(20.dp),
                colors = ButtonDefaults.buttonColors(containerColor = NeonBlue)
            ) {
                Text(
                    text = "START SAFE NAVIGATION",
                    color = BackgroundBlack
                )
            }

            Spacer(Modifier.height(12.dp))

            Text(
                text = "Sentinel monitors your journey and alerts your " +
                    "contacts if something seems wrong.",
                color = TextGray,
                style = MaterialTheme.typography.bodyMedium
            )
        }
    }
}

private fun startMonitoredJourney(
    viewModel: MainViewModel,
    context: android.content.Context
) {
    val journey = viewModel.currentJourney

    // routePoints already holds the safest route from fetchSafeRoute().
    val points = viewModel.routePoints
    val routeArr = DoubleArray(points.size * 2)
    points.forEachIndexed { i, p ->
        routeArr[i * 2] = p.latitude
        routeArr[i * 2 + 1] = p.longitude
    }

    val phones = ArrayList(viewModel.emergencyContacts.map { it.phone })
    val email = SessionManager(context).getUserEmail()

    val serviceIntent =
        Intent(context, JourneyTrackingService::class.java).apply {
            action = JourneyTrackingService.ACTION_START
            putExtra(JourneyTrackingService.EXTRA_ROUTE, routeArr)
            putStringArrayListExtra(
                JourneyTrackingService.EXTRA_CONTACTS,
                phones
            )
            putExtra(JourneyTrackingService.EXTRA_EMAIL, email)
            putExtra(JourneyTrackingService.EXTRA_DEST, journey.destination)
        }

    android.widget.Toast.makeText(
        context,
        "Journey monitoring started",
        android.widget.Toast.LENGTH_LONG
    ).show()

    context.startForegroundService(serviceIntent)

    if (!Settings.canDrawOverlays(context)) {
        val overlayIntent = Intent(
            Settings.ACTION_MANAGE_OVERLAY_PERMISSION,
            Uri.parse("package:" + context.packageName)
        ).addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
        try {
            context.startActivity(overlayIntent)
        } catch (_: Exception) {
        }
    }

    NavigationHelper.openGoogleMaps(
        context,
        journey.source,
        journey.destination
    )
}
