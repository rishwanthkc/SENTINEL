package com.sentinel.app.utils

import android.telephony.SmsManager

object SosHelper {

    fun sendSOS(

        phone: String,

        latitude: Double,

        longitude: Double
    ) {

        val message =

            """
🚨 SENTINEL SOS ALERT

Emergency detected.

Live Location:
https://maps.google.com/?q=$latitude,$longitude

Please contact immediately.
            """.trimIndent()

        try {

            SmsManager
                .getDefault()
                .sendTextMessage(

                    phone,

                    null,

                    message,

                    null,

                    null
                )

            println("SMS SENT TO $phone")

        } catch (e: Exception) {

            e.printStackTrace()

            println("SMS FAILED: ${e.message}")
        }
    }
}