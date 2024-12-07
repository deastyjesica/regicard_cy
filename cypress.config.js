const { defineConfig } = require("cypress");
module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
    },
    fixturesFolder: 'cypress/fixtures', 
    specPattern: 'cypress/e2e/**/*.spec.js', 
  },
});
