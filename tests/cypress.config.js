const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      baseUrl: "http://localhost:8000",
      specPattern: "cypress/e2e/**/*.cy.{js}",
      supportFile: "cypress/support/e2e.js",
      video: false,
      viewportWidth: 1366,
      viewportHeight: 850
    },
  },
});
