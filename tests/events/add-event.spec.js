const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../../pages/login.page');
const { EventsPage } = require('../../pages/events.page.js');

test.describe('Add Event Tests', () => {
  let loginPage;
  let eventsPage;
  let page;

  test.beforeEach(async ({ browser }) => {
    // Create a new browser context with a clean state
    const context = await browser.newContext();
    page = await context.newPage();
    
    loginPage = new LoginPage(page);
    eventsPage = new EventsPage(page);

    // 1. Login to the application
    await loginPage.goto();
    await loginPage.login('aman@gmail.com', 'Admin@123');
    await expect(page).toHaveURL(/dashboard/);

    // 2. Navigate to the Events page
    await eventsPage.goto();
    await expect(page).toHaveURL(/events\/list/);
  });
//test data for script is here 
  test('should add a new event successfully', async () => {
    const uniqueEventName = `Test Event ${Date.now()}`;
    const eventData = {
      eventName: uniqueEventName,
      description: 'This is a test event created by an automated script.',
      client: 'Shalini Kocha (Glintz Entertainment private limited.)',  // Update this to match an existing client
      status: 'In Progress',        // Update this to match an existing status
      eventType: 'Wedding', // Update this to match an existing event type
      venue: 'lodha garden',     // Update this to match an existing venue
      startDate: '2025-12-25',
      endDate: '2025-12-26'
    };

    console.log('Opening add event form...');
    await eventsPage.openAddEventForm();
    
    console.log('Filling event data...');
    await eventsPage.addEvent(eventData);

    // Take a screenshot for debugging
    await page.screenshot({ path: 'event-creation.png' });
    console.log('Screenshot saved as event-creation.png');

    // Check for success message or redirect
    try {
      await expect(page).toHaveURL(/events\/list/, { timeout: 10000 });
      console.log('Successfully redirected to events list');
    } catch (error) {
      console.error('Not redirected to events list. Current URL:', page.url());
      throw error;
    }

    // Verify the new event appears in the list
    try {
      await expect(page.getByText(uniqueEventName)).toBeVisible({ timeout: 10000 });
      console.log('Event found in the list');
    } catch (error) {
      console.error('Event not found in the list. Page content:', await page.content());
      throw error;
    }
  });
});
