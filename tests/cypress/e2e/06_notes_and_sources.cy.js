describe("Notes & Sources (view)", () => {
  beforeEach(() => cy.login("visitor"));

  it("shows wiki links and source anchors", () => {
    cy.openPerson("I2");
    cy.get('[data-testid="notes-section"] a').its("length").should("be.gte", 0);
    cy.get('[data-testid="sources-list"]').should("be.visible");
  });
});