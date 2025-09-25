describe("Admin & setup", () => {
  beforeEach(() => cy.login("wizard"));

  it("shows server settings and updates config", () => {
    cy.visit("/admin");
    cy.get('[data-testid="server-port"]').clear().type("8000");
    cy.get('[data-testid="allowed-tags"]').clear().type("b,i,em,strong,a,ul,ol,li,br");
    cy.intercept("POST", "/admin/settings").as("save");
    cy.get('[data-testid="save-settings"]').click();
    cy.wait("@save").its("response.statusCode").should("eq", 200);
  });

  it("creates a new base", () => {
    cy.intercept("POST", "/admin/bases").as("createBase");
    cy.get('[data-testid="create-base-name"]').type("demo");
    cy.get('[data-testid="create-base-submit"]').click();
    cy.wait("@createBase").its("response.statusCode").should("eq", 201);
    cy.get('[data-testid="bases-list"]').should("contain", "demo");
  });
});