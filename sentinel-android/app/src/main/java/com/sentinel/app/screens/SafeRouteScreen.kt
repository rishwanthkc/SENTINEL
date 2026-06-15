package com.sentinel.app.screens
import com.sentinel.app.utils.Screen

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*

import androidx.compose.foundation.shape.RoundedCornerShape

import androidx.compose.material3.*

import androidx.compose.runtime.*

import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush

import androidx.compose.ui.unit.dp
import androidx.navigation.NavController
import com.sentinel.app.ui.theme.*
import androidx.lifecycle.viewmodel.compose.viewModel

import com.sentinel.app.viewmodel.MainViewModel
import android.annotation.SuppressLint
import android.location.Geocoder
import android.os.Looper

import com.google.android.gms.location.*
import androidx.compose.runtime.LaunchedEffect

import java.util.Locale

@Composable
fun SafeRouteScreen(

    navController: NavController,

    viewModel: MainViewModel
) {

    var source by remember {
        mutableStateOf("Detecting location...")
    }

    var destination by remember {
        mutableStateOf("")
    }
    val context =
        androidx.compose.ui.platform.LocalContext.current

    val fusedLocationClient =
        LocationServices.getFusedLocationProviderClient(
            context
        )

    LaunchedEffect(Unit) {

        try {

            @SuppressLint("MissingPermission")

            fun getLocation() {

                fusedLocationClient
                    .lastLocation
                    .addOnSuccessListener { location ->

                        if (location != null) {

                            try {

                                val geocoder =
                                    Geocoder(
                                        context,
                                        Locale.getDefault()
                                    )

                                val addresses =

                                    geocoder.getFromLocation(

                                        location.latitude,

                                        location.longitude,

                                        1
                                    )

                                if (
                                    !addresses.isNullOrEmpty()
                                ) {

                                    source =

                                        addresses[0]
                                            .getAddressLine(0)
                                }

                            } catch (e: Exception) {

                                e.printStackTrace()
                            }
                        }
                    }
            }

            getLocation()

        } catch (e: Exception) {

            e.printStackTrace()
        }
    }

    Box(

        modifier = Modifier
            .fillMaxSize()
            .background(

                Brush.verticalGradient(

                    listOf(

                        BackgroundBlack,

                        DarkBlue,

                        DeepNavy
                    )
                )
            )
    ) {

        Column(

            modifier = Modifier
                .fillMaxSize()
                .padding(24.dp)
        ) {

            Spacer(
                modifier =
                    Modifier.height(50.dp)
            )

            Text(

                text =
                    "SAFE ROUTE AI",

                color =
                    NeonBlue,

                style =
                    MaterialTheme
                        .typography
                        .headlineMedium
            )

            Spacer(
                modifier =
                    Modifier.height(28.dp)
            )

            OutlinedTextField(

                value = source,

                onValueChange = {},

                readOnly = true,

                label = {
                    Text("Source")
                },

                modifier =
                    Modifier.fillMaxWidth(),

                shape =
                    RoundedCornerShape(20.dp),

                colors =
                    OutlinedTextFieldDefaults
                        .colors(

                            focusedBorderColor =
                                NeonBlue
                        )
            )

            Spacer(
                modifier =
                    Modifier.height(20.dp)
            )

            OutlinedTextField(

                value = destination,

                onValueChange = {
                    destination = it
                },

                label = {
                    Text("Destination")
                },

                modifier =
                    Modifier.fillMaxWidth(),

                shape =
                    RoundedCornerShape(20.dp),

                colors =
                    OutlinedTextFieldDefaults
                        .colors(

                            focusedBorderColor =
                                NeonBlue
                        )
            )

            Spacer(
                modifier =
                    Modifier.height(32.dp)
            )

            Button(

                onClick = {
                    viewModel.startJourney(

                        source,

                        destination
                    )
                    navController.navigate(
                        Screen.RouteRecommendation.route
                    )

                },

                modifier =
                    Modifier
                        .fillMaxWidth()
                        .height(58.dp),

                shape =
                    RoundedCornerShape(20.dp),

                colors =
                    ButtonDefaults.buttonColors(

                        containerColor =
                            NeonBlue
                    )
            ) {

                Text(

                    text =
                        "GENERATE SAFE ROUTE",

                    color =
                        BackgroundBlack
                )
            }
        }
    }
}