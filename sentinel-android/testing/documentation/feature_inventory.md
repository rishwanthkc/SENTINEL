# Sentinel Android Application - Feature Inventory Report

This report outlines all primary features implemented in the Sentinel application, identifying their business logic, viewmodels, inputs, outcomes, and backend API endpoints.

---

## 1. Authentication Module

### Feature: User Registration
* **Description**: Allows new users to register an account in the Sentinel ecosystem.
* **ViewModel Logic**: `MainViewModel.registerUser(email, name, firebaseUid)`
* **Inputs**:
  * Email (string)
  * Full Name (string)
  * Firebase UID (string)
* **Backend Endpoint**: `POST /register`
* **Expected Outcome**: Account registration confirmation. Transition to home dashboard upon successful signup.

### Feature: User Login
* **Description**: Authenticates users based on their registered email address.
* **ViewModel Logic**: `MainViewModel.loginUser(email)`
* **Inputs**:
  * Email (string)
* **Backend Endpoint**: `POST /login`
* **Expected Outcome**: Successful session creation. User email stored via `SessionManager`. Redirect to main dashboard.

---

## 2. Safety & SOS Module

### Feature: Active SOS Trigger (Pulsing Button)
* **Description**: Prominent pulsing red button on the main dashboard for instant emergency signal dispatch.
* **ViewModel Logic**: `MainViewModel.triggerEmergency(email, latitude, longitude)`
* **Inputs**:
  * Active User Email (string)
  * Current Latitude (double)
  * Current Longitude (double)
* **Backend Endpoint**: `POST /emergency/trigger`
* **Expected Outcome**:
  * Registers emergency state on the backend.
  * Dispatches safety SMS to all trusted contacts.
  * Displays emergency notification actions.

### Feature: Trusted Contacts SMS Broadcasting
* **Description**: Sends location coordinates automatically to all contacts in the trusted circle.
* **ViewModel Logic**: `MainViewModel.triggerGuardianSOS(latitude, longitude)`
* **Permissions Required**: `android.permission.SEND_SMS`
* **Outcome**: Dispatches SMS messages formatted with GPS location coordinates link to Google Maps.

---

## 3. Navigation & Routing Module

### Feature: Incident Overlay Map
* **Description**: Displays a Google Map with custom markers indicating nearby incidents.
* **ViewModel Logic**: `MainViewModel.fetchReports()`
* **Backend Endpoint**: `GET /reports`
* **Outcome**: Interacts with the Google Maps Compose SDK to show geographic points flagged by other users.

### Feature: Safe Route Planning
* **Description**: Calculates route options between an origin and destination, flagging risk values based on crowd reports.
* **ViewModel Logic**: `MainViewModel.fetchSafeRoute(origin, destination)`
* **Backend Endpoint**: `POST /routes/safe`
* **Outcome**: Displays routes overlay on a map, ranking them from safest to riskiest.

### Feature: Active Journey Dashboard
* **Description**: Monitors and displays active journey stats (elapsed time, source, destination).
* **ViewModel Logic**: `MainViewModel.startJourney(source, destination)`, `MainViewModel.updateCurrentLocation(lat, lng)`, `MainViewModel.endJourney()`
* **Outcome**: Live foreground location updates, updates travel tracking state parameters.

---

## 4. Trusted Circle (Contacts) Module

### Feature: Emergency Contact Management
* **Description**: CRUD operations for trusted contacts to be notified during SOS triggers.
* **ViewModel Logic**: `MainViewModel.addEmergencyContact(name, phone)`, `MainViewModel.removeEmergencyContact(phone)`
* **Storage Layer**: Local storage via `ContactsManager`
* **Inputs**:
  * Contact Name (string)
  * Phone Number (string)
* **Outcome**: Updated local contact list shown on the contacts page.

---

## 5. Reporting Module

### Feature: Incident Reporting
* **Description**: Allows users to log community safety incidents or hazardous locations.
* **ViewModel Logic**: `MainViewModel.submitReport(ReportRequest)`
* **Inputs**:
  * Category (e.g. Theft, Poor Lighting, Harassment)
  * Description (string)
  * Latitude & Longitude (double)
  * Risk Level (integer 1-5)
* **Backend Endpoint**: `POST /reports`
* **Outcome**: Incident added to the backend, updating the maps view for all users.

---

## 6. User Profile Module

### Feature: Profile Update
* **Description**: Manages user contact info and secondary guardian info.
* **ViewModel Logic**: `MainViewModel.updateProfile(name, phone, guardianPhone, emergencyEmail)`
* **Inputs**:
  * Name (string)
  * Phone Number (string)
  * Guardian Phone (string)
  * Emergency Email (string)
* **Outcome**: Stores updated user profile parameters locally.
