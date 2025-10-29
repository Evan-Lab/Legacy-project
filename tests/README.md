# Cypress E2E Testing Documentation

## 📌 Overview

Cypress is a powerful tool for **end-to-end (E2E) testing**, allowing you to validate that your application works correctly from the user’s perspective.
E2E tests simulate real user flows in the browser, ensuring that features behave as expected when integrated together.

---

## ⚙️ Installation

Make sure you have **Node.js (>=14.x)** and a package manager (`npm` or `yarn`) installed.

```bash
# Install Cypress locally
npm install cypress --save-dev

# OR with yarn
yarn add cypress --dev
```

---

## ▶️ Running E2E Tests

Open the Cypress Test Runner in interactive mode:

```bash
npx cypress open
```

* Select **E2E Testing**.
* Choose your preferred browser.
* Run any test file inside `cypress/e2e/`.

Run E2E tests in **headless mode** (commonly used in CI/CD):

```bash
npx cypress run --e2e
```

Run a specific test file:

```bash
npx cypress run --spec "cypress/e2e/login.cy.js"
```

---

## 📂 Project Structure (E2E)

```
cypress/
  e2e/               # End-to-end test files
    login.cy.js      # Example test suite
    signup.cy.js     # Another test suite
  fixtures/          # Test data (JSON files)
  support/           # Shared commands and setup
cypress.config.js    # Cypress configuration
```

* **`e2e/`** → Main folder for your E2E test cases.
* **`fixtures/`** → Optional test data used in your tests.
* **`support/`** → Custom commands or reusable setup code.

---

## ✍️ Writing an E2E Test

Example: `cypress/e2e/login.cy.js`

```javascript
describe('Login Flow', () => {
  it('should allow a user to log in with valid credentials', () => {
    cy.visit('/login')                                // Navigate to login page
    cy.get('input[name="username"]').type('testuser') // Enter username
    cy.get('input[name="password"]').type('password') // Enter password
    cy.get('button[type="submit"]').click()           // Submit form
    cy.url().should('include', '/dashboard')          // Verify redirect
    cy.contains('Welcome, testuser').should('be.visible') // Verify UI element
  })
})
```

---

## ➕ Adding a New E2E Test

1. **Create a new test file** under `cypress/e2e/` (e.g., `checkout.cy.js`).
2. **Describe the user flow** you want to test (e.g., checkout process).
3. **Use Cypress commands** (`cy.visit`, `cy.get`, `cy.click`, `cy.url`, etc.).
4. Run it via:

```bash
npx cypress open
```

→ Select the new test file and watch it execute in the browser.

---

## 🛠 Best Practices for E2E

* Use **data attributes** (`data-cy`) for selecting elements instead of classes/IDs.
* Keep tests **isolated**: each test should start fresh (e.g., by visiting a page).
* **Avoid flakiness**: rely on Cypress’ automatic waiting instead of arbitrary delays.
* Use **fixtures** for reusable data instead of hardcoding values.
* Group related flows in the same test file for clarity.

---

## 📚 References

* [Cypress E2E Testing Guide](https://docs.cypress.io/guides/end-to-end-testing/writing-your-first-end-to-end-test)
* [Best Practices for E2E](https://docs.cypress.io/guides/references/best-practices)

---

✅ With this guide, you can confidently set up and extend your **E2E Cypress test suite**.
