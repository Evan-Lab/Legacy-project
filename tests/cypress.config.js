const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    video: true,
    screenshotOnRunFailure: true,
    videosFolder: 'cypress/videos',
    screenshotsFolder: 'cypress/screenshots',
    setupNodeEvents(on, config) {
      config.baseUrl = "http://localhost:2317";
      return config;
    },
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
  },
});