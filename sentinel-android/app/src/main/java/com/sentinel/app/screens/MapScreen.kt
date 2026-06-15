package com.sentinel.app.screens

import android.annotation.SuppressLint
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.lifecycle.viewmodel.compose.viewModel

import com.google.android.gms.location.LocationServices
import com.google.android.gms.maps.CameraUpdateFactory
import com.google.android.gms.maps.model.*
import com.google.maps.android.compose.*

import kotlinx.coroutines.delay

import com.sentinel.app.model.ActiveEmergencyResponse
import com.sentinel.app.ui.theme.EmergencyRed
import com.sentinel.app.ui.theme.NeonBlue
import com.sentinel.app.viewmodel.MainViewModel

@SuppressLint("MissingPermission")
@Composable
fun MapScreen(
    viewModel: MainViewModel
) {
    val context = LocalContext.current

    val fusedLocationClient = remember {
        LocationServices.getFusedLocationProviderClient(context)
    }

    var currentLocation by remember {
        mutableStateOf(LatLng(13.0827, 80.2707))
    }

    val cameraPositionState = rememberCameraPositionState()

    val routePoints = viewModel.routePoints
    val riskPoints = viewModel.riskPoints

    val activeEmergencies = remember {
        mutableStateListOf<ActiveEmergencyResponse>()
    }

    // Follow the user until a route is drawn.
    LaunchedEffect(currentLocation) {
        if (routePoints.isEmpty()) {
            cameraPositionState.move(
                CameraUpdateFactory.newLatLngZoom(currentLocation, 15f)
            )
        }
    }

    // Frame the route when one is available.
    LaunchedEffect(routePoints) {
        if (routePoints.isNotEmpty()) {
            cameraPositionState.animate(
                update = CameraUpdateFactory.newLatLngZoom(
                    routePoints.first(),
                    13f
                ),
                durationMs = 1500
            )
        }
    }

    // Live data loop: risk points, emergencies, location.
    LaunchedEffect(Unit) {
        while (true) {
            viewModel.fetchRiskPoints()

            fusedLocationClient.lastLocation.addOnSuccessListener { location ->
                if (location != null) {
                    currentLocation =
                        LatLng(location.latitude, location.longitude)
                }
            }

            viewModel.fetchActiveEmergencies {
                activeEmergencies.clear()
                activeEmergencies.addAll(it)
            }

            delay(8000)
        }
    }

    GoogleMap(
        modifier = Modifier.fillMaxSize(),
        cameraPositionState = cameraPositionState
    ) {

        // User location
        Marker(
            state = MarkerState(position = currentLocation),
            title = "You",
            snippet = "Live Location",
            icon = BitmapDescriptorFactory.defaultMarker(
                BitmapDescriptorFactory.HUE_AZURE
            )
        )

        // Safest route
        if (routePoints.isNotEmpty()) {
            Polyline(
                points = routePoints,
                color = NeonBlue,
                width = 18f
            )
        }

        // Risk zones (crime dataset + community reports)
        riskPoints.forEach { rp ->
            val pos = LatLng(rp.latitude, rp.longitude)
            val color = when (rp.severity) {
                3 -> EmergencyRed
                2 -> Color(0xFFFBBF24)
                else -> Color(0xFF34D399)
            }
            val radius = when (rp.severity) {
                3 -> 260.0
                2 -> 190.0
                else -> 130.0
            }
            Circle(
                center = pos,
                radius = radius,
                fillColor = color.copy(alpha = 0.22f),
                strokeColor = color,
                strokeWidth = 3f
            )
            Marker(
                state = MarkerState(position = pos),
                title = rp.category ?: "Risk",
                snippet = (rp.source ?: "") + " · severity " + rp.severity,
                icon = BitmapDescriptorFactory.defaultMarker(
                    when (rp.severity) {
                        3 -> BitmapDescriptorFactory.HUE_RED
                        2 -> BitmapDescriptorFactory.HUE_ORANGE
                        else -> BitmapDescriptorFactory.HUE_YELLOW
                    }
                )
            )
        }

        // Live SOS markers
        activeEmergencies.forEach { emergency ->
            Marker(
                state = MarkerState(
                    position = LatLng(
                        emergency.latitude,
                        emergency.longitude
                    )
                ),
                title = "SOS ALERT",
                snippet = emergency.user_email + "\n" + emergency.created_at,
                icon = BitmapDescriptorFactory.defaultMarker(
                    BitmapDescriptorFactory.HUE_VIOLET
                )
            )
        }
    }
}
