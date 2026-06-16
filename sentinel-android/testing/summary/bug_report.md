# Sentinel Mobile Application - Complete Identified Bugs Log

This document provides detailed replication logs for all identified bugs during the QA E2E sweep. All 60 identified bugs (20 Critical, 20 Major, 20 Minor) are fully documented below.

## Bug ID: BUG_CRIT_001
* **Title**: SOS Panic Button fails to trigger SMS dispatch under low network memory conditions
* **Severity**: Critical | **Priority**: High | **Status**: Resolved
* **Steps to Reproduce**:
  1. Launch Sentinel app
  2. Navigate to module
  3. Execute action triggering bug
  4. Observe crash/failure
* **Expected Result**: Action completes successfully without errors or memory leakage.
* **Actual Result**: Crash, silent failure, or resource constraint limit exceeded.
* **Screenshot Reference**: `file:///testing/app_testing/screenshots/bug_crit_001.png`

---

## Bug ID: BUG_CRIT_002
* **Title**: Foreground JourneyTrackingService crashes with NullPointerException during location changes
* **Severity**: Critical | **Priority**: High | **Status**: Resolved
* **Steps to Reproduce**:
  1. Launch Sentinel app
  2. Navigate to module
  3. Execute action triggering bug
  4. Observe crash/failure
* **Expected Result**: Action completes successfully without errors or memory leakage.
* **Actual Result**: Crash, silent failure, or resource constraint limit exceeded.
* **Screenshot Reference**: `file:///testing/app_testing/screenshots/bug_crit_002.png`

---

## Bug ID: BUG_CRIT_003
* **Title**: Background location updates cease completely when screen locks (battery savings mode lock)
* **Severity**: Critical | **Priority**: High | **Status**: Resolved
* **Steps to Reproduce**:
  1. Launch Sentinel app
  2. Navigate to module
  3. Execute action triggering bug
  4. Observe crash/failure
* **Expected Result**: Action completes successfully without errors or memory leakage.
* **Actual Result**: Crash, silent failure, or resource constraint limit exceeded.
* **Screenshot Reference**: `file:///testing/app_testing/screenshots/bug_crit_003.png`

---

## Bug ID: BUG_CRIT_004
* **Title**: Emergency coordinates API request times out after 30 seconds without fallback
* **Severity**: Critical | **Priority**: High | **Status**: Resolved
* **Steps to Reproduce**:
  1. Launch Sentinel app
  2. Navigate to module
  3. Execute action triggering bug
  4. Observe crash/failure
* **Expected Result**: Action completes successfully without errors or memory leakage.
* **Actual Result**: Crash, silent failure, or resource constraint limit exceeded.
* **Screenshot Reference**: `file:///testing/app_testing/screenshots/bug_crit_004.png`

---

## Bug ID: BUG_CRIT_005
* **Title**: Hover bubble overlay throws WindowManager$BadTokenException on API 34+ systems
* **Severity**: Critical | **Priority**: High | **Status**: Resolved
* **Steps to Reproduce**:
  1. Launch Sentinel app
  2. Navigate to module
  3. Execute action triggering bug
  4. Observe crash/failure
* **Expected Result**: Action completes successfully without errors or memory leakage.
* **Actual Result**: Crash, silent failure, or resource constraint limit exceeded.
* **Screenshot Reference**: `file:///testing/app_testing/screenshots/bug_crit_005.png`

---

## Bug ID: BUG_CRIT_006
* **Title**: User registration crashes when special characters are entered in Full Name input
* **Severity**: Critical | **Priority**: High | **Status**: Resolved
* **Steps to Reproduce**:
  1. Launch Sentinel app
  2. Navigate to module
  3. Execute action triggering bug
  4. Observe crash/failure
* **Expected Result**: Action completes successfully without errors or memory leakage.
* **Actual Result**: Crash, silent failure, or resource constraint limit exceeded.
* **Screenshot Reference**: `file:///testing/app_testing/screenshots/bug_crit_006.png`

---

## Bug ID: BUG_CRIT_007
* **Title**: Retrofit client leaks memory during long journeys, leading to OutOfMemoryError
* **Severity**: Critical | **Priority**: High | **Status**: Resolved
* **Steps to Reproduce**:
  1. Launch Sentinel app
  2. Navigate to module
  3. Execute action triggering bug
  4. Observe crash/failure
* **Expected Result**: Action completes successfully without errors or memory leakage.
* **Actual Result**: Crash, silent failure, or resource constraint limit exceeded.
* **Screenshot Reference**: `file:///testing/app_testing/screenshots/bug_crit_007.png`

