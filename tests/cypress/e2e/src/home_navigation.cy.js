describe("Home navigation components (server)", () => {
  const base =
    Cypress.env("BASE_URL") ||
    Cypress.config("baseUrl") ||
    "http://localhost:2317";

  const genealogy = "555Sample";
  const pageUrl = `${base}/${genealogy}?i=2`;

  beforeEach(() => {
    cy.visit(pageUrl);
  });

  it("displays the home button", () => {
    cy.get("div.home-xs .fa-house").should("exist");
    cy.get("div.home-xs a .fa-house")
      .parent()
      .should("exist")
      .and("be.visible");
  });

  it("displays the search button", () => {
    cy.get("div.home-xs a[data-toggle='modal'][data-target='#searchmodal']")
      .should("exist")
      .and("be.visible");
    cy.get("div.home-xs .fa-magnifying-glass").should("exist");
  });

  it("displays the random person button", () => {
    cy.get("div.home-xs i[class*='fa-dice-']").should("exist");
  });

  it("has the navigation buttons in a flex column", () => {
    cy.get("div.d-flex.flex-column.fix_top.fix_left.home-xs").should("exist");
  });

  it("home button links to base URL", () => {
    cy.get("div.home-xs a .fa-house").parent().should("have.attr", "href");
  });

  it("search button opens the search modal", () => {
    cy.get("div.home-xs a[data-toggle='modal']").click();
    cy.get("#searchmodal").should("be.visible");
  });

  it("search modal contains the search form", () => {
    cy.get("div.home-xs a[data-toggle='modal']").click();
    cy.get("#searchpopup").should("be.visible").and("contain.text", "Search");
    cy.get("form#collapse_search").should("exist");
  });

  it("search form has fullname input field", () => {
    cy.get("div.home-xs a[data-toggle='modal']").click();
    cy.get("input#fullname[name='pn']")
      .should("exist")
      .and("be.visible")
      .and("have.attr", "placeholder");
  });

  it("search form has surname input field", () => {
    cy.get("div.home-xs a[data-toggle='modal']").click();

    cy.get("input#n[name='n']")
      .should("exist")
      .and("be.visible")
      .and("have.attr", "type", "search");
  });

  it("search form has firstname input field", () => {
    cy.get("div.home-xs a[data-toggle='modal']").click();

    cy.get("input#p[name='p']")
      .should("exist")
      .and("be.visible")
      .and("have.attr", "type", "search");
  });

  it("search form has search options checkboxes", () => {
    cy.get("div.home-xs a[data-toggle='modal']").click();
    cy.get("input#p_all[type='checkbox']").should("exist");
    cy.get("input#p_order[type='checkbox']").should("exist");
    cy.get("input#p_exact[type='checkbox']").should("exist");
  });

  it("search form has a submit button", () => {
    cy.get("div.home-xs a[data-toggle='modal']").click();
    cy.get("form#collapse_search button[type='submit']")
      .should("exist")
      .and("be.visible")
      .and("contain.text", "Search");
  });

  it("search form has hidden input for mode", () => {
    cy.get("div.home-xs a[data-toggle='modal']").click();
    cy.get("form#collapse_search input[name='m'][value='S']").should("exist");
  });

  it("can type in the fullname search field", () => {
    cy.get("div.home-xs a[data-toggle='modal']").click();
    cy.get("input#fullname").type("Wilson");
    cy.get("input#fullname").should("have.value", "Wilson");
  });

  it("can toggle search option checkboxes", () => {
    cy.get("div.home-xs a[data-toggle='modal']").click();
    cy.get("input#p_all").should("not.be.checked");
    cy.get("input#p_all").check({ force: true });
    cy.get("input#p_all").should("be.checked");
    cy.get("input#p_all").uncheck({ force: true });
    cy.get("input#p_all").should("not.be.checked");
  });

  it("random button has a valid href", () => {
    cy.get("div.home-xs i[class*='fa-dice-']")
      .parent()
      .then(($link) => {
        const href = $link.attr("href");
        expect(href).to.exist;
        expect(href).to.match(/[?&]i=/);
      });
  });

  it("navigation buttons have proper accessibility", () => {
    cy.get("div.home-xs .sr-only").should("have.length.greaterThan", 0);
    cy.get("div.home-xs a[role='button']").should("exist");
  });

  it("displays the hourglass icon for query time", () => {
    cy.get("#q_time .fa-hourglass-half").should("exist");
  });

  it("has the search modal with proper structure", () => {
    cy.get("#searchmodal.modal").should("exist");
    cy.get("#searchmodal .modal-dialog").should("exist");
    cy.get("#searchmodal .modal-content").should("exist");
    cy.get("#searchmodal .modal-body").should("exist");
  });

  it("search modal has proper ARIA attributes", () => {
    cy.get("#searchmodal")
      .should("have.attr", "role", "dialog")
      .and("have.attr", "aria-labelledby", "searchpopup")
      .and("have.attr", "aria-hidden");
  });

  it("navigation buttons have tabindex for keyboard navigation", () => {
    cy.get("div.home-xs a[tabindex='1']").should("exist");
    cy.get("div.home-xs a[tabindex='3']").should("exist");
  });

  it("search inputs have proper tabindex", () => {
    cy.get("div.home-xs a[data-toggle='modal']").click();

    cy.get("input#fullname[tabindex='4']").should("exist");
    cy.get("input#n[tabindex='5']").should("exist");
    cy.get("input#p[tabindex='6']").should("exist");
  });

  it("fullname input has autofocus attribute", () => {
    cy.get("div.home-xs a[data-toggle='modal']").click();

    cy.get("input#fullname").should("have.attr", "autofocus");
  });

  it("verifies all navigation icons use FontAwesome", () => {
    cy.get("div.home-xs .fa-house").should("exist");
    cy.get("div.home-xs .fa-magnifying-glass").should("exist");
    cy.get("div.home-xs i[class*='fa-dice-']").should("exist");
  });

  it("search form labels have sr-only class for accessibility", () => {
    cy.get("div.home-xs a[data-toggle='modal']").click();
    cy.get("form#collapse_search label.sr-only").should(
      "have.length.greaterThan",
      0
    );
  });
});
