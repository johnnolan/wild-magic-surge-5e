/* exported */

const config = {
  setupFiles: ["<rootDir>/test-env.js"],
  reporters: ["default", "jest-junit"],
  resetMocks: true,
  restoreMocks: true,
  transform: {
    "^.+\\.[t|j]sx?$": "babel-jest",
  },
  testEnvironment: "jsdom",
  collectCoverage: true,
  collectCoverageFrom: ["!**/node_modules/**", "scripts/**/*.js"],
};
