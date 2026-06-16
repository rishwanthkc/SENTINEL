from .base_page import BasePage
from selenium.webdriver.common.by import By

class LoginPage(BasePage):
    EMAIL_FIELD = (By.XPATH, "//android.widget.EditText[contains(@text, '') or @hint='Email']")
    LOGIN_BTN = (By.XPATH, "//android.widget.Button[@text='LOGIN']")
    WELCOME_HEADER = (By.XPATH, "//*[contains(@text, 'WELCOME')]")

    def enter_email(self, email):
        """Types the email into the login field."""
        self.type_text(*self.EMAIL_FIELD, email, name="Email Input Field")

    def click_login(self):
        """Clicks the LOGIN button."""
        self.click(*self.LOGIN_BTN, name="Login Button")

    def perform_login(self, email):
        """Helper to perform the complete login workflow."""
        self.enter_email(email)
        self.click_login()

    def is_on_login(self):
        """Verifies if the login screen is displayed."""
        return self.is_displayed(*self.LOGIN_BTN, name="Login Button")
