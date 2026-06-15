package com.sentinel.app.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.sentinel.app.api.RetrofitClient
import com.sentinel.app.model.EmergencyRequest
import com.sentinel.app.model.LoginRequest
import com.sentinel.app.model.UserRequest
import kotlinx.coroutines.launch
import com.sentinel.app.model.ContactRequest
import com.sentinel.app.repository.Repository
import com.sentinel.app.model.EmergencyHistoryResponse
import kotlinx.coroutines.launch
import com.sentinel.app.model.ReportResponse
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.sentinel.app.model.ActiveEmergencyResponse
import com.sentinel.app.api.models.ReportRequest
import androidx.lifecycle.viewModelScope
import kotlinx.coroutines.launch
import com.sentinel.app.utils.PolylineDecoder
import com.sentinel.app.model.UserProfile
import com.google.android.gms.maps.model.LatLng
import com.sentinel.app.model.EmergencyContact
import org.json.JSONObject
import com.sentinel.app.utils.SosHelper
import android.app.Application
import androidx.lifecycle.AndroidViewModel
import android.widget.Toast
import com.sentinel.app.utils.ContactsManager
import com.sentinel.app.model.JourneyState
import com.sentinel.app.model.SafeRouteResponse
import com.sentinel.app.model.RiskPoint
import com.sentinel.app.api.DirectionsRetrofit
class MainViewModel(

    application: Application

) : AndroidViewModel(application) {
    private val repository =
        Repository()

    private val contactsManager =

        ContactsManager(
            getApplication()
        )

    // REGISTER
    fun registerUser(
        email: String,
        name: String,
        firebaseUid: String,
        onResult: (String) -> Unit
    ) {

        viewModelScope.launch {

            try {

                val response =
                    RetrofitClient.api.registerUser(

                        UserRequest(
                            email = email,
                            display_name = name,
                            firebase_uid = firebaseUid
                        )
                    )

                if (response != null) {

                    onResult(
                        "Registration successful"
                    )

                } else {

                    onResult(
                        "Registration failed"
                    )
                }

            } catch (e: Exception) {

                onResult(
                    "Backend connection failed"
                )
            }
        }
    }

    // LOGIN
    fun loginUser(
        email: String,
        onResult: (String) -> Unit
    ) {

        viewModelScope.launch {

            try {

                val response =
                    RetrofitClient.api.loginUser(

                        LoginRequest(
                            email = email
                        )
                    )

                if (response != null) {

                    onResult(
                        "Login successful"
                    )

                } else {

                    onResult(
                        "Login failed"
                    )
                }

            } catch (e: Exception) {

                onResult(
                    "Backend connection failed"
                )
            }
        }
    }

    // SOS EMERGENCY
    fun triggerEmergency(

        email: String,

        latitude: Double,

        longitude: Double,

        onResult: (String) -> Unit
    ) {

        viewModelScope.launch {

            try {

                val response =
                    RetrofitClient.api.triggerEmergency(

                        EmergencyRequest(
                            user_email = email,
                            latitude = latitude,
                            longitude = longitude
                        )
                    )

                if (
                    response.message.contains(
                        "Triggered",
                        ignoreCase = true
                    )
                ) {

                    onResult(
                        "SOS Activated"
                    )

                } else {

                    onResult(
                        "SOS Failed"
                    )
                }

            } catch (e: Exception) {

                onResult(
                    "Backend connection failed"
                )
            }
        }
    }
    fun addEmergencyContact(

        userEmail: String,

        contactName: String,

        contactPhone: String,

        onResult: (String) -> Unit
    ) {

        viewModelScope.launch {

            try {

                val response =
                    RetrofitClient.api.addContact(

                        ContactRequest(

                            user_email =
                                userEmail,

                            contact_name =
                                contactName,

                            contact_phone =
                                contactPhone
                        )
                    )

                if (
                    response.message.contains(
                        "Added",
                        ignoreCase = true
                    )
                ) {

                    onResult(
                        "Contact Added"
                    )

                } else {

                    onResult(
                        "Failed"
                    )
                }

            } catch (e: Exception) {

                onResult(
                    "Backend connection failed"
                )
            }
        }
    }
    fun fetchEmergencyHistory(

        email: String,

        onResult:
            (List<EmergencyHistoryResponse>) -> Unit
    ) {

        viewModelScope.launch {

            try {

                val response =
                    RetrofitClient
                        .api
                        .getEmergencyHistory(
                            email
                        )

                onResult(response)

            } catch (e: Exception) {

                onResult(emptyList())
            }
        }
    }
    fun fetchActiveEmergencies(

        onResult:
            (List<ActiveEmergencyResponse>) -> Unit
    ) {

        viewModelScope.launch {

            try {

                val response =
                    RetrofitClient
                        .api
                        .getActiveEmergencies()

                onResult(response)

            } catch (e: Exception) {

                onResult(emptyList())
            }
        }
    }

    fun submitReport(

        request: ReportRequest,

        onResult: (String) -> Unit
    ) {

        viewModelScope.launch {

            try {

                repository.submitReport(
                    request
                )

                onResult(
                    "Report Submitted"
                )

            } catch (e: Exception) {

                onResult(
                    e.message ?: "Error"
                )
            }
        }
    }
    var reports by mutableStateOf<List<ReportResponse>>(emptyList())
        private set
    fun fetchReports() {

        viewModelScope.launch {

            try {

                reports =
                    repository.getReports()

            } catch (e: Exception) {

                e.printStackTrace()
            }
        }
    }
    var routePoints by mutableStateOf<List<LatLng>>(emptyList())
        private set

    fun generateRoute(

        origin: String,

        destination: String,

        apiKey: String
    ) {

        viewModelScope.launch {

            try {

                val response =

                    DirectionsRetrofit
                        .api
                        .getDirections(

                            origin,

                            destination,

                            apiKey
                        )
                android.util.Log.d(
                    "SENTINEL_ROUTE",
                    response
                )

                val json =
                    JSONObject(response)

                val routes =
                    json.getJSONArray("routes")

                if (routes.length() > 0) {

                    val overviewPolyline =

                        routes
                            .getJSONObject(0)
                            .getJSONObject(
                                "overview_polyline"
                            )
                            .getString("points")

                    routePoints =
                        PolylineDecoder.decodePolyline(
                            overviewPolyline
                        )

                    android.util.Log.d(
                        "SENTINEL_ROUTE",
                        "POINTS = ${routePoints.size}"
                    )
                    android.util.Log.d(
                        "SENTINEL_ROUTE",
                        "FIRST = ${routePoints.firstOrNull()}"
                    )

                    android.util.Log.d(
                        "SENTINEL_ROUTE",
                        "LAST = ${routePoints.lastOrNull()}"
                    )
                }

            } catch (e: Exception) {

                e.printStackTrace()
            }
        }
    }
    var userProfile by mutableStateOf(

        UserProfile(

            name = "",

            phone = "",

            guardianPhone = "",

            emergencyEmail = ""
        )
    )
        private set

    fun updateProfile(

        name: String,

        phone: String,

        guardianPhone: String,

        emergencyEmail: String
    ) {

        userProfile =

            UserProfile(

                name,

                phone,

                guardianPhone,

                emergencyEmail
            )
    }
    var emergencyContacts by mutableStateOf(

        contactsManager.loadContacts()
    )
        private set

    fun addEmergencyContact(

        name: String,

        phone: String
    ) {

        val updatedList =

            emergencyContacts.toMutableList()

        updatedList.add(

            EmergencyContact(
                name,
                phone
            )
        )

        emergencyContacts = updatedList

        contactsManager.saveContacts(
            emergencyContacts
        )
    }
    fun triggerGuardianSOS(

        latitude: Double,

        longitude: Double
    ) {

        Toast.makeText(

            getApplication(),

            "Contacts: ${emergencyContacts.size}",

            Toast.LENGTH_LONG

        ).show()

        emergencyContacts.forEach {

            try {

                SosHelper.sendSOS(

                    it.phone,

                    latitude,

                    longitude
                )

                Toast.makeText(

                    getApplication(),

                    "SMS sent to ${it.phone}",

                    Toast.LENGTH_SHORT

                ).show()

            } catch (e: Exception) {

                Toast.makeText(

                    getApplication(),

                    "SMS failed: ${e.message}",

                    Toast.LENGTH_LONG

                ).show()

                e.printStackTrace()
            }
        }
    }

    fun removeEmergencyContact(

        phone: String
    ) {

        emergencyContacts =

            emergencyContacts.filter {

                it.phone != phone
            }

        contactsManager.saveContacts(
            emergencyContacts
        )
    }

    var currentJourney by mutableStateOf(
        JourneyState()
    )
        private set

    fun startJourney(

        source: String,

        destination: String
    ) {

        currentJourney = JourneyState(

            source = source,

            destination = destination,

            startTime = System.currentTimeMillis(),

            isActive = true
        )
    }

    fun endJourney() {

        currentJourney =

            currentJourney.copy(

                isActive = false
            )
    }
    fun updateCurrentLocation(

        latitude: Double,

        longitude: Double

    ) {

        currentJourney =

            currentJourney.copy(

                currentLatitude = latitude,

                currentLongitude = longitude
            )
    }
    // ---------------- SAFE ROUTING ----------------

    var safeRoute by mutableStateOf<SafeRouteResponse?>(null)
        private set

    var riskPoints by mutableStateOf<List<RiskPoint>>(emptyList())
        private set

    var safeRouteLoading by mutableStateOf(false)
        private set

    fun fetchSafeRoute(
        origin: String,
        destination: String,
        onDone: (Boolean) -> Unit = {}
    ) {
        viewModelScope.launch {
            safeRouteLoading = true
            try {
                val resp =
                    RetrofitClient.api.getSafeRoute(origin, destination)
                safeRoute = resp
                riskPoints = resp.risk_points
                val safest = resp.routes.getOrNull(resp.safest_index)
                if (safest != null) {
                    routePoints = safest.points.mapNotNull {
                        if (it.size >= 2) LatLng(it[0], it[1]) else null
                    }
                }
                onDone(true)
            } catch (e: Exception) {
                e.printStackTrace()
                onDone(false)
            } finally {
                safeRouteLoading = false
            }
        }
    }

    fun fetchRiskPoints() {
        viewModelScope.launch {
            try {
                riskPoints = RetrofitClient.api.getRiskPoints()
            } catch (e: Exception) {
                e.printStackTrace()
            }
        }
    }
}
