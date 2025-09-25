describe("Person page", () => {
  beforeEach(() => cy.login("visitor"));

  it("shows identity, events, notes, media, links", () => {
    cy.openPerson("I1");
    cy.get('[data-testid="person-identity"]').should("be.visible");
    cy.get('[data-testid="events-list"]').should("be.visible");
    cy.get('[data-testid="notes-section"]').should("be.visible");
    cy.get('[data-testid="media-gallery"]').should("be.visible");
    cy.get('[data-testid="relations-panel"]').should("be.visible");
  });

  it("opens media lightbox and copies link", () => {
    cy.openPerson("I1");
    cy.get('[data-testid="media-thumb"]').first().click();
    cy.get('[data-testid="lightbox"]').should("be.visible");
    cy.get('[data-testid="copy-media-link"]').click();
    cy.get('[data-testid="toast"]').should("contain", "copi");
  });
});