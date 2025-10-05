// @ts-check
const { expect } = require('@playwright/test');

class DashboardPage {
  constructor(page) {
    this.page = page;
    
    // Locators
    this.userMenu = page.getByRole('button', { name: 'Aman ()' });
    this.logoutButton = page.getByRole('button', { name: 'Logout' });
  }

  async logout() {
    await this.userMenu.click();
    await this.logoutButton.click();
    await this.page.waitForURL('**/login');
  }
}

module.exports = { DashboardPage };
