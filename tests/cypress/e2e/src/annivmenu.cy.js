describe("Anniversaries menu page (server)", () => {
  const base =
    Cypress.env("BASE_URL") ||
    Cypress.config("baseUrl") ||
    "http://localhost:2317";

  const genealogy = "555Sample";
  const pageUrl = `${base}/${genealogy}?m=ANM`;

  beforeEach(() => {
    cy.visit(pageUrl);
  });

  it("shows the main heading", () => {
    cy.get("h1").should("be.visible").and("contain.text", "Anniversaries");
  });

  it("contains the container div", () => {
    cy.get("div.container").should("exist");
  });

  it("displays all 3 anniversary links", () => {
    cy.get("ul li").then(($lis) => {
      const anniversaryLinks = $lis.filter((_i, el) => {
        const href = Cypress.$(el).find("a").attr("href");
        return (
          href &&
          (href.includes("m=AN") ||
            href.includes("m=AD") ||
            href.includes("m=AM"))
        );
      });
      expect(anniversaryLinks).to.have.length(3);
    });

    cy.get('a[href*="555Sample?m=AN"]')
      .first()
      .should("exist")
      .and("contain.text", "Birthdays");

    cy.get('a[href*="555Sample?m=AD"]')
      .first()
      .should("exist")
      .and("contain.text", "dead");

    cy.get('a[href*="555Sample?m=AM"]')
      .first()
      .should("exist")
      .and("contain.text", "Wedding anniversaries");
  });

  [
    {
      name: "Birthdays",
      selector: 'a[href*="m=AN"]',
      urlPart: "m=AN",
      confirmation: /Birthdays/i,
    },
    {
      name: "Deceased",
      selector: 'a[href*="m=AD"]',
      urlPart: "m=AD",
      confirmation: /Anniversaries of dead people/i,
    },
    {
      name: "Weddings",
      selector: 'a[href*="m=AM"]',
      urlPart: "m=AM",
      confirmation: /Wedding anniversaries/i,
    },
  ].forEach(({ name, selector, urlPart, confirmation }) => {
    it(`navigates to ${name} page when its link is clicked`, () => {
      cy.get(selector)
        .first()
        .should("be.visible")
        .then(($link) => {
          const href = $link.attr("href");
          expect(href, `${name} link has an href`).to.exist;
          expect(href).to.include(urlPart);
          cy.wrap($link).click();
        });

      cy.location("search").should("include", urlPart);
      cy.contains(confirmation).should("be.visible");
    });
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

  it("verifies the page structure is rendered", () => {
    cy.get("body").should("exist");
    cy.get("div.container").should("exist");
    cy.get("h1").should("exist");
  });
});
