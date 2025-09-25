// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add("login", (role) => {
  cy.visit("/auth/login");
  const users = {
    visitor: { u: "visitor", p: "visitor" },
    friend:  { u: "friend",  p: "friend"  },
    wizard:  { u: "wizard",  p: "wizard"  }
  };
  const { u, p } = users[role];
  cy.get('[data-testid="login-username"]').clear().type(u);
  cy.get('[data-testid="login-password"]').clear().type(p, { log: false });
  cy.get('[data-testid="login-submit"]').click();
  cy.url().should("not.include", "/auth/login");
  cy.get("body").should("have.attr", "data-role", role);
});

Cypress.Commands.add("openPerson", (pid) => {
  cy.visit(`/people/${pid}`);
  cy.get('[data-testid="person-title"]').should("be.visible");
});

Cypress.Commands.add("openFamily", (fid) => {
  cy.visit(`/families/${fid}`);
  cy.get('[data-testid="family-title"]').should("be.visible");
});

Cypress.Commands.add("deselectAll", () => {
  cy.focused().blur();
});