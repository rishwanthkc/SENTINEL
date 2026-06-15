package com.sentinel.app.model

data class UserRequest(
    val email: String,
    val display_name: String,
    val firebase_uid: String
)