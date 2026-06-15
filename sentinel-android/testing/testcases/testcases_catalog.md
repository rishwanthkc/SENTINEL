# Sentinel Android Application - Complete QA Test Cases Catalog

This document contains a comprehensive library of **150+ unique automated and manual test cases** for the Sentinel women's safety Android application.

---

## 1. Functional Testing (40+ Test Cases)
Evaluates critical business logic, screen rendering, API communications, background processing, and location tracking.

* **TC_FUNC_001**: Verify app launch and automatic redirection to Onboarding screen on fresh install.
* **TC_FUNC_002**: Verify transition to Home screen from Splash screen if user session is already logged in.
* **TC_FUNC_003**: Verify User Registration API integration using valid inputs (Email, Name, Firebase UID).
* **TC_FUNC_004**: Verify User Login API integration using a registered email address.
* **TC_FUNC_005**: Verify SharedPreferences session storage gets updated with user email on login.
* **TC_FUNC_006**: Verify SOS trigger sends location coordinate payload (Latitude/Longitude) to backend.
* **TC_FUNC_007**: Verify SOS trigger sends SMS with GPS link to all trusted emergency contacts.
* **TC_FUNC_008**: Verify SMS broadcasting logic if no internet is available.
* **TC_FUNC_009**: Verify ADD CONTACT adds trusted contact name and phone to local circle contacts.
* **TC_FUNC_010**: Verify DELETE CONTACT removes trusted contact and updates local contact cache.
* **TC_FUNC_011**: Verify incident reporting forms submit category, details, severity, and location to backend.
* **TC_FUNC_012**: Verify incident map populates custom pins/markers fetched from backend incident list.
* **TC_FUNC_013**: Verify Google Maps display shows current GPS blue dot when location permission is active.
* **TC_FUNC_014**: Verify Safe Route Planning displays route options and color codes by safety ratings.
* **TC_FUNC_015**: Verify Route Recommendation screen lets user select route and start journey.
* **TC_FUNC_016**: Verify Journey Dashboard displays live duration clock timer and path coordinates.
* **TC_FUNC_017**: Verify Journey Dashboard END JOURNEY button deactivates service and navigates back.
* **TC_FUNC_018**: Verify Profile screen populates text fields from local profile data.
* **TC_FUNC_019**: Verify Profile screen SAVE button updates local storage and displays confirmation.
* **TC_FUNC_020**: Verify Profile screen LOGOUT button clears login state cache and redirects to Login.
* **TC_FUNC_021**: Verify Foreground tracking service starts and displays persistent notification.
* **TC_FUNC_022**: Verify Foreground service updates location continuously on backend during active journey.
* **TC_FUNC_023**: Verify Floating bubble overlay launches when permission is granted and journey is active.
* **TC_FUNC_024**: Verify clicking Floating bubble overlay triggers instant emergency panic mode.
* **TC_FUNC_025**: Verify SafetyActionReceiver executes broadcast intent from notification button.
* **TC_FUNC_026**: Verify "I'm Safe" notification action dismisses emergency state on backend.
* **TC_FUNC_027**: Verify "Send SOS" notification action immediately triggers secondary warning broadcasts.
* **TC_FUNC_028**: Verify History screen loads previous journey logs and maps paths from database.
* **TC_FUNC_029**: Verify app behaves correctly when Google Play Services are disabled.
* **TC_FUNC_030**: Verify app behavior when device storage is completely full.
* **TC_FUNC_031**: Verify SMS broadcasting logic handles blank phone numbers.
* **TC_FUNC_032**: Verify location fetching is restarted if GPS connection drops and reconnects.
* **TC_FUNC_033**: Verify retrofit clients retry requests when backend is temporarily unresponsive.
* **TC_FUNC_034**: Verify map screen updates pins dynamically when user pans/scrolls the map.
* **TC_FUNC_035**: Verify user can select emergency category via incident dropdown.
* **TC_FUNC_036**: Verify slider component updates risk value between 1 and 5 in real-time.
* **TC_FUNC_037**: Verify custom Bottom Nav Bar switches view state fragments correctly.
* **TC_FUNC_038**: Verify app handles interruption (like incoming phone call) during active routing.
* **TC_FUNC_039**: Verify contacts count displays correct values in greeting status message.
* **TC_FUNC_040**: Verify registration fails if email already exists on database.
* **TC_FUNC_041**: Verify logout de-registers FCM notification tokens from backend.
* **TC_FUNC_042**: Verify active emergency list updates automatically when new SOS is fired.

