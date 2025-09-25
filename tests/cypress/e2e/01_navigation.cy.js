describe("Navigation", () => {
  beforeEach(() => cy.login("visitor"));

  it("shows the home page and top nav", () => {
    cy.visit("/");
    cy.get('[data-testid="nav-search"]').should("exist");
    cy.get('[data-testid="nav-people"]').should("exist");
    cy.get('[data-testid="nav-trees"]').should("exist");
    cy.get('[data-testid="nav-places"]').should("exist");
    cy.get('[data-testid="nav-anniversaries"]').should("exist");
    cy.get('[data-testid="nav-stats"]').should("exist");
    cy.get('[data-testid="lang-switch"]').click();
    cy.get('[data-testid="lang-option-en"]').click();
    cy.get("html").should("have.attr", "lang", "en");
  });

  it("navigates by breadcrumb and back/forward", () => {
    cy.visit("/people/I1");
    cy.get('[data-testid="breadcrumb-home"]').click();
    cy.location("pathname").should("eq", "/");
    cy.go("back");
    cy.location("pathname").should("include", "/people/");
    cy.go("forward");
    cy.location("pathname").should("eq", "/");
  });
});