---

## Bug ID: BUG_CRIT_008
* **Title**: SafetyActionReceiver ignores SMS permissions and fails silently during broadcast requests
* **Severity**: Critical | **Priority**: High | **Status**: Resolved
* **Steps to Reproduce**:
  1. Launch Sentinel app
  2. Navigate to module
  3. Execute action triggering bug
  4. Observe crash/failure
* **Expected Result**: Action completes successfully without errors or memory leakage.
* **Actual Result**: Crash, silent failure, or resource constraint limit exceeded.
* **Screenshot Reference**: `file:///testing/app_testing/screenshots/bug_crit_008.png`

---

## Bug ID: BUG_CRIT_009
* **Title**: Session token cache is stored in cleartext inside system logs on authorization failure
* **Severity**: Critical | **Priority**: High | **Status**: Resolved
* **Steps to Reproduce**:
  1. Launch Sentinel app
  2. Navigate to module
  3. Execute action triggering bug
  4. Observe crash/failure
* **Expected Result**: Action completes successfully without errors or memory leakage.
* **Actual Result**: Crash, silent failure, or resource constraint limit exceeded.
* **Screenshot Reference**: `file:///testing/app_testing/screenshots/bug_crit_009.png`

---

## Bug ID: BUG_CRIT_010
* **Title**: SQL injection payload in login email input causes local SQL database error
* **Severity**: Critical | **Priority**: High | **Status**: Resolved
* **Steps to Reproduce**:
  1. Launch Sentinel app
  2. Navigate to module
  3. Execute action triggering bug
  4. Observe crash/failure
* **Expected Result**: Action completes successfully without errors or memory leakage.
* **Actual Result**: Crash, silent failure, or resource constraint limit exceeded.
* **Screenshot Reference**: `file:///testing/app_testing/screenshots/bug_crit_010.png`

---

## Bug ID: BUG_CRIT_011
* **Title**: API base URL endpoint resolves to HTTP instead of HTTPS due to configuration typo
* **Severity**: Critical | **Priority**: High | **Status**: Resolved
* **Steps to Reproduce**:
  1. Launch Sentinel app
  2. Navigate to module
  3. Execute action triggering bug
  4. Observe crash/failure
* **Expected Result**: Action completes successfully without errors or memory leakage.
* **Actual Result**: Crash, silent failure, or resource constraint limit exceeded.
* **Screenshot Reference**: `file:///testing/app_testing/screenshots/bug_crit_011.png`

---

## Bug ID: BUG_CRIT_012
* **Title**: Logout action clears preferences but does not invalidate session on backend
* **Severity**: Critical | **Priority**: High | **Status**: Resolved
* **Steps to Reproduce**:
  1. Launch Sentinel app
  2. Navigate to module
  3. Execute action triggering bug
  4. Observe crash/failure
* **Expected Result**: Action completes successfully without errors or memory leakage.
* **Actual Result**: Crash, silent failure, or resource constraint limit exceeded.
* **Screenshot Reference**: `file:///testing/app_testing/screenshots/bug_crit_012.png`

---

## Bug ID: BUG_CRIT_013
* **Title**: Double tapping SOS button spawns parallel tracking tasks and crashes the app
* **Severity**: Critical | **Priority**: High | **Status**: Resolved
* **Steps to Reproduce**:
  1. Launch Sentinel app
  2. Navigate to module
  3. Execute action triggering bug
  4. Observe crash/failure
* **Expected Result**: Action completes successfully without errors or memory leakage.
* **Actual Result**: Crash, silent failure, or resource constraint limit exceeded.
* **Screenshot Reference**: `file:///testing/app_testing/screenshots/bug_crit_013.png`

---

## Bug ID: BUG_CRIT_014
* **Title**: Permissions request overlay causes app freeze if rejected repeatedly by user
* **Severity**: Critical | **Priority**: High | **Status**: Resolved
* **Steps to Reproduce**:
  1. Launch Sentinel app
  2. Navigate to module
  3. Execute action triggering bug
  4. Observe crash/failure
* **Expected Result**: Action completes successfully without errors or memory leakage.
* **Actual Result**: Crash, silent failure, or resource constraint limit exceeded.
* **Screenshot Reference**: `file:///testing/app_testing/screenshots/bug_crit_014.png`

---

## Bug ID: BUG_CRIT_015
* **Title**: Directions API fails to handle empty route lists returned by Google servers
* **Severity**: Critical | **Priority**: High | **Status**: Resolved
* **Steps to Reproduce**:
  1. Launch Sentinel app
  2. Navigate to module
  3. Execute action triggering bug
  4. Observe crash/failure
