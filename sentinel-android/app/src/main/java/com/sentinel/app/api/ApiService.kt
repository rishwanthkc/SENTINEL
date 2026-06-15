package com.sentinel.app.api

import com.sentinel.app.model.RegisterResponse
import com.sentinel.app.model.UserRequest
import retrofit2.Response
import retrofit2.http.Body
import retrofit2.http.POST
import retrofit2.http.GET
import retrofit2.http.Path
import retrofit2.http.Query
import com.sentinel.app.model.LoginRequest
import com.sentinel.app.model.LoginResponse
import com.sentinel.app.model.EmergencyRequest
import com.sentinel.app.model.EmergencyResponse
import com.sentinel.app.model.ContactRequest
import com.sentinel.app.model.ContactResponse
import com.sentinel.app.model.EmergencyHistoryResponse
import com.sentinel.app.model.ActiveEmergencyResponse
import com.sentinel.app.api.models.ReportRequest
import com.sentinel.app.model.ReportResponse
import com.sentinel.app.model.SafeRouteResponse
import com.sentinel.app.model.RiskPoint
interface ApiService {

    @POST("auth/register")
    suspend fun registerUser(
        @Body user: UserRequest
    ): Response<RegisterResponse>

    @POST("/auth/login")
    suspend fun loginUser(
        @Body request: LoginRequest
    ): LoginResponse

    @POST("/emergency/trigger")
    suspend fun triggerEmergency(

        @Body request: EmergencyRequest

    ): EmergencyResponse

    @POST("/contacts/add")
    suspend fun addContact(

        @Body request: ContactRequest

    ): ContactResponse

    @GET("/emergency/history/{email}")
    suspend fun getEmergencyHistory(

        @Path("email")
        email: String

    ): List<EmergencyHistoryResponse>

    @GET("emergency/active")
    suspend fun getActiveEmergencies():
            List<ActiveEmergencyResponse>

    @POST("/reports/submit")

    suspend fun submitReport(

        @Body request: ReportRequest
    ): Map<String, String>

    @GET("reports/all")

    suspend fun getReports():

            List<ReportResponse>




    @GET("safety/route")
    suspend fun getSafeRoute(
        @Query("origin") origin: String,
        @Query("destination") destination: String,
        @Query("mode") mode: String = "driving"
    ): SafeRouteResponse

    @GET("safety/risk-points")
    suspend fun getRiskPoints(): List<RiskPoint>
}
