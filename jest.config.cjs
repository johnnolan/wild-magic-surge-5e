/* exported config */
/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  transform: {
    "^.+\\.ts?$": [
      "ts-jest",
      {
        isolatedModules: true,
        diagnostics: {
          exclude: ["**"],
        },
      },
    ],
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
};
