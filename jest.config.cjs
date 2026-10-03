/* exported config */
/** @type {import('jest').Config} */
module.exports = {
  testMatch: ["<rootDir>/scripts/**/*.test.ts"],
  transform: {
    "^.+\\.tsx?$": "babel-jest",
  },
  reporters: ["default", "jest-junit"],
  coverageThreshold: {
    global: {
      lines: 80,
    },
  },
  collectCoverage: true,
  collectCoverageFrom: [
    "!**/node_modules/**",
    "scripts/**/*.ts",
    "!scripts/panels/*.ts",
    "!scripts/**/*.test.ts",
    "!scripts/**/*.d.ts",
    "!scripts/ModuleSettings.ts",
    "!scripts/module.ts",
    "!scripts/Logger.ts",
    "!scripts/macros/**/*.*",
  ],
  testEnvironment: "jest-environment-jsdom",
  testEnvironmentOptions: {
    url: "http://localhost",
  },
  setupFiles: ["./jest.setup.cjs"],
};
