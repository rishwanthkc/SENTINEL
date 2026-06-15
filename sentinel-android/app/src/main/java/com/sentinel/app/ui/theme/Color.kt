package com.sentinel.app.ui.theme

import androidx.compose.ui.graphics.Color

/* ============================================================
   SENTINEL — Theme palette
   Modern, rich, elegant midnight aesthetic.
   NOTE: token names are unchanged, so every screen that already
   references them is re-skinned automatically.
   ============================================================ */

// Backgrounds (used as a dark -> lighter vertical gradient)
val BackgroundBlack = Color(0xFF070B14) // deep ink, subtle blue undertone
val DarkBlue        = Color(0xFF0C1322) // mid gradient stop
val DeepNavy        = Color(0xFF121C33) // top gradient stop, refined navy

// Card / elevated surfaces
val CardDark = Color(0xFF151D30) // primary elevated surface
val CardBlue = Color(0xFF1C2942) // highlighted / secondary surface

// Accents
val NeonBlue   = Color(0xFF34D6E6) // primary — luminous, refined aqua
val NeonCyan   = Color(0xFF6EE7DF) // tertiary — soft aqua highlight / glow
val NeonPurple = Color(0xFF8B7CF8) // secondary — elegant periwinkle violet

// Text
val TextWhite = Color(0xFFF2F5FA) // soft white (not harsh pure white)
val SoftWhite = Color(0xFFE3E9F2) // secondary text / on-card
val TextGray  = Color(0xFF93A1B8) // muted slate for captions/labels

// Status
val EmergencyRed = Color(0xFFFB4D6A) // refined coral-rose, still urgent

// --- Additive helpers (safe, optional to use in screens) ---
val SuccessGreen = Color(0xFF34D399)
val WarningAmber = Color(0xFFFBBF24)
val AccentGold   = Color(0xFFE7C496) // subtle premium gold for highlights
val BorderSubtle = Color(0xFF233252) // hairline borders / dividers
val Overlay      = Color(0xCC070B14) // scrim for modals / sheets

val InkOnAccent = Color(0xFF052027) // dark ink for text/icons on bright accents
