describe("Roles visibility", () => {
  it("visitor cannot see edit buttons", () => {
    cy.login("visitor");
    cy.openPerson("I1");
    cy.get('[data-testid="btn-edit"]').should("not.exist");
  });

  it("friend sees extended info but no edits", () => {
    cy.login("friend");
    cy.openPerson("I1");
    cy.get('[data-testid="extended-panel"]').should("exist");
    cy.get('[data-testid="btn-edit"]').should("not.exist");
  });

  it("wizard can edit", () => {
    cy.login("wizard");
    cy.openPerson("I1");
    cy.get('[data-testid="btn-edit"]').should("exist");
  });
});