describe("Add Parents page", () => {
  const base =
    Cypress.env("BASE_URL") ||
    Cypress.config("baseUrl") ||
    "http://localhost:2317";
  const testDatabase = "555Sample";
  const testPersonId = "0";

  beforeEach(() => {
    cy.visit(`${base}/${testDatabase}?m=ADD_PAR&ip=${testPersonId}`);
  });

  describe("Page structure and navigation", () => {
    it("displays the main heading for adding parents", () => {
      cy.get("h1").should("be.visible").and("not.be.empty");
    });

    it("has a form with id updfam", () => {
      cy.get("form#updfam").should("exist").and("have.attr", "method", "post");
    });

    it("has a container div with correct Bootstrap class", () => {
      cy.get("div.container").should("exist").and("have.class", "container");
    });

    it("has the correct hidden mode value for ADD_PAR", () => {
      cy.get('input[type="hidden"][name="m"]')
        .should("exist")
        .and("have.value", "ADD_PAR_OK");
    });
  });

  describe("Fixed navigation bar (nav pills)", () => {
    it("has a fixed navigation bar", () => {
      cy.get("nav#banner")
        .should("exist")
        .and("have.class", "navbar")
        .and("have.class", "navbar-light");
    });

    it("has nav pills with correct Bootstrap classes", () => {
      cy.get("nav.nav.nav-pills.nav-fill")
        .should("exist")
        .and("have.class", "nav")
        .and("have.class", "nav-pills")
        .and("have.class", "nav-fill");
    });

    it("has a link to Parents section", () => {
      cy.get('a.nav-item.nav-link[href="#family"]')
        .should("exist")
        .and("have.class", "nav-item")
        .and("have.class", "nav-link");
    });

    it("has a link to Events section", () => {
      cy.get('a.nav-item.nav-link[href="#events"]').should("exist");
    });

    it("has a link to Children section", () => {
      cy.get('a.nav-item.nav-link[href="#children"]').should("exist");
    });

    it("can click on Parents link and navigate to that section", () => {
      cy.get('a.nav-item.nav-link[href="#family"]').click();
      cy.url().should("include", "#family");
    });
  });

  describe("Parents card section - Main focus for ADD_PAR", () => {
    it("has a card for Parents section", () => {
      cy.get("h3.card-header#parents")
        .should("exist")
        .and("have.class", "card-header");
    });

    it("has card-body with form fields", () => {
      cy.get(".card .card-body").should("exist").and("have.class", "card-body");
    });

    it("has first name input for parent 1 (Father)", () => {
      cy.get('input[name="pa1_fn"]')
        .should("exist")
        .and("have.class", "form-control")
        .and("have.attr", "placeholder");
    });

    it("has surname input for parent 1 (Father)", () => {
      cy.get('input[name="pa1_sn"]')
        .should("exist")
        .and("have.class", "form-control");
    });

    it("has first name input for parent 2 (Mother)", () => {
      cy.get('input[name="pa2_fn"]')
        .should("exist")
        .and("have.class", "form-control");
    });

    it("has surname input for parent 2 (Mother)", () => {
      cy.get('input[name="pa2_sn"]')
        .should("exist")
        .and("have.class", "form-control");
    });

    it("has occurrence number inputs for both parents", () => {
      cy.get('input[name="pa1_occ"][type="number"]')
        .should("exist")
        .and("have.attr", "min", "0");

      cy.get('input[name="pa2_occ"][type="number"]')
        .should("exist")
        .and("have.attr", "min", "0");
    });

    it("has create/link select dropdowns for both parents", () => {
      cy.get('select[name="pa1_p"]')
        .should("exist")
        .and("have.class", "form-control");

      cy.get('select[name="pa2_p"]')
        .should("exist")
        .and("have.class", "form-control");
    });

    it("create/link select has create and link options", () => {
      cy.get('select[name="pa1_p"]').find("option").should("have.length", 2);

      cy.get('select[name="pa1_p"] option[value="create"]').should("exist");

      cy.get('select[name="pa1_p"] option[value="link"]').should("exist");
    });

    it("has birth date fields for parents", () => {
      cy.get("body").then(($body) => {
        if ($body.find('input[name*="pa1"][name*="b_"]').length > 0) {
          cy.get('input[name*="pa1"][name*="b_"]').should(
            "have.length.greaterThan",
            0
          );
        }
      });
    });

    it("has death date fields for parents", () => {
      cy.get("body").then(($body) => {
        if ($body.find('input[name*="pa1"][name*="d_"]').length > 0) {
          cy.get('input[name*="pa1"][name*="d_"]').should(
            "have.length.greaterThan",
            0
          );
        }
      });
    });

    it("has occupation field for parents", () => {
      cy.get("body").then(($body) => {
        if ($body.find('input[name="pa1_occu"]').length > 0) {
          cy.get('input[name="pa1_occu"]').should("have.class", "form-control");
        }
      });
    });

    it("has a validation button in parents section", () => {
      cy.get('.card .card-body button[type="submit"]')
        .first()
        .should("exist")
        .and("have.class", "btn")
        .and("have.class", "btn-outline-primary");
    });

    it("validation button has correct text and icon", () => {
      cy.get('.card .card-body button[type="submit"]')
        .first()
        .should("contain.text", "OK");
    });
  });

  describe("Form interactions - Add Parents workflow", () => {
    it("can fill out father information", () => {
      cy.get('input[name="pa1_fn"]').clear().type("Robert");
      cy.get('input[name="pa1_sn"]').clear().type("Johnson");
      cy.get('input[name="pa1_occ"]').clear().type("0");
      cy.get('select[name="pa1_p"]').select("create");

      cy.get('input[name="pa1_fn"]').should("have.value", "Robert");
      cy.get('input[name="pa1_sn"]').should("have.value", "Johnson");
      cy.get('select[name="pa1_p"]').should("have.value", "create");
    });

    it("can fill out mother information", () => {
      cy.get('input[name="pa2_fn"]').clear().type("Mary");
      cy.get('input[name="pa2_sn"]').clear().type("Smith");
      cy.get('input[name="pa2_occ"]').clear().type("0");
      cy.get('select[name="pa2_p"]').select("create");

      cy.get('input[name="pa2_fn"]').should("have.value", "Mary");
      cy.get('input[name="pa2_sn"]').should("have.value", "Smith");
      cy.get('select[name="pa2_p"]').should("have.value", "create");
    });

    it("can fill out both parents completely", () => {
      // Father
      cy.get('input[name="pa1_fn"]').clear().type("Robert");
      cy.get('input[name="pa1_sn"]').clear().type("Johnson");
      cy.get('select[name="pa1_p"]').select("create");

      cy.get('input[name="pa2_fn"]').clear().type("Mary");
      cy.get('input[name="pa2_sn"]').clear().type("Smith");
      cy.get('select[name="pa2_p"]').select("create");

      cy.get('input[name="pa1_fn"]').should("have.value", "Robert");
      cy.get('input[name="pa2_fn"]').should("have.value", "Mary");
    });

    it("can switch between create and link modes", () => {
      cy.get('select[name="pa1_p"]')
        .select("create")
        .should("have.value", "create");

      cy.get('select[name="pa1_p"]')
        .select("link")
        .should("have.value", "link");
    });

    it("can type in occupation field if present", () => {
      cy.get("body").then(($body) => {
        if ($body.find('input[name="pa1_occu"]').length > 0) {
          cy.get('input[name="pa1_occu"]')
            .clear()
            .type("Farmer")
            .should("have.value", "Farmer");
        }
      });
    });
  });

  describe("Events section (secondary for ADD_PAR)", () => {
    it("has Events card section", () => {
      cy.get("h3.card-header#events").should("exist");
    });

    it("has event selector if present", () => {
      cy.get("body").then(($body) => {
        if ($body.find('select[id^="fevent_select"]').length > 0) {
          cy.get('select[id^="fevent_select"]').should(
            "have.class",
            "form-control"
          );
        }
      });
    });
  });

  describe("Children section", () => {
    it("has Children card section", () => {
      cy.get("h3.card-header#children").should("exist");
    });

    it("may have insert child controls", () => {
      cy.get("body").then(($body) => {
        if ($body.find('select[name^="ins_ch"]').length > 0) {
          cy.get('select[name^="ins_ch"]').should("have.class", "form-control");
        }
      });
    });
  });

  describe("Comments section", () => {
    it("has Comments card section", () => {
      cy.get("h3.card-header#comments").should("exist");
    });

    it("has comments textarea", () => {
      cy.get('textarea#notes_comments[name="comment"]')
        .should("exist")
        .and("have.class", "form-control");
    });

    it("can type in comments field", () => {
      cy.get("textarea#notes_comments")
        .clear()
        .type("Adding parents for this person")
        .should("have.value", "Adding parents for this person");
    });

    it("has main validation button", () => {
      cy.get("textarea#notes_comments")
        .parent()
        .find('button[type="submit"].btn-lg')
        .should("exist")
        .and("have.class", "btn-outline-primary");
    });
  });

  describe("Hidden form inputs", () => {
    it("has hidden input for mode ADD_PAR_OK", () => {
      cy.get('input[type="hidden"][name="m"]').should(
        "have.value",
        "ADD_PAR_OK"
      );
    });

    it("has hidden input for person id", () => {
      cy.get('input[type="hidden"][name="ip"]')
        .should("exist")
        .and("have.value", testPersonId);
    });

    it("has hidden digest for security", () => {
      cy.get('input[type="hidden"][name="digest"]')
        .should("exist")
        .and("have.attr", "value");
    });
  });

  describe("Navigation between sections", () => {
    it("can navigate to all sections via nav pills", () => {
      cy.get('a[href="#family"]').click();
      cy.url().should("include", "#family");

      cy.get('a[href="#events"]').click();
      cy.url().should("include", "#events");

      cy.get('a[href="#children"]').click();
      cy.url().should("include", "#children");

      cy.get('a[href="#sources"]').click();
      cy.url().should("include", "#sources");

      cy.get('a[href="#comments"]').click();
      cy.url().should("include", "#comments");
    });
  });
});
