# Contributing to Wild Magic Surge 5e

Thanks for helping improve the module. Use the [issue templates](https://github.com/johnnolan/wild-magic-surge-5e/issues/new/choose) for bugs and feature requests, or open a pull request with a focused change.

## Get started

1. Fork and clone the repository. Use the Node version in `.nvmrc` and install dependencies with `yarn install --frozen-lockfile`.
2. Read [the architecture map](docs/ARCHITECTURE.md) for the runtime path you are changing. The [testing guide](docs/TESTING.md) maps changes to checks. If you use a coding agent, start with [AGENTS.md](AGENTS.md); browser tests have [additional rules](e2e/AGENTS.md).
3. Make the smallest change that solves the issue. Production TypeScript lives in `scripts/`, with nearby `*.test.ts` Jest tests. Foundry browser tests live in `e2e/`.
4. Run the checks relevant to your change. For a typical code change, start with:

   ```sh
   yarn lint:check
   yarn typecheck
   yarn test
   yarn build
   ```

   `yarn typecheck` permits a recorded production diagnostic baseline; a zero exit code does not mean TypeScript reported no diagnostics. See [the testing guide](docs/TESTING.md) for details. The old `yarn jshint` command is no longer defined.

## Changes that need Foundry

Changes to spell or feature use, settings panels, chat visibility, persisted documents, public hooks, or other Foundry behavior may need a real browser test. Use the licensed, dedicated test world described in [the browser setup guide](docs/BROWSER_TESTING.md). Run `yarn typecheck:e2e`, `yarn lint:check`, a focused `yarn test:e2e <spec-file>`, and the full `yarn test:e2e` suite when that environment is available. The browser suite is separate from `yarn test` and is not run in the ordinary PR workflow.

If you cannot run Foundry locally, run the available checks and say which browser checks were not run. Do not run the suite against a campaign world.

## Open a pull request

Describe the user-visible behavior or bug, the files or paths affected, and the checks you ran. Include the Foundry and dnd5e versions for browser-tested behavior. Add or update player-facing documentation when setup or behavior changes; [README.md](README.md) links to the existing setup guides. If a design decision will be hard to infer from the code later, record it under [docs/decisions/](docs/decisions/README.md).

Please follow the [Code of Conduct](CODE_OF_CONDUCT.md). Translations are managed through [Weblate](https://weblate.foundryvtt-hub.com/engage/wild-magic-surge-5e/).
