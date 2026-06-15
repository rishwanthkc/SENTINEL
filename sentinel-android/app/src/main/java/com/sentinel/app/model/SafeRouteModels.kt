package com.sentinel.app.model

data class RiskPoint(
    val latitude: Double,
    val longitude: Double,
    val severity: Int,
    val category: String? = null,
    val source: String? = null
)

data class RouteOption(
    val polyline: String,
    val points: List<List<Double>>,   // [[lat, lng], ...]
    val risk_score: Double,
    val distance: String,
    val duration: String,
    val safety_score: Int,
    val is_safest: Boolean
)

data class SafeRouteResponse(
    val origin: String,
    val destination: String,
    val safest_index: Int,
    val routes: List<RouteOption>,
    val risk_points: List<RiskPoint>
)
