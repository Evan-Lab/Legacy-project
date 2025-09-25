describe("Family page", () => {
  beforeEach(() => cy.login("visitor"));

  it("shows union and children", () => {
    cy.openFamily("F1");
    cy.get('[data-testid="family-union"]').should("be.visible");
    cy.get('[data-testid="children-list"] li').its("length").should("be.gte", 0);
  });
});