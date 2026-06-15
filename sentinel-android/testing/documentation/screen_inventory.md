# Sentinel Android Application - Screen Inventory Report

This inventory catalog details each visible screen within the Sentinel app, mapping UI controls, elements, fields, and expected behavior to enable robust Page Object Model creation for Appium automation.

---

## 1. Splash Screen (`SplashScreen`)
* **Route**: `splash`
* **Components**:
  * Title: `"SENTINEL"` (Pulsing text, styled in `NeonBlue`)
  * Subtitle: `"AI Women Safety Platform"` (Text, `TextGray`)
* **Behavior**: Waits `2500ms` using `LaunchedEffect`, then performs session lookup to navigate.

---

## 2. Onboarding Screen (`OnboardingScreen`)
* **Route**: `onboarding`
* **Components**:
  * Logo Header: `"SENTINEL"` (Text)
  * Pager: `HorizontalPager` with 3 pages:
    * Page 1: `"AI Powered Protection"`
    * Page 2: `"Emergency Response"`
    * Page 3: `"Live Guardian Tracking"`
  * Action Button: `"GET STARTED"` (Button, `NeonBlue`)
* **Behavior**: Clicking "GET STARTED" navigates to the login screen.

---

## 3. Login Screen (`LoginScreen`)
* **Route**: `login`
* **Components**:
  * Header Text: `"WELCOME"`, `"Login to continue"`
  * Card Container: Rounded corner container (`CardDark`)
  * Input Field: `"Email"` (OutlinedTextField)
  * Action Button: `"LOGIN"` (Button, `NeonBlue`)
* **Behavior**: Clicking "LOGIN" launches the Retrofit login request. If successful, initializes session storage and transitions to Home.

---

## 4. Register Screen (`RegisterScreen`)
* **Route**: `register`
* **Components**:
  * Header Text: `"SENTINEL"`, `"Women Safety Platform"`
  * Input Field: `"Email"` (OutlinedTextField)
  * Input Field: `"Full Name"` (OutlinedTextField)
  * Input Field: `"Firebase UID"` (OutlinedTextField)
  * Action Button: `"REGISTER"` (Button, `NeonBlue`)
* **Behavior**: Submits API registration payload. Navigates to Home upon success.

---

## 5. Home Screen (`HomeScreen`)
* **Route**: `home`
* **Components**:
  * Greeting Header: `"Welcome back, [Name]"`
  * Profile Icon: Top right clickable avatar (navigates to Profile)
  * Protection Banner: Card showing `"PROTECTION ACTIVE"` with a green status indicator dot.
  * Central SOS Button: Pulsing red circular button (`"SOS"`, `"TAP FOR EMERGENCY"`).
  * Quick Actions Feature Cards:
    * Live Map: `"Live Map"`, `"Nearby incidents"` (navigates to Maps)
    * Safe Route: `"Safe Route"`, `"Plan & navigate"` (navigates to SafeRoute)
    * Contacts: `"Contacts"`, `"Trusted circle"` (navigates to Contacts)
    * Journeys: `"Journeys"`, `"Your activity"` (navigates to History)
  * Report Banner: `"Report an incident"`, `"Flag an unsafe area"` (navigates to Report)
* **Behavior**: Tapping SOS triggers GPS verification, checks permissions, posts backend alerts, and broadcasts coordinates via SMS.

---

## 6. Profile Screen (`ProfileScreen`)
* **Route**: `profile`
* **Components**:
  * Avatar Graphic
  * Input Field: `"Full Name"` (OutlinedTextField)
  * Input Field: `"Phone Number"` (OutlinedTextField)
  * Input Field: `"Guardian Phone"` (OutlinedTextField)
  * Input Field: `"Emergency Email"` (OutlinedTextField)
  * Action Button: `"SAVE CHANGES"` (Button)
  * Danger Action: `"LOGOUT"` (TextButton / Button)
* **Behavior**: Updates ViewModel profile states on save; clears SharedPreferences session on logout and returns to login screen.

---

## 7. Safe Route Screen (`SafeRouteScreen`)
* **Route**: `safe_route`
* **Components**:
  * Input Field: `"Start Location"`
  * Input Field: `"Destination"`
  * Action Button: `"CALCULATE SAFEST ROUTE"`
* **Behavior**: Queries routes from the routing engine and redirects to the Route Recommendation list.

---

## 8. Route Recommendation Screen (`RouteRecommendationScreen`)
* **Route**: `route_recommendation`
* **Components**:
  * Route Option Cards: Lists routing variants (e.g. "Safest Route", "Alternative Route 1") with risk statistics.
  * Map Overlay: Displays route polylines.
  * Action Button: `"START JOURNEY"`
* **Behavior**: Initiates background tracking service and loads Journey Dashboard.

---

## 9. Journey Dashboard Screen (`JourneyDashboardScreen`)
* **Route**: `journey_dashboard`
* **Components**:
  * Active Tracking Header: `"JOURNEY ACTIVE"`
  * Timer: Displays elapsed journey duration.
  * Live Map: Displays real-time location.
  * Panic Action: `"PANIC / TRIGGER SOS"` (Emergency Red)
  * Action Button: `"END JOURNEY"` (Button)
* **Behavior**: Ends tracking state and returns to Home.

---

## 10. Report Incident Screen (`ReportScreen`)
* **Route**: `report`
* **Components**:
  * Form Field: `"Incident Title"`
  * Form Field: `"Description"`
  * Dropdown: `"Incident Category"` (e.g., Theft, Harassment, Poor Lighting)
  * Slider: `"Risk Severity"` (1 to 5)
  * Action Button: `"SUBMIT REPORT"`
* **Behavior**: Dispatches incident details to backend and adds point to the community map.

---

## 11. Emergency Contacts Screen (`EmergencyContactsScreen`)
* **Route**: `contacts`
* **Components**:
  * Contact Input Field: `"Contact Name"`
  * Contact Input Field: `"Phone Number"`
  * Action Button: `"ADD CONTACT"`
  * List: Trusted contacts list with `"DELETE"` icon next to each entry.
* **Behavior**: Appends/removes records from local contact storage list.
