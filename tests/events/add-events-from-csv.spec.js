const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../../pages/login.page');
const { EventsPage } = require('../../pages/events.page.js');
const fs = require('fs');
const { parse } = require('csv-parse/sync');
const path = require('path');

// Helper function to read CSV file
function readEventsFromCSV(filePath) {
  const csvFilePath = path.resolve(__dirname, filePath);
  const fileContent = fs.readFileSync(csvFilePath, 'utf8');
  
  return parse(fileContent, {
    columns: true,
    skip_empty_lines: true,
    trim: true
  });
}

test.describe('Add Multiple Events from CSV', () => {
  let loginPage;
  let eventsPage;
  let page;

// Read test data from CSV
const testData = readEventsFromCSV('../../fixtures/sample-events.csv');

// Dynamically generate a test for each row in the CSV
for (const eventData of testData) {
  test(`should add event: ${eventData.eventName}`, async ({ page }) => {
    const loginPage = new LoginPage(page);
    const eventsPage = new EventsPage(page);

    // 1. Login to the application
    await loginPage.goto();
    await loginPage.login('aman@gmail.com', 'Admin@123');
    await expect(page).toHaveURL(/dashboard/);

    // 2. Navigate to events list
    await eventsPage.goto();
    await expect(page).toHaveURL(/events\/list/);
    
    // 3. Open add event form
    console.log(`Opening add event form for: ${eventData.eventName}`);
    await eventsPage.openAddEventForm();
    
    // 4. Fill and submit the event form
    console.log('Filling event data from CSV...');
    await eventsPage.addEvent(eventData);
    
    // 5. Verify redirection to event detail page
    await expect(page).toHaveURL(/events\/\d+/, { timeout: 10000 });
    console.log(`✅ Successfully created event: ${eventData.eventName}`);
    
    // 6. Take a screenshot for documentation
    const eventNameForFile = eventData.eventName.replace(/\s+/g, '-').toLowerCase();
    await page.screenshot({ path: `event-${eventNameForFile}.png` });
  });
}
});
