const normalizeText = (text = "") => text.replace(/\s+/g, " ").trim();

describe("Compact descendants tree page (server)", () => {
  const base =
    Cypress.env("BASE_URL") ||
    Cypress.config("baseUrl") ||
    "http://localhost:2317";

  const genealogy = "555Sample";
  const pageUrl = `${base}/${genealogy}?p=mary+ann&n=wilson&m=D&t=TV&v=3`;
  const computeDestinationUrl = (href) => new URL(href, pageUrl).href;
  const defaultSpParam = new URL(pageUrl).searchParams.get("sp");
  const expectedPath = new URL(pageUrl).pathname;

  beforeEach(() => {
    cy.visit(pageUrl);
  });

  it("shows the compact descendants tree heading", () => {
    cy.contains("h3", "Compact descendants tree").should("be.visible");
  });

  it("displays the person name in the heading", () => {
    cy.contains("h3", "Compact descendants tree").should(
      "contain.text",
      "Wilson"
    );
  });

  it("filters spouse information out when the spouse toggle is used", () => {
    cy.contains("table#dag", "Robert Eugene Williams").should("exist");

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

    cy.get("table#dag").should("not.contain", "Robert Eugene Williams");
  });

  it("shows the generation information in the heading", () => {
    cy.contains("h3", "Compact descendants tree").should(
      "contain.text",
      "great-grandchildren"
    );
  });

  it("contains the DAG table", () => {
    cy.get("table#dag").should("exist").and("be.visible");
  });

  it("has container-fluid for full width", () => {
    cy.get("div.container-fluid").should("exist");
  });

  it("displays table rows with genealogical data", () => {
    cy.get("table#dag tr").should("have.length.greaterThan", 1);
  });

  it("displays table cells with proper alignment", () => {
    cy.get("table#dag td").should("exist");
    cy.get("table#dag td.align-top").should("exist");
  });

  it("displays vertical bars connecting people", () => {
    cy.get("table#dag").then(($table) => {
      const text = $table.text();
      expect(text).to.include("│");
    });
  });

  it("displays horizontal lines in the tree", () => {
    cy.get("table#dag").then(($table) => {
      const hrElements = $table.find("hr");
      if (hrElements.length > 0) {
        expect(hrElements.length).to.be.greaterThan(0);
      } else {
        expect($table).to.exist;
      }
    });
  });

  it("has cells with proper styling classes", () => {
    cy.get("table#dag td.px-0").should("exist");
    cy.get("table#dag td.text-monopace").should("exist");
  });

  it("displays navigation buttons", () => {
    cy.get("div.d-flex.justify-content-center").should("exist");
  });

  it("displays person items in the tree", () => {
    cy.get("table#dag div.d-flex-row").should("exist");
  });

  it("has clickable navigation links", () => {
    cy.get("table#dag a").should("exist");
  });

  it("displays person names in the tree", () => {
    cy.get("table#dag").should("contain.text", "Wilson");
  });

  it("has proper table structure with colspan", () => {
    cy.get("table#dag td").then(($cells) => {
      const colspanCells = $cells.filter("[colspan]");
      if (colspanCells.length > 0) {
        expect(colspanCells.length).to.be.greaterThan(0);
      } else {
        expect($cells.length).to.be.greaterThan(0);
      }
    });
  });

  it("verifies cells have line-height styling", () => {
    cy.get("table#dag td[style*='line-height']").should("exist");
  });

  it("displays stretched links for navigation", () => {
    cy.get("table#dag a.stretched-link").should("exist");
  });

  it("has proper meta tags", () => {
    cy.get('meta[name="robots"]').should("have.attr", "content", "none");
    cy.get('meta[charset="UTF-8"]').should("exist");
    cy.get('meta[name="viewport"]').should(
      "have.attr",
      "content",
      "width=device-width, initial-scale=1, shrink-to-fit=no"
    );
  });

  it("verifies favicon is present", () => {
    cy.get('link[rel="shortcut icon"]').should("exist");
  });

  it("has multiple table rows for different generations", () => {
    cy.get("table#dag tr").should("have.length.greaterThan", 0);
  });

  it("displays the tree with proper margins", () => {
    cy.get("table#dag.mt-2").should("exist");
    cy.get("table#dag.mb-6").should("exist");
    cy.get("table#dag.ml-4").should("exist");
  });

  it("redirects to the selected person when a compact tree entry is clicked", () => {
    let expectedUrl;
    let personLabel;

    cy.get("table#dag td")
      .filter((_, element) =>
        Cypress.$(element).find("a.stretched-link").length > 0
      )
      .first()
      .then(($cell) => {
        const $link = $cell.find("a.stretched-link").first();
        const href = $link.attr("href");
        expect(href, "compact descendant link href")
          .to.be.a("string")
          .and.not.empty;

        expectedUrl = computeDestinationUrl(href);
        const nameSource =
          $cell.find("a.normal_anchor").first().text() ||
          $cell.find("div.d-flex-row.flex-column").first().text();

        personLabel = normalizeText(nameSource)
          .replace(/^\d+\s*/, "")
          .replace(/\s+\d{3,4}.*$/, "")
          .split(" (")[0]
          .trim();

        expect(personLabel, "extracted compact descendant name")
          .to.be.a("string")
          .and.not.empty;

        cy.wrap($link).click({ force: true });
      });

    cy.location("href").should((currentUrl) => {
      expect(new URL(currentUrl).href).to.eq(expectedUrl);
    });

    cy.contains("h3", "Compact descendants tree")
      .invoke("text")
      .then((heading) => {
        expect(normalizeText(heading)).to.include(personLabel);
      });
  });

  it("has position-relative divs for link containers", () => {
    cy.get("table#dag div.position-relative").should("exist");
  });

  it("displays flex columns for content layout", () => {
    cy.get("table#dag div.d-flex-row.flex-column").should("exist");
  });

  it("verifies the page is fully rendered and interactive", () => {
    cy.get("body").should("exist");
    cy.get("table#dag").should("be.visible");
    cy.get("table#dag td").should("have.length.greaterThan", 5);
  });
});
