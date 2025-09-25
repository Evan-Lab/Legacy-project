describe("Import & Export (stubbed)", () => {
  beforeEach(() => cy.login("wizard"));

  it("imports GEDCOM", () => {
    cy.intercept("POST", "/admin/import/gedcom").as("import");
    cy.visit("/admin/import");
    cy.get('input[type="file"][data-testid="gedcom-file"]').selectFile("cypress/fixtures/gedcom-sample.ged");
    cy.get('[data-testid="btn-import-gedcom"]').click();
    cy.wait("@import").its("response.statusCode").should("be.oneOf", [200, 202]);
    cy.get('[data-testid="toast"]').should("contain", "Import");
  });

  it("exports GEDCOM and .gw", () => {
    cy.intercept("GET", "/admin/export/gedcom").as("exportGed");
    cy.intercept("GET", "/admin/export/gw").as("exportGw");
    cy.visit("/admin/export");
    cy.get('[data-testid="btn-export-gedcom"]').click();
    cy.wait("@exportGed").its("response.statusCode").should("eq", 200);
    cy.get('[data-testid="btn-export-gw"]').click();
    cy.wait("@exportGw").its("response.statusCode").should("eq", 200);
  });
});