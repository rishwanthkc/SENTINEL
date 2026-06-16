from .base_page import BasePage
from selenium.webdriver.common.by import By

class OnboardingPage(BasePage):
    GET_STARTED_BTN = (By.XPATH, "//android.widget.Button[@text='GET STARTED']")
    PAGER_TEXT = (By.CLASS_NAME, "android.widget.TextView")

    def click_get_started(self):
        """Clicks the GET STARTED button to move to Login."""
        self.click(*self.GET_STARTED_BTN, name="Get Started Button")

    def is_on_onboarding(self):
        """Verifies if the onboarding screen is currently displayed."""
        return self.is_displayed(*self.GET_STARTED_BTN, name="Get Started Button")
