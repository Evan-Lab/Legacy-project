describe("History & diff", () => {
  beforeEach(() => cy.login("wizard"));

  it("shows history entries and opens diff", () => {
    cy.visit("/history");
    cy.get('[data-testid="history-row"]').first().click();
    cy.get('[data-testid="diff-view"]').should("be.visible");
  });
});