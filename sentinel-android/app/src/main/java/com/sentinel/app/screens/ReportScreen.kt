package com.sentinel.app.screens

import android.annotation.SuppressLint
import android.widget.Toast
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape

import androidx.compose.material3.*

import androidx.compose.runtime.*

import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.unit.dp
import androidx.compose.foundation.layout.statusBarsPadding
import com.google.android.gms.location.LocationServices

import com.sentinel.app.api.models.ReportRequest
import com.sentinel.app.ui.theme.*
import com.sentinel.app.viewmodel.MainViewModel

@OptIn(ExperimentalMaterial3Api::class)
@SuppressLint("MissingPermission")
@Composable
fun ReportScreen(

    viewModel: MainViewModel
) {

    val context =
        LocalContext.current

    val fusedLocationClient =
        remember {

            LocationServices
                .getFusedLocationProviderClient(
                    context
                )
        }

    var latitude by remember {
        mutableStateOf(0.0)
    }

    var longitude by remember {
        mutableStateOf(0.0)
    }

    LaunchedEffect(Unit) {

        fusedLocationClient
            .lastLocation
            .addOnSuccessListener {

                if (it != null) {

                    latitude =
                        it.latitude

                    longitude =
                        it.longitude
                }
            }
    }

    var reportType by remember {
        mutableStateOf("Harassment")
    }

    var description by remember {
        mutableStateOf("")
    }

    val severity = when(reportType) {

        "Assault" -> 3

        "Harassment" -> 2

        "Suspicious Activity" -> 2

        else -> 1
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
                .padding(
                    top = 70.dp,
                    start = 24.dp,
                    end = 24.dp,
                    bottom = 24.dp
                )        ) {

            Text(

                text = "COMMUNITY REPORT",

                color = NeonBlue,

                style =
                    MaterialTheme.typography
                        .headlineMedium
            )

            Spacer(
                modifier =
                    Modifier.height(24.dp)
            )

            val reportTypes = listOf(

                "Assault",

                "Harassment",

                "Poor Lighting",

                "Suspicious Activity",

                "Other"
            )

            var expanded by remember {
                mutableStateOf(false)
            }

            ExposedDropdownMenuBox(

                expanded = expanded,

                onExpandedChange = {
                    expanded = !expanded
                }
            ) {

                OutlinedTextField(

                    value = reportType,

                    onValueChange = {},

                    readOnly = true,

                    label = {
                        Text("Report Type")
                    },

                    modifier =
                        Modifier
                            .menuAnchor()
                            .fillMaxWidth(),

                    colors =
                        OutlinedTextFieldDefaults
                            .colors(

                                focusedBorderColor =
                                    NeonBlue,

                                unfocusedBorderColor =
                                    TextGray
                            )
                )

                ExposedDropdownMenu(

                    expanded = expanded,

                    onDismissRequest = {
                        expanded = false
                    }
                ) {

                    reportTypes.forEach {

                        DropdownMenuItem(

                            text = {
                                Text(it)
                            },

                            onClick = {

                                reportType = it

                                expanded = false
                            }
                        )
                    }
                }
            }

            Spacer(
                modifier =
                    Modifier.height(20.dp)
            )

            OutlinedTextField(

                value = description,

                onValueChange = {
                    description = it
                },

                label = {
                    Text("Description")
                },

                modifier =
                    Modifier
                        .fillMaxWidth()
                        .height(160.dp),

                shape =
                    RoundedCornerShape(20.dp),

                colors =
                    OutlinedTextFieldDefaults
                        .colors(

                            focusedBorderColor =
                                NeonBlue,

                            unfocusedBorderColor =
                                TextGray
                        )
            )

            Spacer(
                modifier =
                    Modifier.height(20.dp)
            )

            Text(

                text =
                    "Latitude: $latitude",

                color = SoftWhite
            )

            Text(

                text =
                    "Longitude: $longitude",

                color = SoftWhite
            )

            Spacer(
                modifier =
                    Modifier.height(32.dp)
            )

            Button(

                onClick = {

                    val request = ReportRequest(

                        user_email =
                            "rishi@test.com",

                        report_type =
                            reportType,

                        severity =
                            severity,

                        latitude =
                            latitude,

                        longitude =
                            longitude,

                        description =
                            description
                    )

                    viewModel.submitReport(

                        request
                    ) {

                        Toast
                            .makeText(

                                context,

                                it,

                                Toast.LENGTH_SHORT
                            )
                            .show()
                    }
                },

                modifier =
                    Modifier
                        .fillMaxWidth()
                        .height(60.dp),

                shape =
                    RoundedCornerShape(20.dp),

                colors =
                    ButtonDefaults
                        .buttonColors(

                            containerColor =
                                NeonBlue
                        )
            ) {

                Text(

                    text =
                        "SUBMIT REPORT",

                    color =
                        BackgroundBlack
                )
            }
        }
    }
}