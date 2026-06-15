package com.sentinel.app.model

data class ReportResponse(

    val id: Int,

    val user_email: String,

    val report_type: String,

    val severity: Int,

    val latitude: Double,

    val longitude: Double,

    val description: String,

    val created_at: String
)