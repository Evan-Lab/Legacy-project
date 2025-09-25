describe("Editing flows (wizard)", () => {
  beforeEach(() => cy.login("wizard"));

  it("edits person identity and validates errors", () => {
    cy.openPerson("I1");
    cy.get('[data-testid="btn-edit"]').click();
    cy.get('[data-testid="edit-given"]').clear().type("John");
    cy.get('[data-testid="edit-surname"]').clear().type("{selectall}{backspace}");
    cy.get('[data-testid="save"]').click();
    cy.get('[data-testid="form-error"]').should("contain", "surname");
    cy.get('[data-testid="edit-surname"]').type("Doe");
    cy.get('[data-testid="save"]').click();
    cy.get('[data-testid="toast"]').should("contain", "Enregistr");
  });

  it("adds family event and reorders children", () => {
    cy.openFamily("F1");
    cy.get('[data-testid="btn-edit"]').click();
    cy.get('[data-testid="add-event"]').click();
    cy.get('[data-testid="event-type"]').select("Marriage");
    cy.get('[data-testid="event-date"]').type("1900-05-01");
    cy.get('[data-testid="save"]').click();
    cy.get('[data-testid="children-list"] [data-testid="move-down"]').first().click();
  });

  it("edits notes with safe HTML", () => {
    cy.openPerson("I2");
    cy.get('[data-testid="btn-edit-notes"]').click();
    cy.get('[data-testid="notes-editor"]').type("<script>alert(1)</script> **OK**");
    cy.get('[data-testid="save-notes"]').click();
    cy.get('[data-testid="notes-section"]').should("contain", "OK");
    cy.get('[data-testid="notes-section"]').should("not.contain", "alert(1)");
  });
});