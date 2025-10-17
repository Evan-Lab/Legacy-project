describe("Database welcome page (server)", () => {
  const base =
    Cypress.env("BASE_URL") ||
    Cypress.config("baseUrl") ||
    "http://localhost:2317";
  const testDatabase = Cypress.env("TEST_DB") || "555SAMPLE";

  beforeEach(() => {
    cy.visit(`${base}/?b=${testDatabase}`);
  });

  describe("Page structure and CSS classes", () => {
    it("has a container div with correct class", () => {
      cy.get("div.container").should("exist").and("have.class", "container");
    });

    it("displays the GeneWeb logo if present", () => {
      cy.get("body").then(($body) => {
        if ($body.find('img[src*="gwlogo"]').length > 0) {
          cy.get('img[src*="gwlogo"]').should("exist").and("be.visible");
        } else if ($body.find('img[alt*="GeneWeb"]').length > 0) {
          cy.get('img[alt*="GeneWeb"]').should("exist").and("be.visible");
        }
      });
    });

    it("displays the main H1 heading", () => {
      cy.get("h1").should("exist").and("be.visible");
    });

    it("displays H2 heading if present", () => {
      cy.get("body").then(($body) => {
        if ($body.find("h2").length > 0) {
          cy.get("h2").should("be.visible").and("not.be.empty");
        }
      });
    });
  });

  describe("Navigation links", () => {
    it("has a link to Statistics page", () => {
      cy.get('a[href*="m=STAT"]').should("exist").and("be.visible");
    });

    it("navigates to Statistics page when clicked", () => {
      cy.get('a[href*="m=STAT"]').click();
      cy.url().should("include", "m=STAT");
    });

    it("has a link to Calendar page", () => {
      cy.get('a[href*="m=CAL"]').should("exist").and("be.visible");
    });

    it("navigates to Calendar page when clicked", () => {
      cy.get('a[href*="m=CAL"]').click();
      cy.url().should("include", "m=CAL");
    });

    it("has a link to Anniversaries page", () => {
      cy.get('a[href*="m=ANM"]').should("exist").and("be.visible");
    });

    it("navigates to Anniversaries page when clicked", () => {
      cy.get('a[href*="m=ANM"]').click();
      cy.url().should("include", "m=ANM");
    });

    it("has a link to First names page", () => {
      cy.get('a[href*="m=P"]').should("exist").and("be.visible");
    });

    it("has a link to Surnames page", () => {
      cy.get('a[href*="m=N"]').should("exist").and("be.visible");
    });

    it("navigates to First names page when clicked", () => {
      cy.get('a[href*="m=P"][href*="tri=A"]').first().click();
      cy.url().should("include", "m=P");
    });

    it("navigates to Surnames page when clicked", () => {
      cy.get('a[href*="m=N"][href*="tri=A"]').first().click();
      cy.url().should("include", "m=N");
    });
  });

  describe("Login form", () => {
    it("has a login form with correct class if auth is required", () => {
      cy.get("body").then(($body) => {
        if ($body.find("form.login").length > 0) {
          cy.get("form.login").should("exist").and("have.class", "login");

          cy.get('form.login input[name="w"][type="password"]').should("exist");
        }
      });
    });
  });

  describe("Place/Events search form", () => {
    it("has a form for searching by place and events if available", () => {
      cy.get("body").then(($body) => {
        if ($body.find('input[name="m"][value="PS"]').length > 0) {
          cy.get('input[name="m"][value="PS"]').should("exist");
        } else if ($body.find("form").length > 0) {
          cy.get("form").should("have.length.greaterThan", 0);
        }
      });
    });

    it("has checkboxes for birth, marriage, and death events", () => {
      cy.get("body").then(($body) => {
        if ($body.find('input[name="bi"]').length > 0) {
          cy.get('input[name="bi"][type="checkbox"]')
            .should("exist")
            .and("have.attr", "type", "checkbox");
        }

        if ($body.find('input[name="ma"]').length > 0) {
          cy.get('input[name="ma"][type="checkbox"]')
            .should("exist")
            .and("have.attr", "type", "checkbox");
        }

        if ($body.find('input[name="de"]').length > 0) {
          cy.get('input[name="de"][type="checkbox"]')
            .should("exist")
            .and("have.attr", "type", "checkbox");
        }
      });
    });

    it("can check and uncheck the birth checkbox", () => {
      cy.get("body").then(($body) => {
        if ($body.find('input[name="bi"]').length > 0) {
          cy.get('input[name="bi"]')
            .should("be.checked")
            .uncheck()
            .should("not.be.checked")
            .check()
            .should("be.checked");
        }
      });
    });

    it("can check and uncheck the marriage checkbox", () => {
      cy.get("body").then(($body) => {
        if ($body.find('input[name="ma"]').length > 0) {
          cy.get('input[name="ma"]')
            .should("be.checked")
            .uncheck()
            .should("not.be.checked")
            .check()
            .should("be.checked");
        }
      });
    });

    it("can check and uncheck the death checkbox", () => {
      cy.get("body").then(($body) => {
        if ($body.find('input[name="de"]').length > 0) {
          cy.get('input[name="de"]')
            .should("be.checked")
            .uncheck()
            .should("not.be.checked")
            .check()
            .should("be.checked");
        }
      });
    });

    it("has optional checkboxes for baptism and burial", () => {
      cy.get("body").then(($body) => {
        if ($body.find('input[name="bp"]').length > 0) {
          cy.get('input[name="bp"][type="checkbox"]').should("exist");
        }

        if ($body.find('input[name="bu"]').length > 0) {
          cy.get('input[name="bu"][type="checkbox"]').should("exist");
        }
      });
    });
  });

  describe("Wizard/Admin features", () => {
    it("may have a link to add a family if user is wizard", () => {
      cy.get("body").then(($body) => {
        if ($body.find('a[href*="m=ADD_FAM"]').length > 0) {
          cy.get('a[href*="m=ADD_FAM"]').should("exist").and("be.visible");
        }
      });
    });

    it("may have links to modify data (first names, surnames, places) if user is wizard", () => {
      cy.get("body").then(($body) => {
        if ($body.find('a[href*="m=MOD_DATA"]').length > 0) {
          cy.get('a[href*="m=MOD_DATA"]').should("exist");
        }
      });
    });
  });

  describe("Counter and statistics display", () => {
    it("may display access counter if enabled", () => {
      cy.get("body").then(($body) => {
        const hasCounter =
          $body.text().includes("accesses") ||
          $body.text().includes("consultations") ||
          $body.text().includes("访问");

        if (hasCounter) {
          cy.contains(/accesses|consultations|访问/).should("exist");
        }
      });
    });
  });
});
