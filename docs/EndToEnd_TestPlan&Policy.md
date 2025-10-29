# End-to-End Test Plan


## Executive Summary — E2E Testing Approach Plan (Test Policy)

Our testing strategy focuses exclusively on end-to-end (E2E) testing using Cypress. This approach ensures full validation of user workflows, interface interactions, and integration across all system components without requiring extensive unit or integration test refactoring in the existing codebase.

E2E tests were chosen because they provide the highest assurance of functional correctness in a short time frame. They simulate real user behavior, covering the most critical actions such as navigation, search, data input, and rendering of templates. By testing the application from the user’s perspective, we guarantee that core functionalities work as intended despite underlying technical debt or legacy dependencies.

In total, 477 E2E tests were executed successfully, validating all main user journeys and verifying that 100% of templates render correctly. This comprehensive coverage ensures functional stability and confidence in the application’s reliability, even in the absence of granular unit or component-level testing.

## Why only E2E test ?

E2E tests are the gold standard for validating a legacy system restoration:

- They validate user behavior (what matters most to the client)

- They prove that the system works end-to-end (full integration)

- They are less fragile than unit tests (require less refactoring)

For a QA/PM-oriented project (the targeted skill set), E2E tests are more relevant than unit tests:

- They validate the restore phase (system-level validation)

- They validate the deploy phase (full workflow verification)

- They align directly with the test protocols required
---
## 1. Introduction

### 1.1 Purpose
This document defines the End-to-End (E2E) testing strategy for validating that the GeneWeb Python migration functions correctly from a user perspective. E2E tests verify complete user workflows by testing pages, buttons, inputs, searches, and component interactions as a real user would experience them.

### 1.2 E2E Testing Philosophy
**What E2E Tests Validate:**
- ✅ Pages load correctly
- ✅ Buttons and links work
- ✅ Forms accept input and display output
- ✅ Search functionality returns correct results
- ✅ Navigation flows work end-to-end
- ✅ Components interact correctly with each other
- ✅ User workflows complete successfully

**What E2E Tests Do NOT Cover:**
- ❌ Internal code logic (unit tests)
- ❌ API contracts (integration tests)
- ❌ Database queries (database tests)
- ❌ Performance benchmarks (load tests)

### 1.3 Test Framework

**Tool:** Cypress 15.4.0  
**Approach:** Black-box testing from user perspective  
**Focus:** Input → Component → Output validation

---

## 2. Test Infrastructure

### 2.1 Project Structure

```
tests/
├── cypress.config.js              # Base URL, viewport, timeouts
├── package.json                   # Cypress 15.4.0 dependency
├── README.md                      # Setup instructions
└── cypress/
    ├── e2e/src/                   # 18 test suites (*.cy.js)
```

### 2.2 Test Databases
- **Primary Database:** Main genealogical test data
- **AlexClark Database:** Extended scenarios for regression testing


---

## 3. Test Categories

### 3.1 Navigation Tests

**What We Test:**
- All pages load without errors
- Navigation links work correctly
- Menu buttons are clickable
- Breadcrumb navigation functions
- Back/forward buttons behave correctly

**Example Tests:**
```javascript
// Check homepage loads
it('should display homepage', () => {
  cy.visit('/')
  cy.get('h1').should('be.visible')
})

// Check navigation link works
it('should navigate to search page', () => {
  cy.get('[data-cy="search-link"]').click()
  cy.url().should('include', '/search')
})

// Check menu dropdown opens
it('should open user menu', () => {
  cy.get('[data-cy="user-menu"]').click()
  cy.get('.dropdown-menu').should('be.visible')
})
```

**Component Input/Output:**
- **Input:** User clicks navigation button
- **Output:** Correct page loads and displays

---

### 3.2 Search Tests

**What We Test:**
- Search input accepts text
- Search button triggers search
- Results display correctly
- Filters modify results
- Pagination works
- Sort buttons reorder results
- "No results" message appears when appropriate

**Example Tests:**
```javascript
// Basic search works
it('should search for person by name', () => {
  cy.get('[data-cy="search-input"]').type('Clark')
  cy.get('[data-cy="search-button"]').click()
  cy.get('.search-results').should('contain', 'Alex Clark')
})

// Advanced search with filters
it('should filter by birth year', () => {
  cy.get('[data-cy="advanced-search"]').click()
  cy.get('[data-cy="birth-year"]').type('1950')
  cy.get('[data-cy="search-button"]').click()
  cy.get('.result-item').each(($el) => {
    cy.wrap($el).should('contain', '1950')
  })
})

// Empty results handled
it('should show no results message', () => {
  cy.get('[data-cy="search-input"]').type('NONEXISTENT')
  cy.get('[data-cy="search-button"]').click()
  cy.get('.no-results').should('be.visible')
})
```

