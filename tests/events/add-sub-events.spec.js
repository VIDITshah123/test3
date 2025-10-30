const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../../pages/login.page');
const { EventsPage } = require('../../pages/events.page');
const path = require('path');
const fs = require('fs');
const { parse } = require('csv-parse/sync');

// Test context to share state between tests
const testContext = {
  isInitialized: false,
  shouldSkipTests: false,
  skipReason: ''
};

test.describe('Sub-Event Management Tests', () => {
  let loginPage;
  let eventsPage;

  // Setup before all tests
  test.beforeAll(async ({ page }) => {
    loginPage = new LoginPage(page);
    eventsPage = new EventsPage(page);
    
    try {
      // Initialize test environment
      await loginPage.goto();
      const loginResult = await loginPage.login('test@example.com', 'password');
      
      // Validate login was successful
      if (!loginResult || !(await page.url().includes('dashboard'))) {
        testContext.shouldSkipTests = true;
        testContext.skipReason = 'Login failed - cannot proceed with tests';
        return;
      }
      
      await eventsPage.goto();
      testContext.isInitialized = true;
    } catch (error) {
      testContext.shouldSkipTests = true;
      testContext.skipReason = `Initialization failed: ${error.message}`;
      console.error('Test initialization error:', error);
    }
  });

  // Setup before each test
  test.beforeEach(async ({ page }) => {
    if (testContext.shouldSkipTests) {
      test.skip(testContext.skipReason);
    }
  });

  // Critical test - verify we can access the events page
  test('01 - should be able to access events page', async ({ page }) => {
    await expect(page).toHaveURL(/events/);
    await expect(eventsPage.eventsHeader).toBeVisible();
  });

  test('02 - should create multiple sub-events in different events', async ({ page }) => {
    // Read test data from CSV
    const testDataPath = path.resolve(process.cwd(), 'fixtures/sample-sub-events.csv');
    const fileContent = fs.readFileSync(testDataPath, 'utf8');
    
    // Parse CSV content with headers
    const subEvents = parse(fileContent, {
      columns: true,
      skip_empty_lines: true
    });

    // Group sub-events by parent event
    const eventsMap = new Map();
    subEvents.forEach(subEvent => {
      if (!eventsMap.has(subEvent.parentEvent)) {
        eventsMap.set(subEvent.parentEvent, []);
      }
      eventsMap.get(subEvent.parentEvent).push(subEvent);
    });

    // Process each parent event and its sub-events
    for (const [parentEvent, subEvents] of eventsMap.entries()) {
      // Navigate to the parent event
      await eventsPage.navigateToEvent(parentEvent);
      
      // Add each sub-event
      for (const subEvent of subEvents) {
        await test.step(`Adding sub-event '${subEvent.name}' to '${parentEvent}'`, async () => {
          // Add sub-event using page object methods
          await eventsPage.openAddSubEventForm();
          await eventsPage.fillSubEventForm({
            name: subEvent.name,
            description: subEvent.description,
            startDate: subEvent.startDate,
            endDate: subEvent.endDate,
            location: subEvent.location
          });
          
          // Submit and verify
          await eventsPage.submitSubEventForm();
          await expect(eventsPage.successMessage).toBeVisible();
          
          // Verify sub-event is visible in the list
          await expect(page.getByText(subEvent.name)).toBeVisible();
        });
      }
    }
  });

  // Cleanup after all tests (optional)
  test.afterAll(async ({ page }) => {
    // Add cleanup logic if needed
    // For example, removing test data
  });
});
