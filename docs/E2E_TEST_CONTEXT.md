# Playwright suite context

This file explains how to extend the suite. [BROWSER_TESTING.md](BROWSER_TESTING.md) covers the licensed Foundry install, dedicated world, environment variables, and run commands. Live configuration in `playwright.config.ts`, `package.json`, and the helpers takes precedence if a detail here becomes stale.

## Test boundary

The browser suite drives the built module in Foundry V14 with the installed dnd5e system, Chromium, one worker, and no retries. `package.json` builds and stages the module before Playwright; `scripts/e2e/` validates a marked test-data directory and starts Foundry. `e2e/fixtures.ts` logs in a GM, checks that dnd5e and this module are active, and supplies an optional separate player context. The last fully recorded pass used Foundry 14.367.0 and dnd5e 6.0.5. Verify current versions when debugging selectors or document shapes.

Use Jest for pure functions, parsing, malformed input, and detailed edge-case matrices. Use Playwright when the rule depends on the real Foundry/dnd5e activity route, settings UI, chat audience, persisted documents, or public hooks.

## Ownership and flow

1. Import `test` and `expect` from `./fixtures`. Most scenarios use `{ gmPage, world }`; privacy scenarios also use `{ player }`.
2. Create the smallest required actor or other document through `support/` and immediately call the matching `world.track*` method. Give documents a unique `E2E ` name. A helper that fails after creating a document should delete it before throwing.
3. Change settings with `world.setSetting` or `world.setCoreSetting`. For a setting saved through a real panel, call `world.rememberSetting(key)` before using the UI. `world` snapshots starting chat IDs.
4. Capture relevant before state, act through the dnd5e sheet or other real UI path, then assert the action completed and poll for the observable module outcome. A negative case must still prove its action happened.
5. The `world` fixture restores settings and deletes tracked actors, tables, macros, scenes, combats, and newly created chat messages in teardown. The `player` fixture closes its context and deletes its user. Keep the suite serial because these objects and settings are shared by every browser session.

`zz.cleanup.spec.ts` checks for leftover `E2E ` documents and messages after other specs. A hard timeout can close the page before teardown; inspect leftovers carefully and remove only test-created state.

## Helper map

| Need | Existing file |
| --- | --- |
| GM/player sessions, ready checks, per-test world | `e2e/fixtures.ts` |
| Track documents, settings, and chat for cleanup | `e2e/support/cleanup.ts` |
| Real character/NPC, feat, SRD spell, spell slots, player ownership | `e2e/support/actors.ts` |
| dnd5e sheet, spell activity chooser/usage dialog, feature use | `e2e/support/actions.ts` |
| Actor flags/resources, slots, visible chat, before/after messages | `e2e/support/observations.ts` |
| Guaranteed Standard, Incremental, and Spell Level outcomes | `e2e/support/recipes.ts` |
| Temporary Foundry dice face for bounded rare-result cases | `e2e/support/rolls.ts` |
| Scenes, tokens, combats, tables, feats, hooks, activity events | Corresponding files in `e2e/support/` |
| Registered settings panel and setting reads | `e2e/foundry.ts` |

Extend a shared helper when several specs need the same domain action. Keep version-sensitive document data and selectors there. The caster helper copies a real spell from `dnd5e.spells` and finds a usable activity. `castSpellFromSheet` opens the actor sheet, selects the activity if needed, and confirms the usage dialog. Assertions about slot spending or `dnd5e.postUseActivity` establish that this real route ran.

## Determinism and observations

- `configureStandardOutcome(world, "surge")` uses `1d20` and equality against every face from 1 to 20; `"no surge"` compares against 0. Foundry still rolls the die.
- `configureSpellLevelOutcome` uses `< 21` for surge or `> 20` for no surge on a level-one spell.
- `configureIncrementalIncrease` uses `1d20+20` so an initial threshold of 1 cannot surge. Tests that force a later surge set the stored threshold to 20 with the actor helper.
- `withFoundryRandomValue` temporarily replaces `CONFIG.Dice.randomUniform` for bounded die-face cases, then restores it in `finally`. Wait for the roll and persisted result inside its callback.
- `readChatMessages` includes only messages Foundry marks both `visible` and `isContentVisible`. Use `messagesAfter(before, after)` and a unique marker or actor ID to identify output. For private chat, compare GM and player sessions; raw `game.messages.contents` alone does not establish visibility.

Use role, label, or name locators where possible. For asynchronous Foundry updates use `expect.poll`, a visible locator, or a targeted `waitForFunction`; avoid arbitrary delays. The verified dnd5e 6.0.5 Light cantrip and Rage feature report `consumption.spellSlot=true` in their activity event even though they spend no spell slot, so distinguish that event field from actual slot expenditure. See the live contract notes in `BROWSER_TESTING.md` for other version-specific findings.

## Review and verification

For a new behavior, compare the matching production code, nearby Jest tests, and closest browser spec before writing assertions. Run `yarn typecheck:e2e`, `yarn lint:check`, the focused `yarn test:e2e <spec>`, and the full `yarn test:e2e` in the dedicated world. Check that the focused spec passes alone and that a second full run leaves the world clean. If the Foundry install or world is unavailable, report that and still run checks that do not require it. Historical counts in `BROWSER_TESTING.md` are not the current expected test count.
