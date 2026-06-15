from .base_page import BasePage
from selenium.webdriver.common.by import By

class HomePage(BasePage):
    SOS_BTN = (By.XPATH, "//*[contains(@text, 'SOS') or contains(@text, 'TAP FOR EMERGENCY')]")
    PROTECTION_BANNER = (By.XPATH, "//*[contains(@text, 'PROTECTION ACTIVE')]")
    PROFILE_ICON = (By.XPATH, "//android.widget.ImageView[@content-desc='Profile'] or //*[contains(@content-desc, 'Profile')]")
    
    MAP_CARD = (By.XPATH, "//*[contains(@text, 'Live Map')]")
    SAFE_ROUTE_CARD = (By.XPATH, "//*[contains(@text, 'Safe Route')]")
    CONTACTS_CARD = (By.XPATH, "//*[contains(@text, 'Contacts')]")
    JOURNEYS_CARD = (By.XPATH, "//*[contains(@text, 'Journeys')]")
    REPORT_INCIDENT_CARD = (By.XPATH, "//*[contains(@text, 'Report an incident')]")

    def click_sos(self):
        """Triggers the primary SOS emergency alert."""
        self.click(*self.SOS_BTN, name="SOS Panic Button")

    def open_profile(self):
        """Clicks profile avatar."""
        self.click(*self.PROFILE_ICON, name="Profile Button")

    def open_live_map(self):
        """Clicks Live Map quick action."""
        self.click(*self.MAP_CARD, name="Live Map Feature Card")

    def open_safe_route(self):
        """Clicks Safe Route planner."""
        self.click(*self.SAFE_ROUTE_CARD, name="Safe Route Feature Card")

    def open_contacts(self):
        """Clicks trusted circle Contacts page."""
        self.click(*self.CONTACTS_CARD, name="Contacts Feature Card")

    def open_journeys(self):
        """Clicks past Journey activity logs."""
        self.click(*self.JOURNEYS_CARD, name="Journeys Feature Card")

    def open_report_incident(self):
        """Clicks community incident report form."""
        self.click(*self.REPORT_INCIDENT_CARD, name="Report Incident Card")

    def is_on_home(self):
        """Verifies if home screen is active."""
        return self.is_displayed(*self.SOS_BTN, name="SOS Button")
