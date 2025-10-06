// @ts-check
const { expect } = require('@playwright/test');

class ClientsPage {
  constructor(page) {
    this.page = page;

    // Locators for the main clients page
    this.addClientButton = page.getByRole('button', { name: 'Add Client' });
    this.bulkUploadButton = page.getByRole('button', { name: 'Import' });

    // Locators for the 'Add Client' form
    this.customerDropdown = page.getByLabel('Customer');
    this.clientNameInput = page.getByPlaceholder('Enter client name');
    this.emailInput = page.getByPlaceholder('Enter email address');
    this.phoneInput = page.getByPlaceholder('Enter phone number');
    this.websiteInput = page.getByPlaceholder('Enter website URL');
    this.industryInput = page.getByPlaceholder('Enter industry');
    this.addressInput = page.getByPlaceholder('Enter address');
    this.cityInput = page.getByPlaceholder('Enter city');
    this.stateInput = page.getByPlaceholder('Enter state');
    this.postalCodeInput = page.getByPlaceholder('Enter postal code');
    this.countryInput = page.getByPlaceholder('Enter country');
    this.notesInput = page.getByPlaceholder('Enter notes or additional information');
    this.saveClientButton = page.getByRole('button', { name: 'Save Client' });
    this.successMessage = page.getByText('Client added successfully');
  }

  async goto() {
    await this.page.goto('https://rsvp.hiringtests.in/clients');
    await this.page.waitForLoadState('networkidle');
  }

  async openAddClientForm() {
    await this.addClientButton.click();
  }

  async addSingleClient(clientData) {
    // Assuming 'Select a Customer' is the first option and we need to select something else.
    // This might need adjustment based on actual dropdown options.
    await this.customerDropdown.selectOption({ index: 1 }); 

    await this.clientNameInput.fill(clientData.clientName);
    await this.emailInput.fill(clientData.email);
    await this.phoneInput.fill(clientData.phone);
    await this.websiteInput.fill(clientData.website);
    await this.industryInput.fill(clientData.industry);
    await this.addressInput.fill(clientData.address);
    await this.cityInput.fill(clientData.city);
    await this.stateInput.fill(clientData.state);
    await this.postalCodeInput.fill(clientData.postalCode);
    await this.countryInput.fill(clientData.country);
    await this.notesInput.fill(clientData.notes);
    
    await this.saveClientButton.click();
  }

  async uploadBulkClients(filePath) {
    await this.bulkUploadButton.click();
    // Playwright's setInputFiles handles file uploads.
    // The locator for the file input might need to be more specific.
    await this.page.setInputFiles('input[type="file"]', filePath);
    // There might be a confirmation/submit button after selecting the file.
    // This will need to be added if it exists.
  }
}

module.exports = { ClientsPage };
