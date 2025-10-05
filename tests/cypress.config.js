const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      config.baseUrl = "http://localhost:2317";
      return config;
    },
  },
});
