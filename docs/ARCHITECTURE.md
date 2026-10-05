# Architecture map

Wild Magic Surge 5e is a client-side Foundry VTT module for the dnd5e system. `build.js` bundles `scripts/module.ts` into `dist/module.js`, which `module.json` loads. The manifest, settings template, languages, and macro pack are separate module assets. Treat source files and the manifest as the authority when this map becomes stale.

## From an activity to a result

1. `scripts/module.ts` registers module settings on Foundry's `init` hook. On `ready`, it listens for `dnd5e.postUseActivity`. `scripts/utils/Dnd5eActivity.ts` passes through activity events whose `consumption.spellSlot` field is true. That field is an event signal, not proof that a spell slot was spent: the installed dnd5e system can set it for some cantrips and features.
2. A GM client checks the actor and item directly. A player client emits a `SurgeCheck` payload on the module socket; the GM listener retrieves the actor and runs the check. Keep this GM/player boundary in mind when changing permissions, duplicate handling, or chat audience.
3. `scripts/MagicSurgeCheck.ts` calls `scripts/utils/SurgeDetails.ts` to decide whether the actor and item qualify. `SurgeDetails` delegates spell, feat, and actor checks to `scripts/utils/SpellParser.ts` and reads the relevant settings. A qualifying Path of Wild Magic Rage follows the barbarian table path. Other qualifying uses either post a reminder or enter automatic surge checking, depending on settings.
4. Automatic checking selects the configured mode in `MagicSurgeCheck`: Standard, Incremental, Chaotic Incremental, Spell Level Dependent, or Descending Die. `scripts/utils/IncrementalCheck.ts`, `scripts/RoundCheck.ts`, `scripts/utils/SpellLevelTrigger.ts`, and `scripts/utils/DieDescending.ts` contain the mode-specific rules. An enabled and spent Tides of Chaos can trigger the automatic surge path before the normal roll.
5. The outcome updates actor flags and may send chat through `scripts/Chat.ts`, recharge Tides of Chaos, roll a table, call public hooks, execute a GM macro, or play an optional effect. `scripts/RollTableMagicSurge.ts`, `scripts/TidesOfChaos.ts`, `scripts/utils/CallHooks.ts`, `scripts/TriggerMacro.ts`, and `scripts/AutoEffects.ts` own those paths. Table and roll chat audiences are configured separately.

The `updateCombat` listener in `scripts/module.ts` calls `scripts/RoundCheck.ts` for Chaotic Incremental mode. Manual and reset hooks in `module.ts` provide additional entry points; [HOOKS.md](HOOKS.md) documents the public hook contract.

## State and configuration

`scripts/WMSCONST.ts` names modes, settings, and flags. `scripts/ModuleSettings.ts` registers world settings and the panels under `scripts/panels/`; `templates/settings.html` renders the settings UI. `scripts/utils/TypedSettings.ts` provides typed access to registered settings and actor flags. Incremental and descending counters persist on actor flags through `scripts/utils/Resource.ts`. Foundry documents, chat messages, settings, and flags are shared world state, so browser test isolation must restore or remove only test-owned changes.

## Where to start for a change

| Change | Inspect first | Closest verification |
| --- | --- | --- |
| Spell or feature eligibility | `scripts/utils/Dnd5eActivity.ts`, `scripts/utils/SurgeDetails.ts`, `scripts/utils/SpellParser.ts` | Nearby Jest tests; `e2e/spell.*.spec.ts` and `e2e/barbarian.spec.ts` |
| Surge modes and actor resources | `scripts/MagicSurgeCheck.ts`, `scripts/utils/IncrementalCheck.ts`, `scripts/utils/DieDescending.ts`, `scripts/RoundCheck.ts` | Nearby Jest tests; `e2e/surge.*.spec.ts` and `e2e/resources.spec.ts` |
| Settings and panels | `scripts/ModuleSettings.ts`, `scripts/WMSCONST.ts`, `scripts/panels/`, `templates/settings.html` | Panel Jest tests; `e2e/settings.panels.spec.ts` |
| Chat, tables, privacy | `scripts/Chat.ts`, `scripts/RollTableMagicSurge.ts`, `scripts/utils/ChatMessageHooks.ts` | Nearby Jest tests; `e2e/chat.*.spec.ts` and `e2e/table.spec.ts` |
| Tides, hooks, macros, effects | `scripts/TidesOfChaos.ts`, `scripts/utils/CallHooks.ts`, `scripts/TriggerMacro.ts`, `scripts/AutoEffects.ts` | Nearby Jest tests; matching `e2e/*.spec.ts` |
| Build or browser harness | `build.js`, `module.json`, `playwright.config.ts`, `e2e/fixtures.ts`, `scripts/e2e/` | `yarn build`; focused and full browser suite in the dedicated world |

For test selection and commands, use [TESTING.md](TESTING.md). For the browser fixture and helper map, use [E2E_TEST_CONTEXT.md](E2E_TEST_CONTEXT.md).
