package com.sentinel.app.utils

import android.location.Location

/**
 * Geo helpers for journey monitoring. Uses Android's accurate
 * Location.distanceBetween (WGS84) under the hood.
 */
object GeoUtils {

    fun distanceMeters(
        lat1: Double,
        lng1: Double,
        lat2: Double,
        lng2: Double
    ): Float {
        val result = FloatArray(1)
        Location.distanceBetween(lat1, lng1, lat2, lng2, result)
        return result[0]
    }

    /**
     * Shortest distance (metres) from a point to the planned route.
     * The route is an interleaved [lat0, lng0, lat1, lng1, ...] array.
     * Returns 0f when there is no route (treated as "on route").
     */
    fun distanceToRouteMeters(
        lat: Double,
        lng: Double,
        route: DoubleArray?
    ): Float {
        if (route == null || route.size < 2) return 0f
        var min = Float.MAX_VALUE
        var i = 0
        while (i + 1 < route.size) {
            val d = distanceMeters(lat, lng, route[i], route[i + 1])
            if (d < min) min = d
            i += 2
        }
        return min
    }
}
