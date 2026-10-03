# Browser testing implementation spec

## Goal

Add a small Playwright suite that drives this module inside a real Foundry VTT world using the dnd5e system. Keep the existing Jest suite as the fast unit test layer. The browser suite should prove that the built module loads, its settings work, and a spell use reaches the module's chat behavior. A contributor should be able to add a test by copying one short, readable example.

This is an implementation plan, not a claim that browser tests are already installed or passing.

## Useful working examples

- [DCC's browser testing guide](https://github.com/foundryvtt-dcc/dcc/blob/main/docs/dev/TESTING.md#browser-tests-playwright) shows a real Foundry server, a dedicated world, Playwright fixtures, and tests that create their own documents. Use its isolation pattern, adapting it to this module and dnd5e.
- [The Foundry Playwright helper library](https://github.com/TheFehr/foundry-playwright) offers world setup, dnd5e adapters, and V14 support. Evaluate it against the **exact** Foundry and dnd5e versions chosen below before adopting it. Its example Docker command mounts a module directory, but this repository's `module.json` expects `dist/module.js` plus templates and other assets at the module root; mounting `dist/` alone would be insufficient.
- [A Foundry module template with Playwright](https://github.com/rune-goblin/runegoblin-foundrytemplate) documents an opt-in local browser suite against headless Foundry. It is a useful example of keeping licensed server tests separate from ordinary CI.
- [Playwright's test guidance](https://playwright.dev/docs/best-practices) explains user-visible assertions, isolated tests, locators, and retrying assertions. Follow it when writing the tests below.

Use plain `@playwright/test` as the initial runner. Add a Foundry-specific helper dependency only if a spike proves it works with this project's V14 build, dnd5e version, module layout, and local license setup. This keeps the first suite small and makes its setup visible to future maintainers.

## Repository facts that shape the suite

| Fact | Source | Consequence |
| --- | --- | --- |
| The module currently requires Foundry `14.367` or later in V14 and dnd5e `6.0.5` or later. | `module.json` | Pin one tested Foundry/dnd5e pair in the browser test instructions. Do not assume a helper library's sample V14 build is compatible. |
| `yarn build` emits `dist/module.js`; the manifest also references `templates/settings.html`, languages, and a macro pack. | `build.js`, `module.json` | Stage a **complete module directory**, then enable that directory in a test world. Do not use the hard-coded remote `build:dev` copy target. |
| Jest uses jsdom and Foundry mocks. | `jest.config.cjs`, `scripts/test/FoundryFixtures.ts` | Browser tests need their own runner, config, and TypeScript scope. They do not contribute to the Jest coverage threshold. |
| The module listens for `dnd5e.postUseActivity` and only proceeds when `consumption.spellSlot` is true. | `scripts/module.ts`, `scripts/utils/Dnd5eActivity.ts` | The spell test must use an actual dnd5e activity that consumes a slot. Calling `Hooks.callAll` as the only test action would miss the UI-to-system path. |
| A character needs a **feat** named `Wild Magic Surge` (unless the world setting changes that name); the spell must be level 1 or higher by default. | `scripts/utils/SpellParser.ts` | Seed these exact document types and names in the test fixture. A generic actor or cantrip will not exercise the intended path. |
| The module has ApplicationV2 settings panels and a custom settings template. | `scripts/panels/SettingsPanelBase.ts`, `templates/settings.html` | Cover one panel through the browser. Add explicit label/input associations if needed so Playwright can use `getByLabel`. |

## Deliverable file layout

```text
playwright.config.ts
tsconfig.e2e.json
e2e/
  fixtures.ts                 # logged-in GM page and per-test cleanup
  foundry.ts                  # tiny typed helpers for seeding and reading game state
  settings.spec.ts
  spell-use.spec.ts
scripts/e2e/
  stage-module.mjs            # build complete module folder in private test data
  start-foundry.mjs           # start owned server and wait for readiness
docs/BROWSER_TESTING.md       # one-time setup and day-to-day commands
```

Names may change if a simpler layout emerges. Keep test scenarios in `*.spec.ts`; helpers should describe domain actions such as `createWildMagicCaster` and `castPreparedSpell`, not wrap every Playwright call. Add `test:e2e`, `test:e2e:headed`, and `test:e2e:ui` scripts to `package.json`. Update Jest's discovery so `e2e/**/*.spec.ts` never runs under Jest, and update ESLint/TypeScript scopes deliberately instead of weakening existing checks.

## Implementation steps

### 1. Record the baseline

1. Run `yarn test`, `yarn typecheck:test`, and `yarn build`. Record any pre-existing failures.
2. Inspect `scripts/MagicSurgeCheck.test.ts`, `scripts/utils/Dnd5eActivity.test.ts`, `scripts/utils/SpellParser.test.ts`, `scripts/Chat.test.ts`, and `scripts/panels/SettingsPanelBase.test.ts`. Extract only observable behavior for browser cases; do not copy Jest mocks into Playwright.
3. Choose and record the exact local Foundry V14 build (at least `14.367`) and dnd5e version (at least `6.0.5`). Verify this pair starts and the module can be enabled before authoring scenario assertions. Foundry's [installation guide](https://foundryvtt.com/article/installation/) describes running its Node server, and its [CLI](https://github.com/foundryvtt/foundryvtt-cli) has a `launch` command.

### 2. Add the Playwright runner

1. Add `@playwright/test` as a pinned dev dependency with Yarn; install Chromium using the Playwright command documented for the installed version. Do not change the existing Jest scripts.
2. Create `playwright.config.ts` with `testDir: "./e2e"`, Chromium only, `workers: 1`, a local `baseURL`, a useful timeout for Foundry startup, and traces on first retry or failure. Put reports and traces in ignored directories.
3. Add `tsconfig.e2e.json` for only the config, helpers, and specs. Keep browser tests out of `tsconfig.test.json` and Jest's test discovery. Add the new files to linting.
4. Verify `yarn playwright test --list` lists only browser specs. `yarn test` must still list only unit tests.

### 3. Make an owned Foundry environment

1. Use a dedicated local data directory and port, never a personal campaign world or the existing remote `build:dev` destination. Require `FOUNDRY_INSTALL_PATH`, `FOUNDRY_E2E_DATA_PATH`, and optionally `FOUNDRY_E2E_PORT`; validate paths before writing. Refuse to run if the data directory is not marked as an E2E directory or the chosen port is occupied by another process.
2. In `stage-module.mjs`, run the normal build and stage `module.json`, `dist/`, `templates/`, `languages/`, `packs/`, and any referenced assets under `Data/modules/wild-magic-surge-5e/`. Verify every manifest path exists in that staged folder. The source manifest has release-time placeholder strings; generate a test-only manifest from it if Foundry rejects those values, using the package version and valid local metadata. Do not alter release metadata solely for E2E tests.
3. One-time setup may require a licensed Foundry install, license acceptance, dnd5e installation, and creation of a world with one GM. Document these manual steps precisely in `docs/BROWSER_TESTING.md`. After that, `yarn test:e2e` should build, stage, start the owned server, enter the dedicated world, run specs, and stop only the process it started. A failed setup should say exactly which prerequisite is missing.
4. Use a fresh or restorable test world. If a world snapshot is used, restore it before every test or test file. If using per-test documents instead, create them with a unique test prefix and delete them in `finally`/fixture teardown. Reset changed world settings and chat messages as well. Browser context isolation alone does **not** reset Foundry's shared world database.
5. Start with a single GM session and one worker. Add a player session later for the socket path. Keep licenses and credentials in private environment variables or local ignored files; never log or commit them.

The [Foundry installation guide](https://foundryvtt.com/article/installation/) and [official CLI](https://github.com/foundryvtt/foundryvtt-cli) are the sources for the local server start command. A container is another valid implementation if it is already available locally; [felddy's image](https://github.com/felddy/foundryvtt-docker) documents its license and download inputs. Do not make CI depend on a container or licensed download until the local suite passes.

### 4. Build a small fixture layer

1. The fixture logs in as GM, waits for the game to finish loading, and checks `game.modules.get("wild-magic-surge-5e")?.active` before running scenario steps. Fail with a clear message if the module, system, or world is wrong.
2. Provide small helpers to create/delete a dnd5e character, a `Wild Magic Surge` feat, a level-1 spell with a working activity and available spell slot, and to read only the state needed for an assertion. Run those helpers in the real page using Foundry's public client API; validate the created documents before proceeding. Keep version-specific dnd5e data shape in one helper.
3. Use the **UI** for the action being tested: click settings controls for settings cases and use the actor sheet's spell activity for spell cases. `page.evaluate` is suitable for fixture setup and narrow persisted-state checks, not for faking the behavior under test.
4. Prefer role/name/label locators. `templates/settings.html` currently has text labels without `for`/`id`; connect them if needed so the UI is accessible and `getByLabel` works. Use a single narrow selector constant for a Foundry/dnd5e control when no semantic locator exists. Never depend on long CSS chains or nth-child selectors.
5. Wait for a visible or persisted state change with Playwright assertions. Avoid fixed sleeps, swallowed errors, global variables, and assertions about internal mocks.

### 5. Add the starter scenarios

Implement in this order. Each spec title should read like an outcome a person expects. Each test should show **setup → action → outcome** in that order, with one main behavior. Use the listed Jest suites to understand the rule, then prove it in Foundry.

| Browser test | Setup and action | Assert | Unit reference |
| --- | --- | --- | --- |
| `shows the module settings and saves a chat message` | Open Module Settings as GM, open **Chat Message Options**, enter a unique reminder message, save, then reopen the panel. | The saved text is visible after reopening and the registered world setting has that value. | `SettingsPanelBase.test.ts`, `Helpers.test.ts` |
| `reminds the table after a Wild Magic character casts a level-one spell` | Create a character with the named feat and a usable level-1 spell. Turn **Automate Wild Magic Surge** off, then cast through the dnd5e actor sheet using a spell slot. | The slot is consumed and exactly one new module reminder appears in chat with the configured text. | `Dnd5eActivity.test.ts`, `SpellParser.test.ts`, `MagicSurgeCheck.test.ts`, `Chat.test.ts` |
| `does not send a reminder for a character without the feat` | Create the same usable caster and spell without the feat; use the same settings and cast through the sheet. | The slot is consumed, and the module reminder count stays at its pre-cast value. | `SpellParser.test.ts`, `SurgeDetails.test.ts` |
| `announces a surge when the roll matches the configured result` | Give the character the feat. Enable automatic checking and set Standard mode with `1d20`, comparison `=`, and target list `1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20`; cast through the sheet. | The module's surge chat message appears and `hassurged` is true on that actor. Reset these settings afterward. The complete target list removes randomness while still using Foundry's real roll. | `MagicSurgeCheck.test.ts`, `Chat.test.ts` |

If the installed dnd5e version cannot use the proposed seeded spell activity, inspect its live data model and sheet once, fix the shared fixture, and document the chosen activity data. Do not replace the browser action with a direct module method call to make the test pass. If the final surge case reveals a product defect, keep a clear failing test and report the defect separately from setup failures.

### 6. Make the suite maintainable

- Keep each spec focused and short. Use descriptive variable names such as `caster`, `spellSlotBefore`, and `surgeMessages`; avoid abbreviations and scenario names made from implementation terms.
- Use helpers only when they remove meaningful repetition. A reader should understand the test without opening several helper files.
- Aim for this readable shape (illustrative names, not a ready-made API): create the caster; record the current spell slot and matching chat count; cast the spell through the sheet; assert one fewer slot and one more matching message. Keep fixture creation and cleanup in the fixture, and keep these four scenario steps visible in the spec.
- Include clear failure messages for missing game readiness, module enablement, activity setup, and fixture cleanup.
- On failure, retain a Playwright trace and screenshot. Document `yarn playwright show-trace <path>` in the contributor guide.
- Run every starter spec alone and as part of the full suite, twice in different orders, to prove tests do not depend on prior world state. Repeat each once after restarting Foundry to catch persistence issues.
- Keep CI's existing Jest job unchanged initially. After the local suite is reliable, add a separate, explicitly configured browser job only where Foundry licensing and download credentials are available. Never make an unconfigured PR job fail because a licensed server is absent.

## Completion criteria

The implementing agent is done when `yarn test`, `yarn typecheck:test`, `yarn build`, linting, and `yarn test:e2e` pass in the documented local environment; all four starter specs pass independently and together; the test world is left clean; traces are available for failures; and `docs/BROWSER_TESTING.md` lets a new contributor run one test without guessing the install path, port, world, module build, or login steps. Report the exact Foundry/dnd5e versions tested and any unsupported environment or remaining product failure.
