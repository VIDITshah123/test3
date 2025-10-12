// @ts-check
const { expect } = require('@playwright/test');

class EventsPage {
  constructor(page) {
    this.page = page;

    // Locators for the main events page
    this.addEventButton = page.locator('button.btn-primary:has-text("Add Event")');

    // Locators for the 'Add Event' form
    this.clientDropdown = page.getByText('Client *').locator('..').locator('select.form-select');
    this.eventNameInput = page.getByPlaceholder('Enter event name');
    this.descriptionInput = page.getByPlaceholder('Enter event description');
    this.statusDropdown = page.getByText('Status').locator('..').locator('select.form-select');
    this.eventTypeDropdown = page.getByText('Event Type').locator('..').locator('select.form-select');
    this.startDateInput = page.getByLabel('Start Date');
    this.endDateInput = page.getByLabel('End Date');
    this.venuesDropdown = page.getByText('Venues').locator('..').getByRole('combobox');
    this.saveEventButton = page.getByRole('button', { name: 'Create Event' });
    this.successMessage = page.getByText(/event (created|added) successfully/i);
    
    // Dropdown options
    this.dropdownOptions = page.locator('div[role="option"]');
  }

  async goto() {
    await this.page.goto('https://rsvp.hiringtests.in/events/list');
    await this.page.waitForLoadState('networkidle');
    // Wait for the add event button to be visible
    await this.addEventButton.waitFor({ state: 'visible' });
  }

  async openAddEventForm() {
    await this.addEventButton.click();
    // Wait for the form to be visible
    await this.eventNameInput.waitFor({ state: 'visible' });
  }

  async selectFromCustomDropdown(dropdownLocator, optionText) {
    await dropdownLocator.click();
    const option = this.page.getByRole('option', { name: optionText });
    await option.waitFor({ state: 'visible' });
    await option.click();
  }

  async addEvent(eventData) {
    // Use selectOption for standard <select> dropdowns
    await this.clientDropdown.selectOption({ label: eventData.client });
    
    // Fill in basic info
    await this.eventNameInput.fill(eventData.eventName);
    await this.descriptionInput.fill(eventData.description);

    // Select status and event type (standard dropdowns)
    await this.statusDropdown.selectOption({ label: eventData.status });
    await this.eventTypeDropdown.selectOption({ label: eventData.eventType });

    // Use the custom handler for the Venues combobox
    await this.selectFromCustomDropdown(this.venuesDropdown, eventData.venue);

    // Fill in dates
    await this.startDateInput.fill(eventData.startDate);
    await this.endDateInput.fill(eventData.endDate);

    // Save the event
    await this.saveEventButton.click();
    
    // Wait for success message or redirect
    try {
      await this.successMessage.waitFor({ state: 'visible', timeout: 10000 });
    } catch (error) {
      // If no success message, check if we were redirected to the events list
      if (!this.page.url().includes('/events/list')) {
        throw new Error('Event creation might have failed. No success message and not redirected to events list.');
      }
    }
  }
}

module.exports = { EventsPage };
