package com.sentinel.app.model

data class EmergencyHistoryResponse(

    val id: Int,

    val user_email: String,

    val latitude: Double,

    val longitude: Double,

    val status: String,

    val created_at: String
)