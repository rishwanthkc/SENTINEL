import os

# Base directory of the testing ecosystem (sentinel-android/testing)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Simulation mode toggle - set to True when running in headless environments without physical devices or active emulators
SIMULATION_MODE = True

# Target application package details
APP_PACKAGE = "com.sentinel.app"
APP_ACTIVITY = "com.sentinel.app.MainActivity"

# Relative paths for files
APP_APK_PATH = os.path.abspath(os.path.join(
    BASE_DIR, "app", "build", "outputs", "apk", "debug", "app-debug.apk"
))

# Appium server details
APPIUM_SERVER_URL = "http://localhost:4723"

# Appium driver configurations
DESIRED_CAPABILITIES = {
    "platformName": "Android",
    "automationName": "UiAutomator2",
    "deviceName": "Android_Emulator",
    "appPackage": APP_PACKAGE,
    "appActivity": APP_ACTIVITY,
    "noReset": False,
    "fullReset": True,
    "autoGrantPermissions": True,
    "newCommandTimeout": 300,
    "gpsEnabled": True
}

# Timeout configurations (in seconds)
EXPLICIT_WAIT_TIMEOUT = 10
IMPLICIT_WAIT_TIMEOUT = 5

# Local testing paths
SCREENSHOTS_DIR = os.path.join(BASE_DIR, "app_testing", "screenshots")
VIDEOS_DIR = os.path.join(BASE_DIR, "app_testing", "videos")
LOGS_DIR = os.path.join(BASE_DIR, "app_testing", "logs")
EVIDENCE_DIR = os.path.join(BASE_DIR, "app_testing", "evidence")
REPORTS_DIR = os.path.join(BASE_DIR, "app_testing", "reports")
EXCEL_REPORTS_DIR = os.path.join(BASE_DIR, "excel-reports")
SUMMARY_DIR = os.path.join(BASE_DIR, "summary")

# Make sure folders exist
for folder in [SCREENSHOTS_DIR, VIDEOS_DIR, LOGS_DIR, EVIDENCE_DIR, REPORTS_DIR, EXCEL_REPORTS_DIR, SUMMARY_DIR]:
    os.makedirs(folder, exist_ok=True)
