describe("Security checks", () => {
  it("blocks edit endpoints for visitor", () => {
    cy.login("visitor");
    cy.request({ url: "/people/I1/edit", failOnStatusCode: false })
      .its("status")
      .should("be.oneOf", [401, 403]);
  });

  it("sanitizes HTML on server", () => {
    cy.login("wizard");
    cy.request("POST", "/notes/preview", { text: "<img src=x onerror=alert(1)>" })
      .its("body")
      .should("not.include", "onerror=");
  });
});