**Component Input/Output:**
- **Input:** User types search query, clicks button
- **Output:** Results list displays matching persons

---

### 3.3 Form Tests

**What We Test:**
- Form inputs accept data
- Save button submits form
- Success messages display
- Error messages display for invalid input
- Required field validation works
- Cancel button returns to previous page
- Data persists after save

**Example Tests:**
```javascript
// Add person form works
it('should add new person', () => {
  cy.get('[data-cy="add-person"]').click()
  
  // Fill inputs
  cy.get('[name="firstname"]').type('Jean')
  cy.get('[name="lastname"]').type('Dupont')
  cy.get('[name="birth_date"]').type('1975-06-15')
  
  // Submit and verify output
  cy.get('[data-cy="save-button"]').click()
  cy.get('.success-message').should('be.visible')
  cy.get('.person-name').should('contain', 'Jean Dupont')
})

// Validation works
it('should show error for missing required field', () => {
  cy.get('[data-cy="add-person"]').click()
  cy.get('[data-cy="save-button"]').click()
  cy.get('.error-message').should('contain', 'Last name is required')
})

// Edit form pre-populates
it('should load existing person data in edit form', () => {
  cy.visit('/person/123/edit')
  cy.get('[name="firstname"]').should('have.value', 'Alex')
  cy.get('[name="lastname"]').should('have.value', 'Clark')
})
```

**Component Input/Output:**
- **Input:** User fills form fields, clicks save
- **Output:** Data saved, success message shown, page displays new data

---

### 3.4 Family Tree Tests
**What We Test:**
- Tree visualization renders
- Tree buttons (ascending/descending) work
- Tree nodes are clickable
- Clicking node navigates to person page
- Tree expands/collapses correctly
- All family members appear in tree

**Example Tests:**
```javascript
// Tree displays correctly
it('should show ascending tree', () => {
  cy.visit('/person/alex-clark')
  cy.get('[data-cy="ascending-tree-button"]').click()
  cy.get('.tree-container').should('be.visible')
  cy.get('.tree-node').should('have.length.at.least', 3)
})

// Tree node navigation works
it('should navigate when clicking tree node', () => {
  cy.get('.tree-node').first().click()
  cy.url().should('include', '/person/')
  cy.get('.person-details').should('be.visible')
})

// Tree shows correct relationships
it('should display parents in ascending tree', () => {
  cy.get('.tree-node[data-relation="parent"]')
    .should('have.length', 2)
})
```

**Component Input/Output:**
- **Input:** User clicks tree button
- **Output:** Tree visualization renders with correct family members

---

### 3.5 Relationship Tests

**What We Test:**
- "Add relationship" button opens form
- Relationship form accepts input
- Relationship saves correctly
- Relationship displays on person page
- Delete relationship button works
- Consanguinity calculation displays

**Example Tests:**
```javascript
// Add parent relationship
it('should add parent relationship', () => {
  cy.visit('/person/jean-dupont')
  cy.get('[data-cy="add-parent-button"]').click()
  
  // Search for parent
  cy.get('[data-cy="search-parent"]').type('Marie Martin')
  cy.get('.search-result').first().click()
  cy.get('[data-cy="confirm-button"]').click()
  
  // Verify output
  cy.get('.parent-list').should('contain', 'Marie Martin')
})

// Consanguinity displays
it('should show consanguinity value', () => {
  cy.visit('/person/alex-clark')
  cy.get('[data-cy="consanguinity-button"]').click()
  cy.get('.consanguinity-value').should('be.visible')
  cy.get('.consanguinity-value').should('match', /\d+\.\d+%/)
})

// Delete relationship
it('should delete relationship with confirmation', () => {
  cy.get('[data-cy="delete-parent-button"]').click()
  cy.get('.confirmation-dialog').should('be.visible')
  cy.get('[data-cy="confirm-delete"]').click()
  cy.get('.parent-list').should('not.contain', 'Marie Martin')
})
```

**Component Input/Output:**
- **Input:** User clicks add relationship, selects person, clicks save
- **Output:** Relationship appears in list, confirmation message shows

---

### 3.6 Update Individual Page Tests 

**What We Test:**
- Update form loads with current data
- All input fields are present and editable
- Public name input field exists
- Save button updates person
- Changes reflect on person detail page

**Example Test:**
```javascript
it("should contain input for Public name", () => {
  cy.visit('/person/123/update')
  cy.get('div.form-group')
    .eq(2) // Adjust the index if necessary
    .find('label')
    .should('contain', 'Public name')
  cy.get('[name="public_name"]').should('be.visible')
})

it('should update person information', () => {
  cy.visit('/person/123/update')
  cy.get('[name="public_name"]').clear().type('Jean "Johnny" Dupont')
  cy.get('[data-cy="save-button"]').click()
  cy.get('.success-message').should('be.visible')
  cy.visit('/person/123')
  cy.get('.public-name').should('contain', 'Jean "Johnny" Dupont')
})
```

