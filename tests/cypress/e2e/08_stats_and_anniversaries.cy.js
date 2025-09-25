describe("Stats & Anniversaries", () => {
  beforeEach(() => cy.login("visitor"));

  it("shows birthdays and links to persons", () => {
    cy.visit("/anniversaries");
    cy.get('[data-testid="anniv-tabs"]').contains("Naissances");
    cy.get('[data-testid="anniv-list"] a').first().click();
    cy.get('[data-testid="person-title"]').should("be.visible");
  });

  it("shows basic stats", () => {
    cy.visit("/stats");
    cy.get('[data-testid="stat-oldest"]').should("be.visible");
    cy.get('[data-testid="stat-count"]').should("be.visible");
  });
});