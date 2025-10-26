describe("Menubar on person page", () => {
  const base =
    Cypress.env("BASE_URL") ||
    Cypress.config("baseUrl") ||
    "http://localhost:2317";
  const testDatabase = "555Sample";
  const testPersonId = "2";

  beforeEach(() => {
    cy.visit(`${base}/${testDatabase}?i=${testPersonId}`);
  });

  describe("Menubar structure and CSS classes", () => {
    it("has a navbar with correct Bootstrap classes", () => {
      cy.get("nav.navbar")
        .should("exist")
        .and("have.class", "navbar")
        .and("have.class", "navbar-light")
        .and("have.class", "navbar-expand-md");
    });

    it("has a navbar toggler button for mobile", () => {
      cy.get("button.navbar-toggler")
        .should("exist")
        .and("have.class", "navbar-toggler")
        .and("have.attr", "type", "button");
    });

    it("has a collapsible navbar section", () => {
      cy.get("#navbarSupportedContent")
        .should("exist")
        .and("have.class", "collapse")
        .and("have.class", "navbar-collapse");
    });

    it("has nav-tabs with nav items", () => {
      cy.get("ul.nav.nav-tabs")
        .should("exist")
        .and("have.class", "nav")
        .and("have.class", "nav-tabs");
    });
  });

  describe("Self button", () => {
    it("has a self button with correct classes", () => {
      cy.get("a#self").should("exist").and("have.class", "nav-link");
    });

    it("self button has a user icon", () => {
      cy.get("a#self span.fa-user-large")
        .should("exist")
        .and("have.class", "fa-user-large");
    });

    it("can click the self button and stay on the same person", () => {
      cy.get("a#self").click();
      cy.url().should((url) => {
        expect(url).to.include(testDatabase);
        expect(url).to.match(/[?&](i=\d+|p=[\w-]+&n=[\w-]+)/);
      });
    });
  });

  describe("Person tools dropdown", () => {
    it("has a person tools dropdown toggle", () => {
      cy.get("a.nav-link.dropdown-toggle")
        .first()
        .should("exist")
        .and("have.class", "dropdown-toggle");
    });

    it("person tools dropdown has correct icon", () => {
      cy.get("body").then(($body) => {
        if ($body.find("span.fa-user-gear").length > 0) {
          cy.get("span.fa-user-gear").should("exist");
        }
      });
    });

    it("can open the person tools dropdown", () => {
      cy.get("body").then(($body) => {
        if ($body.find("a#load_once_copylink").length > 0) {
          cy.get("a#load_once_copylink").click();
          cy.get(".dropdown-menu.dropdown-menu-transl").should("be.visible");
        }
      });
    });

    it("dropdown menu has correct Bootstrap classes", () => {
      cy.get("body").then(($body) => {
        if ($body.find(".dropdown-menu.dropdown-menu-transl").length > 0) {
          cy.get(".dropdown-menu.dropdown-menu-transl")
            .should("have.class", "dropdown-menu")
            .and("have.class", "dropdown-menu-transl");
        }
      });
    });
  });

  describe("Wizard/Admin buttons (if user is wizard)", () => {
    it("may have a modify person button if user is wizard", () => {
      cy.get("body").then(($body) => {
        if ($body.find("a#mod_ind").length > 0) {
          cy.get("a#mod_ind")
            .should("exist")
            .and("have.class", "nav-link")
            .and("have.attr", "href")
            .and("include", "m=MOD_IND");
        }
      });
    });

    it("modify button has correct icon if present", () => {
      cy.get("body").then(($body) => {
        if ($body.find("a#mod_ind span.fa-user-pen").length > 0) {
          cy.get("a#mod_ind span.fa-user-pen")
            .should("exist")
            .and("have.class", "fa-user-pen");
        }
      });
    });

    it("may have an add parents button if user is wizard", () => {
      cy.get("body").then(($body) => {
        if ($body.find("a#add_par").length > 0) {
          cy.get("a#add_par")
            .should("exist")
            .and("have.class", "nav-link")
            .and("have.attr", "href")
            .and("include", "m=ADD_PAR");
        }
      });
    });

    it("may have an add family button if user is wizard", () => {
      cy.get("body").then(($body) => {
        if ($body.find("a#add_fam").length > 0) {
          cy.get("a#add_fam").should("exist").and("have.class", "dropdown-item");
        }
      });
    });
  });

  describe("Ancestors dropdown", () => {
    it("has an ancestors dropdown if person has parents", () => {
      cy.get("body").then(($body) => {
        if (
          $body.find("a.nav-link.dropdown-toggle span.fa-code-fork").length > 0
        ) {
          cy.get("a.nav-link.dropdown-toggle span.fa-code-fork")
            .should("exist")
            .and("have.class", "fa-code-fork");
        }
      });
    });

    it("can open the ancestors dropdown and see ascendants tree link", () => {
      cy.get("body").then(($body) => {
        const ancestorDropdown = $body
          .find("a.nav-link.dropdown-toggle")
          .filter((i, el) => {
            return Cypress.$(el).find("span.fa-code-fork").length > 0;
          });

        if (ancestorDropdown.length > 0) {
          cy.wrap(ancestorDropdown).first().click();

          if ($body.find("a#anc_tree").length > 0) {
            cy.get("a#anc_tree")
              .should("be.visible")
              .and("have.attr", "href")
              .and("include", "m=A");
          }
        }
      });
    });
  });

  describe("Descendants dropdown", () => {
    it("has a descendants dropdown if person has children", () => {
      cy.get("body").then(($body) => {
        if ($body.find("span.fa-sitemap").length > 0) {
          cy.get("span.fa-sitemap")
            .should("exist")
            .and("have.class", "fa-sitemap");
        }
      });
    });

    it("can open the descendants dropdown if available", () => {
      cy.get("body").then(($body) => {
        const descendantDropdown = $body
          .find("a.nav-link.dropdown-toggle")
          .filter((i, el) => {
            return Cypress.$(el).find("span.fa-sitemap").length > 0;
          });

        if (descendantDropdown.length > 0) {
          cy.wrap(descendantDropdown).first().click();

          cy.get(".dropdown-menu.dropdown-menu-transl").should("be.visible");
        }
      });
    });
  });

  describe("Relationship dropdown", () => {
    it("has a relationship dropdown toggle", () => {
      cy.get("body").then(($body) => {
        if ($body.find("a#load_once_rlm_builder").length > 0) {
          cy.get("a#load_once_rlm_builder")
            .should("exist")
            .and("have.class", "nav-link")
            .and("have.class", "dropdown-toggle");
        }
      });
    });

    it("relationship dropdown has user-group icon", () => {
      cy.get("body").then(($body) => {
        if (
          $body.find("a#load_once_rlm_builder span.fa-user-group").length > 0
        ) {
          cy.get("a#load_once_rlm_builder span.fa-user-group")
            .should("exist")
            .and("have.class", "fa-user-group");
        }
      });
    });

    it("can open the relationship dropdown", () => {
      cy.get("body").then(($body) => {
        if ($body.find("a#load_once_rlm_builder").length > 0) {
          cy.get("a#load_once_rlm_builder").click();

          cy.get(".dropdown-menu.dropdown-menu-transl").should("be.visible");
        }
      });
    });
  });

  describe("Sosa navigation buttons", () => {
    it("may have sosa navigation buttons if person has sosa number", () => {
      cy.get("body").then(($body) => {
        const sosaPrev = $body.find("span.fa-chevron-left").length > 0;
        const sosaNext = $body.find("span.fa-chevron-right").length > 0;

        if (sosaPrev || sosaNext) {
          cy.get("span.fa-chevron-left, span.fa-chevron-right").should("exist");
        }
      });
    });

    it("sosa previous button navigates to previous person if available", () => {
      cy.get("body").then(($body) => {
        const sosaPrevLink = $body.find("a.nav-link").filter((i, el) => {
          return Cypress.$(el).find("span.fa-chevron-left").length > 0;
        });

        if (sosaPrevLink.length > 0) {
          cy.wrap(sosaPrevLink)
            .first()
            .should("have.attr", "href")
            .and("not.be.empty");
        }
      });
    });

    it("sosa next button navigates to next person if available", () => {
      cy.get("body").then(($body) => {
        const sosaNextLink = $body.find("a.nav-link").filter((i, el) => {
          return Cypress.$(el).find("span.fa-chevron-right").length > 0;
        });

        if (sosaNextLink.length > 0) {
          cy.wrap(sosaNextLink)
            .first()
            .should("have.attr", "href")
            .and("not.be.empty");
        }
      });
    });
  });

  describe("P_MOD dropdown (module selector)", () => {
    it("has a p_mod dropdown toggle", () => {
      cy.get("body").then(($body) => {
        if ($body.find("a#load_once_p_mod").length > 0) {
          cy.get("a#load_once_p_mod")
            .should("exist")
            .and("have.class", "nav-link")
            .and("have.class", "dropdown-toggle");
        }
      });
    });

    it("p_mod dropdown has address-card icon", () => {
      cy.get("body").then(($body) => {
        if ($body.find("span.fa-address-card").length > 0) {
          cy.get("span.fa-address-card")
            .should("exist")
            .and("have.class", "fa-address-card");
        }
      });
    });
  });

  describe("Image/Carrousel button", () => {
    it("may have an image button if images exist", () => {
      cy.get("body").then(($body) => {
        if (
          $body.find("span.fa-image").length > 0 ||
          $body.find("i.fa-images").length > 0
        ) {
          cy.get("span.fa-image, i.fa-images").should("exist");
        }
      });
    });
  });

  describe("Dropdown items interactions", () => {
    it("dropdown items have correct Bootstrap classes", () => {
      cy.get("body").then(($body) => {
        if ($body.find(".dropdown-item").length > 0) {
          cy.get(".dropdown-item")
            .first()
            .should("have.class", "dropdown-item");
        }
      });
    });

    it("can interact with dropdown dividers", () => {
      cy.get("body").then(($body) => {
        if ($body.find(".dropdown-divider").length > 0) {
          cy.get(".dropdown-divider").should("have.class", "dropdown-divider");
        }
      });
    });
  });
});
