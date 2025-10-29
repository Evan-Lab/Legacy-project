describe("Descendants menu page (server)", () => {
  const base =
    Cypress.env("BASE_URL") ||
    Cypress.config("baseUrl") ||
    "http://localhost:2317";

  const genealogy = "555Sample";
  const pageUrl = `${base}/${genealogy}?p=mary+ann&n=wilson&m=D`;

  beforeEach(() => {
    cy.visit(pageUrl);
  });

  it("shows the main heading with person name", () => {
    cy.get("h1").should("be.visible").and("contain.text", "Descendants");
    cy.get("h1").should("contain.text", "Wilson");
  });

  it("contains the container div and form", () => {
    cy.get("div.container").should("exist");
    cy.get("form.needs-validation").should("exist");
  });

  it("displays the generation select dropdown", () => {
    cy.get("select#v").should("exist").and("be.visible");
    cy.get("select#v option").should("have.length.greaterThan", 1);
  });

  it("displays all display type radio buttons", () => {
    cy.get("input#tL[type='radio']").should("exist").and("be.checked");
    cy.get("input#tM[type='radio']").should("exist");
    cy.get("input#tF[type='radio']").should("exist");
    cy.get("input#tT[type='radio']").should("exist");
    cy.get("input#tS[type='radio']").should("exist");
    cy.get("input#tN[type='radio']").should("exist");
    cy.get("input#tG[type='radio']").should("exist");
    cy.get("input#tC[type='radio']").should("exist");
    cy.get("input#tA[type='radio']").should("exist");
    cy.get("input#tH[type='radio']").should("exist");
    cy.get("input#tI[type='radio']").should("exist");
  });

  it("displays long display options checkboxes", () => {
    cy.get("input#ld_alwsurn[type='checkbox']").should("exist");
    cy.get("input#ld_rel[type='checkbox']").should("exist");
    cy.get("input#ld_notes[type='checkbox']").should("exist").and("be.checked");
    cy.get("input#ld_src[type='checkbox']").should("exist").and("be.checked");
    cy.get("input#ld_witn[type='checkbox']").should("exist");
    cy.get("input#ld_comm[type='checkbox']").should("exist");
    cy.get("input#ld_inline[type='checkbox']").should("exist");
  });

  it("displays table options checkboxes", () => {
    cy.get("input#t_num_table[type='checkbox']").should("exist");
    cy.get("input#t_nowrap[type='checkbox']").should("exist");
    cy.get("input#t_tt[type='checkbox']").should("exist");
    cy.get("input#t_fn[type='checkbox']").should("exist");
    cy.get("input#t_marr[type='checkbox']").should("exist");
    cy.get("input#t_child[type='checkbox']").should("exist");
    cy.get("input#t_birth_date[type='checkbox']").should("exist");
    cy.get("input#t_birth_place[type='checkbox']").should("exist");
    cy.get("input#t_marr_date[type='checkbox']").should("exist");
    cy.get("input#t_marr_place[type='checkbox']").should("exist");
    cy.get("input#t_death_date[type='checkbox']").should("exist");
    cy.get("input#t_death_place[type='checkbox']").should("exist");
    cy.get("input#t_occu[type='checkbox']").should("exist");
    cy.get("input#t_gen[type='checkbox']").should("exist");
  });

  it("displays global options checkboxes", () => {
    cy.get("input#only[type='checkbox']").should("exist");
    cy.get("input#image[type='checkbox']").should("exist");
    cy.get("input#cgl[type='checkbox']").should("exist");
  });

  it("has a submit button", () => {
    cy.get("button[type='submit']")
      .should("exist")
      .and("be.visible")
      .and("contain.text", "Ok");
  });

  it("verifies the robots meta tag", () => {
    cy.get('meta[name="robots"]').should("have.attr", "content", "none");
  });

  it("verifies favicon and viewport meta", () => {
    cy.get('link[rel="shortcut icon"]').should("exist");
    cy.get('meta[charset="UTF-8"]').should("exist");
    cy.get('meta[name="viewport"]').should(
      "have.attr",
      "content",
      "width=device-width, initial-scale=1, shrink-to-fit=no"
    );
  });

  it("verifies form has hidden fields for person identification", () => {
    cy.get('input[type="hidden"][name="m"][value="D"]').should("exist");
    cy.get('input[type="hidden"]').then(($inputs) => {
      const hasPN =
        $inputs.filter('[name="p"]').length > 0 &&
        $inputs.filter('[name="n"]').length > 0;
      const hasI = $inputs.filter('[name="i"]').length > 0;
      expect(hasPN || hasI).to.be.true;
    });
  });

  it("can select a generation and submit form", () => {
    cy.get("select#v").select(1);
    cy.get("button[type='submit']").should("not.be.disabled");
  });

  it("verifies the page structure is rendered", () => {
    cy.get("body").should("exist");
    cy.get("div.container").should("exist");
    cy.get("h1").should("exist");
    cy.get("form").should("exist");
  });
});
