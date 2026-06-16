import os
import time
import logging
from ..configs import config

logger = logging.getLogger("SentinelQA")

class BasePage:
    def __init__(self, driver):
        self.driver = driver
        self.is_simulated = getattr(driver, "is_simulated", False)

    def find_element(self, by, locator, timeout=config.EXPLICIT_WAIT_TIMEOUT):
        """Finds element on page with explicit wait."""
        if self.is_simulated:
            logger.info(f"SIMULATED: Finding element by {by} with locator '{locator}'")
            return SimulatedElement(by, locator)
        else:
            from selenium.webdriver.support.ui import WebDriverWait
            from selenium.webdriver.support import expected_conditions as EC
            wait = WebDriverWait(self.driver, timeout)
            return wait.until(EC.presence_of_element_located((by, locator)))

    def click(self, by, locator, name="Element"):
        """Clicks on element."""
        if self.is_simulated:
            logger.info(f"SIMULATED: Clicking on '{name}' (Locator: {locator})")
            time.sleep(0.1)
        else:
            el = self.find_element(by, locator)
            el.click()
            logger.info(f"LIVE: Clicked on '{name}'")

    def type_text(self, by, locator, text, name="Field"):
        """Types text into an input field."""
        # Sanitize input for security checks
        clean_text = self._sanitize_input(text)
        if self.is_simulated:
            logger.info(f"SIMULATED: Typing '{clean_text}' into '{name}' (Locator: {locator})")
            time.sleep(0.1)
        else:
            el = self.find_element(by, locator)
            el.clear()
            el.send_keys(clean_text)
            logger.info(f"LIVE: Typed text into '{name}'")

    def get_text(self, by, locator, name="Element"):
        """Gets text content of element."""
        if self.is_simulated:
            logger.info(f"SIMULATED: Getting text of '{name}'")
            return "Mock Text"
        else:
            el = self.find_element(by, locator)
            return el.text

    def is_displayed(self, by, locator, name="Element"):
        """Checks if element is visible on screen."""
        if self.is_simulated:
            logger.info(f"SIMULATED: Checking visibility of '{name}'")
            return True
        else:
            try:
                el = self.find_element(by, locator, timeout=2)
                return el.is_displayed()
            except Exception:
                return False

    def capture_screenshot(self, filename):
        """Captures a screenshot of the current viewport."""
        path = os.path.join(config.SCREENSHOTS_DIR, filename)
        if self.is_simulated:
            logger.info(f"SIMULATED: Capturing screenshot to: {path}")
            # Create a placeholder empty file to serve as visual evidence
            with open(path, "w") as f:
                f.write(f"SIMULATED SCREENSHOT CONTENT FOR: {filename}")
        else:
            try:
                self.driver.save_screenshot(path)
                logger.info(f"LIVE: Saved screenshot to: {path}")
            except Exception as e:
                logger.error(f"Failed to capture screenshot: {str(e)}")
        return path

    def _sanitize_input(self, text):
        """Helper to sanitize input for security vulnerability testing."""
        # Log dangerous injections if seen (for security audit sheets)
        if "DROP TABLE" in text or "<script>" in text or "OR 1=1" in text:
            logger.warning(f"SECURITY INJECTION SUSPECTED: {text}")
        return text

class SimulatedElement:
    """Mock element class for simulation mode."""
    def __init__(self, by, locator):
        self.by = by
        self.locator = locator
        self.text = "Simulated UI Element Text"

    def click(self):
        pass

    def send_keys(self, text):
        pass

    def clear(self):
        pass

    def is_displayed(self):
        return True
