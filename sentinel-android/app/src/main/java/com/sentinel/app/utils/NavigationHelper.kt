package com.sentinel.app.utils

import android.content.Context
import android.content.Intent
import android.net.Uri

object NavigationHelper {

    fun openGoogleMaps(

        context: Context,

        source: String,

        destination: String
    ) {

        android.util.Log.d(
            "SENTINEL_NAV",
            "SOURCE=$source DEST=$destination"
        )

        val uri = Uri.parse(
            "https://www.google.com/maps/dir/" +
                    "?api=1" +
                    "&origin=${Uri.encode(source)}" +
                    "&destination=${Uri.encode(destination)}" +
                    "&travelmode=driving"
        )

        val intent = Intent(
            Intent.ACTION_VIEW,
            uri
        )

        intent.setPackage(
            "com.google.android.apps.maps"
        )

        context.startActivity(intent)
    }
}