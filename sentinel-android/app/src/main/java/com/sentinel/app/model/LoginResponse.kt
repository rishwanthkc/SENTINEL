package com.sentinel.app.model

data class LoginResponse(

    val message: String,

    val user_id: String,

    val display_name: String,

    val email: String
)