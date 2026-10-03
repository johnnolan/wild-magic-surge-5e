# Running browser tests

The Playwright suite runs against a dedicated local Foundry VTT world. It does not use a campaign world, and it does not run as part of the ordinary Jest command.

## One-time setup

1. Use the Node version in `.nvmrc` and install dependencies with `yarn install`.
2. Obtain a licensed **Node server** installation of Foundry V14. Choose a build compatible with `module.json` (currently at least `14.367`). The test world also needs dnd5e `6.0.5` or later. Record the exact pair you use when reporting test results.
3. Set these variables in your shell, substituting the actual installation path:

   ```sh
   export FOUNDRY_INSTALL_PATH=/absolute/path/to/FoundryVTT-Node
   export FOUNDRY_E2E_DATA_PATH="$PWD/.foundry-e2e"
   export FOUNDRY_E2E_PORT=31000
   export FOUNDRY_E2E_WORLD_ID=wild-magic-surge-e2e
   export FOUNDRY_E2E_GM_NAME=Gamemaster
   ```

4. Install Playwright's Chromium once: `yarn playwright install chromium`.
5. Run `yarn e2e:setup`. The command creates a marked, dedicated data directory, builds and stages the complete module, then starts Foundry in Setup mode. Open the printed local address. Accept the license if required, install dnd5e, and create a world with the exact ID in `FOUNDRY_E2E_WORLD_ID`. Set the world language to English. Start that world, enable **Wild Magic Surge 5e** in Manage Modules, and create or retain a passwordless GM with the exact name in `FOUNDRY_E2E_GM_NAME`. Stop this setup server with Ctrl-C when finished.

The test data directory must be new or already carry the `.wild-magic-surge-5e-e2e` marker. The scripts refuse to modify an existing unmarked directory. The server uses its own port; Playwright refuses to reuse a server already on that port. Do not put campaign data in this directory. Keep license and account credentials outside the repository.

## Daily use

```sh
yarn test:e2e                 # build, stage, start Foundry, run tests, stop server
yarn test:e2e:headed          # show Chromium while tests run
yarn test:e2e:ui              # Playwright UI mode
yarn playwright test --list   # list browser tests without launching Foundry
yarn typecheck:e2e            # type-check the browser suite
```

To run one case, use `yarn test:e2e settings.spec.ts` or `yarn test:e2e -g "saves a reminder"`. The script builds and stages the module before Playwright starts. Failed tests leave traces in `test-results/playwright/`; inspect one with `yarn playwright show-trace <trace.zip>`. The HTML report is written to `playwright-report/`.

The tests currently use a single GM session and one worker. Each test gets a new browser context. World settings still persist across browser contexts, so tests must restore any values they change. The first cases are a module-load smoke test and a browser test for saving a custom chat reminder. Spell activity cases from [the implementation spec](BROWSER_TESTING_SPEC.md) can be added once the installed dnd5e sheet and activity data are available to inspect.

If startup fails, verify `FOUNDRY_INSTALL_PATH` contains `main.js`, the dedicated data directory contains `Data/systems/dnd5e/system.json` and the named world's `world.json`, and the module is enabled in that world. If login fails, close any other GM browser session for this test world.