---

## 2. UI Testing (20+ Test Cases)
Validates UI aesthetics, colors, font sizes, responsiveness, alignments, and state representations.

* **TC_UI_001**: Verify Splash screen titles are styled in correct NeonBlue color and center-aligned.
* **TC_UI_002**: Verify Onboarding pages have distinct horizontal pager indicator dots.
* **TC_UI_003**: Verify OutlinedTextField borders glow with NeonBlue when focused.
* **TC_UI_004**: Verify OutlinedTextField borders display TextGray when unfocused.
* **TC_UI_005**: Verify Welcome headers match font styles (bold, Segoe UI / default default styling).
* **TC_UI_006**: Verify SOS button has a pulsing halo animation and remains centered on Home screen.
* **TC_UI_007**: Verify Protection Active Status Card displays a solid green indicator dot.
* **TC_UI_008**: Verify Bottom Navigation Bar icons are highlighted when their respective route is active.
* **TC_UI_009**: Verify incident report card outline matches EmergencyRed theme.
* **TC_UI_010**: Verify Incident Map pins use unique custom markers (not generic default ones).
* **TC_UI_011**: Verify empty list states display descriptive illustrations and help text.
* **TC_UI_012**: Verify dialog buttons use rounded corners matching the global design specs.
* **TC_UI_013**: Verify loading screen shows custom material indicator or shimmer layouts.
* **TC_UI_014**: Verify text wrapping does not overlap on small screen resolutions (e.g. 5-inch screens).
* **TC_UI_015**: Verify Dark Mode colors maintain appropriate contrast ratios (> 4.5:1).
* **TC_UI_016**: Verify Light Mode fallback colors are applied consistently if toggled.
* **TC_UI_017**: Verify card elevations and dropshadows are rendered correctly.
* **TC_UI_018**: Verify form inputs show red error borders when validation errors occur.
* **TC_UI_019**: Verify profile picture uses circular cropping boundaries.
* **TC_UI_020**: Verify UI margins are proportional across all key fragments.
* **TC_UI_021**: Verify text field placeholders remain legible in dark settings.
* **TC_UI_022**: Verify action icons align with text labels within feature cards.

---

## 3. UX Testing (15+ Test Cases)
Evaluates accessibility, touch target sizes, ease of navigation, feedback mechanisms, and user path friction.

* **TC_UX_001**: Verify that the main SOS panic button is easily reachable within thumb zone.
* **TC_UX_002**: Verify Toast messages are shown to confirm success of critical inputs (e.g. Contact Added).
* **TC_UX_003**: Verify user is prompted to confirm before deletion of a trusted contact.
* **TC_UX_004**: Verify screen transition animations are smooth with zero flicker.
* **TC_UX_005**: Verify touch target sizes for all interactive items are at least 48dp x 48dp.
* **TC_UX_006**: Verify input field autofocus is configured on appropriate screens (e.g. Login email input).
* **TC_UX_007**: Verify keyboard type displays numeric pad for phone inputs and email format for email inputs.
* **TC_UX_008**: Verify loading overlays prevent double-tapping buttons during network operations.
* **TC_UX_009**: Verify user can dismiss warning dialogs by tapping outside their bounds.
* **TC_UX_010**: Verify error popups contain actionable suggestions (e.g. "Try again", "Check GPS").
* **TC_UX_011**: Verify back navigation prompts user to confirm before stopping an active journey.
* **TC_UX_012**: Verify UI updates within 100ms of click interactions (low input lag).
* **TC_UX_013**: Verify screen brightness remains optimized during active mapping tracking.
* **TC_UX_014**: Verify onboarding skips are supported to respect user preferences.
* **TC_UX_015**: Verify screen reader content descriptions are present for all icons.
* **TC_UX_016**: Verify haptic feedback triggers on SOS button long-press.

---

