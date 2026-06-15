from .base_page import BasePage
from selenium.webdriver.common.by import By

class ContactsPage(BasePage):
    CONTACT_NAME_FIELD = (By.XPATH, "//android.widget.EditText[@hint='Contact Name']")
    CONTACT_PHONE_FIELD = (By.XPATH, "//android.widget.EditText[@hint='Phone Number']")
    ADD_CONTACT_BTN = (By.XPATH, "//android.widget.Button[@text='ADD CONTACT']")
    DELETE_CONTACT_ICON = (By.XPATH, "//*[contains(@content-desc, 'Delete') or contains(@text, 'Delete')]")
    CONTACT_LIST_ITEM = (By.XPATH, "//*[contains(@text, 'Trusted Circle') or contains(@text, 'Contacts')]")

    def enter_contact_details(self, name, phone):
        """Fills contact details."""
        self.type_text(*self.CONTACT_NAME_FIELD, name, name="Contact Name Field")
        self.type_text(*self.CONTACT_PHONE_FIELD, phone, name="Contact Phone Field")

    def click_add_contact(self):
        """Adds contact to local list."""
        self.click(*self.ADD_CONTACT_BTN, name="Add Contact Button")

    def perform_add_contact(self, name, phone):
        """Helper to quickly add a contact."""
        self.enter_contact_details(name, phone)
        self.click_add_contact()

    def click_delete_contact(self):
        """Deletes contact at index (removes it)."""
        self.click(*self.DELETE_CONTACT_ICON, name="Delete Contact Icon")
