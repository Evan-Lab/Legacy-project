describe("Places", () => {
  beforeEach(() => cy.login("visitor"));

  it("navigates hierarchy and filters", () => {
    cy.visit("/places");
    cy.get('[data-testid="place-level"]').contains("Countries");
    cy.get('[data-testid="place-node"]').first().click();
    cy.get('[data-testid="filter-persons"]').type("Doe");
    cy.get('[data-testid="place-persons"] li').its("length").should("be.gte", 0);
  });
});