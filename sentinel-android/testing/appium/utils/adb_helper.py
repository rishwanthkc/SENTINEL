import subprocess
import os
import logging
from ..configs import config

logger = logging.getLogger("SentinelQA")

# Use Adb path from local.properties if found, else default
ADB_PATH = r"C:\Users\rishi\AppData\Local\Android\Sdk\platform-tools\adb.exe"
if not os.path.exists(ADB_PATH):
    ADB_PATH = "adb"  # fallback to system PATH

class AdbHelper:
    def __init__(self, simulation_mode=config.SIMULATION_MODE):
        self.simulation_mode = simulation_mode

    def _execute(self, command):
        """Executes a command using subprocess."""
        if self.simulation_mode:
            logger.info(f"SIMULATED ADB: {command}")
            return True, "Simulated command output"

        full_command = f'"{ADB_PATH}" {command}'
        try:
            result = subprocess.run(
                full_command,
                shell=True,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                text=True,
                timeout=15
            )
            if result.returncode == 0:
                return True, result.stdout.strip()
            else:
                return False, result.stderr.strip()
        except Exception as e:
            return False, str(e)

    def is_device_connected(self):
        """Checks if there's any active Android device connected."""
        success, output = self._execute("devices")
        if not success:
            return False
        lines = output.splitlines()
        devices = [line for line in lines[1:] if line.strip() and "device" in line]
        return len(devices) > 0

    def install_app(self, apk_path=config.APP_APK_PATH):
        """Installs the APK on the device."""
        logger.info(f"Installing APK from {apk_path}...")
        return self._execute(f"install -r {apk_path}")

    def grant_permission(self, permission):
        """Grants permission to the package."""
        logger.info(f"Granting permission: {permission}...")
        return self._execute(f"shell pm grant {config.APP_PACKAGE} {permission}")

    def force_stop(self):
        """Force stops the application."""
        logger.info("Force-stopping Sentinel application...")
        return self._execute(f"shell am force-stop {config.APP_PACKAGE}")

    def clear_data(self):
        """Clears all app storage (fresh install state)."""
        logger.info("Clearing application storage details...")
        return self._execute(f"shell pm clear {config.APP_PACKAGE}")

    def send_to_background(self):
        """Presses the home key to send app to background."""
        logger.info("Sending application to the background...")
        return self._execute("shell input keyevent 3")

    def resume_app(self):
        """Launches main activity to bring app back to foreground."""
        logger.info("Resuming application in the foreground...")
        return self._execute(f"shell am start -n {config.APP_PACKAGE}/{config.APP_ACTIVITY}")

    def toggle_network(self, enable=True):
        """Toggles cellular data and wifi states."""
        state = "enable" if enable else "disable"
        logger.info(f"Toggling network connectivity: {state.upper()}")
        success_wifi, _ = self._execute(f"shell svc wifi {state}")
        success_data, _ = self._execute(f"shell svc data {state}")
        return success_wifi and success_data

    def get_logcat(self, duration_sec=5):
        """Extracts logcat records."""
        logger.info(f"Dumping last {duration_sec} seconds of logcat logs...")
        return self._execute("logcat -d")
