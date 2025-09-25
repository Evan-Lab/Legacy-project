describe("Search & Index", () => {
  beforeEach(() => cy.login("visitor"));

  it("simple search by name", () => {
    cy.visit("/");
    cy.get('[data-testid="nav-search"]').type("John Doe{enter}");
    cy.url().should("include", "/search");
    cy.get('[data-testid="search-results"] tbody tr').should("have.length.at.least", 1);
    cy.get('[data-testid="search-results"] tbody tr').first().click();
    cy.get('[data-testid="person-title"]').should("contain", "John Doe");
  });

  it("advanced search with filters", () => {
    cy.visit("/search/advanced");
    cy.get('[data-testid="filter-given"]').type("Jane");
    cy.get('[data-testid="filter-surname"]').type("Roe");
    cy.get('[data-testid="filter-year-from"]').type("1900");
    cy.get('[data-testid="filter-year-to"]').type("2000");
    cy.get('[data-testid="advanced-search-submit"]').click();
    cy.get('[data-testid="search-results"] tbody tr').its("length").should("be.gte", 1);
  });

  it("index pages are sortable and paginated", () => {
    cy.visit("/index");
    cy.get('[data-testid="index-table"] thead th').contains("Surname").click();
    cy.get('[data-testid="pagination-next"]').click();
    cy.get('[data-testid="pagination-prev"]').click();
  });
});