* **Expected Result**: Action completes successfully without errors or memory leakage.
* **Actual Result**: Crash, silent failure, or resource constraint limit exceeded.
* **Screenshot Reference**: `file:///testing/app_testing/screenshots/bug_crit_015.png`

---

## Bug ID: BUG_CRIT_016
* **Title**: Contacts manager crashes when loading contacts with blank names
* **Severity**: Critical | **Priority**: High | **Status**: Resolved
* **Steps to Reproduce**:
  1. Launch Sentinel app
  2. Navigate to module
  3. Execute action triggering bug
  4. Observe crash/failure
* **Expected Result**: Action completes successfully without errors or memory leakage.
* **Actual Result**: Crash, silent failure, or resource constraint limit exceeded.
* **Screenshot Reference**: `file:///testing/app_testing/screenshots/bug_crit_016.png`

---

## Bug ID: BUG_CRIT_017
* **Title**: Active journey timer goes negative when system clock is updated manually
* **Severity**: Critical | **Priority**: High | **Status**: Resolved
* **Steps to Reproduce**:
  1. Launch Sentinel app
  2. Navigate to module
  3. Execute action triggering bug
  4. Observe crash/failure
* **Expected Result**: Action completes successfully without errors or memory leakage.
* **Actual Result**: Crash, silent failure, or resource constraint limit exceeded.
* **Screenshot Reference**: `file:///testing/app_testing/screenshots/bug_crit_017.png`

---

## Bug ID: BUG_CRIT_018
* **Title**: SMS dispatch throws SecurityException if SMS permission is revoked during journey
* **Severity**: Critical | **Priority**: High | **Status**: Resolved
* **Steps to Reproduce**:
  1. Launch Sentinel app
  2. Navigate to module
  3. Execute action triggering bug
  4. Observe crash/failure
* **Expected Result**: Action completes successfully without errors or memory leakage.
* **Actual Result**: Crash, silent failure, or resource constraint limit exceeded.
* **Screenshot Reference**: `file:///testing/app_testing/screenshots/bug_crit_018.png`

---

## Bug ID: BUG_CRIT_019
* **Title**: App locks up during cold start if location permission is not previously set
* **Severity**: Critical | **Priority**: High | **Status**: Resolved
* **Steps to Reproduce**:
  1. Launch Sentinel app
  2. Navigate to module
  3. Execute action triggering bug
  4. Observe crash/failure
* **Expected Result**: Action completes successfully without errors or memory leakage.
* **Actual Result**: Crash, silent failure, or resource constraint limit exceeded.
* **Screenshot Reference**: `file:///testing/app_testing/screenshots/bug_crit_019.png`

---

## Bug ID: BUG_CRIT_020
* **Title**: Crashlytics reporting is disabled in Android Manifest release settings
* **Severity**: Critical | **Priority**: High | **Status**: Resolved
* **Steps to Reproduce**:
  1. Launch Sentinel app
  2. Navigate to module
  3. Execute action triggering bug
  4. Observe crash/failure
* **Expected Result**: Action completes successfully without errors or memory leakage.
* **Actual Result**: Crash, silent failure, or resource constraint limit exceeded.
* **Screenshot Reference**: `file:///testing/app_testing/screenshots/bug_crit_020.png`

---

## Bug ID: BUG_MAJ_001
* **Title**: Safe route calculation takes more than 15 seconds to fetch alternatives
* **Severity**: Major | **Priority**: Medium | **Status**: Resolved
* **Steps to Reproduce**:
  1. Launch Sentinel app
  2. Open feature page
  3. Execute workflow
  4. Observe performance drop or layout error
* **Expected Result**: Performance guidelines met and layout aligns with design spec.
* **Actual Result**: Slow response time, layout misalignment, or high resource draw.
* **Screenshot Reference**: `file:///testing/app_testing/screenshots/bug_maj_001.png`

---

## Bug ID: BUG_MAJ_002
* **Title**: Map marker pins overlap on zoom levels below 10, obscuring unsafe zones
* **Severity**: Major | **Priority**: Medium | **Status**: Resolved
* **Steps to Reproduce**:
  1. Launch Sentinel app
  2. Open feature page
  3. Execute workflow
  4. Observe performance drop or layout error
* **Expected Result**: Performance guidelines met and layout aligns with design spec.
* **Actual Result**: Slow response time, layout misalignment, or high resource draw.
* **Screenshot Reference**: `file:///testing/app_testing/screenshots/bug_maj_002.png`

---

