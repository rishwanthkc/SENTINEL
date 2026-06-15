package com.sentinel.app.screens

import androidx.compose.animation.core.*
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.material3.Text
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.alpha
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavController
import com.sentinel.app.ui.theme.*
import com.sentinel.app.utils.Screen
import com.sentinel.app.utils.SessionManager
import kotlinx.coroutines.delay

@Composable
fun SplashScreen(
    navController: NavController,
    sessionManager: SessionManager
) {

    val infiniteTransition =
        rememberInfiniteTransition(
            label = ""
        )

    val alphaAnimation by infiniteTransition.animateFloat(

        initialValue = 0.4f,

        targetValue = 1f,

        animationSpec = infiniteRepeatable(

            animation = tween(
                1200
            ),

            repeatMode = RepeatMode.Reverse
        ),

        label = ""
    )

    LaunchedEffect(true) {

        delay(2500)

        if (
            sessionManager.isLoggedIn()
        ) {

            navController.navigate(
                Screen.Home.route
            ) {

                popUpTo(
                    Screen.Splash.route
                ) {

                    inclusive = true
                }
            }

        } else {

            navController.navigate(
                Screen.Onboarding.route
            ) {

                popUpTo(
                    Screen.Splash.route
                ) {

                    inclusive = true
                }
            }
        }
    }

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(
                brush = Brush.verticalGradient(
                    colors = listOf(
                        BackgroundBlack,
                        DarkBlue,
                        DeepNavy
                    )
                )
            ),

        contentAlignment = Alignment.Center
    ) {

        Column(
            horizontalAlignment =
                Alignment.CenterHorizontally
        ) {

            Text(
                text = "SENTINEL",

                color = NeonBlue,

                fontSize = 52.sp,

                fontWeight = FontWeight.Bold,

                modifier = Modifier.alpha(
                    alphaAnimation
                )
            )

            Spacer(
                modifier = Modifier.height(16.dp)
            )

            Text(
                text = "AI Women Safety Platform",

                color = TextGray,

                fontSize = 18.sp
            )
        }
    }
}