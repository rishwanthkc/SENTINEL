package com.sentinel.app.api

import retrofit2.http.GET
import retrofit2.http.Query

interface GeocodingApiService {

    @GET("maps/api/geocode/json")

    suspend fun getCoordinates(

        @Query("address")
        address: String,

        @Query("key")
        apiKey: String
    ): String
}