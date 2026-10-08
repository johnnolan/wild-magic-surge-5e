# Testing changes

The repository has two test layers. Jest covers TypeScript logic quickly with Foundry test fixtures. Playwright exercises the built module in a real Foundry and dnd5e world. The commands below are defined in `package.json`; use [BROWSER_TESTING.md](BROWSER_TESTING.md) for the browser environment and [E2E_TEST_CONTEXT.md](E2E_TEST_CONTEXT.md) when writing a spec.

| Change | Checks to run |
| --- | --- |
| Documentation only | Check local links and commands against the current files. No runtime test is required. |
| Production logic or settings | `yarn lint:check`, `yarn typecheck`, `yarn test`, `yarn build`; run the closest Jest test while iterating. |
| Browser specs or Foundry behavior | `yarn typecheck:e2e`, `yarn lint:check`, a focused `yarn test:e2e <spec-file-or--g-filter>`, then the full `yarn test:e2e` suite when the dedicated world is available. Also run the production checks above if production code changed. |
| Build or packaging | `yarn build`; inspect the generated module assets. Run the relevant unit or browser checks if behavior changed. |

`yarn test` runs Jest only. `yarn test:coverage` is the CI Jest command and enforces the configured coverage threshold. `yarn typecheck` and `yarn typecheck:test` compare TypeScript diagnostics with recorded baselines in `scripts/typecheck.js`; they can exit successfully while reporting existing diagnostics. Do not raise a baseline to hide a new diagnostic. `yarn typecheck:e2e` is a separate, direct TypeScript check of the browser project.

Typechecks use TypeScript 7's `tsc` executable, installed through the `@typescript/native` npm alias. The `typescript` dependency aliases `@typescript/typescript6` to provide the TypeScript 6 API required by typescript-eslint. Keep these side by side until typescript-eslint supports the native compiler API; installing TypeScript 7 directly as `typescript` breaks ESLint.

`yarn test:e2e` builds and stages the module, starts the owned Foundry server, runs Chromium with one worker, and stops that server. It needs a licensed install and dedicated test world. Run a focused spec before the full suite; browser fixtures share one world database, so keep tests serial and verify teardown. The ordinary PR workflow runs lint, production and E2E typechecks, Jest coverage, and build; it does not start Foundry or run Playwright.

When reporting results, name the commands that ran, any prerequisite that prevented a browser run, and the Foundry/dnd5e versions used for a browser run. Do not treat historical pass counts in [BROWSER_TESTING_HISTORY.md](BROWSER_TESTING_HISTORY.md) as the current expected count.
