const js = require("@eslint/js");
const tsParser = require("@typescript-eslint/parser");
const tsPlugin = require("@typescript-eslint/eslint-plugin");
const prettier = require("eslint-plugin-prettier");
const prettierConfig = require("eslint-config-prettier");
const foundryGlobals =
  require("@typhonjs-fvtt/eslint-config-foundry.js/latest").globals;

const productionFiles = ["scripts/**/*.ts", "e2e/**/*.ts", "playwright.config.ts"];
const e2eRuntimeFiles = ["scripts/e2e/**/*.mjs"];

module.exports = [
  {
    ignores: [
      "**/node_modules/**",
      "coverage/**",
      "dist/**",
      "macros/**",
      "MockData/**",
      "__mocks__/**",
      "scripts/**/*.test.ts",
      "scripts/test/**",
      "test-results/**",
    ],
  },
  { ...js.configs.recommended, files: productionFiles },
  { ...js.configs.recommended, files: e2eRuntimeFiles },
  ...tsPlugin.configs["flat/recommended"].map((config) => ({
    ...config,
    files: productionFiles,
  })),
  {
    files: productionFiles,
    languageOptions: {
      parser: tsParser,
      parserOptions: { ecmaVersion: "latest", sourceType: "module" },
      globals: { ...foundryGlobals, process: "readonly" },
    },
    plugins: { prettier },
    rules: {
      ...prettierConfig.rules,
      "prettier/prettier": "error",
    },
  },
  {
    files: e2eRuntimeFiles,
    languageOptions: {
      globals: { process: "readonly", console: "readonly" },
    },
    plugins: { prettier },
    rules: {
      ...prettierConfig.rules,
      "prettier/prettier": "error",
    },
  },
];
