# Test Automation Standards and Guidelines

> **IMPORTANT**: This document serves as the single source of truth for all test automation development. 
> All new test files MUST follow the patterns and practices described here.

## Table of Contents
- [Getting Started](#getting-started)
- [Test Creation Process](#test-creation-process)
- [Test Scripts Overview](#test-scripts-overview)
- [Test Script Template](#test-script-template)
- [Best Practices](#best-practices)
- [Running Tests](#running-tests)

## Getting Started

### Prerequisites
- Node.js and npm installed
- Playwright installed (`npm install -D @playwright/test`)
- Access to the test environment

### Test Creation Process
1. **Review Existing Tests**: Check for similar tests before creating new ones
2. **Create Test File**: Use the template below
3. **Implement Page Objects**: Create necessary page objects if they don't exist
4. **Write Tests**: Follow the test structure and patterns
5. **Run Tests Locally**: Verify tests pass in your environment
6. **Commit Changes**: Follow the project's Git workflow

## Test Scripts Overview

### Authentication
- **File**: `tests/auth/login.spec.js`
  - Tests user authentication functionality
  - Verifies successful login with valid credentials
  - Tests login error scenarios

### Clients Management
- **File**: `tests/clients/add-client.spec.js`
  - Tests adding single client
  - Tests bulk client import from CSV
  - Validates client data after creation

### Events Management
- **File**: `tests/events/add-event.spec.js`
  - Tests single event creation
  - Validates event details and form submission

- **File**: `tests/events/add-events-from-csv.spec.js`
  - Tests bulk event import from CSV
  - Validates multiple event creation

- **File**: `tests/events/delete-events.spec.js`
  - Tests event deletion functionality
  - Verifies event removal from the system

## Test Validation and Early Termination

### Validation and Termination Strategy
- Always validate critical test dependencies before proceeding with test execution
- If a critical test fails, use `test.fail()` or `test.setFailed()` to mark the test as failed
- Use `test.skip()` to skip dependent tests when a critical test fails
- Implement a test context to share state between tests

### Test Implementation Guide

### File Naming Convention
- Use `.spec.js` suffix for test files
- Name files to describe what they test (e.g., `user-login.spec.js`)
- Group related tests in appropriate directories (e.g., `tests/auth/`, `tests/clients/`)

### Test Structure
1. **Imports**: All required modules and page objects
2. **Test Context**: Shared state and configuration
3. **Test Suite**: Group related tests with `test.describe`
4. **Test Cases**: Individual test scenarios
5. **Hooks**: Setup and teardown code

### Test Script Template with Validation

```javascript
const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../../pages/login.page');
const { PageName } = require('../../pages/pageName.page');

// Test context to share state between tests
const testContext = {
  isInitialized: false,
  shouldSkipTests: false,
  skipReason: ''
};

// Test suite description
test.describe('Feature Name Tests', () => {
  let loginPage;
  let pageObject;

  // Setup before all tests
  test.beforeAll(async ({ page }) => {
    loginPage = new LoginPage(page);
    
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
      
      pageObject = new PageName(page);
      await pageObject.goto();
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
    
    // Additional per-test setup can go here
  });

  // Critical test case - runs first and will skip others if it fails
  test('01 - should verify critical functionality', async ({ page }) => {
    // Example critical check
    const isPageReady = await pageObject.verifyPageReady();
    if (!isPageReady) {
      testContext.shouldSkipTests = true;
      testContext.skipReason = 'Critical functionality check failed';
      test.fail();
    }
    
    // Additional assertions
    await expect(someCriticalElement).toBeVisible();
  });

  // Regular test case - will be skipped if critical test failed
  test('02 - should perform specific action', async ({ page }) => {
    // Test steps
    // 1. Perform action
    // 2. Verify results
    // 3. Add assertions
    
    // Example:
    // await pageObject.someAction();
    // await expect(someElement).toBeVisible();
  });

  // Data-driven test example
  test('should handle multiple scenarios', async ({ page }) => {
    const testData = [
      { input: 'value1', expected: 'result1' },
      { input: 'value2', expected: 'result2' },
    ];

    for (const data of testData) {
      // Test implementation
    }
  });
});
```

## Code Review Checklist

Before submitting a test for review, ensure:

- [ ] Follows the template structure
- [ ] Includes proper error handling
- [ ] Uses page object model
- [ ] Has meaningful test names
- [ ] Includes necessary assertions
- [ ] Handles test data properly
- [ ] Includes appropriate test hooks
- [ ] Follows naming conventions

## Best Practices

### Test Structure
- Keep test files focused on a single feature/functionality
- Use descriptive test names that explain the test case
- Group related tests using `test.describe` blocks
- Keep tests independent and isolated

### Selectors
- Use data-testid attributes for stable element selection
- Avoid using XPath selectors when possible
- Keep selectors in page objects

### Test Data
- Use fixtures for test data
- Generate unique data for each test run
- Keep test data separate from test logic

### Assertions
- Add meaningful assertions for each test
- Verify both positive and negative scenarios
- Include error message in assertions

## Running Tests

### Run all tests
```bash
npx playwright test
```

### Run specific test file
```bash
npx playwright test tests/path/to/test.spec.js
```

### Run tests in debug mode
```bash
npx playwright test --debug
```

### Generate test report
```bash
npx playwright show-report
```

### Run tests in headed mode
```bash
npx playwright test --headed
```

## Dependencies
- Playwright Test
- csv-parse (for CSV processing)

## Fixtures
Test data files are located in the `fixtures/` directory:
- `sample-clients.csv` - Sample client data
- `sample-events.csv` - Sample event data
