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
   4. Launch that world, enable **Wild Magic Surge 5e** in **Manage Modules**, and create or retain a GM with the exact name in `FOUNDRY_E2E_GM_NAME`. A passwordless GM works by default; if the GM has an access key, set `FOUNDRY_E2E_GM_PASSWORD` in your shell.
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

To run one case, use `yarn test:e2e settings.panels.spec.ts`, `yarn test:e2e surge.standard.spec.ts`, or `yarn test:e2e -g "saves a reminder"`. The script builds and stages the module before Playwright starts. Failed tests leave traces in `test-results/playwright/`; inspect one with `yarn playwright show-trace <trace.zip>`. The HTML report is written to `playwright-report/`.

The suite uses one worker and a logged-in GM. Cases that need to prove what a player sees also create a temporary player account and browser context. A player must be granted ownership of the test actor; the player page is then reloaded so Foundry includes that actor in its world data. The fixture closes that context and deletes the player after the case.

`e2e/support/actors.ts` creates disposable dnd5e characters or NPCs with a named feat and copies a real spell from the installed `dnd5e.spells` SRD pack. Tests choose the spell and slot level they need. `e2e/support/actions.ts` opens the dnd5e sheet, chooses an activity when a spell has more than one, and confirms **Cast Spell** when dnd5e presents a usage dialog. Feature actions use the same sheet path. The selectors are specific to the verified Foundry **14.367** and dnd5e **6.0.5** pair; update the shared helper if a later sheet changes. Spell cases assert slot consumption, and selected cases observe `dnd5e.postUseActivity`, so they exercise the installed system's real activity route.

Specs are grouped by the behavior being checked: panel persistence, spell eligibility, each roll mode, chat content and audience, tables, Tides, resources, hooks, macros, and optional effects. Keep a test's setup, sheet action, and observable outcome in that order. Add a focused helper only when it makes several tests clearer; keep Foundry document shapes and sheet selectors under `e2e/support/`.

Audience checks use `e2e/support/observations.ts` in both browser sessions. Foundry may retain a private message document in a player's collection while hiding its content; the reader includes only messages for which Foundry reports `visible` and `isContentVisible`. The actor helper's WMS control appears in Foundry's expanded sheet-header menu, which is outside the actor-sheet DOM; its test finds the visible **WMS** menu entry after opening that menu.

The Light cantrip's real dnd5e 6.0.5 `postUseActivity` payload sets `consumption.spellSlot=true` even though no spell slot changes. The activity observer calls this `spellSlotFlag` to distinguish the hook field from actual slot expenditure. The separate cantrip-option case checks whether the module responds to that activity.

`e2e/support/rolls.ts` can temporarily set Foundry's `CONFIG.Dice.randomUniform` for a known die face. Descending and chaotic tests use this with a real `Roll` and restore the original function in `finally`. This makes the rare roll-of-one path bounded without replacing the module's outcome logic. Other deterministic recipes use valid formulas and comparison settings. A test must wait for its actor or chat outcome before the temporary dice source is restored.

Cases that use the `world` fixture record original world and selected core settings, created actor, table, macro, scene, and combat IDs, and starting chat-message IDs. Its teardown restores settings and deletes only tracked documents and new messages, including after ordinary assertion failures. The separate player fixture closes its browser context before deleting the player. Keep tests on the dedicated world and one worker; a timeout that closes the browser before teardown may require manual cleanup. `module.spec.ts` checks for leftover `E2E` actors and players. The [expansion checklist](E2E_TEST_TODO.md) tracks scenario coverage.

At the Phase 1 baseline, `yarn test` passed 250 tests, `yarn typecheck:e2e`, `yarn lint:check`, and `yarn build` passed, and the two original browser cases passed. `yarn typecheck:test` was already over its recorded diagnostic limit: 200 diagnostics against a limit of 145. This is separate from the new E2E TypeScript project.

On Foundry **14.367** with dnd5e **6.0.5**, the completed Phase 2 suite passed **42 browser cases twice** without resetting the world. The Sequencer/JB2A animation assertion was skipped because those optional modules are absent. The missing-dependency fallback passed, and the suite's last case confirmed that its temporary documents and chat messages were removed.

## Live contract notes

| Finding in Foundry 14.367 / dnd5e 6.0.5 | Guard |
| --- | --- |
| Roll Type displays **Standard**, and the registered defaults for Roll Type and table behavior must use the `DEFAULT` choice key. Earlier registrations used `Default`, which was not a valid choice key. | `documentation.contract.spec.ts` |
| The default feature names are `Wild Magic Surge`, `Tides of Chaos`, and `Path of Wild Magic`. | `documentation.contract.spec.ts`, `settings.panels.spec.ts`, `barbarian.spec.ts` |
| The module's optional Sorcerer spell filter matches the spell **name**; it does not inspect dnd5e's Source Class field. The player setup guide now says this explicitly. | `spell.eligibility.spec.ts` |
| dnd5e reports remaining Tides uses in `uses.value` and spent uses in `uses.spent`. The guide keeps the setup values `max: 1` and `spent: 0`. | `tides.spec.ts` |
| Public hook names and payloads match `HOOKS.md`; the selected-token console example now uses the V14 actor ID path. | `hooks.spec.ts` |
| The real Light cantrip and Rage feat both report `consumption.spellSlot=true` in `postUseActivity`, while neither spends a spell slot. The cantrip option works through the existing entry point. The Barbarian player button needed its table type in the chat markup so it could select the Path table. | `spell.eligibility.spec.ts`, `barbarian.spec.ts` |

The completed Phase 3 suite passed **46 browser cases twice** on Foundry **14.367.0** and dnd5e **6.0.5**, without resetting the dedicated world. The Sequencer/JB2A animation case remained the sole skip; cleanup passed at the end of both runs. Jest passed **251 tests**, and `yarn typecheck:e2e`, `yarn lint:check`, and `yarn build` passed.

If startup fails, verify `FOUNDRY_INSTALL_PATH` contains `main.js`, the dedicated data directory contains `Data/systems/dnd5e/system.json` and the named world's `world.json`, and the module is enabled in that world. If login fails, check the GM name and access key, then close any other GM browser session for this test world.
