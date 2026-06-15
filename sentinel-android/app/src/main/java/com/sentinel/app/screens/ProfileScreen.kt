package com.sentinel.app.screens
import com.sentinel.app.utils.Screen

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*

import androidx.compose.foundation.shape.RoundedCornerShape

import androidx.compose.material3.*

import androidx.compose.runtime.Composable

import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier

import androidx.compose.ui.graphics.Brush

import androidx.compose.ui.platform.LocalContext

import androidx.compose.ui.text.font.FontWeight

import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

import androidx.navigation.NavController

import com.sentinel.app.ui.theme.*

import com.sentinel.app.utils.SessionManager

@Composable
fun ProfileScreen(

    navController: NavController
) {

    val context =
        LocalContext.current

    val sessionManager =
        SessionManager(context)

    val email =
        sessionManager.getUserEmail()

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
                    Modifier.height(70.dp)
            )

            Text(

                text = "PROFILE",

                color = NeonBlue,

                fontSize = 34.sp,

                fontWeight =
                    FontWeight.Bold
            )

            Spacer(
                modifier =
                    Modifier.height(40.dp)
            )

            Card(

                modifier =
                    Modifier.fillMaxWidth(),

                shape =
                    RoundedCornerShape(24.dp),

                colors =
                    CardDefaults.cardColors(

                        containerColor =
                            CardDark
                    )
            ) {

                Column(

                    modifier =
                        Modifier.padding(24.dp)
                ) {

                    Text(

                        text = "Logged in as",

                        color = TextGray
                    )

                    Spacer(
                        modifier =
                            Modifier.height(10.dp)
                    )

                    Text(

                        text =
                            email ?: "Unknown",

                        color = TextWhite,

                        fontSize = 20.sp
                    )
                }
            }

            Spacer(
                modifier =
                    Modifier.height(50.dp)
            )

            Button(

                onClick = {

                    sessionManager.logout()

                    navController.navigate(
                        Screen.Login.route
                    ) {

                        popUpTo(0)
                    }
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
                            EmergencyRed
                    )
            ) {

                Text(

                    text = "LOGOUT"
                )
            }
        }
    }
}