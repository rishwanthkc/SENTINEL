package com.sentinel.app.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.platform.LocalContext
import androidx.lifecycle.viewmodel.compose.viewModel
import com.sentinel.app.model.EmergencyHistoryResponse
import com.sentinel.app.ui.theme.*
import com.sentinel.app.utils.SessionManager
import com.sentinel.app.viewmodel.MainViewModel

@Composable
fun HistoryScreen(

    viewModel: MainViewModel =
        viewModel()
) {

    val context = LocalContext.current

    val sessionManager =
        remember {
            SessionManager(context)
        }

    var emergencyList by remember {

        mutableStateOf<
                List<EmergencyHistoryResponse>
                >(emptyList())
    }

    LaunchedEffect(Unit) {

        val email =
            sessionManager
                .getUserEmail()

        if (email != null) {

            viewModel.fetchEmergencyHistory(
                email
            ) {

                emergencyList = it
            }
        }
    }

    Column(
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
            .padding(
                top = 60.dp,
                start = 20.dp,
                end = 20.dp,
                bottom = 20.dp
            )    ) {

        Text(
            text = "Emergency Timeline",

            color = NeonBlue,

            fontSize = 30.sp,

            fontWeight = FontWeight.Bold
        )

        Spacer(
            modifier = Modifier.height(20.dp)
        )

        LazyColumn {

            items(emergencyList) { item ->

                Card(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(bottom = 16.dp),

                    shape = RoundedCornerShape(20.dp),

                    colors = CardDefaults.cardColors(
                        containerColor = CardDark
                    )
                ) {

                    Column(
                        modifier =
                            Modifier.padding(20.dp)
                    ) {

                        Text(
                            text =
                                "STATUS : ${item.status}",

                            color = NeonBlue,

                            fontWeight =
                                FontWeight.Bold,

                            fontSize = 18.sp
                        )

                        Spacer(
                            modifier =
                                Modifier.height(10.dp)
                        )

                        Text(
                            text =
                                "Latitude : ${item.latitude}",

                            color = SoftWhite
                        )

                        Text(
                            text =
                                "Longitude : ${item.longitude}",

                            color = SoftWhite
                        )

                        Spacer(
                            modifier =
                                Modifier.height(10.dp)
                        )

                        Text(
                            text = item.created_at,

                            color = TextGray
                        )
                    }
                }
            }
        }
    }
}