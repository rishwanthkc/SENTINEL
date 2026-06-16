from .base_page import BasePage
from selenium.webdriver.common.by import By

class RegisterPage(BasePage):
    EMAIL_FIELD = (By.XPATH, "//android.widget.EditText[@hint='Email']")
    NAME_FIELD = (By.XPATH, "//android.widget.EditText[@hint='Full Name']")
    FIREBASE_UID_FIELD = (By.XPATH, "//android.widget.EditText[@hint='Firebase UID']")
    REGISTER_BTN = (By.XPATH, "//android.widget.Button[@text='REGISTER']")
    HEADER = (By.XPATH, "//*[contains(@text, 'SENTINEL')]")

    def enter_details(self, email, name, uid):
        """Fills out the registration form details."""
        self.type_text(*self.EMAIL_FIELD, email, name="Email Field")
        self.type_text(*self.NAME_FIELD, name, name="Full Name Field")
        self.type_text(*self.FIREBASE_UID_FIELD, uid, name="Firebase UID Field")

    def click_register(self):
        """Clicks the REGISTER button."""
        self.click(*self.REGISTER_BTN, name="Register Button")

    def perform_registration(self, email, name, uid):
        """Helper to complete registration workflow."""
        self.enter_details(email, name, uid)
        self.click_register()

    def is_on_register(self):
        """Verifies if the registration screen is displayed."""
        return self.is_displayed(*self.REGISTER_BTN, name="Register Button")