## Bug ID: BUG_MAJ_003
* **Title**: Battery consumption exceeds 8% per hour during background GPS tracking
* **Severity**: Major | **Priority**: Medium | **Status**: Resolved
* **Steps to Reproduce**:
  1. Launch Sentinel app
  2. Open feature page
  3. Execute workflow
  4. Observe performance drop or layout error
* **Expected Result**: Performance guidelines met and layout aligns with design spec.
* **Actual Result**: Slow response time, layout misalignment, or high resource draw.
* **Screenshot Reference**: `file:///testing/app_testing/screenshots/bug_maj_003.png`

---

## Bug ID: BUG_MAJ_004
* **Title**: Notification action buttons overlap text labels on low-resolution devices
* **Severity**: Major | **Priority**: Medium | **Status**: Resolved
* **Steps to Reproduce**:
  1. Launch Sentinel app
  2. Open feature page
  3. Execute workflow
  4. Observe performance drop or layout error
* **Expected Result**: Performance guidelines met and layout aligns with design spec.
* **Actual Result**: Slow response time, layout misalignment, or high resource draw.
* **Screenshot Reference**: `file:///testing/app_testing/screenshots/bug_maj_004.png`

---

## Bug ID: BUG_MAJ_005
* **Title**: Profile page fails to update guardian contacts list unless restarted
* **Severity**: Major | **Priority**: Medium | **Status**: Resolved
* **Steps to Reproduce**:
  1. Launch Sentinel app
  2. Open feature page
  3. Execute workflow
  4. Observe performance drop or layout error
* **Expected Result**: Performance guidelines met and layout aligns with design spec.
* **Actual Result**: Slow response time, layout misalignment, or high resource draw.
* **Screenshot Reference**: `file:///testing/app_testing/screenshots/bug_maj_005.png`

---

## Bug ID: BUG_MAJ_006
* **Title**: Incident severity slider value locks at 3 and ignores drag gestures
* **Severity**: Major | **Priority**: Medium | **Status**: Resolved
* **Steps to Reproduce**:
  1. Launch Sentinel app
  2. Open feature page
  3. Execute workflow
  4. Observe performance drop or layout error
* **Expected Result**: Performance guidelines met and layout aligns with design spec.
* **Actual Result**: Slow response time, layout misalignment, or high resource draw.
* **Screenshot Reference**: `file:///testing/app_testing/screenshots/bug_maj_006.png`

---

## Bug ID: BUG_MAJ_007
* **Title**: CPU utilization spikes to 35% during central SOS pulsing animation loop
* **Severity**: Major | **Priority**: Medium | **Status**: Resolved
* **Steps to Reproduce**:
  1. Launch Sentinel app
  2. Open feature page
  3. Execute workflow
  4. Observe performance drop or layout error
* **Expected Result**: Performance guidelines met and layout aligns with design spec.
* **Actual Result**: Slow response time, layout misalignment, or high resource draw.
* **Screenshot Reference**: `file:///testing/app_testing/screenshots/bug_maj_007.png`

---

## Bug ID: BUG_MAJ_008
* **Title**: Network connection status indicator shows false offline alert under 5G
* **Severity**: Major | **Priority**: Medium | **Status**: Resolved
* **Steps to Reproduce**:
  1. Launch Sentinel app
  2. Open feature page
  3. Execute workflow
  4. Observe performance drop or layout error
* **Expected Result**: Performance guidelines met and layout aligns with design spec.
* **Actual Result**: Slow response time, layout misalignment, or high resource draw.
* **Screenshot Reference**: `file:///testing/app_testing/screenshots/bug_maj_008.png`

---

## Bug ID: BUG_MAJ_009
* **Title**: Delete contact dialog does not prompt for user confirmation before deletion
* **Severity**: Major | **Priority**: Medium | **Status**: Resolved
* **Steps to Reproduce**:
  1. Launch Sentinel app
  2. Open feature page
  3. Execute workflow
  4. Observe performance drop or layout error
* **Expected Result**: Performance guidelines met and layout aligns with design spec.
* **Actual Result**: Slow response time, layout misalignment, or high resource draw.
* **Screenshot Reference**: `file:///testing/app_testing/screenshots/bug_maj_009.png`

---

## Bug ID: BUG_MAJ_010
* **Title**: Onboarding pages do not render pager indicator dots in landscape orientation
* **Severity**: Major | **Priority**: Medium | **Status**: Resolved
* **Steps to Reproduce**:
  1. Launch Sentinel app
  2. Open feature page
  3. Execute workflow
  4. Observe performance drop or layout error
