// Welcome page tests (loads tests/src/welcome.html)
describe('Welcome page (server)', () => {
  const base = Cypress.env('BASE_URL') || Cypress.config('baseUrl') || 'http://localhost:8000';

  beforeEach(() => {
    cy.visit(base + '/');
  });

  it('shows the main heading and database selection', () => {
    // Reference strings from templates (kept as expectations)
    const EXPECTED = {
      heading: 'Choose a genealogy',
      dbPrompt: 'Please, enter the name of the database you want to use:',
      sampleDbLink: '555SAMPLE',
      languageLabel: 'English'
    };

    cy.get('h1').contains(EXPECTED.heading).should('be.visible');
    cy.contains(EXPECTED.dbPrompt).should('exist');
    cy.get('a').contains(EXPECTED.sampleDbLink).should('exist');
    cy.get('a[title="en"]').should('contain.text', EXPECTED.languageLabel);
  });

  it('lists many language buttons and includes English', () => {
    cy.get('a[title="en"]').should('contain.text', 'English');
    cy.get('a[title="fr"]').should('exist');
  });
});
