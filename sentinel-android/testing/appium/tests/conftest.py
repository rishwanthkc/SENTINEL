import pytest
import logging
from ..configs import config
from ..utils.adb_helper import AdbHelper

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("SentinelQA")

class SimulatedDriver:
    is_simulated = True
    
    def __init__(self):
        self.session_id = "simulated-appium-session-77777"
        self.capabilities = config.DESIRED_CAPABILITIES
        logger.info("Initializing Simulated Appium WebDriver session...")

    def save_screenshot(self, path):
        logger.info(f"SIMULATED DRIVER: Saving screenshot to: {path}")
        with open(path, "w") as f:
            f.write("Simulated screenshot PNG binary placeholder.")
        return True

    def quit(self):
        logger.info("Terminating Simulated Appium session.")

@pytest.fixture(scope="session")
def adb():
    """Fixture providing ADB commands helper."""
    return AdbHelper(simulation_mode=config.SIMULATION_MODE)

@pytest.fixture(scope="function")
def driver(adb):
    """Initializes Appium Driver (or Simulated Driver fallback)."""
    driver_obj = None
    
    if config.SIMULATION_MODE:
        driver_obj = SimulatedDriver()
    else:
        # Check connected device
        if not adb.is_device_connected():
            logger.warning("No active Android device detected. Falling back to Simulated Driver.")
            driver_obj = SimulatedDriver()
        else:
            try:
                from appium import webdriver
                from appium.options.android import UiAutomator2Options
                
                logger.info(f"Attempting connection to Appium server at {config.APPIUM_SERVER_URL}")
                options = UiAutomator2Options().load_capabilities(config.DESIRED_CAPABILITIES)
                driver_obj = webdriver.Remote(config.APPIUM_SERVER_URL, options=options)
                driver_obj.is_simulated = False
                logger.info("LIVE: Appium WebDriver session established successfully.")
            except Exception as e:
                logger.error(f"Failed to connect to Appium Server: {str(e)}. Falling back to Simulated Driver.")
                driver_obj = SimulatedDriver()
                
    yield driver_obj
    
    # Teardown
    if driver_obj:
        driver_obj.quit()
