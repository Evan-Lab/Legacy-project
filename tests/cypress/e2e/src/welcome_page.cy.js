describe("Welcome page (server)", () => {
  const base =
    Cypress.env("BASE_URL") ||
    Cypress.config("baseUrl") ||
    "http://localhost:2317";

  const dbsName = [
    '555Sample',
    'AlexClark'
  ];

  beforeEach(() => {
    cy.visit(base + "/");
  });

  it("shows the main heading with correct Bootstrap classes", () => {
    cy.get("h1")
      .contains("Choose a genealogy")
      .should("be.visible")
  });

  it("shows the text above the form", () => {
    cy.get("span")
      .contains("Please, enter the name of the database you want to use:")
      .should("be.visible")
  })

  it("shows the database input form with Bootstrap classes", () => {
    cy.get("form")
      .should("exist")

    cy.get('form input[name="b"]')
      .should("exist")
      .should("be.visible")
      .and("have.class", "form-control")

    cy.get('form button[type="submit"]')
      .should("exist")
      .should("be.visible")
      .and("have.class", "btn")
  });

   it('should navigate to the correct genealogy page after search', () => {
    dbsName.forEach(dbName => {
      cy.get('form input[name="b"]').clear().type(dbName);

      cy.get('form button[type="submit"]').click();

      cy.url().should('include', dbName);
      cy.get('h1').should('contain.text', dbName);

      cy.go('back');
    });
  });

  it("shows the language selection heading with Bootstrap classes", () => {
    cy.get("h3.text-center.mt-4")
      .should("be.visible")
      .and("have.class", "text-center")
      .and("have.class", "mt-4");
  });

  it("lists many language buttons with Bootstrap classes", () => {
    cy.get('a[title="en"]')
      .should("contain.text", "English")
      .and("have.class", "btn")
      .and("have.class", "btn-outline-secondary");

    cy.get('a[title="fr"]')
      .should("contain.text", "français")
      .and("have.class", "btn")
      .and("have.class", "btn-outline-secondary");

    cy.get('a[title="de"]')
      .should("contain.text", "Deutsch")
      .and("have.class", "btn")
      .and("have.class", "btn-outline-secondary");

    cy.get('a[title="es"]')
      .should("contain.text", "Español")
      .and("have.class", "btn")
      .and("have.class", "btn-outline-secondary");
  });

  it('should display the list of available genealogies', () => {
    cy.get('div.mt-4')
      .should('contain.text', 'List of available genealogies:')
      .and('contain.text', '555Sample')
      .and('contain.text', 'AlexClark');
  });

  it('list of databases should have correct links', () => {
    cy.get('div.mt-4 a')
      .eq(0)
      .should('have.attr', 'href', '555Sample')
      .and('contain.text', '555Sample');

    cy.get('div.mt-4 a')
      .eq(1)
      .should('have.attr', 'href', 'AlexClark')
      .and('contain.text', 'AlexClark');
  });

  it('should navigate correctly when clicking each link', () => {
    dbsName.forEach(dbName => {
      cy.contains('div.mt-4 a', dbName)
        .should('have.attr', 'href', dbName)
        .click();

      cy.url().should('include', '/' + dbName);

      cy.get('h1').should('contain.text', dbName);

      cy.go('back');
    });
  });
});
