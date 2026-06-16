from .base_page import BasePage
from selenium.webdriver.common.by import By

class SafeRoutePage(BasePage):
    # Safe Route Input Screen
    START_LOC_FIELD = (By.XPATH, "//android.widget.EditText[@hint='Start Location']")
    DEST_LOC_FIELD = (By.XPATH, "//android.widget.EditText[@hint='Destination']")
    CALC_ROUTE_BTN = (By.XPATH, "//android.widget.Button[contains(@text, 'CALCULATE') or contains(@text, 'ROUTE')]")

    # Route Recommendation Screen
    ROUTE_CARD_SAFEST = (By.XPATH, "//*[contains(@text, 'Safest Route')]")
    START_JOURNEY_BTN = (By.XPATH, "//android.widget.Button[@text='START JOURNEY']")

    # Journey Dashboard Screen
    JOURNEY_ACTIVE_HEADER = (By.XPATH, "//*[contains(@text, 'JOURNEY ACTIVE')]")
    END_JOURNEY_BTN = (By.XPATH, "//android.widget.Button[@text='END JOURNEY']")
    PANIC_SOS_BTN = (By.XPATH, "//*[contains(@text, 'PANIC') or contains(@text, 'SOS')]")

    def input_route(self, start, destination):
        """Fills out origin and destination."""
        self.type_text(*self.START_LOC_FIELD, start, name="Start Location Field")
        self.type_text(*self.DEST_LOC_FIELD, destination, name="Destination Location Field")

    def click_calculate(self):
        """Triggers route safety indexing."""
        self.click(*self.CALC_ROUTE_BTN, name="Calculate Safest Route Button")

    def select_safest_route(self):
        """Clicks on safest route card recommendation."""
        self.click(*self.ROUTE_CARD_SAFEST, name="Safest Route Card")

    def click_start_journey(self):
        """Starts the active location journey."""
        self.click(*self.START_JOURNEY_BTN, name="Start Journey Button")

    def click_end_journey(self):
        """Stops location tracking and ends the journey."""
        self.click(*self.END_JOURNEY_BTN, name="End Journey Button")

    def is_journey_active(self):
        """Verifies if journey tracking dashboard is showing."""
        return self.is_displayed(*self.JOURNEY_ACTIVE_HEADER, name="Journey Active Banner")
