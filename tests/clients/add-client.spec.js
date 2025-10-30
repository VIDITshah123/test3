const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../../pages/login.page');
const { ClientsPage } = require('../../pages/clients.page.js');
const path = require('path');
const fs = require('fs');
const { parse } = require('csv-parse/sync');

test.describe('Add Client Tests', () => {
  let loginPage;
  let clientsPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    clientsPage = new ClientsPage(page);

    // 1. Login to the application
    await loginPage.goto();
    await loginPage.login('aman@gmail.com', 'Admin@123');
    await expect(page).toHaveURL(/dashboard/);

    // 2. Navigate to the Clients page
    await clientsPage.goto();
    await expect(page).toHaveURL(/clients/);
  });

  test('should add multiple clients from CSV file', async ({ page }) => {
    // Read and parse the CSV file
    const csvFilePath = path.resolve(process.cwd(), 'fixtures/sample-clients.csv');
    console.log('Reading CSV file from:', csvFilePath);
    const fileContent = fs.readFileSync(csvFilePath, 'utf8');
    console.log('CSV content:', fileContent);
    
    // Parse CSV content with headers
    const records = parse(fileContent, {
      columns: true,
      skip_empty_lines: true
    });

    // Process each client from the CSV
    for (const record of records) {
      // Create a unique client name by appending timestamp
      const uniqueClientName = `${record['Client Name']} ${Date.now()}`;
      
      const clientData = {
        clientName: uniqueClientName,
        email: record['Email'].replace('@', `+${Date.now()}@`), // Make email unique
        phone: record['Phone'],
        website: record['Website'],
        industry: record['Industry'],
        address: record['Address'],
        city: record['City'],
        state: record['State'],
        postalCode: record['Postal Code'],
        country: record['Country'],
        notes: record['Notes']
      };

      // Add the client
      await clientsPage.openAddClientForm();
      await clientsPage.addSingleClient(clientData);

      // Verify success message
      await expect(clientsPage.successMessage).toBeVisible();
      
      // Verify the new client appears in the list/table
      await expect(page.getByText(uniqueClientName)).toBeVisible();
    }
  });

  test('should add a single client successfully', async ({ page }) => {
    const uniqueClientName = `Test Client ${Date.now()}`;
    const clientData = {
      clientName: uniqueClientName,
      email: `test.${Date.now()}@example.com`,
      phone: '1122334455',
      website: 'https://example.com',
      industry: 'Automation',
      address: '123 Test St',
      city: 'Testville',
      state: 'TS',
      postalCode: '12345',
      country: 'Testland',
      notes: 'This is a test client added via automation.'
    };

    await clientsPage.openAddClientForm();
    await clientsPage.addSingleClient(clientData);

    // Verify success message
    await expect(clientsPage.successMessage).toBeVisible();

    // Optional: Verify the new client appears in the list/table
    // This assumes the client name is displayed on the page after creation.
    await expect(page.getByText(uniqueClientName)).toBeVisible();
  });

  test('should upload clients in bulk via CSV file', async ({ page }) => {
    const csvFilePath = path.resolve(__dirname, '../../fixtures/sample-clients.csv');
    
    await clientsPage.uploadBulkClients(csvFilePath);

    // The success message for bulk upload might be different.
    // We'll use a generic success message check for now.
    const bulkSuccessMessage = page.getByText('Bulk client upload completed successfully');
    await expect(bulkSuccessMessage).toBeVisible({ timeout: 10000 }); // Increased timeout for processing

    // Optional: Verify the clients from the CSV appear in the list
    await expect(page.getByText('Test Client 1')).toBeVisible();
    await expect(page.getByText('Test Client 2')).toBeVisible();
  });
});