## 4. Validation Testing (20+ Test Cases)
Tests system bounds, input checks, security injections, constraints, and error feedback logic.

* **TC_VAL_001**: Verify login fails with invalid email format (e.g., "invalid_email.com").
* **TC_VAL_002**: Verify registration fails if Email field is empty.
* **TC_VAL_003**: Verify registration fails if Name field is empty.
* **TC_VAL_004**: Verify registration fails if Firebase UID field is empty.
* **TC_VAL_005**: Verify emergency contact addition fails if name contains numbers.
* **TC_VAL_006**: Verify emergency contact addition fails if phone number contains letters.
* **TC_VAL_007**: Verify contact phone validation rejects values shorter than 10 digits.
* **TC_VAL_008**: Verify contact phone validation rejects values longer than 15 digits.
* **TC_VAL_009**: Verify incident report title rejects empty string.
* **TC_VAL_0010**: Verify incident description rejects inputs longer than 1000 characters.
* **TC_VAL_011**: Verify risk severity slider restricts inputs between boundary conditions 1 and 5.
* **TC_VAL_012**: Verify SQL injection string inputs are sanitized in login input (`' OR 1=1 --`).
* **TC_VAL_013**: Verify HTML/XSS injection tags are stripped in incident descriptions (`<script>alert(1)</script>`).
* **TC_VAL_014**: Verify special characters (`$`, `&`, `*`, `%`) are handled gracefully in text forms.
* **TC_VAL_015**: Verify blank spaces are trimmed from email strings before execution.
* **TC_VAL_016**: Verify safe route planning requires different origin and destination inputs.
* **TC_VAL_017**: Verify profile page emergency email field validates formatting requirements.
* **TC_VAL_018**: Verify numeric location inputs (latitude/longitude) are checked against valid ranges (-90 to 90, -180 to 180).
* **TC_VAL_019**: Verify date pickers do not allow selection of future dates for past history.
* **TC_VAL_020**: Verify duplicate contacts are rejected during trusted circle additions.
* **TC_VAL_021**: Verify password-style inputs are masked where appropriate.

---

## 5. Security Testing (15+ Test Cases)
Verifies session boundaries, local storage configurations, API communications, and data leakage mitigations.

* **TC_SEC_001**: Verify sensitive credentials are not saved in cleartext inside local logcat logs.
* **TC_SEC_002**: Verify user session is completely terminated on logout (erasing token caches).
* **TC_SEC_003**: Verify app denies navigation to Home screen if user has not completed login process.
* **TC_SEC_004**: Verify SSL pinning or HTTPS protocol is enforced on all backend API connections.
* **TC_SEC_005**: Verify local shared preferences (`sentinel_prefs`) are initialized using `MODE_PRIVATE`.
* **TC_SEC_006**: Verify database coordinates of incidents do not expose private user profile information.
* **TC_SEC_007**: Verify app permissions are requested dynamically, adhering to the principle of least privilege.
* **TC_SEC_008**: Verify backup configurations exclude sensitive account cache variables.
* **TC_SEC_009**: Verify root access detection warning alerts the user when run on compromised environments.
* **TC_SEC_010**: Verify token expiration forces automated session logout and prompts login again.
* **TC_SEC_011**: Verify API requests include auth signatures in HTTP header parameters.
* **TC_SEC_012**: Verify that background processes do not leak coordinates when app is closed.
* **TC_SEC_013**: Verify app prevents screenshot capture on sensitive screens (e.g. passwords/UIDs) if enabled.
* **TC_SEC_014**: Verify API endpoints cannot be queried without valid signature authorization tokens.
* **TC_SEC_015**: Verify Android Manifest config enforces network security config restrictions.

---

## 6. Performance Testing (15+ Test Cases)
Measures resource usage, response times, memory leaks, and CPU optimization.

