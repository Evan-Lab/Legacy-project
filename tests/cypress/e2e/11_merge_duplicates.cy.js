describe("Merge duplicates", () => {
  beforeEach(() => cy.login("wizard"));

  it("compares two persons and merges field-by-field", () => {
    cy.visit("/merge/people");
    cy.get('[data-testid="merge-left"]').type("John Doe");
    cy.get('[data-testid="merge-right"]').type("John Doe (dup)");
    cy.get('[data-testid="load-candidates"]').click();
    cy.get('[data-testid="merge-row"]').should("exist");
    cy.get('[data-testid="take-left-given"]').check();
    cy.get('[data-testid="take-right-surname"]').check();
    cy.get('[data-testid="merge-preview"]').click();
    cy.get('[data-testid="merge-apply"]').click();
    cy.get('[data-testid="toast"]').should("contain", "Fusion");
  });
});