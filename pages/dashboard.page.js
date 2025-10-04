// @ts-check
const { expect } = require('@playwright/test');

class DashboardPage {
  constructor(page) {
    this.page = page;
    
    // Locators
    this.userMenu = page.locator('.user-menu');
    this.logoutButton = page.locator('button:has-text("Logout")');
  }

  async logout() {
    await this.userMenu.click();
    await this.logoutButton.click();
    await this.page.waitForLoadState('networkidle');
  }
}

module.exports = { DashboardPage };
