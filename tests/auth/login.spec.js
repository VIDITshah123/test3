const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../../pages/login.page');
const { DashboardPage } = require('../../pages/dashboard.page');

test.describe('Authentication Tests', () => {
  let loginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test('successful login with valid credentials', async ({ page }) => {
    await loginPage.login('aman@gmail.com', 'Admin@123');
    await expect(page).toHaveURL(/dashboard/);
    
    // Logout after successful login
    const dashboardPage = new DashboardPage(page);
    await dashboardPage.logout();
    await expect(page).toHaveURL(/login/);
  });

  test('login with invalid email', async () => {
    await loginPage.login('invalid@example.com', 'Admin@123');
    await expect(loginPage.errorMessage).toHaveText('Invalid credentials');
  });

  test('login with invalid password', async () => {
    await loginPage.login('aman@gmail.com', 'wrongpassword');
    await expect(loginPage.errorMessage).toHaveText('Invalid credentials');
  });

  test('login with empty credentials', async () => {
    await loginPage.login('', '');
    await expect(loginPage.emailInput).toHaveAttribute('required', '');
    await expect(loginPage.passwordInput).toHaveAttribute('required', '');
  });
});
