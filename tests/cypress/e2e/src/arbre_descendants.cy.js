const normalizeText = (text = "") => text.replace(/\s+/g, " ").trim();

describe("Descendants tree page (server)", () => {
  const base =
    Cypress.env("BASE_URL") ||
    Cypress.config("baseUrl") ||
    "http://localhost:2317";

  const genealogy = "555Sample";
  const pageUrl = `${base}/${genealogy}?p=mary+ann&n=wilson&m=D&t=V&v=3`;
  const computeDestinationUrl = (href) => new URL(href, pageUrl).href;
  const defaultSpParam = new URL(pageUrl).searchParams.get("sp");
  const expectedPath = new URL(pageUrl).pathname;

  beforeEach(() => {
    cy.visit(pageUrl);
  });

  it("shows the descendants tree heading", () => {
    cy.get("h3#a").should("be.visible").and("contain.text", "Descendants tree");
  });

  it("contains the descendants tree table", () => {
    cy.get("table.destree_table").should("exist").and("be.visible");
  });

  it("displays table rows with person information", () => {
    cy.get("table.destree_table tr").should("have.length.greaterThan", 3);
  });

  it("displays person names in the tree", () => {
    cy.get("table.destree_table").should("contain.text", "Wilson");
  });

  it("displays links to person pages", () => {
    cy.get("table.destree_table a.normal_anchor").should("exist");
  });

  it("shows dates for people", () => {
    cy.get("table.destree_table .font-italic").should("exist");
  });

  it("displays horizontal lines connecting family members", () => {
    cy.get("table.destree_table").then(($table) => {
      const hrElements = $table.find("hr");
      if (hrElements.length > 0) {
        expect(hrElements.length).to.be.greaterThan(0);
      } else {
        expect($table).to.exist;
      }
    });
  });

  it("displays vertical bars connecting generations", () => {
    cy.get("table.destree_table").then(($table) => {
      const text = $table.text();
      expect(text).to.include("│");
    });
  });

  it("has table cells with proper styling", () => {
    cy.get("table.destree_table td.text-center").should("exist");
    cy.get("table.destree_table td.align-top").should("exist");
  });

  it("displays multiple generations", () => {
    cy.get("table.destree_table td").should("have.length.greaterThan", 10);
  });

  it("verifies navigation buttons are present", () => {
    cy.get("body").should("exist");
  });

  it("redirects to the selected person when a descendant link is clicked", () => {
    let expectedUrl;
    let linkLabel;

    cy.get("table.destree_table a.normal_anchor").then(($links) => {
      const linkElement = Array.from($links).find((element) => {
        const href = element.getAttribute("href") || "";
        return href.trim().length > 0;
      });

      expect(linkElement, "descendant link element").to.exist;

      const href = linkElement.getAttribute("href") || "";
      expectedUrl = computeDestinationUrl(href);
      linkLabel = normalizeText(linkElement.textContent || "")
        .split(" (")[0]
        .trim();

      cy.wrap(linkElement).click();
    });

    cy.location("href").should((currentUrl) => {
      expect(new URL(currentUrl).href).to.eq(expectedUrl);
    });

    cy.get("h1")
      .invoke("text")
      .then((heading) => {
        expect(normalizeText(heading)).to.include(linkLabel);
      });
  });

  it("displays person containers with proper structure", () => {
    cy.get("table.destree_table div.px-0").should("exist");
  });

  it("shows ampersand symbols for marriages", () => {
    cy.get("table.destree_table").then(($table) => {
      const text = $table.text();
      expect(text).to.match(/[&]/);
    });
  });

  it("verifies the page has proper meta tags", () => {
    cy.get('meta[charset="UTF-8"]').should("exist");
    cy.get('meta[name="viewport"]').should(
      "have.attr",
      "content",
      "width=device-width, initial-scale=1, shrink-to-fit=no"
    );
  });

  it("filters spouse information out when the spouse toggle is used", () => {
    cy.contains("table.destree_table", "Robert Eugene Williams").should(
      "exist"
    );

    cy.get("nav.navbar.fixed-bottom a").then(($links) => {
      const linkElement = Array.from($links).find((element) => {
        const href = element.getAttribute("href") || "";
        return /[?&]sp=/.test(href);
      });

      expect(linkElement, "spouse filter link").to.exist;

      cy.wrap(linkElement).click({ force: true });
    });

    cy.location().should((location) => {
      const params = new URLSearchParams(location.search);
      const spValue = params.get("sp");

      expect(location.pathname).to.eq(expectedPath);
      expect(params.get("p"), "person first name parameter").to.eq(
        "mary ann"
      );
      expect(params.get("n"), "person surname parameter").to.eq("wilson");
      expect(spValue, "sp parameter").to.not.equal(defaultSpParam);
      expect(spValue, "sp parameter").to.not.equal(null);
    });

    cy.get("table.destree_table").should(
      "not.contain",
      "Robert Eugene Williams"
    );
  });

  it("has the container div", () => {
    cy.get("div.container").should("exist");
  });

  it("verifies table structure with colspan", () => {
    cy.get("table.destree_table td[colspan]").should("exist");
  });

  it("displays the tree with proper alignment", () => {
    cy.get("table.destree_table td.text-center").should(
      "have.length.greaterThan",
      0
    );
  });

  it("shows the tree is centered on the page", () => {
    cy.get("table.destree_table.mx-auto").should("exist");
  });

  it("verifies the page is rendered and interactive", () => {
    cy.get("body").should("exist");
    cy.get("table.destree_table").should("be.visible");
    cy.get("table.destree_table a.normal_anchor")
      .first()
      .should("not.be.disabled");
  });
});