* **TC_PERF_001**: Verify Cold Start time remains under 1200ms.
* **TC_PERF_002**: Verify Warm Start time remains under 350ms.
* **TC_PERF_003**: Verify app CPU usage remains below 10% during active SOS pulsing animation.
* **TC_PERF_004**: Verify RAM memory consumption does not exceed 100MB during continuous location tracking.
* **TC_PERF_005**: Verify battery drain remains below 5% per hour of continuous background tracking.
* **TC_PERF_006**: Verify safe route planning requests respond and render within 1500ms.
* **TC_PERF_007**: Verify memory leaks do not occur when navigating repeatedly between screens.
* **TC_PERF_008**: Verify logcat outputs are optimized to prevent frame drops.
* **TC_PERF_009**: Verify application renders mapping tiles smoothly at 60 FPS.
* **TC_PERF_010**: Verify network bandwidth utilization is compressed during API coordinate syncs.
* **TC_PERF_011**: Verify battery temperature is maintained below critical thresholds (under 40°C).
* **TC_PERF_012**: Verify app recovers cleanly from memory constraints when system terminates background tasks.
* **TC_PERF_013**: Verify Google Maps Compose doesn't leak memory on screen disposal.
* **TC_PERF_014**: Verify app behavior during heavy database read/write concurrency.
* **TC_PERF_015**: Verify API cache limits data usage for duplicate nearby incident queries.

---

## 7. Navigation Testing (10+ Test Cases)
Checks route paths, state transitions, backstack management, and routing edge cases.

* **TC_NAV_001**: Verify back button does not redirect user to Splash screen from Home dashboard.
* **TC_NAV_002**: Verify back button does not redirect user to Login screen from Home dashboard.
* **TC_NAV_003**: Verify navigation to Profile screen via top right icon and returning works cleanly.
* **TC_NAV_004**: Verify navigation to Safe Route planning from quick action cards.
* **TC_NAV_005**: Verify navigation to Emergency Contacts from quick action cards.
* **TC_NAV_006**: Verify navigation to Journey History logs from quick action cards.
* **TC_NAV_007**: Verify bottom bar selection updates the active navigation state destination.
* **TC_NAV_008**: Verify deep linking to specific screens handles authorization validation first.
* **TC_NAV_009**: Verify back navigation from Report incident returns user directly to Home.
* **TC_NAV_010**: Verify back click on Onboarding prompts user or exits the application context.

---

## 8. Compatibility Testing (10+ Test Cases)
Verifies multi-screen, multi-device, and OS level stability.

* **TC_COMP_001**: Verify UI renders correctly in portrait orientation on API 36 (target).
* **TC_COMP_002**: Verify UI renders correctly in landscape orientation on API 36 (target).
* **TC_COMP_003**: Verify backwards compatibility of layouts on minimum SDK API 26 (Oreo).
* **TC_COMP_004**: Verify app performance and map rendering on low-end hardware profiles (2GB RAM devices).
* **TC_COMP_005**: Verify font sizing adapts to system font adjustments (Accessibility settings).
* **TC_COMP_006**: Verify notifications are visible and correctly styled across Android 10, 11, 12, 13, 14, 15, and 16.
* **TC_COMP_007**: Verify app permissions are requested correctly on devices with runtime permission rules (API 23+).
* **TC_COMP_008**: Verify app adapts layouts for notch/cutout displays.
* **TC_COMP_009**: Verify app layout works on tablet configurations (flexible scaling).
* **TC_COMP_010**: Verify Google Play Services dependencies resolve across different emulator builds.

---

## 9. Deployment Readiness Testing (10+ Test Cases)
Checks production parameters, build hygiene, crash logs, and release readiness.

* **TC_DEP_001**: Verify build compiled in Release mode has Proguard/R8 shrinking enabled.
* **TC_DEP_002**: Verify all debugger logs are disabled in the final release apk.
* **TC_DEP_003**: Verify the application is signed with a production release keystore certificate.
* **TC_DEP_004**: Verify critical path crash-free rate is 100% on automated sanity testing.
* **TC_DEP_005**: Verify database backups rule definition excludes private auth directories.
* **TC_DEP_006**: Verify the API key values inside AndroidManifest do not use debug placeholders.
* **TC_DEP_007**: Verify app icon and round icon packages are fully resolved in mipmap assets.
* **TC_DEP_008**: Verify target sdk version configuration is set to 36.
* **TC_DEP_009**: Verify that third-party licenses are logged and accessible.
* **TC_DEP_010**: Verify final binary size remains within acceptable play store release parameters.
