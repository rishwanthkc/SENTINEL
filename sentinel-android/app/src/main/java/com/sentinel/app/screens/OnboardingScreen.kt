package com.sentinel.app.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.pager.HorizontalPager
import androidx.compose.foundation.pager.rememberPagerState
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavController
import com.sentinel.app.ui.theme.*
import com.sentinel.app.utils.Screen

data class OnboardingPage(
    val title: String,
    val description: String
)

@Composable
fun OnboardingScreen(
    navController: NavController
) {

    val pages = listOf(

        OnboardingPage(
            "AI Powered Protection",
            "Advanced safety intelligence monitoring your journey in real time."
        ),

        OnboardingPage(
            "Emergency Response",
            "Instant SOS activation with live GPS emergency transmission."
        ),

        OnboardingPage(
            "Live Guardian Tracking",
            "Trusted contacts can monitor your journey and receive alerts."
        )
    )

    val pagerState =
        rememberPagerState(
            pageCount = {
                pages.size
            }
        )

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
                modifier = Modifier.height(60.dp)
            )

            Text(
                text = "SENTINEL",

                color = NeonBlue,

                fontSize = 40.sp,

                fontWeight = FontWeight.Bold
            )

            Spacer(
                modifier = Modifier.height(40.dp)
            )

            HorizontalPager(
                state = pagerState
            ) { page ->

                Card(
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(420.dp),

                    shape = RoundedCornerShape(28.dp),

                    colors = CardDefaults.cardColors(
                        containerColor = CardDark
                    )
                ) {

                    Column(
                        modifier = Modifier
                            .fillMaxSize()
                            .padding(30.dp),

                        verticalArrangement =
                            Arrangement.Center,

                        horizontalAlignment =
                            Alignment.CenterHorizontally
                    ) {

                        Text(
                            text = pages[page].title,

                            color = NeonBlue,

                            fontSize = 30.sp,

                            fontWeight = FontWeight.Bold
                        )

                        Spacer(
                            modifier = Modifier.height(30.dp)
                        )

                        Text(
                            text = pages[page].description,

                            color = TextWhite,

                            fontSize = 18.sp
                        )
                    }
                }
            }

            Spacer(
                modifier = Modifier.height(40.dp)
            )

            Button(

                onClick = {

                    navController.navigate(
                        Screen.Login.route
                    ) {

                        popUpTo(
                            Screen.Onboarding.route
                        ) {

                            inclusive = true
                        }
                    }
                },

                modifier = Modifier
                    .fillMaxWidth()
                    .height(60.dp),

                colors = ButtonDefaults.buttonColors(
                    containerColor = NeonBlue
                ),

                shape = RoundedCornerShape(22.dp)
            ) {

                Text(
                    text = "GET STARTED",

                    color = BackgroundBlack,

                    fontSize = 18.sp,

                    fontWeight = FontWeight.Bold
                )
            }
        }
    }
}