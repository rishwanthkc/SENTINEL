package com.sentinel.app.model

data class JourneyState(

    val source: String = "",

    val destination: String = "",

    val startTime: Long = 0L,

    val isActive: Boolean = false,

    val currentLatitude: Double = 0.0,

    val currentLongitude: Double = 0.0,

    val deviationStartTime: Long = 0L,

    val guardianAlertSent: Boolean = false,

    val autoSosTriggered: Boolean = false,

    val routePoints: List<Pair<Double, Double>> = emptyList(),

    val isDeviationDetected: Boolean = false,

    val deviationDistanceMeters: Float = 0f

)