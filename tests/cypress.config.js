const { defineConfig } = require("cypress");
const fs = require("fs");

module.exports = defineConfig({
  e2e: {
    video: true,
    screenshotOnRunFailure: true,
    videosFolder: 'cypress/videos',
    screenshotsFolder: 'cypress/screenshots',

    setupNodeEvents(on, config) {
      config.baseUrl = "http://localhost:2317";

      on("after:spec", (spec, results) => {
        if (results && results.video) {
          const hasFailedTests = results.tests.some(test =>
            test.attempts.some(attempt => attempt.state === "failed")
          );

          if (!hasFailedTests) {
            console.log(`🧹 Suppression de la vidéo (aucune erreur): ${results.video}`);
            fs.unlink(results.video, err => {
              if (err) {
                console.error(`Erreur lors de la suppression de ${results.video}:`, err);
              }
            });
          }
        }
      });

      return config;
    },

    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
  },
});
