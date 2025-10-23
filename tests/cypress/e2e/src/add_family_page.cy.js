describe("Add Family page", () => {
  const base =
    Cypress.env("BASE_URL") ||
    Cypress.config("baseUrl") ||
    "http://localhost:2317";
  const testDatabase = "555Sample";
  const testPersonId = "2";

  beforeEach(() => {
    cy.visit(`${base}/${testDatabase}?m=ADD_FAM&ip=${testPersonId}`);
  });

  describe("Page structure and navigation", () => {
    it("displays the main heading for adding a family", () => {
      cy.get("h1").should("be.visible").and("not.be.empty");
    });

    it("has a form with id updfam", () => {
      cy.get("form#updfam").should("exist").and("have.attr", "method", "post");
    });

    it("has a container div with correct Bootstrap class", () => {
      cy.get("div.container").should("exist").and("have.class", "container");
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

    it("has a link to Sources section", () => {
      cy.get('a.nav-item.nav-link[href="#sources"]').should("exist");
    });

    it("has a link to Comments section", () => {
      cy.get('a.nav-item.nav-link[href="#comments"]').should("exist");
    });

    it("can click on Events link and navigate to that section", () => {
      cy.get('a.nav-item.nav-link[href="#events"]').click();
      cy.url().should("include", "#events");
    });
  });

  describe("Parents card section", () => {
    it("has a card for Parents section", () => {
      cy.get("h3.card-header#parents")
        .should("exist")
        .and("have.class", "card-header");
    });

    it("has card-body with form fields", () => {
      cy.get(".card .card-body").should("exist").and("have.class", "card-body");
    });

    it("has first name input fields for parents", () => {
      cy.get('input[name^="pa"][name$="_fn"]')
        .should("have.length.greaterThan", 0)
        .first()
        .should("have.class", "form-control");
    });

    it("has surname input fields for parents", () => {
      cy.get('input[name^="pa"][name$="_sn"]')
        .should("have.length.greaterThan", 0)
        .first()
        .should("have.class", "form-control");
    });

    it("has occurrence number inputs for parents", () => {
      cy.get('input[name^="pa"][name$="_occ"][type="number"]')
        .should("have.length.greaterThan", 0)
        .first()
        .should("have.attr", "min", "0");
    });

    it("has create/link select dropdown for parents", () => {
      cy.get('select[name^="pa"][name$="_p"]')
        .should("have.length.greaterThan", 0)
        .first()
        .should("have.class", "form-control");
    });

    it("create/link select has correct options", () => {
      cy.get('select[name^="pa"][name$="_p"]')
        .first()
        .find("option")
        .should("have.length", 2);
    });

    it("can type in first name field for parent 1", () => {
      cy.get('input[name="pa1_fn"]')
        .should("exist")
        .clear()
        .type("John")
        .should("have.value", "John");
    });

    it("can type in surname field for parent 1", () => {
      cy.get('input[name="pa1_sn"]')
        .should("exist")
        .clear()
        .type("Doe")
        .should("have.value", "Doe");
    });

    it("can select create option for parent", () => {
      cy.get('select[name^="pa"][name$="_p"]')
        .first()
        .select("create")
        .should("have.value", "create");
    });

    it("has a validation button in parents section", () => {
      cy.get('.card .card-body button[type="submit"]')
        .first()
        .should("exist")
        .and("have.class", "btn")
        .and("have.class", "btn-outline-primary");
    });
  });

  describe("Events card section", () => {
    it("has a card for Events section", () => {
      cy.get("h3.card-header#events")
        .should("exist")
        .and("have.class", "card-header");
    });

    it("has event selector dropdown", () => {
      cy.get('select[id^="fevent_select"]')
        .should("have.length.greaterThan", 0)
        .first()
        .should("have.class", "form-control")
        .and("have.class", "custom-select");
    });

    it("event selector has multiple event options", () => {
      cy.get('select[id^="fevent_select"]')
        .first()
        .find("option")
        .should("have.length.greaterThan", 5);
    });

    it("can select marriage event", () => {
      cy.get('select[id^="fevent_select"]')
        .first()
        .select("#marr")
        .should("have.value", "#marr");
    });

    it("has place input for events", () => {
      cy.get('input[name^="e_place"]')
        .should("have.length.greaterThan", 0)
        .first()
        .should("have.class", "form-control");
    });

    it("can type in event place field", () => {
      cy.get('input[name^="e_place"]')
        .first()
        .type("Paris, France")
        .should("have.value", "Paris, France");
    });

    it("has date input fields for events (day, month, year)", () => {
      // Check for day input
      cy.get('input[name*="_dd"]').should("have.length.greaterThan", 0);

      // Check for month input
      cy.get('input[name*="_mm"]').should("have.length.greaterThan", 0);

      // Check for year input
      cy.get('input[name*="_yyyy"]').should("have.length.greaterThan", 0);
    });

    it("has date precision selector", () => {
      cy.get('select[name*="_prec"]')
        .should("have.length.greaterThan", 0)
        .first()
        .should("have.class", "form-control");
    });

    it("date precision selector has correct options", () => {
      cy.get('select[name*="_prec"]')
        .first()
        .find("option")
        .should("have.length.greaterThan", 3);
    });

    it("has calendar selector", () => {
      cy.get('select[name*="_cal"]')
        .should("have.length.greaterThan", 0)
        .first()
        .should("have.class", "form-control");
    });

    it("has notes textarea for events", () => {
      cy.get('textarea[name^="e_note"]')
        .should("have.length.greaterThan", 0)
        .first()
        .should("have.class", "form-control");
    });

    it("can type in event notes field", () => {
      cy.get('textarea[name^="e_note"]')
        .first()
        .type("Wedding ceremony")
        .should("have.value", "Wedding ceremony");
    });

    it("has source field for events", () => {
      cy.get("body").then(($body) => {
        const hasTextarea = $body.find('textarea[name^="e_src"]').length > 0;
        const hasInput = $body.find('input[name^="e_src"]').length > 0;

        if (hasTextarea || hasInput) {
          cy.get('textarea[name^="e_src"], input[name^="e_src"]')
            .first()
            .should("have.class", "form-control");
        }
      });
    });
  });

  describe("Children card section", () => {
    it("has a card for Children section", () => {
      cy.get("h3.card-header#children")
        .should("exist")
        .and("have.class", "card-header");
    });

    it("has insert child controls", () => {
      cy.get('select[name^="ins_ch"][name$="_n"]')
        .should("have.length.greaterThan", 0)
        .first()
        .should("have.class", "form-control");
    });

    it("has insert child checkbox", () => {
      cy.get('input[type="checkbox"][name^="ins_ch"]').should(
        "have.length.greaterThan",
        0
      );
    });

    it("insert controls have submit button", () => {
      cy.get('select[name^="ins_ch"]')
        .first()
        .parent()
        .find('button[type="submit"]')
        .should("exist")
        .and("have.class", "btn")
        .and("have.class", "btn-outline-primary");
    });

    it("can check the insert child checkbox", () => {
      cy.get('input[type="checkbox"][name^="ins_ch"]')
        .first()
        .check()
        .should("be.checked");
    });
  });

  describe("Sources card section", () => {
    it("has a card for Sources section", () => {
      cy.get("h3.card-header#sources")
        .should("exist")
        .and("have.class", "card-header");
    });

    it("has sources textarea or input for persons", () => {
      cy.get("textarea#psrc, input#psrc")
        .should("exist")
        .and("have.class", "form-control");
    });

    it("has sources field for family", () => {
      cy.get("textarea#src, input#src")
        .should("exist")
        .and("have.class", "form-control");
    });
  });

  describe("Comments card section", () => {
    it("has a card for Comments section", () => {
      cy.get("h3.card-header#comments")
        .should("exist")
        .and("have.class", "card-header");
    });

    it("has comments textarea", () => {
      cy.get('textarea#notes_comments[name="comment"]')
        .should("exist")
        .and("have.class", "form-control");
    });

    it("can type in comments field", () => {
      cy.get("textarea#notes_comments")
        .type("This is a test comment")
        .should("have.value", "This is a test comment");
    });

    it("has a main validation button in comments section", () => {
      cy.get("textarea#notes_comments")
        .parent()
        .find('button[type="submit"].btn-lg')
        .should("exist")
        .and("have.class", "btn")
        .and("have.class", "btn-outline-primary")
        .and("have.class", "btn-lg");
    });
  });

  describe("Form interactions - Complete workflow", () => {
    it("can fill out a complete parent form", () => {
      cy.get('input[name="pa1_fn"]').clear().type("John");
      cy.get('input[name="pa1_sn"]').clear().type("Smith");
      cy.get('input[name="pa1_occ"]').clear().type("0");
      cy.get('select[name="pa1_p"]').select("create");

      cy.get('input[name="pa2_fn"]').clear().type("Jane");
      cy.get('input[name="pa2_sn"]').clear().type("Doe");
      cy.get('input[name="pa2_occ"]').clear().type("0");
      cy.get('select[name="pa2_p"]').select("create");

      cy.get('input[name="pa1_fn"]').should("have.value", "John");
      cy.get('input[name="pa2_fn"]').should("have.value", "Jane");
    });

    it("can fill out event information", () => {
      cy.get('select[id^="fevent_select"]').first().select("#marr");
      cy.get('input[name^="e_place"]').first().type("New York");
      cy.get('textarea[name^="e_note"]').first().type("Wedding at city hall");
      cy.get('input[name^="e_place"]').first().should("have.value", "New York");
      cy.get('textarea[name^="e_note"]')
        .first()
        .should("contain.value", "Wedding");
    });

    it("can navigate between sections using nav pills", () => {
      cy.get('a[href="#family"]').click();
      cy.url().should("include", "#family");
      cy.get('a[href="#events"]').click();
      cy.url().should("include", "#events");
      cy.get('a[href="#children"]').click();
      cy.url().should("include", "#children");
      cy.get('a[href="#comments"]').click();
      cy.url().should("include", "#comments");
    });
  });

  describe("Hidden inputs and form metadata", () => {
    it("has hidden input for mode (m=ADD_FAM_OK)", () => {
      cy.get('input[type="hidden"][name="m"]')
        .should("exist")
        .and("have.value", "ADD_FAM_OK");
    });

    it("has hidden input for person id (ip)", () => {
      cy.get('input[type="hidden"][name="ip"]')
        .should("exist")
        .and("have.value", testPersonId);
    });

    it("has hidden digest input for security", () => {
      cy.get('input[type="hidden"][name="digest"]')
        .should("exist")
        .and("have.attr", "value");
    });
  });

  describe("Navigation from welcome page", () => {
    it("can access Add Family from the welcome page", () => {
      cy.visit(`${base}/?b=${testDatabase}`);
      cy.get("body").then(($body) => {
        if ($body.find('a[href*="m=ADD_FAM"]').length > 0) {
          cy.get('a[href*="m=ADD_FAM"]').first().click();
          cy.url().should("include", "m=ADD_FAM");
          cy.get("form#updfam").should("exist");
          cy.get("h1").should("be.visible").and("contain", "Add family");
        }
      });
    });

    it("Add Family button has correct icon and text", () => {
      cy.visit(`${base}/?b=${testDatabase}`);

      cy.get("body").then(($body) => {
        if ($body.find('a[href*="m=ADD_FAM"]').length > 0) {
          cy.get('a[href*="m=ADD_FAM"]')
            .first()
            .should("have.class", "btn")
            .within(() => {
              cy.get("i.fa-user-plus").should("exist");
            });
        }
      });
    });
  });

  describe("End-to-end family creation with submission", () => {
    beforeEach(() => {
      cy.visit(`${base}/${testDatabase}?m=ADD_FAM`);
    });

    it("can create a complete family with parents and submit", () => {
      const timestamp = Date.now();
      const father = {
        firstName: `TestFather${timestamp}`,
        lastName: `TestFamily${timestamp}`,
        occ: "0",
      };
      const mother = {
        firstName: `TestMother${timestamp}`,
        lastName: `TestFamily${timestamp}`,
        occ: "0",
      };
      cy.get('input[name="pa1_fn"]').clear().type(father.firstName);
      cy.get('input[name="pa1_sn"]').clear().type(father.lastName);
      cy.get('input[name="pa1_occ"]').clear().type(father.occ);
      cy.get('select[name="pa1_p"]').select("create");
      cy.get('input[name="pa2_fn"]').clear().type(mother.firstName);
      cy.get('input[name="pa2_sn"]').clear().type(mother.lastName);
      cy.get('input[name="pa2_occ"]').clear().type(mother.occ);
      cy.get('select[name="pa2_p"]').select("create");
      cy.get('input[name="pa1_fn"]').should("have.value", father.firstName);
      cy.get('input[name="pa2_fn"]').should("have.value", mother.firstName);
      cy.get('button[type="submit"].btn-lg').click();
      cy.url({ timeout: 10000 }).should("not.include", "m=ADD_FAM");
    });

    it("can create family with marriage event and submit", () => {
      const timestamp = Date.now();
      const familyName = `TestFamily${timestamp}`;
      cy.get('input[name="pa1_fn"]').clear().type(`Father${timestamp}`);
      cy.get('input[name="pa1_sn"]').clear().type(familyName);
      cy.get('select[name="pa1_p"]').select("create");
      cy.get('input[name="pa2_fn"]').clear().type(`Mother${timestamp}`);
      cy.get('input[name="pa2_sn"]').clear().type(familyName);
      cy.get('select[name="pa2_p"]').select("create");
      cy.get('a[href="#events"]').click();
      cy.url().should("include", "#events");
      cy.get('select[id^="fevent_select"]').first().select("#marr");
      cy.get('input[name^="e_place"]').first().type("Test City");
      cy.get('input[name*="_yyyy"]').first().type("2020");
      cy.get('textarea[name^="e_note"]').first().type("Test marriage event");
      cy.get('a[href="#comments"]').click();
      cy.get('button[type="submit"].btn-lg').click();
      cy.url({ timeout: 10000 }).should("not.include", "m=ADD_FAM");
    });

    it("can create family with birth dates and submit", () => {
      const timestamp = Date.now();
      cy.get('input[name="pa1_fn"]').clear().type(`TestPerson${timestamp}`);
      cy.get('input[name="pa1_sn"]').clear().type(`TestSurname${timestamp}`);
      cy.get('select[name="pa1_p"]').select("create");
      cy.get('input[name="pa1b_dd"]').clear().type("15");
      cy.get('input[name="pa1b_mm"]').clear().type("06");
      cy.get('input[name="pa1b_yyyy"]').clear().type("1980");
      cy.get('input[name="pa1b_pl"]').clear().type("Paris");
      cy.get('input[name="pa2_fn"]').clear().type(`TestPerson2${timestamp}`);
      cy.get('input[name="pa2_sn"]').clear().type(`TestSurname${timestamp}`);
      cy.get('select[name="pa2_p"]').select("create");
      cy.get('input[name="pa2b_dd"]').clear().type("20");
      cy.get('input[name="pa2b_mm"]').clear().type("09");
      cy.get('input[name="pa2b_yyyy"]').clear().type("1982");
      cy.get('input[name="pa2b_pl"]').clear().type("London");
      cy.get('input[name="pa1b_yyyy"]').should("have.value", "1980");
      cy.get('input[name="pa2b_yyyy"]').should("have.value", "1982");
      cy.get('button[type="submit"].btn-lg').click();
      cy.url({ timeout: 10000 }).should("not.include", "m=ADD_FAM");
    });

    it("form submission redirects to appropriate page", () => {
      const timestamp = Date.now();
      cy.get('input[name="pa1_fn"]').clear().type(`Min1${timestamp}`);
      cy.get('input[name="pa1_sn"]').clear().type(`MinFamily${timestamp}`);
      cy.get('select[name="pa1_p"]').select("create");
      cy.get('input[name="pa2_fn"]').clear().type(`Min2${timestamp}`);
      cy.get('input[name="pa2_sn"]').clear().type(`MinFamily${timestamp}`);
      cy.get('select[name="pa2_p"]').select("create");
      cy.get('button[type="submit"].btn-lg').click();
      cy.url({ timeout: 10000 }).should("not.include", "m=ADD_FAM");
      cy.get("body").should("be.visible");
    });
  });
});
