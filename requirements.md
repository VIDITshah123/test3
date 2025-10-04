# RSVP Application Test Suite

## Tester Profile
- **Role**: Senior QA Automation Engineer
- **Experience**: 5+ years in testing enterprise applications for leading tech companies
- **Expertise**: End-to-end testing, Test Automation, CI/CD Integration
- **Tools**: Playwright
- **Browser**: Chromium

## Project Overview
- **Application Under Test**: [RSVP Management System](https://rsvp.hiringtests.in)
- **Testing Type**: Functional, UI/UX, API, and Performance Testing
- **Automation Framework**: Playwright with TypeScript

## Test Environment
- **Base URL**: https://rsvp.hiringtests.in
- **Test Credentials**:
  - **Role**: Admin
  - **Username**: aman@gmail.com
  - **Password**: Admin@123

## Test Architecture
```
tests/
├── pages/           # Page object models
├── tests/           # Test files
│   ├── auth/        # Authentication tests
│   ├── events/      # Event management tests
│   └── users/       # User management tests
├── utils/           # Helper functions
├── config.ts        # Test configuration
└── fixtures/        # Test data
```

## Testing Guidelines
1. **Test Organization**
   - Create separate test files for each major feature
   - Group related test cases using `describe` blocks
   - Use `test` or `it` blocks for individual test cases
   - Follow naming convention: `feature-name.spec.ts`

2. **Test Data Management**
   - Store test data in JSON files under `fixtures/`
   - Use environment variables for sensitive data
   - Implement data cleanup after tests

3. **Best Practices**
   - Implement Page Object Model (POM) pattern
   - Add meaningful test descriptions
   - Include assertions for each test case
   - Handle test data setup/teardown properly
   - Add appropriate test retries and timeouts
   - Implement visual regression testing

4. **Test Coverage**
   - UI Functionality
   - API Endpoints
   - Form Validations
   - Error Handling
   - Responsive Design
   - Accessibility (a11y)
   - Security Testing

## Execution
```bash
# Install dependencies
npm install

# Run all tests
npx playwright test

# Run tests in UI mode
npx playwright test --ui

# Run specific test file
npx playwright test tests/example.spec.ts

# Generate test report
npx playwright show-report
```

## Reporting
- Generate HTML reports after test execution
- Include screenshots for failed tests
- Track test metrics and coverage
- Integrate with CI/CD pipeline

## Dependencies
- Playwright
- TypeScript
- @playwright/test
- Allure Playwright (for reporting)
- Faker (for test data generation)

## Maintenance
- Keep dependencies updated
- Review and refactor tests regularly
- Update tests according to application changes
- Document test cases and scenarios
