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

  it("home button navigates to base page", () => {
    cy.get("div.home-xs a[tabindex='1']")
      .should("be.visible")
      .then(($link) => {
        const linkEl = $link[0] || $link;
        const rawHref =
          (typeof $link.attr === "function" && $link.attr("href")) ||
          (linkEl && linkEl.getAttribute
            ? linkEl.getAttribute("href")
            : null);

        expect(rawHref, "home link should have href").to.be.a("string");
        const normalizedLinkHref = rawHref.replace(/^(\.\/)/, "");
        expect(normalizedLinkHref).to.eq(`${genealogy}?`);

        cy.wrap(linkEl).click();

        cy.location("pathname").should("eq", `/${genealogy}`);
        cy.location("search").should((search) => {
          expect(["", "?"]).to.include(search);
        });
        cy.location("href").should((href) => {
          expect(href.replace(/\?$/, "")).to.eq(`${base}/${genealogy}`);
        });
      });
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

  it("searches for a person from the home menu and shows result details", () => {
    const searchQuery = "Mary Ann Wilson";

    cy.get("div.home-xs a[data-toggle='modal']").click();
    cy.get("#searchmodal").should("be.visible");

    cy.get("#searchmodal input#fullname")
      .should("have.attr", "name", "pn")
      .clear()
      .type(searchQuery);

    cy.get("#searchmodal form#collapse_search").submit();

    cy.location().then((location) => {
      const params = new URLSearchParams(location.search);
      const composedFullName =
        params.get("pn") ||
        [params.get("p"), params.get("n")].filter(Boolean).join(" ");

      expect(location.pathname).to.eq(`/${genealogy}`);
      expect(composedFullName.toLowerCase()).to.include("mary");
      expect(composedFullName.toLowerCase()).to.include("wilson");
    });

    cy.contains("body", searchQuery).should("exist");

    cy.get("body")
      .invoke("text")
      .then((text) => {
        expect(text, "search results should mention 1822").to.match(/1822/);
        expect(text, "search results should mention 1905").to.match(/1905/);
      });
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

  it("random button navigates to a person page", () => {
    cy.get("div.home-xs i[class*='fa-dice-']")
      .parent("a")
      .should("be.visible")
      .then(($link) => {
        const linkEl = $link[0] || $link;
        const rawHref =
          (typeof $link.attr === "function" && $link.attr("href")) ||
          (linkEl && linkEl.getAttribute
            ? linkEl.getAttribute("href")
            : null);

        expect(rawHref, "random link should have href").to.be.a("string");

        cy.wrap(linkEl).click();

        cy.location("href").should((href) => {
          expect(/[?&](i|p)=/.test(href)).to.be.true;
        });
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
