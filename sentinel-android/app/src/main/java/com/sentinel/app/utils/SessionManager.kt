package com.sentinel.app.utils

import android.content.Context

class SessionManager(
    context: Context
) {

    private val sharedPreferences =

        context.getSharedPreferences(
            "sentinel_prefs",
            Context.MODE_PRIVATE
        )

    fun saveLoginSession(
        email: String
    ) {

        sharedPreferences.edit()

            .putBoolean(
                "is_logged_in",
                true
            )

            .putString(
                "user_email",
                email
            )

            .apply()
    }

    fun isLoggedIn(): Boolean {

        return sharedPreferences.getBoolean(
            "is_logged_in",
            false
        )
    }

    fun logout() {

        sharedPreferences.edit()
            .clear()
            .apply()
    }

    fun getUserEmail(): String? {

        return sharedPreferences.getString(
            "user_email",
            null
        )
    }


}