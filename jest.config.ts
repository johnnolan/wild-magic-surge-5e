/* exported config */

const config = {
  reporters: ["default", "jest-junit"],
  coverageThreshold: {
    global: {
      lines: 90,
    },
  },
  collectCoverage: true,
  collectCoverageFrom: [
    "!**/node_modules/**",
    "scripts/**/*.js",
    "!scripts/panels/*.js",
    "!scripts/**/*.test.js",
    "!scripts/ModuleSettings.js",
    "!scripts/module.js",
  ],
};

module.exports = config;