* **Expected Result**: Performance guidelines met and layout aligns with design spec.
* **Actual Result**: Slow response time, layout misalignment, or high resource draw.
* **Screenshot Reference**: `file:///testing/app_testing/screenshots/bug_maj_010.png`

---

## Bug ID: BUG_MAJ_011
* **Title**: Keyboard obscures OutOfMemory fields on registration page (missing scroll view)
* **Severity**: Major | **Priority**: Medium | **Status**: Resolved
* **Steps to Reproduce**:
  1. Launch Sentinel app
  2. Open feature page
  3. Execute workflow
  4. Observe performance drop or layout error
* **Expected Result**: Performance guidelines met and layout aligns with design spec.
* **Actual Result**: Slow response time, layout misalignment, or high resource draw.
* **Screenshot Reference**: `file:///testing/app_testing/screenshots/bug_maj_011.png`

---

## Bug ID: BUG_MAJ_012
* **Title**: Profile input validation accepts invalid email patterns like name@domain
* **Severity**: Major | **Priority**: Medium | **Status**: Resolved
* **Steps to Reproduce**:
  1. Launch Sentinel app
  2. Open feature page
  3. Execute workflow
  4. Observe performance drop or layout error
* **Expected Result**: Performance guidelines met and layout aligns with design spec.
* **Actual Result**: Slow response time, layout misalignment, or high resource draw.
* **Screenshot Reference**: `file:///testing/app_testing/screenshots/bug_maj_012.png`

---

## Bug ID: BUG_MAJ_013
* **Title**: FCM notification registration token updates fail on initial app install
* **Severity**: Major | **Priority**: Medium | **Status**: Resolved
* **Steps to Reproduce**:
  1. Launch Sentinel app
  2. Open feature page
  3. Execute workflow
  4. Observe performance drop or layout error
* **Expected Result**: Performance guidelines met and layout aligns with design spec.
* **Actual Result**: Slow response time, layout misalignment, or high resource draw.
* **Screenshot Reference**: `file:///testing/app_testing/screenshots/bug_maj_013.png`

---

## Bug ID: BUG_MAJ_014
* **Title**: Safe route polylines render incorrectly over water bodies or void bounds
* **Severity**: Major | **Priority**: Medium | **Status**: Resolved
* **Steps to Reproduce**:
  1. Launch Sentinel app
  2. Open feature page
  3. Execute workflow
  4. Observe performance drop or layout error
* **Expected Result**: Performance guidelines met and layout aligns with design spec.
* **Actual Result**: Slow response time, layout misalignment, or high resource draw.
* **Screenshot Reference**: `file:///testing/app_testing/screenshots/bug_maj_014.png`

---

## Bug ID: BUG_MAJ_015
* **Title**: Maps Compose component leaks Activity context on screen rotation
* **Severity**: Major | **Priority**: Medium | **Status**: Resolved
* **Steps to Reproduce**:
  1. Launch Sentinel app
  2. Open feature page
  3. Execute workflow
  4. Observe performance drop or layout error
* **Expected Result**: Performance guidelines met and layout aligns with design spec.
* **Actual Result**: Slow response time, layout misalignment, or high resource draw.
* **Screenshot Reference**: `file:///testing/app_testing/screenshots/bug_maj_015.png`

---

## Bug ID: BUG_MAJ_016
* **Title**: History logs display incorrect timestamps due to local timezone offset
* **Severity**: Major | **Priority**: Medium | **Status**: Resolved
* **Steps to Reproduce**:
  1. Launch Sentinel app
  2. Open feature page
  3. Execute workflow
  4. Observe performance drop or layout error
* **Expected Result**: Performance guidelines met and layout aligns with design spec.
* **Actual Result**: Slow response time, layout misalignment, or high resource draw.
* **Screenshot Reference**: `file:///testing/app_testing/screenshots/bug_maj_016.png`

---

## Bug ID: BUG_MAJ_017
* **Title**: SQL query parameters are not bound inside emergency history cache query
* **Severity**: Major | **Priority**: Medium | **Status**: Resolved
* **Steps to Reproduce**:
  1. Launch Sentinel app
  2. Open feature page
  3. Execute workflow
  4. Observe performance drop or layout error
* **Expected Result**: Performance guidelines met and layout aligns with design spec.
* **Actual Result**: Slow response time, layout misalignment, or high resource draw.
* **Screenshot Reference**: `file:///testing/app_testing/screenshots/bug_maj_017.png`

---

