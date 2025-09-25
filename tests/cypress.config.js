const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      baseUrl: "http://localhost:8000",
      specPattern: "tests/cypress/e2e/**/*.cy.{js}",
      supportFile: "tests/cypress/support/e2e.js",
      video: false,
      viewportWidth: 1366,
      viewportHeight: 850
    },
  },
});
