package com.sentinel.app.repository

import com.sentinel.app.api.RetrofitClient
import com.sentinel.app.api.models.ReportRequest

class Repository {

    private val apiService =
        RetrofitClient.api

    suspend fun submitReport(

        request: ReportRequest
    ) =
        apiService.submitReport(request)

    suspend fun getReports() =

        apiService.getReports()
}