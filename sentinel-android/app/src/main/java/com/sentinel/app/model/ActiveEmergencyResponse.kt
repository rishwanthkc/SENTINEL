package com.sentinel.app.model

data class ActiveEmergencyResponse(

    val latitude: Double,

    val longitude: Double,

    val user_email: String,

    val created_at: String
)