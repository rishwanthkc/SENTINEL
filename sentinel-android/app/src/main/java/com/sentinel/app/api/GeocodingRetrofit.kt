package com.sentinel.app.api

import retrofit2.Retrofit

import retrofit2.converter.scalars.ScalarsConverterFactory

object GeocodingRetrofit {

    private const val BASE_URL =

        "https://maps.googleapis.com/"

    val api: GeocodingApiService by lazy {

        Retrofit.Builder()

            .baseUrl(BASE_URL)

            .addConverterFactory(

                ScalarsConverterFactory.create()
            )

            .build()

            .create(
                GeocodingApiService::class.java
            )
    }
}