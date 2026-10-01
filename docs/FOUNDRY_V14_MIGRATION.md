# Foundry V14 Migration Checklist

Scope: Foundry V13.346 to V14.367, based on the module source and the official V14 release notes. The Foundry release index now lists V14.368 as the latest stable release, so confirm whether 14.367 or 14.368 is the actual deployment target before updating compatibility metadata.

## Compatibility and Tooling

- [ ] Back up user data and test V14 in a separate installation/user-data directory before switching the live environment. V14 cannot be installed through Foundry's in-app updater from V13. See the [V14.359 compatibility notes](https://foundryvtt.com/releases/14.359).
- [ ] Update `@league-of-foundry-developers/foundry-vtt-types` from the V13.346 beta to a V14 version matching the chosen target. Fix resulting API/type errors, including the deep `RoundData` import in `scripts/module.ts`, then run type-check/build/lint. The package currently does not have a dedicated type-check script, so use the project’s configured TypeScript command or add one as appropriate. See [`package.json`](../package.json) and [`tsconfig.json`](../tsconfig.json).
- [ ] Reconcile the module's Foundry compatibility range with the release target. The manifest currently says minimum 13, verified 14.367, maximum 14; keep V13 support only if it is tested, and advance `verified` to 14.368 if that is the intended target. Validate the package manifest against the V14 schema and consider adding the explicit `"type": "module"` package field. See [`module.json`](../module.json) and the [V14.355 package development notes](https://foundryvtt.com/releases/14.355).
- [ ] Revisit the D&D5E compatibility declaration and verify the `dnd5e.postUseActivity` integration against the V14-compatible system release. The manifest currently declares 5.0.4, while the V14 testing notes state D&D5E 5.2.5 was not V14-compatible and use 5.3.0 for testing. Update the declared minimum/verified system versions to match the versions actually tested. See [`module.json`](../module.json), [`scripts/module.ts`](../scripts/module.ts), and the [V14.356 testing notes](https://foundryvtt.com/releases/14.356).

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