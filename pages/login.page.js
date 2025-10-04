// @ts-check
const { expect } = require('@playwright/test');

class LoginPage {
  constructor(page) {
    this.page = page;
    
    // Locators
    this.emailInput = page.getByPlaceholder('Enter username');
    this.passwordInput = page.getByPlaceholder('Enter password');
    this.loginButton = page.getByRole('button', { name: 'Sign In' });
    this.errorMessage = page.locator('.error-message');
  }

  async goto() {
    await this.page.goto('https://rsvp.hiringtests.in/login');
    await this.page.waitForLoadState('networkidle');
  }

  async login(email, password) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async togglePasswordVisibility() {
    await this.passwordToggle.click();
  }
}

module.exports = { LoginPage };
