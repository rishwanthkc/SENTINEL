package com.sentinel.app.screens

import android.annotation.SuppressLint
import android.widget.Toast

import androidx.compose.animation.core.RepeatMode
import androidx.compose.animation.core.animateFloat
import androidx.compose.animation.core.infiniteRepeatable
import androidx.compose.animation.core.rememberInfiniteTransition
import androidx.compose.animation.core.tween

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll

import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.AccountCircle
import androidx.compose.material.icons.filled.Contacts
import androidx.compose.material.icons.filled.History
import androidx.compose.material.icons.filled.Map
import androidx.compose.material.icons.filled.Navigation
import androidx.compose.material.icons.filled.ReportProblem
import androidx.compose.material.icons.filled.Shield

import androidx.compose.material3.*

import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember

import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.scale
import androidx.compose.ui.draw.shadow

import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector

import androidx.compose.ui.platform.LocalContext

import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign

import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

import androidx.lifecycle.viewmodel.compose.viewModel

import androidx.navigation.NavController

import com.google.android.gms.location.LocationServices

import com.sentinel.app.ui.theme.*
import com.sentinel.app.utils.Screen
import com.sentinel.app.utils.SessionManager
import com.sentinel.app.viewmodel.MainViewModel
import android.Manifest
import android.content.pm.PackageManager

import androidx.core.app.ActivityCompat

import android.app.Activity

