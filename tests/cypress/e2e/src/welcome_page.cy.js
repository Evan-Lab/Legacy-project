describe("Welcome page (server)", () => {
  const base =
    Cypress.env("BASE_URL") ||
    Cypress.config("baseUrl") ||
    "http://localhost:2317";

  beforeEach(() => {
    cy.visit(base + "/");
  });

  it("shows the main heading with correct Bootstrap classes", () => {
    cy.get("h1")
      .contains("Choose a genealogy")
      .should("be.visible")
      .and("have.class", "mt-5");
  });

  it("verifies container and text-center classes on main div", () => {
    cy.get("div.container").should("exist").and("have.class", "text-center");
  });

  it("shows the database input form with Bootstrap classes", () => {
    cy.get("form")
      .should("exist")
      .and("have.class", "form-inline")
      .and("have.class", "d-flex")
      .and("have.class", "justify-content-center")
      .and("have.class", "mt-2");

    cy.get('input[name="b"]')
      .should("exist")
      .and("have.class", "form-control")
      .and("have.class", "col-8");

    cy.get('button[type="submit"]')
      .should("exist")
      .and("have.class", "btn")
      .and("have.class", "btn-outline-secondary")
      .and("have.class", "ml-2");
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

  it("verifies language container has correct Bootstrap classes", () => {
    cy.get("div.d-flex")
      .should("exist")
      .and("have.class", "flex-wrap")
      .and("have.class", "justify-content-center")
      .and("have.class", "col-10")
      .and("have.class", "mx-auto");
  });

  it("shows GeneWeb footer with correct classes", () => {
    cy.get("div.btn-group")
      .should("exist")
      .and("have.class", "float-right")
      .and("have.class", "mt-5")
      .and("have.class", "mr-5");

    cy.contains("GeneWeb v.").should("exist");
    cy.get('a[href*="github.com/geneweb"]').should("exist");
  });
});
