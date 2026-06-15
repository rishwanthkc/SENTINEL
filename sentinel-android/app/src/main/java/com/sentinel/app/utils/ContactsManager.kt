package com.sentinel.app.utils

import android.content.Context

import com.google.gson.Gson
import com.google.gson.reflect.TypeToken

import com.sentinel.app.model.EmergencyContact

class ContactsManager(

    context: Context
) {

    private val prefs =

        context.getSharedPreferences(

            "sentinel_contacts",

            Context.MODE_PRIVATE
        )

    private val gson =
        Gson()

    fun saveContacts(

        contacts:
        List<EmergencyContact>
    ) {

        val json =
            gson.toJson(
                contacts
            )

        prefs.edit()

            .putString(
                "contacts",
                json
            )

            .apply()
    }

    fun loadContacts():
            List<EmergencyContact> {

        val json =

            prefs.getString(
                "contacts",
                null
            )

        if (json == null)
            return emptyList()

        val type =

            object :
                TypeToken<
                        List<EmergencyContact>
                        >() {}.type

        return gson.fromJson(
            json,
            type
        )
    }
}