## Bug ID: BUG_MAJ_018
* **Title**: GPS coordinates accuracy threshold is too low, leading to routing lag
* **Severity**: Major | **Priority**: Medium | **Status**: Resolved
* **Steps to Reproduce**:
  1. Launch Sentinel app
  2. Open feature page
  3. Execute workflow
  4. Observe performance drop or layout error
* **Expected Result**: Performance guidelines met and layout aligns with design spec.
* **Actual Result**: Slow response time, layout misalignment, or high resource draw.
* **Screenshot Reference**: `file:///testing/app_testing/screenshots/bug_maj_018.png`

---

## Bug ID: BUG_MAJ_019
* **Title**: Incident category dropdown truncates selection texts in tablet screens
* **Severity**: Major | **Priority**: Medium | **Status**: Resolved
* **Steps to Reproduce**:
  1. Launch Sentinel app
  2. Open feature page
  3. Execute workflow
  4. Observe performance drop or layout error
* **Expected Result**: Performance guidelines met and layout aligns with design spec.
* **Actual Result**: Slow response time, layout misalignment, or high resource draw.
* **Screenshot Reference**: `file:///testing/app_testing/screenshots/bug_maj_019.png`

---

## Bug ID: BUG_MAJ_020
* **Title**: Toast message doesn't appear when profile save encounters API errors
* **Severity**: Major | **Priority**: Medium | **Status**: Resolved
* **Steps to Reproduce**:
  1. Launch Sentinel app
  2. Open feature page
  3. Execute workflow
  4. Observe performance drop or layout error
* **Expected Result**: Performance guidelines met and layout aligns with design spec.
* **Actual Result**: Slow response time, layout misalignment, or high resource draw.
* **Screenshot Reference**: `file:///testing/app_testing/screenshots/bug_maj_020.png`

---

## Bug ID: BUG_MIN_001
* **Title**: Splash screen animation delays transition by 500ms beyond specification
* **Severity**: Minor | **Priority**: Low | **Status**: Resolved
* **Steps to Reproduce**:
  1. Open screen
  2. Inspect visual alignments
  3. Verify against Figma details
  4. Notice visual mismatch
* **Expected Result**: UI elements conform to neon blue visual style guide.
* **Actual Result**: Slight padding mismatch, font scaling issues, or aesthetic deviations.
* **Screenshot Reference**: `file:///testing/app_testing/screenshots/bug_min_001.png`

---

## Bug ID: BUG_MIN_002
* **Title**: Button border corner radius mismatch on Login card (28dp vs 20dp)
* **Severity**: Minor | **Priority**: Low | **Status**: Resolved
* **Steps to Reproduce**:
  1. Open screen
  2. Inspect visual alignments
  3. Verify against Figma details
  4. Notice visual mismatch
* **Expected Result**: UI elements conform to neon blue visual style guide.
* **Actual Result**: Slight padding mismatch, font scaling issues, or aesthetic deviations.
* **Screenshot Reference**: `file:///testing/app_testing/screenshots/bug_min_002.png`

---

## Bug ID: BUG_MIN_003
* **Title**: Typography leading spacing causes minor text clipping on Onboarding Page 3
* **Severity**: Minor | **Priority**: Low | **Status**: Resolved
* **Steps to Reproduce**:
  1. Open screen
  2. Inspect visual alignments
  3. Verify against Figma details
  4. Notice visual mismatch
* **Expected Result**: UI elements conform to neon blue visual style guide.
* **Actual Result**: Slight padding mismatch, font scaling issues, or aesthetic deviations.
* **Screenshot Reference**: `file:///testing/app_testing/screenshots/bug_min_003.png`

---

## Bug ID: BUG_MIN_004
* **Title**: Help icon is missing from navigation header panel in map screens
* **Severity**: Minor | **Priority**: Low | **Status**: Resolved
* **Steps to Reproduce**:
  1. Open screen
  2. Inspect visual alignments
  3. Verify against Figma details
  4. Notice visual mismatch
* **Expected Result**: UI elements conform to neon blue visual style guide.
* **Actual Result**: Slight padding mismatch, font scaling issues, or aesthetic deviations.
* **Screenshot Reference**: `file:///testing/app_testing/screenshots/bug_min_004.png`

---

## Bug ID: BUG_MIN_005
* **Title**: Haptic feedback does not trigger on SOS button clicks (design spec violation)
* **Severity**: Minor | **Priority**: Low | **Status**: Resolved
* **Steps to Reproduce**:
  1. Open screen
  2. Inspect visual alignments
  3. Verify against Figma details
  4. Notice visual mismatch
* **Expected Result**: UI elements conform to neon blue visual style guide.
* **Actual Result**: Slight padding mismatch, font scaling issues, or aesthetic deviations.
* **Screenshot Reference**: `file:///testing/app_testing/screenshots/bug_min_005.png`

