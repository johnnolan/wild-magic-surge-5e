# Foundry V14 Migration Checklist

Target: Foundry V14 with a minimum of 14.367. The manifest remains verified at 14.367; V14.368 is the latest stable release but has not been smoke-tested here. The current D&D5E release is 6.0.5, which requires Foundry 14.367. The newest available Foundry type snapshot is `14.366.0-beta.20261001000223`, one patch behind the retained verified build and two behind V14.368.

## Compatibility and Tooling

- [ ] Back up user data and test V14 in a separate installation/user-data directory before switching the live environment. V14 cannot be installed through Foundry's in-app updater from V13. See the [V14.359 compatibility notes](https://foundryvtt.com/releases/14.359).
- [ ] Update `@league-of-foundry-developers/foundry-vtt-types` from the V13.346 beta to a V14 version matching the chosen target. The package is pinned to `14.366.0-beta.20261001000223`; the deep `RoundData` import has been removed, `updateCombat` uses the public inferred hook type, and the D&D5E activity hook has a module-owned augmentation. Production type-checking still reports 425 project diagnostics. Jest passes (158 tests) and the build passes; lint is blocked because ESLint 10 requires flat config while the repository has legacy config, and the installed typescript-eslint also rejects TypeScript 7. See [`package.json`](../package.json) and [`tsconfig.json`](../tsconfig.json).
- [ ] Reconcile the module's Foundry compatibility range with the release target. The manifest now says minimum 14.367, verified 14.367, maximum 14; V13 support was removed because latest D&D5E requires V14. `package.json` already declares `"type": "module"`, and `module.json` now uses the V14-required boolean type for `library`. The manifest parses and its compatibility/library fields match the V14 package declarations, but no standalone official JSON-schema validator or Foundry runtime is available here. See [`module.json`](../module.json) and the [V14.355 package development notes](https://foundryvtt.com/releases/14.355).
- [ ] Revisit the D&D5E compatibility declaration against the V14-compatible system release. D&D5E 6.0.5 is the current release and requires Foundry 14.367. The manifest now requires D&D5E 6.0.5 and leaves its `verified` value unset pending an actual Foundry smoke test. The `dnd5e.postUseActivity` handler now uses the Activity's `item` and `consumption.spellSlot` fields and has typed arguments matching the 6.0.5 hook source. See [`module.json`](../module.json), [`scripts/module.ts`](../scripts/module.ts), and the [V14.356 testing notes](https://foundryvtt.com/releases/14.356).

## API and UI Refactors

- [ ] Migrate the five settings panels that extend legacy `FormApplication` to `ApplicationV2` with `HandlebarsApplicationMixin`, or document why they must remain V1. Preserve their form submission, dimensions, close behavior, setting values, and menu registration. `ActorHelperPanel` already uses the V2 pattern and can serve as a local example. See [`scripts/panels/`](../scripts/panels/) and [V14 pop-out application notes](https://foundryvtt.com/releases/14.349/#release-highlights).
- [ ] Verify the chat button integration against V14's chat rendering hooks. `scripts/module.ts` listens to `renderChatMessage` and assumes a jQuery-like `html.find()` result; test whether that hook and markup behave as expected, and use the supported `renderChatMessageHTML` hook/DOM event handling if needed. Check button behavior on newly rendered and re-rendered messages. See [`scripts/module.ts`](../scripts/module.ts) and the [V14.364 API notes](https://foundryvtt.com/releases/14.364).
- [ ] Migrate outgoing chat visibility settings from the legacy roll-mode model to V14 Chat Message Visibility Modes, preserving public, GM-whisper, and blind-message behavior. The V14 notes retain backwards compatibility for old roll modes until V16, so this is a forward-compatibility refactor rather than a V14 hard blocker. Cover both generated chat messages and the example macro that sets `blind`/`whisper`. See [`scripts/Chat.ts`](../scripts/Chat.ts), [`scripts/macros/custom-message.js`](../scripts/macros/custom-message.js), and the [V14.355 breaking changes](https://foundryvtt.com/releases/14.355).
- [ ] Audit the example macros for legacy Application V1 usage. In particular, migrate `new Dialog(...)` in `scripts/macros/dialog.js` to the V2 dialog API if V1 dialogs are no longer supported in the chosen compatibility range; test the macro pack in a clean V14 world. See [`scripts/macros/dialog.js`](../scripts/macros/dialog.js) and the [V14.349 ApplicationV2 notes](https://foundryvtt.com/releases/14.349/#release-highlights).

## Validation

- [ ] Test a clean V14 install and an upgraded world with the supported D&D5E version. Confirm settings persist, the existing `Migrate()` conversion still works, and no settings are silently reset during the major-version transition.
- [ ] Exercise the main workflows as both GM and player: spell activity detection, socket-based surge checks, roll-table output, whisper/blind visibility, combat-round checks, helper/settings dialogs, and every shipped example macro. Run the automated suite, build, and lint against V14 types; update Foundry mocks where they encode V13-only behavior.
- [ ] If V13 remains in the manifest minimum, run the same smoke tests on V13.346 as well as the chosen V14 target; otherwise raise the minimum to V14 and state that support policy clearly.

## Not Currently Indicated by This Codebase

The source scan found no use of MeasuredTemplate documents, TinyMCE, custom Active Effect schemas, or custom canvas/Scene Level APIs. Those prominent V14 changes do not appear to require a module-specific migration unless new code or user-facing content depends on them.

## Release Note References

- [V14.359 stable release and combined V14 highlights](https://foundryvtt.com/releases/14.359)
- [V14.367 stable release notes](https://foundryvtt.com/releases/14.367)
- [V14.368 stable release notes](https://foundryvtt.com/releases/14.368)
- [Foundry release index](https://foundryvtt.com/releases/)