@SuppressLint("MissingPermission")
@Composable
fun HomeScreen(
    navController: NavController,
    viewModel: MainViewModel = viewModel()
) {

    val context = LocalContext.current
    val activity = context as Activity

    val sessionManager = remember { SessionManager(context) }

    val fusedLocationClient = remember {
        LocationServices.getFusedLocationProviderClient(context)
    }

    val greetingName = remember {
        sessionManager.getUserEmail()
            ?.substringBefore("@")
            ?.replaceFirstChar { it.uppercase() }
            ?: "there"
    }

    // Gentle pulsing animation for the SOS halo.
    val transition = rememberInfiniteTransition(label = "sos")
    val pulse by transition.animateFloat(
        initialValue = 1f,
        targetValue = 1.16f,
        animationSpec = infiniteRepeatable(
            animation = tween(1400),
            repeatMode = RepeatMode.Reverse
        ),
        label = "pulse"
    )
    val glowAlpha by transition.animateFloat(
        initialValue = 0.45f,
        targetValue = 0.12f,
        animationSpec = infiniteRepeatable(
            animation = tween(1400),
            repeatMode = RepeatMode.Reverse
        ),
        label = "glow"
    )

    // --- SOS trigger (logic preserved) ---
    val onSos: () -> Unit = onSos@{
        if (
            ActivityCompat.checkSelfPermission(
                context,
                Manifest.permission.SEND_SMS
            ) != PackageManager.PERMISSION_GRANTED
        ) {
            ActivityCompat.requestPermissions(
                activity,
                arrayOf(Manifest.permission.SEND_SMS),
                1001
            )
            return@onSos
        }
        fusedLocationClient.lastLocation
            .addOnSuccessListener { location ->
                if (location != null) {
                    val email = sessionManager.getUserEmail()
                    if (email != null) {
                        viewModel.triggerEmergency(
                            email = email,
                            latitude = location.latitude,
                            longitude = location.longitude
                        ) { result ->
                            viewModel.triggerGuardianSOS(
                                location.latitude,
                                location.longitude
                            )
                            Toast.makeText(
                                context,
                                result,
                                Toast.LENGTH_LONG
                            ).show()
                        }
                    } else {
                        Toast.makeText(
                            context,
                            "User not logged in",
                            Toast.LENGTH_LONG
                        ).show()
                    }
                } else {
                    Toast.makeText(
                        context,
                        "Location is NULL",
                        Toast.LENGTH_LONG
                    ).show()
                }
            }
    }

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(
                brush = Brush.verticalGradient(
                    colors = listOf(BackgroundBlack, DarkBlue, DeepNavy)
                )
            )
    ) {

        Column(
            modifier = Modifier
                .fillMaxSize()
                .verticalScroll(rememberScrollState())
                .padding(horizontal = 20.dp)
        ) {

            Spacer(Modifier.height(12.dp))

            // ---------- HEADER ----------
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Column(modifier = Modifier.weight(1f)) {
                    Text(
                        text = "Welcome back",
                        color = TextGray,
                        fontSize = 14.sp
                    )
                    Spacer(Modifier.height(2.dp))
                    Text(
                        text = greetingName,
                        color = TextWhite,
                        fontSize = 28.sp,
                        fontWeight = FontWeight.Bold
                    )
                }

                Box(
                    modifier = Modifier
                        .size(52.dp)
                        .clip(CircleShape)
                        .background(
                            Brush.linearGradient(
                                listOf(NeonBlue, NeonPurple)
                            )
                        )
                        .clickable {
                            navController.navigate(Screen.Profile.route)
                        },
                    contentAlignment = Alignment.Center
                ) {
                    Icon(
                        imageVector = Icons.Default.AccountCircle,
                        contentDescription = "Profile",
                        tint = InkOnAccent,
                        modifier = Modifier.size(30.dp)
                    )
                }
            }

            Spacer(Modifier.height(22.dp))

            // ---------- STATUS CARD ----------
            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(24.dp),
                colors = CardDefaults.cardColors(containerColor = CardDark),
                border = BorderStroke(1.dp, BorderSubtle)
            ) {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(18.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Box(
                        modifier = Modifier
                            .size(48.dp)
                            .clip(RoundedCornerShape(16.dp))
                            .background(NeonBlue.copy(alpha = 0.16f)),
                        contentAlignment = Alignment.Center
                    ) {
                        Icon(
                            imageVector = Icons.Filled.Shield,
                            contentDescription = null,
                            tint = NeonBlue,
                            modifier = Modifier.size(26.dp)
                        )
                    }

                    Spacer(Modifier.width(14.dp))

                    Column(modifier = Modifier.weight(1f)) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Box(
                                modifier = Modifier
                                    .size(8.dp)
                                    .clip(CircleShape)
                                    .background(SuccessGreen)
                            )
                            Spacer(Modifier.width(8.dp))
                            Text(
                                text = "PROTECTION ACTIVE",
                                color = SuccessGreen,
                                fontSize = 13.sp,
                                fontWeight = FontWeight.Bold
                            )
                        }
                        Spacer(Modifier.height(4.dp))
                        Text(
                            text = "All systems online · location ready",
                            color = TextGray,
                            fontSize = 13.sp
                        )
                    }
                }
            }

            Spacer(Modifier.height(36.dp))

            // ---------- SOS ----------
            Box(
                modifier = Modifier.fillMaxWidth(),
                contentAlignment = Alignment.Center
            ) {
                Box(contentAlignment = Alignment.Center) {

                    // pulsing halo
                    Box(
                        modifier = Modifier
                            .size(250.dp)
                            .scale(pulse)
                            .clip(CircleShape)
                            .background(
                                Brush.radialGradient(
                                    listOf(
                                        EmergencyRed.copy(alpha = glowAlpha),
                                        Color.Transparent
                                    )
                                )
                            )
                    )

                    // outer ring
                    Box(
                        modifier = Modifier
                            .size(208.dp)
                            .clip(CircleShape)
                            .background(EmergencyRed.copy(alpha = 0.10f))
                    )

                    // main button
                    Box(
                        modifier = Modifier
                            .size(186.dp)
                            .shadow(
                                elevation = 30.dp,
                                shape = CircleShape,
                                ambientColor = EmergencyRed,
                                spotColor = EmergencyRed
                            )
                            .clip(CircleShape)
                            .background(
                                Brush.radialGradient(
                                    colors = listOf(
                                        Color(0xFFFF8DA3),
                                        EmergencyRed,
                                        Color(0xFFB31233)
                                    )
                                )
                            )
                            .clickable { onSos() },
                        contentAlignment = Alignment.Center
                    ) {
                        Column(
                            horizontalAlignment = Alignment.CenterHorizontally
                        ) {
                            Text(
                                text = "SOS",
                                color = Color.White,
                                fontSize = 46.sp,
                                fontWeight = FontWeight.Black
                            )
                            Spacer(Modifier.height(2.dp))
                            Text(
                                text = "TAP FOR EMERGENCY",
                                color = Color.White.copy(alpha = 0.9f),
                                fontSize = 12.sp,
                                fontWeight = FontWeight.SemiBold
                            )
                        }
                    }
                }
            }

            Spacer(Modifier.height(14.dp))

            Text(
                text = "Your live location is shared with your trusted contacts.",
                color = TextGray,
                fontSize = 12.sp,
                textAlign = TextAlign.Center,
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 24.dp)
            )

            Spacer(Modifier.height(32.dp))

            // ---------- QUICK ACTIONS ----------
            Text(
                text = "Quick actions",
                color = TextWhite,
                fontSize = 18.sp,
                fontWeight = FontWeight.SemiBold
            )

            Spacer(Modifier.height(14.dp))

            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(14.dp)
            ) {
                FeatureCard(
                    modifier = Modifier.weight(1f),
                    icon = Icons.Filled.Map,
                    title = "Live Map",
                    subtitle = "Nearby incidents",
                    accent = NeonBlue
                ) { navController.navigate(Screen.Maps.route) }

                FeatureCard(
                    modifier = Modifier.weight(1f),
                    icon = Icons.Filled.Navigation,
                    title = "Safe Route",
                    subtitle = "Plan & navigate",
                    accent = NeonCyan
                ) { navController.navigate(Screen.SafeRoute.route) }
            }

            Spacer(Modifier.height(14.dp))

            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(14.dp)
            ) {
                FeatureCard(
                    modifier = Modifier.weight(1f),
                    icon = Icons.Filled.Contacts,
                    title = "Contacts",
                    subtitle = "Trusted circle",
                    accent = NeonPurple
                ) { navController.navigate(Screen.Contacts.route) }

                FeatureCard(
                    modifier = Modifier.weight(1f),
                    icon = Icons.Filled.History,
                    title = "Journeys",
                    subtitle = "Your activity",
                    accent = AccentGold
                ) { navController.navigate(Screen.History.route) }
            }

            Spacer(Modifier.height(14.dp))

            // ---------- REPORT (prominent) ----------
            Card(
                onClick = { navController.navigate(Screen.Report.route) },
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(22.dp),
                colors = CardDefaults.cardColors(
                    containerColor = EmergencyRed.copy(alpha = 0.14f)
                ),
                border = BorderStroke(1.dp, EmergencyRed.copy(alpha = 0.45f))
            ) {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(18.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Box(
                        modifier = Modifier
                            .size(46.dp)
                            .clip(RoundedCornerShape(14.dp))
                            .background(EmergencyRed.copy(alpha = 0.22f)),
                        contentAlignment = Alignment.Center
                    ) {
                        Icon(
                            imageVector = Icons.Filled.ReportProblem,
                            contentDescription = null,
                            tint = EmergencyRed,
                            modifier = Modifier.size(24.dp)
                        )
                    }
                    Spacer(Modifier.width(14.dp))
                    Column(modifier = Modifier.weight(1f)) {
                        Text(
                            text = "Report an incident",
                            color = TextWhite,
                            fontSize = 16.sp,
                            fontWeight = FontWeight.SemiBold
                        )
                        Text(
                            text = "Flag an unsafe area for the community",
                            color = TextGray,
                            fontSize = 12.sp
                        )
                    }
                }
            }

            Spacer(Modifier.height(28.dp))
        }
    }
}

@Composable
fun FeatureCard(
    modifier: Modifier = Modifier,
    icon: ImageVector,
    title: String,
    subtitle: String,
    accent: Color,
    onClick: () -> Unit
) {
    Card(
        onClick = onClick,
        modifier = modifier.height(120.dp),
        shape = RoundedCornerShape(22.dp),
        colors = CardDefaults.cardColors(containerColor = CardDark),
        border = BorderStroke(1.dp, BorderSubtle)
    ) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(16.dp),
            verticalArrangement = Arrangement.SpaceBetween
        ) {
            Box(
                modifier = Modifier
                    .size(40.dp)
                    .clip(RoundedCornerShape(13.dp))
                    .background(accent.copy(alpha = 0.16f)),
                contentAlignment = Alignment.Center
            ) {
                Icon(
                    imageVector = icon,
                    contentDescription = null,
                    tint = accent,
                    modifier = Modifier.size(22.dp)
                )
            }

            Column {
                Text(
                    text = title,
                    color = TextWhite,
                    fontSize = 15.sp,
                    fontWeight = FontWeight.SemiBold
                )
                Text(
                    text = subtitle,
                    color = TextGray,
                    fontSize = 12.sp
                )
            }
        }
    }
}