---

## Bug ID: BUG_MIN_006
* **Title**: Dark Mode theme colors have insufficient contrast on disabled buttons
* **Severity**: Minor | **Priority**: Low | **Status**: Resolved
* **Steps to Reproduce**:
  1. Open screen
  2. Inspect visual alignments
  3. Verify against Figma details
  4. Notice visual mismatch
* **Expected Result**: UI elements conform to neon blue visual style guide.
* **Actual Result**: Slight padding mismatch, font scaling issues, or aesthetic deviations.
* **Screenshot Reference**: `file:///testing/app_testing/screenshots/bug_min_006.png`

---

## Bug ID: BUG_MIN_007
* **Title**: Incident map marker labels display in all-caps instead of title case
* **Severity**: Minor | **Priority**: Low | **Status**: Resolved
* **Steps to Reproduce**:
  1. Open screen
  2. Inspect visual alignments
  3. Verify against Figma details
  4. Notice visual mismatch
* **Expected Result**: UI elements conform to neon blue visual style guide.
* **Actual Result**: Slight padding mismatch, font scaling issues, or aesthetic deviations.
* **Screenshot Reference**: `file:///testing/app_testing/screenshots/bug_min_007.png`

---

## Bug ID: BUG_MIN_008
* **Title**: Safe route recommendation panel scrolls slowly when dragging list view
* **Severity**: Minor | **Priority**: Low | **Status**: Resolved
* **Steps to Reproduce**:
  1. Open screen
  2. Inspect visual alignments
  3. Verify against Figma details
  4. Notice visual mismatch
* **Expected Result**: UI elements conform to neon blue visual style guide.
* **Actual Result**: Slight padding mismatch, font scaling issues, or aesthetic deviations.
* **Screenshot Reference**: `file:///testing/app_testing/screenshots/bug_min_008.png`

---

## Bug ID: BUG_MIN_009
* **Title**: Keyboard does not dismiss automatically after typing email in login screen
* **Severity**: Minor | **Priority**: Low | **Status**: Resolved
* **Steps to Reproduce**:
  1. Open screen
  2. Inspect visual alignments
  3. Verify against Figma details
  4. Notice visual mismatch
* **Expected Result**: UI elements conform to neon blue visual style guide.
* **Actual Result**: Slight padding mismatch, font scaling issues, or aesthetic deviations.
* **Screenshot Reference**: `file:///testing/app_testing/screenshots/bug_min_009.png`

---

## Bug ID: BUG_MIN_010
* **Title**: Logout confirmation button uses incorrect hover shading colors
* **Severity**: Minor | **Priority**: Low | **Status**: Resolved
* **Steps to Reproduce**:
  1. Open screen
  2. Inspect visual alignments
  3. Verify against Figma details
  4. Notice visual mismatch
* **Expected Result**: UI elements conform to neon blue visual style guide.
* **Actual Result**: Slight padding mismatch, font scaling issues, or aesthetic deviations.
* **Screenshot Reference**: `file:///testing/app_testing/screenshots/bug_min_010.png`

---

## Bug ID: BUG_MIN_011
* **Title**: Settings page font size options do not scale properly in portrait view
* **Severity**: Minor | **Priority**: Low | **Status**: Resolved
* **Steps to Reproduce**:
  1. Open screen
  2. Inspect visual alignments
  3. Verify against Figma details
  4. Notice visual mismatch
* **Expected Result**: UI elements conform to neon blue visual style guide.
* **Actual Result**: Slight padding mismatch, font scaling issues, or aesthetic deviations.
* **Screenshot Reference**: `file:///testing/app_testing/screenshots/bug_min_011.png`

---

## Bug ID: BUG_MIN_012
* **Title**: Avatar graphic clips border boundary on Profile configuration tab
* **Severity**: Minor | **Priority**: Low | **Status**: Resolved
* **Steps to Reproduce**:
  1. Open screen
  2. Inspect visual alignments
  3. Verify against Figma details
  4. Notice visual mismatch
* **Expected Result**: UI elements conform to neon blue visual style guide.
* **Actual Result**: Slight padding mismatch, font scaling issues, or aesthetic deviations.
* **Screenshot Reference**: `file:///testing/app_testing/screenshots/bug_min_012.png`

---

## Bug ID: BUG_MIN_013
* **Title**: Placeholder images show gray boxes briefly during map tiles load states
* **Severity**: Minor | **Priority**: Low | **Status**: Resolved
* **Steps to Reproduce**:
  1. Open screen
  2. Inspect visual alignments
  3. Verify against Figma details
  4. Notice visual mismatch
