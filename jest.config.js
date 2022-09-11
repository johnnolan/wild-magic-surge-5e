/* exported config */

export default {
  preset: "ts-jest",
  globals: {
    "ts-jest": {
      isolatedModules: true,
      diagnostics: {
        exclude: ["**"],
      },
    },
  },
  transform: { "^.+\\.ts?$": "ts-jest" },
  reporters: ["default", "jest-junit"],
  coverageThreshold: {
    global: {
      lines: 90,
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
