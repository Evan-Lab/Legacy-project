describe("One person page (server)", () => {
  const base =
    Cypress.env("BASE_URL") ||
    Cypress.config("baseUrl") ||
    "http://localhost:2317";

  const genealogy = "555Sample";
  const personQuery = "?p=robert+eugene&n=williams";
  const pageUrl = `${base}/${genealogy}${personQuery}`;

  const findEventRow = (iconClass) =>
    cy
      .get("li")
      .filter((_, element) => element.querySelector(`i.${iconClass}`));

  beforeEach(() => {
    cy.visit(pageUrl);
  });

  it("renders the expected heading and metadata", () => {
    cy.title().should("include", "Robert Eugene Williams");

    cy.get("h1")
      .invoke("text")
      .then((heading) => {
        const text = heading.replace(/\s+/g, " ").trim();
        expect(text).to.include("Robert Eugene");
        expect(text).to.include("Williams");
        expect(text).to.include("1822");
        expect(text).to.include("1905");
      });

    cy.get('meta[name="robots"]').should("have.attr", "content", "none");
    cy.get('link[rel="icon"]').should("exist");
    cy.get('link[rel="apple-touch-icon"]').should("exist");
  });

  it("shows Robert Eugene Williams' vital records", () => {
    findEventRow("fa-baby")
      .should("exist")
      .invoke("text")
      .then((text) => {
        const normalized = text.replace(/\s+/g, " ").trim();
        expect(normalized.toLowerCase()).to.include("born");
        expect(normalized).to.match(/2 Oct(?:ober)? 1822/);
        expect(normalized).to.include("Weston, Madison, Connecticut");
      });

    findEventRow("fa-skull-crossbones")
      .should("exist")
      .invoke("text")
      .then((text) => {
        const normalized = text.replace(/\s+/g, " ").trim();
        expect(normalized.toLowerCase()).to.include("died");
        expect(normalized).to.match(/14 Apr(?:il)? 1905/);
        expect(normalized).to.include("Stamford, Fairfield, Connecticut");
      });

    findEventRow("fa-cross")
      .should("exist")
      .invoke("text")
      .then((text) => {
        const normalized = text.replace(/\s+/g, " ").trim();
        expect(normalized).to.include("Spring Hill Cemetery");
      });
  });

  it("lists spouse and marriage information", () => {
    cy.contains("li", /Married in December 1859/i)
      .should("exist")
      .then(($li) => {
        const normalized = $li.text().replace(/\s+/g, " ").trim();
        expect(normalized).to.match(/Married in December 1859/i);
        expect(normalized).to.include("Mary Ann Wilson");
        expect(normalized).to.include("Rapid City, Pennington, South Dakota");
      });
  });

  it("lists the couple's child", () => {
    cy.contains("li", /Married in December 1859/i)
      .should("exist")
      .parent()
      .within(() => {
        cy.contains("Joe").should("exist");
      });
  });

  it("provides research tools and external links", () => {
    cy.get("#load_once_copylink").click();
    cy.get(".dropdown-menu.dropdown-menu-transl")
      .first()
      .should("be.visible")
      .within(() => {
        cy.contains(/Visibility/i).should("exist");
        cy.contains(/Merge/i).should("exist");
        cy.contains(/Delete/i).should("exist");
      });

    cy.contains("Search Robert Eugene Williams on Geneanet")
      .should("have.attr", "href")
      .and("include", "geneanet.org");
  });
});