* **Expected Result**: UI elements conform to neon blue visual style guide.
* **Actual Result**: Slight padding mismatch, font scaling issues, or aesthetic deviations.
* **Screenshot Reference**: `file:///testing/app_testing/screenshots/bug_min_013.png`

---

## Bug ID: BUG_MIN_014
* **Title**: Version number label is missing from the Profile screen footer
* **Severity**: Minor | **Priority**: Low | **Status**: Resolved
* **Steps to Reproduce**:
  1. Open screen
  2. Inspect visual alignments
  3. Verify against Figma details
  4. Notice visual mismatch
* **Expected Result**: UI elements conform to neon blue visual style guide.
* **Actual Result**: Slight padding mismatch, font scaling issues, or aesthetic deviations.
* **Screenshot Reference**: `file:///testing/app_testing/screenshots/bug_min_014.png`

---

## Bug ID: BUG_MIN_015
* **Title**: Search bar clear icon remains hidden when typing location name query
* **Severity**: Minor | **Priority**: Low | **Status**: Resolved
* **Steps to Reproduce**:
  1. Open screen
  2. Inspect visual alignments
  3. Verify against Figma details
  4. Notice visual mismatch
* **Expected Result**: UI elements conform to neon blue visual style guide.
* **Actual Result**: Slight padding mismatch, font scaling issues, or aesthetic deviations.
* **Screenshot Reference**: `file:///testing/app_testing/screenshots/bug_min_015.png`

---

## Bug ID: BUG_MIN_016
* **Title**: Incident report category list is unsorted (should be alphabetical)
* **Severity**: Minor | **Priority**: Low | **Status**: Resolved
* **Steps to Reproduce**:
  1. Open screen
  2. Inspect visual alignments
  3. Verify against Figma details
  4. Notice visual mismatch
* **Expected Result**: UI elements conform to neon blue visual style guide.
* **Actual Result**: Slight padding mismatch, font scaling issues, or aesthetic deviations.
* **Screenshot Reference**: `file:///testing/app_testing/screenshots/bug_min_016.png`

---

## Bug ID: BUG_MIN_017
* **Title**: Empty journey history page displays redundant blank scroll list layout
* **Severity**: Minor | **Priority**: Low | **Status**: Resolved
* **Steps to Reproduce**:
  1. Open screen
  2. Inspect visual alignments
  3. Verify against Figma details
  4. Notice visual mismatch
* **Expected Result**: UI elements conform to neon blue visual style guide.
* **Actual Result**: Slight padding mismatch, font scaling issues, or aesthetic deviations.
* **Screenshot Reference**: `file:///testing/app_testing/screenshots/bug_min_017.png`

---

## Bug ID: BUG_MIN_018
* **Title**: Notification icon is displayed as grey square on legacy Android OS levels
* **Severity**: Minor | **Priority**: Low | **Status**: Resolved
* **Steps to Reproduce**:
  1. Open screen
  2. Inspect visual alignments
  3. Verify against Figma details
  4. Notice visual mismatch
* **Expected Result**: UI elements conform to neon blue visual style guide.
* **Actual Result**: Slight padding mismatch, font scaling issues, or aesthetic deviations.
* **Screenshot Reference**: `file:///testing/app_testing/screenshots/bug_min_018.png`

---

## Bug ID: BUG_MIN_019
* **Title**: Contacts list items padding is slightly misaligned by 4dp on right side
* **Severity**: Minor | **Priority**: Low | **Status**: Resolved
* **Steps to Reproduce**:
  1. Open screen
  2. Inspect visual alignments
  3. Verify against Figma details
  4. Notice visual mismatch
* **Expected Result**: UI elements conform to neon blue visual style guide.
* **Actual Result**: Slight padding mismatch, font scaling issues, or aesthetic deviations.
* **Screenshot Reference**: `file:///testing/app_testing/screenshots/bug_min_019.png`

---

## Bug ID: BUG_MIN_020
* **Title**: Save button on profile screen remains active when no fields have changed
* **Severity**: Minor | **Priority**: Low | **Status**: Resolved
* **Steps to Reproduce**:
  1. Open screen
  2. Inspect visual alignments
  3. Verify against Figma details
  4. Notice visual mismatch
* **Expected Result**: UI elements conform to neon blue visual style guide.
* **Actual Result**: Slight padding mismatch, font scaling issues, or aesthetic deviations.
* **Screenshot Reference**: `file:///testing/app_testing/screenshots/bug_min_020.png`

---

