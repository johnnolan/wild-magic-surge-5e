# Repository guidance for coding agents

This is a Foundry VTT module for dnd5e. Production TypeScript lives in `scripts/`; fast Jest tests are `scripts/**/*.test.ts`. Browser integration tests are `e2e/**/*.spec.ts` and run against a real, dedicated Foundry world. Do not use Jest mocks to stand in for Foundry behavior in a Playwright spec.

Before changing browser tests, read [e2e/AGENTS.md](e2e/AGENTS.md), [the test context](docs/E2E_TEST_CONTEXT.md), and [the setup guide](docs/BROWSER_TESTING.md). Check `playwright.config.ts`, `e2e/fixtures.ts`, and the relevant `e2e/support/` helper. `docs/E2E_TEST_TODO.md` records a completed expansion plan, not an open task list.

## Test commands

- `yarn test` runs Jest only.
- `yarn typecheck:e2e` checks the browser test TypeScript project.
- `yarn lint:check` checks repository lint rules.
- `yarn test:e2e <spec-file-or--g-filter>` builds and stages the module, starts the owned Foundry server, and runs Playwright. It requires the setup in `docs/BROWSER_TESTING.md`.

For browser test changes, run typecheck, lint, the focused spec, and the full browser suite when the dedicated Foundry environment is available. Report which checks ran and any unavailable prerequisite. Keep the suite on a dedicated world and at one worker unless the shared-world isolation model is changed deliberately.
