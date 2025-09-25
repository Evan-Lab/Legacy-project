describe("Trees: ascend/descend/cousins/DAG/fan", () => {
  beforeEach(() => cy.login("visitor"));

  const openTree = (type, pid="I1") => cy.visit(`/trees/${type}/${pid}`);

  it("ascendance options and node navigation", () => {
    openTree("asc");
    cy.get('[data-testid="gen-depth"]').select("5");
    cy.get('[data-testid="invert-parent"]').check();
    cy.get('[data-testid="tree-node"]').first().click();
    cy.location("pathname").should("match", /\/people\/.+/);
  });

  it("descendance zoom and print", () => {
    openTree("desc");
    cy.get('[data-testid="zoom-in"]').click().click();
    cy.get('[data-testid="print-tree"]').should("exist");
  });

  it("DAG interactive graph", () => {
    openTree("dag");
    cy.get('[data-testid="dag-svg"]').should("be.visible");
    cy.get('[data-testid="dag-edge"]').its("length").should("be.gte", 1);
  });

  it("fan chart is renderable", () => {
    openTree("fan");
    cy.get('[data-testid="fan-svg"]').should("be.visible");
  });
});