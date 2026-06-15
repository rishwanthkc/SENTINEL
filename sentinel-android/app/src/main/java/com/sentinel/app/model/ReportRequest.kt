package com.sentinel.app.api.models

data class ReportRequest(

    val user_email: String,

    val report_type: String,

    val severity: Int,

    val latitude: Double,

    val longitude: Double,

    val description: String
)