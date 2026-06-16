from .base_page import BasePage
from selenium.webdriver.common.by import By

class ProfilePage(BasePage):
    NAME_FIELD = (By.XPATH, "//android.widget.EditText[@hint='Full Name']")
    PHONE_FIELD = (By.XPATH, "//android.widget.EditText[@hint='Phone Number']")
    GUARDIAN_PHONE_FIELD = (By.XPATH, "//android.widget.EditText[@hint='Guardian Phone']")
    EMERGENCY_EMAIL_FIELD = (By.XPATH, "//android.widget.EditText[@hint='Emergency Email']")
    
    SAVE_BTN = (By.XPATH, "//android.widget.Button[@text='SAVE CHANGES']")
    LOGOUT_BTN = (By.XPATH, "//*[contains(@text, 'LOGOUT')]")

    def edit_profile(self, name=None, phone=None, guardian_phone=None, emergency_email=None):
        """Edits profile parameters."""
        if name:
            self.type_text(*self.NAME_FIELD, name, name="Full Name Input")
        if phone:
            self.type_text(*self.PHONE_FIELD, phone, name="Phone Number Input")
        if guardian_phone:
            self.type_text(*self.GUARDIAN_PHONE_FIELD, guardian_phone, name="Guardian Phone Input")
        if emergency_email:
            self.type_text(*self.EMERGENCY_EMAIL_FIELD, emergency_email, name="Emergency Email Input")

    def click_save(self):
        """Clicks SAVE CHANGES button."""
        self.click(*self.SAVE_BTN, name="Save Button")

    def click_logout(self):
        """Clicks LOGOUT button."""
        self.click(*self.LOGOUT_BTN, name="Logout Button")
