const js = require("@eslint/js");
const tsParser = require("@typescript-eslint/parser");
const tsPlugin = require("@typescript-eslint/eslint-plugin");
const prettier = require("eslint-plugin-prettier");
const prettierConfig = require("eslint-config-prettier");
const foundryGlobals =
  require("@typhonjs-fvtt/eslint-config-foundry.js/latest").globals;

const productionFiles = ["scripts/**/*.ts"];

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
  ...tsPlugin.configs["flat/recommended"].map((config) => ({
    ...config,
    files: productionFiles,
  })),
  {
    files: productionFiles,
    languageOptions: {
      parser: tsParser,
      parserOptions: { ecmaVersion: "latest", sourceType: "module" },
      globals: foundryGlobals,
    },
    plugins: { prettier },
    rules: {
      ...prettierConfig.rules,
      "prettier/prettier": "error",
    },
  },
];