**Component Input/Output:**
- **Input:** User modifies form field, clicks update
- **Output:** Updated data displays on person page

---

## 4. Test Execution

### 4.1 Running Tests

```bash
# Install dependencies
npm install

# Run all 477 tests inside test folder 
npm ci 


# Run specific test suite
npx cypress run --spec "cypress/e2e/src/search.cy.js"

```

### 4.2 Test Results

**Current Status:**
- **Total Suites:** 18
- **Total Tests:** 477
- **Passed:** 477 (100%)
- **Failed:** 0 (0%)
- **Duration:** ~8 minutes 30 seconds

---

## 5. Test Scenarios by Component

### 5.1 Page Loading Component

**Test:** Does the page load?
```javascript
it('page loads successfully', () => {
  cy.visit('/person/123')
  cy.get('.person-details').should('exist')
})
```
- **Input:** URL navigation
- **Output:** Page content appears

---

### 5.2 Button Click Component

**Test:** Does clicking the button do something?
```javascript
it('button performs action', () => {
  cy.get('[data-cy="show-tree"]').click()
  cy.get('.tree-view').should('be.visible')
})
```
- **Input:** Button click
- **Output:** Expected component appears/changes

---

### 5.3 Form Input Component

**Test:** Can user type and submit?
```javascript
it('form accepts input and submits', () => {
  cy.get('[name="firstname"]').type('Test Name')
  cy.get('[name="firstname"]').should('have.value', 'Test Name')
  cy.get('form').submit()
  cy.get('.confirmation').should('be.visible')
})
```
- **Input:** User types in field, submits form
- **Output:** Form processes, confirmation appears

---

### 5.4 Search Component

**Test:** Does search return results?
```javascript
it('search returns matching results', () => {
  cy.get('[data-cy="search"]').type('Clark')
  cy.get('[data-cy="search-button"]').click()
  cy.get('.results').children().should('have.length.gt', 0)
})
```
- **Input:** Search query + button click
- **Output:** Results list populated

---

### 5.5 Link Component

**Test:** Does clicking link navigate?
```javascript
it('link navigates to correct page', () => {
  cy.get('a[href="/about"]').click()
  cy.url().should('include', '/about')
  cy.get('h1').should('contain', 'About')
})
```
- **Input:** Link click
- **Output:** New page loads

---

### 5.6 Dropdown Component

**Test:** Does dropdown open and select work?
```javascript
it('dropdown opens and selects option', () => {
  cy.get('[data-cy="filter-dropdown"]').click()
  cy.get('.dropdown-menu').should('be.visible')
  cy.get('.dropdown-item').contains('Male').click()
  cy.get('[data-cy="filter-dropdown"]').should('contain', 'Male')
})
```
- **Input:** Click dropdown, select option
- **Output:** Selected value displays, dropdown closes

---

### 5.7 Validation Component

**Test:** Do error messages appear for invalid input?
```javascript
it('shows validation error', () => {
  cy.get('[name="email"]').type('invalid-email')
  cy.get('form').submit()
  cy.get('.error').should('contain', 'Invalid email format')
})
```
- **Input:** Invalid data + submit
- **Output:** Error message displays, form doesn't submit


---

## 7. Success Criteria

### 7.1 Test Pass Criteria
A test passes when:
- ✅ Page loads without errors
- ✅ Button performs expected action
- ✅ Input accepts user data
- ✅ Output displays correctly
- ✅ Navigation works as expected
- ✅ No console errors appear

### 7.2 Overall Success Metrics
- **477/477 tests passing** ✅
- **100% pass rate** ✅
- **All critical user flows validated** ✅
- **Zero regression detected** ✅



---

## 9. Conclusion

### 9.1 What These Tests Prove
Our 477 E2E tests demonstrate that:
1. **All pages load correctly** - No broken pages
2. **All buttons work** - User can click and interact
3. **All forms function** - Data entry and submission work
4. **All searches work** - Users can find information
5. **All navigation works** - Users can move through the application
6. **All components interact correctly** - Complete workflows function end-to-end

### 9.2 Testing Philosophy
We test **from the user's perspective**: if a user can see it, click it, or type into it, we test it. This ensures the Python migration provides the same user experience as the original OCaml system. This is our focus and why we only have E2E test as it is the most critical thing that the user look for in legacy project : THAT EVERYTHING IS WORKING SO WE CAN DO THE LEGACY PROPRELY

**Test Result:** 477/477 passing = 100% functional validation ✅