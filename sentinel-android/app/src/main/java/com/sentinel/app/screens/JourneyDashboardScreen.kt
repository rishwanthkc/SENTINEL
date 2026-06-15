package com.sentinel.app.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*

import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.unit.dp

import androidx.lifecycle.viewmodel.compose.viewModel

import com.sentinel.app.viewmodel.MainViewModel
import com.sentinel.app.ui.theme.*

@Composable
fun JourneyDashboardScreen(

    viewModel: MainViewModel = viewModel()

) {

    val journey =
        viewModel.currentJourney

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
                .padding(24.dp),

            horizontalAlignment =
                Alignment.CenterHorizontally
        ) {

            Spacer(
                modifier =
                    Modifier.height(40.dp)
            )

            Text(

                text =
                    "JOURNEY MONITOR",

                color =
                    NeonBlue,

                style =
                    MaterialTheme
                        .typography
                        .headlineMedium
            )

            Spacer(
                modifier =
                    Modifier.height(30.dp)
            )

            Card(

                modifier =
                    Modifier.fillMaxWidth(),

                colors =
                    CardDefaults.cardColors(

                        containerColor =
                            DarkBlue
                    )
            ) {

                Column(

                    modifier =
                        Modifier.padding(20.dp)
                ) {

                    Text(
                        text =
                            "📍 Source"
                    )

                    Text(
                        text =
                            journey.source
                    )

                    Spacer(
                        modifier =
                            Modifier.height(12.dp)
                    )

                    Text(
                        text =
                            "🎯 Destination"
                    )

                    Text(
                        text =
                            journey.destination
                    )

                    Spacer(
                        modifier =
                            Modifier.height(12.dp)
                    )

                    Text(
                        text =
                            "🛡 Status"
                    )

                    Text(
                        text =
                            if (journey.isActive)
                                "SAFE"
                            else
                                "ENDED"
                    )

                    Spacer(
                        modifier =
                            Modifier.height(12.dp)
                    )

                    Text(
                        text =
                            "🚨 Deviation"
                    )

                    Text(
                        text =
                            if (journey.isDeviationDetected)
                                "DETECTED"
                            else
                                "NONE"
                    )
                }
            }
        }
    }
}