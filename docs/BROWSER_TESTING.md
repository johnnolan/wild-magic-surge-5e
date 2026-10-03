# Running browser tests

The Playwright suite runs against a dedicated local Foundry VTT world. It does not use a campaign world, and it does not run as part of the ordinary Jest command.

## One-time setup

1. Use the Node version in `.nvmrc` and install dependencies with `yarn install`.
2. From your Foundry account's **Purchased Licenses** page, download a V14 build compatible with `module.json` (currently at least `14.367`) and choose **Node.js** as the download type. **Extract the ZIP** into an application folder outside this repository, for example `~/FoundryVTT-Node`. The folder used for `FOUNDRY_INSTALL_PATH` must contain `main.js` directly. If the ZIP creates another enclosing folder, point the variable at that inner folder. Do not put the ZIP itself in the test data directory. You do not need to start Foundry manually: `yarn e2e:setup` starts it for first-time setup, and `yarn test:e2e` starts it for test runs. Foundry V14 needs Node 24; this repository's `.nvmrc` selects it.
3. Set these variables in your shell, substituting the actual **extracted** installation path:

   ```sh
   export FOUNDRY_INSTALL_PATH=/absolute/path/to/FoundryVTT-Node
   export FOUNDRY_E2E_DATA_PATH="$PWD/.foundry-e2e"
   export FOUNDRY_E2E_PORT=31000
   export FOUNDRY_E2E_WORLD_ID=wild-magic-surge-e2e
   export FOUNDRY_E2E_GM_NAME=Gamemaster
   ```

4. Install Playwright's Chromium once: `yarn playwright install chromium`.
5. Run `yarn e2e:setup`. The command creates a marked, dedicated data directory, builds and stages the complete module, then starts the extracted Foundry server in Setup mode. Open the printed local address and complete these UI steps:

   1. Enter your license key and accept the agreement if prompted.
   2. In **Game Systems**, install **Dungeons & Dragons Fifth Edition (dnd5e)**, version `6.0.5` or later. The test scripts do not install the system for you.
   3. In **Game Worlds**, create a new world using dnd5e. Set its **Data Path** (world ID) to the exact value of `FOUNDRY_E2E_WORLD_ID`, and set its language to English.
   4. Launch that world, enable **Wild Magic Surge 5e** in **Manage Modules**, and create or retain a passwordless GM with the exact name in `FOUNDRY_E2E_GM_NAME`.
   5. Stop this setup server with Ctrl-C. Later `yarn test:e2e` runs the same extracted server against this world automatically.

The test data directory must be new or already carry the `.wild-magic-surge-5e-e2e` marker. The scripts refuse to modify an existing unmarked directory. The server uses its own port; Playwright refuses to reuse a server already on that port. Do not put campaign data in this directory. Keep license and account credentials outside the repository.

The launcher checks the Node version used **for Foundry**. It prefers Node 24 or newer on `PATH`, then the `.nvmrc` version installed in `~/.nvm`. Fedora's `/usr/bin/yarn` may itself report Node 22 because its shebang points directly to `/usr/bin/node`; this does not prevent the launcher from using Node 24. If Node 24 is installed elsewhere, set `FOUNDRY_NODE_PATH` to its executable path.

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
