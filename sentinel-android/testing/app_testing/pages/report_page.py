from .base_page import BasePage
from selenium.webdriver.common.by import By

class ReportPage(BasePage):
    TITLE_FIELD = (By.XPATH, "//android.widget.EditText[@hint='Incident Title']")
    DESC_FIELD = (By.XPATH, "//android.widget.EditText[@hint='Description']")
    CATEGORY_DROPDOWN = (By.XPATH, "//*[contains(@text, 'Incident Category') or @hint='Incident Category']")
    RISK_SLIDER = (By.CLASS_NAME, "android.widget.SeekBar")
    SUBMIT_BTN = (By.XPATH, "//android.widget.Button[@text='SUBMIT REPORT']")

    def enter_report_details(self, title, desc, risk_score_simulated=3):
        """Fills out incident description."""
        self.type_text(*self.TITLE_FIELD, title, name="Incident Title Field")
        self.type_text(*self.DESC_FIELD, desc, name="Description Field")

    def click_submit(self):
        """Submits the report card to backend APIs."""
        self.click(*self.SUBMIT_BTN, name="Submit Report Button")

    def submit_new_report(self, title, desc):
        """Helper to create and submit a report."""
        self.enter_report_details(title, desc)
        self.click_submit()
