package com.sentinel.app.ui.theme

import androidx.compose.material3.*
import androidx.compose.runtime.Composable

private val SentinelColorScheme = darkColorScheme(

    primary = NeonBlue,
    onPrimary = InkOnAccent,
    primaryContainer = CardBlue,
    onPrimaryContainer = TextWhite,

    secondary = NeonPurple,
    onSecondary = TextWhite,
    secondaryContainer = CardBlue,
    onSecondaryContainer = SoftWhite,

    tertiary = NeonCyan,
    onTertiary = InkOnAccent,

    background = BackgroundBlack,
    onBackground = TextWhite,

    surface = CardDark,
    onSurface = TextWhite,
    surfaceVariant = CardBlue,
    onSurfaceVariant = TextGray,

    outline = BorderSubtle,
    outlineVariant = BorderSubtle,

    error = EmergencyRed,
    onError = TextWhite,

    scrim = Overlay
)

@Composable
fun SentinelTheme(
    content: @Composable () -> Unit
) {
    MaterialTheme(
        colorScheme = SentinelColorScheme,
        typography = Typography,
        content = content
    )
}
