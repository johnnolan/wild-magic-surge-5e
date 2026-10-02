# TypeScript and Code Quality Action Plan

This checklist turns the findings in the [TypeScript and Code Quality Report](TYPESCRIPT_AND_CODE_QUALITY_REPORT.md) into work that can be completed by the maintainer or delegated to an agent. Keep changes focused by phase, and verify the relevant behavior before moving on.

## Working Rules

- Start each task by checking the current branch, working tree, supported Foundry/D&D5E versions, and existing tests. Preserve unrelated edits.
- Verify upstream package versions, exports, and API signatures at the time of implementation. The versions and availability noted in the report are a snapshot, not a permanent recommendation.
- Do not solve type errors by broadly casting to `any`, disabling `strict`, or expanding `skipLibCheck`.
- Run focused tests or type checks after each task. At the end of a phase, run the complete required checks and report any known baseline failures separately.

## Phase 1: Make Type Checking Predictable

### 1. Correct TypeScript file discovery

- [x] In `tsconfig.json`, rename the invalid `includes` option to `include` and explicitly list production TypeScript files.
- [x] Add a test TypeScript configuration that extends the base config and includes tests, `MockData`, and `__mocks__` without pulling them into the production check.
- [x] Confirm the production configuration includes shipped code and excludes tests and fixtures; confirm the test configuration includes both.

**Done when:** `tsc --noEmit` checks only production code, and a separate test-config invocation checks the test/fixture surface.

### 2. Align compiler settings with the build

- [x] Document the Foundry browser runtime target the module supports and compare it with the esbuild target.
- [x] Set intentional TypeScript `target`, `module`, and `moduleResolution` values for the no-emit check. Use a resolution mode compatible with the selected declarations package's `exports` (the report identifies `bundler` as the package guidance to verify).
- [x] Remove the broad `"*": ["./scripts/types/*.d.ts"]` path mapping unless a real import depends on it. Replace it with a narrow alias only if there is a demonstrated use case.
- [x] Keep `skipLibCheck` only if it is needed for third-party declaration internals; do not rely on it to hide project diagnostics.
- [x] Run the type checker and build after changing settings; confirm the build output and module resolution remain compatible.

**Done when:** compiler options are documented by their role, package exports resolve, and build behavior is unchanged.

**Verification:** Foundry 13+ support and the esbuild ES6 target are documented alongside TypeScript's ES2015 target. `skipLibCheck` is retained because disabling it exposes 93 diagnostics in the installed Foundry declarations. Both no-emit projects have zero unresolved-module diagnostics; existing project diagnostics remain.

### 3. Add type checking to normal quality gates

- [x] Add a `typecheck` package script for the production configuration.
- [x] Add a separate test typecheck script if test typing is enabled, so fixture errors can be tracked without blocking production work unexpectedly.
- [x] Add the production typecheck to the repository's CI checks alongside tests, build, and lint. Find the current workflow files before editing; do not assume a workflow path.
- [x] Record the current diagnostic baseline, then fix newly introduced errors rather than accepting a growing error count.

**Done when:** local and CI commands run the same production type check, and failures return a non-zero exit code.

**Verification:** `yarn run typecheck` gates production against a baseline of 425 diagnostics; `yarn run typecheck:test` separately tracks 145 test/fixture diagnostics. The PR test workflow and main build workflow both invoke the same production command. Lower the baselines as errors are resolved; only raise them after reviewing and explicitly accepting new diagnostics.

## Phase 2: Establish the Correct Foundry Type Boundary

### 4. Select and pin declarations that match the supported runtime

- [x] Re-check the module's declared Foundry compatibility in `module.json` and the Foundry versions used for development/testing.
- [x] Check current releases, npm dist-tags, package exports, and recent upstream changes for `@league-of-foundry-developers/foundry-vtt-types` (or a maintained successor).
- [x] Select a declaration version suitable for the supported runtime, install it as a dev dependency, and pin the resolved version in the package manifest and lockfile.
- [x] Validate the Foundry APIs touched by this compatibility update against official API documentation and the selected declarations. Record any declaration/runtime discrepancy that affects implementation.

**Done when:** the dependency and lockfile agree, and the chosen declaration version is justified against the runtime being supported.

**Verification:** `module.json` sets minimum/verified Foundry to 14.367; no `fvtt` or `foundryvtt` executable is available here, so runtime smoke coverage is not claimed. The current stable release is 14.368, and D&D5E 6.0.5 requires 14.367. npm's newest types beta is `14.366.0-beta.20261001000223`, published 2026-10-01; it is also the exact version in `package.json`, `yarn.lock`, and the installed package. It exposes public `configuration` exports and is based one patch below the module's verified Foundry version (two below 14.368). Upstream `main` had changes through 2026-09-30, including a TypeScript peer-dependency update to `>=5.9`; this project uses TypeScript 7.0.2. The `updateCombat` callback now uses the declared public hook signature, and the `dnd5e.postUseActivity` augmentation matches the D&D5E 6.0.5 source contract. Treat the unverified 14.368 runtime and any declaration/runtime differences as smoke-test follow-up.

### 5. Remove deep or runtime-unsafe type imports

- [x] In `scripts/module.ts`, remove the deep `RoundData` import from the package's internal `src/` tree.
- [x] Use the public hook callback signature or a small local type where inference is not sufficient; use `import type` for type-only imports.
- [x] Check remaining imports from declaration-package internals and replace them with public exports, inferred callback types, or narrow module-owned types.
- [x] Keep Foundry globals (`game`, `Hooks`, `Actor`, `Item`, `Roll`, etc.) sourced from the configured declarations rather than redeclaring them locally.

**Done when:** production source no longer depends on undocumented package-internal type paths and type-only imports cannot become runtime imports.

**Verification:** `scripts/module.ts` now infers the public `updateCombat` callback type. A production-source scan found no imports from Foundry declaration-package internals or other direct imports from that package; its globals are supplied through the `types` entry in `tsconfig.json`. `scripts/types/globals.d.ts` contains module-owned aliases and the public D&D5E hook augmentation, not replacement declarations for Foundry globals.


### 6. Verify public API usage

- [x] Search production code for underscored members and implementation-only Foundry APIs.
- [x] Check each candidate against Foundry's current API documentation and mark whether it is public/supported.
- [x] Replace unsupported calls with public APIs where available; isolate unavoidable compatibility code behind a small adapter and document the runtime constraint.

**Done when:** each identified non-public API use has been removed or has a documented, tested reason to remain.

**Verification:** The legacy `renderChatMessage` route was replaced with V14's documented `renderChatMessageHTML` hook and an `HTMLElement` listener. The underscore-prefixed Foundry members found are documented subclass hooks: `FormApplication._updateObject` is its abstract form-submit handler, and `ApplicationV2._prepareContext` is a protected context-preparation hook. Other underscore-prefixed members are module-owned. The module still uses V1 `FormApplication` panels, which Foundry deprecated in V13 but continues to expose in V14; migration is tracked separately. The production typecheck is within baseline at 422/425 diagnostics; build and Jest pass.

## Phase 3: Type Event and System Integrations

### 7. Augment the module's custom Hook registry

- [x] Create module-owned hook argument types based on actual `Hooks.call`/`Hooks.callAll` sites and listener callbacks.
- [x] Augment the public `@league-of-foundry-developers/foundry-vtt-types/configuration` export, not an internal package path.
- [x] Cover published events: `manualTriggerWMS`, `reset`, `Reset`, `ResetDieDescending`, `ResetIncrementalCheck`, `SetDieDescending`, and `SetIncrementalCheck`.
- [x] Cover emitted notifications: `CheckForSurge`, `IsWildMagicSurge`, `DieDescendingChanged`, and `IncrementalCheckChanged`.
- [x] Include exact payload shapes and return/argument contracts; update both emitters and listeners if the current contract is inconsistent.

**Done when:** hook names and callback parameters are checked at both call sites and listeners, with no `any` added to make the augmentation compile.

**Verification:** All seven module listeners are typed through the public `HookConfig` augmentation. `CallHooks.Call` now maps each emitted notification to its exact payload, and the `Hooks.on` callbacks infer their arguments from the registry. `docs/HOOKS.md` was corrected to match the emitted data. The production diagnostic count fell from 425 to 413; the remaining `wild-magic-surge-5e.reset` callback still references an undefined `roll` and is tracked separately under task 15.

### 8. Validate socket messages at runtime

- [ ] Define a discriminated union for messages on `module.wild-magic-surge-5e`, including the current `SurgeCheck` event and its data.
- [ ] Add a runtime type guard that checks the incoming value is an object with a recognized event and valid event-specific data before use.
- [ ] Use the union for outgoing messages and narrow received `unknown` values with the guard.
- [ ] Add tests for valid payloads, missing fields, unknown events, and malformed data.

**Done when:** malformed socket data is ignored or handled explicitly instead of causing unsafe property access.

### 9. Correct and type the Combat hook

- [x] Change the `updateCombat` callback in `scripts/module.ts` to use the documented/public Combat hook signature or inferred parameters.
- [x] Rename the Combat argument to `combat` and access `combat.combatant?.actor` only after appropriate narrowing.
- [x] Add or update a focused test for missing combatant/actor data and the normal update path.

**Done when:** the callback reflects the real Foundry contract and safely handles absent combatant data.

**Verification:** `RoundCheck.OnCombatUpdate(combat: Combat)` is registered directly with `Hooks.on("updateCombat", ...)`. Focused tests cover absent combatant, missing actor, and normal actor handling; all 8 `RoundCheck.test.ts` tests pass. Production typecheck remains within baseline at 414/425 diagnostics. A real Foundry smoke test is unavailable because no Foundry runtime is installed here.

### 10. Type the D&D5E Activity hook independently

- [x] Check the D&D5E version the module supports and inspect that version's `dnd5e.postUseActivity` declaration/implementation.
- [x] Use a D&D5E-exported Activity type if it is available and stable; otherwise define a narrow module-owned consumer shape for the `item`, `item.actor`, and `consumption.spellSlot` fields actually read.
- [x] Correct the callback so the Activity is not incorrectly annotated as a core `Item`.
- [x] Add tests for relevant activity values, missing optional fields, and non-spell activity behavior.

**Done when:** the hook's argument order and accessed fields match the supported D&D5E release and are checked without a broad cast.

**Verification:** D&D5E 6.0.5 invokes `postUseActivity(activity, usageConfig, results)` after use; the Activity exposes `item` and `consumption.spellSlot`. No stable D&D5E declaration package is a project dependency, so `Dnd5ePostUseActivity` is a narrow module-owned type in `scripts/utils/Dnd5eActivity.ts` and the hook registry retains the exact three-argument order. `HandlePostUseActivity` tests cover absent consumption data, unconsumed spells, orphaned items, GM checks, and player socket routing (5 tests pass). Production typecheck remains at 414/425 diagnostics; a Foundry runtime smoke test remains unavailable.

### 11. Model only the D&D5E system data this module consumes

- [x] Inventory reads of spell `system.level`, actor `system.details.level`, actor `system.resources`, and Item/Actor subtype values.
- [x] Prefer declarations exported by the supported D&D5E release where appropriate; otherwise define narrow interfaces and guards in one module-owned location.
- [x] Update consumers to use those types/guards instead of repeated `any` casts on `system`.
- [x] Add tests for absent, malformed, and valid system data at the boundaries that affect surge behavior.

**Done when:** each system-data access is either declaration-backed or guarded by a narrow runtime check.

**Verification:** The project has no D&D5E type dependency, so `scripts/utils/Dnd5eSystem.ts` defines narrow readers for spell levels (integer 0-9), Actor `details.level`, resource slots (`max`/`value`), uses (`value` plus optional `max`/`spent`), and the Item/Actor subtypes used by feature checks. Spell parsing rejects malformed levels; missing actor levels use one roll-table result; malformed resources initialize and return the resource class default; invalid Tides uses data is treated as unknown/not consumed. The focused consumer suite passes 106 tests. Production and test/fixture checks remain within their baselines at 394/425 and 115/145 diagnostics, respectively. No direct production access remains outside the guard module, apart from typed document update paths.

### 12. Type module flags and settings

- [ ] Inventory every `wild-magic-surge-5e` Actor flag key and its stored value type.
- [ ] Inventory every module setting key and registered value type.
- [ ] Add key-to-value maps and typed wrappers around `getFlag`/`setFlag` and `game.settings.get`/`set`.
- [ ] Migrate callers to the wrappers and test representative reads, writes, and invalid key/value combinations.

**Done when:** misspelled keys and mismatched value types are caught at the access boundary instead of at arbitrary call sites.

### 13. Type chat, sheet, and header callbacks

- [ ] In `scripts/Chat.ts` and related hooks, select the intended legacy `renderChatMessage` or V14 `renderChatMessageHTML` contract and use its declared callback types.
- [ ] In `scripts/module.ts`, replace `Array<any>` for header controls with the matching Foundry control entry type.
- [ ] Update callback code to match the selected hook's actual HTML element/context arguments.
- [ ] Add focused tests where callback logic can be exercised in Jest; include a real Foundry smoke check for rendering behavior.

**Done when:** the relevant hook callbacks compile against the selected declarations without `any` and preserve expected UI behavior.

### 14. Move application-owned aliases out of ambient globals

- [ ] Move `SurgeType`, `Comparison`, `DieValue`, `HookValue`, `ResourceValue`, and `SpellLevelFormula` into an exported module-owned domain/types module.
- [ ] Import those types explicitly where used.
- [ ] Keep `scripts/types/globals.d.ts` limited to necessary Foundry augmentations and ambient declarations.
- [ ] Check for duplicate global names or newly required runtime imports after moving types.

**Done when:** application-domain types are explicit module imports and ambient declarations describe only actual ambient APIs/augmentations.

## Phase 4: Fix Concrete Runtime and Quality Risks

### 15. Fix the undefined `roll` in the reset hook

- [ ] Inspect the `wild-magic-surge-5e.reset` hook registration and every emitter to determine intended reset behavior.
- [ ] Replace the undefined `roll` reference with the correct reset operation or payload; do not suppress the compiler diagnostic.
- [ ] Add a regression test that invokes the reset hook and verifies its state changes.

**Done when:** invoking reset cannot throw a `ReferenceError`, and the test verifies the intended behavior.

### 16. Guard nullable Actor IDs and canvas tokens

- [ ] Trace Actor ID and canvas token values from their source in `scripts/module.ts` and `scripts/TriggerMacro.ts` to their consumers.
- [ ] Add guards where the operation requires a present ID/token; otherwise reflect optionality in function parameters/return values.
- [ ] Test absent IDs/tokens and the normal path.

**Done when:** no downstream call assumes an ID/token exists without a guard or an explicit non-optional contract.

### 17. Replace `any` in settings panel helpers

- [ ] In `scripts/panels/Helpers.ts`, define a setting-key union, typed metadata/value records, and the form-data shape used by the helper.
- [ ] Type settings reads/writes through the wrappers from task 12 where practical.
- [ ] Keep any unavoidable conversion at one adapter boundary and explain why it is needed.
- [ ] Test building settings data and submitting valid/invalid form values.

**Done when:** the helpers no longer expose unbounded `any` inputs/outputs and their callers remain type-safe.

### 18. Make resource defaults immutable per operation

- [ ] In `scripts/utils/Resource.ts`, inspect `SetResource` and all paths returning or mutating `defaultValue`.
- [ ] Create a fresh resource object for each write and avoid returning shared mutable defaults.
- [ ] Add a regression test proving one resource update does not alter the default or affect another resource instance.

**Done when:** writes cannot mutate shared static defaults.

### 19. Await and correctly type chat message creation

- [ ] In `scripts/Chat.ts`, change the create input contract to Foundry's create-data type rather than an instantiated `ChatMessage` document.
- [ ] Await `ChatMessage.create` inside the async method and propagate its result/failure according to the method's public contract.
- [ ] Update tests to verify completion and rejected create behavior.

**Done when:** callers observe asynchronous create failures and the input type describes data, not a document instance.

### 20. Improve test fixture typing

- [ ] Inventory `global as any` casts in tests and identify repeated setup patterns.
- [ ] Add or extend shared typed Foundry/Jest setup helpers and small fixture builders.
- [ ] Use `Partial<T>` only where incompleteness is intentional; if a complete document instance is required, centralize the unavoidable cast in one helper.
- [ ] Migrate fixtures by test area and keep assertions focused on behavior rather than declaration implementation details.

**Done when:** common test setup is typed, and any remaining casts are narrow, explicit, and centralized.

### 21. Await state changes where completion matters

- [ ] Review document creation, Actor updates, flag writes, and nested helper calls.
- [ ] Await operations whose completion determines the caller's result or error handling; preserve intentionally fire-and-forget work only when it is safe and documented.
- [ ] Add or update tests to ensure async failures are observable and tests wait for persisted state.

**Done when:** state-changing async work has an explicit completion/error contract and tests do not pass before the work finishes.

## Phase 5: Complete the Quality Workflow

### 22. Lint the entire production surface

- [ ] Inspect `.eslintrc.json` and remove or narrow the ignore for `scripts/panels/**/*.ts` so the five legacy panels receive appropriate lint coverage.
- [ ] Resolve any lint errors introduced by enabling coverage without mixing unrelated formatting changes into behavioral fixes.
- [ ] Run the full lint command and confirm each production panel is included.

**Done when:** all production TypeScript, including legacy panels, is linted by an intentional rule set.

### 23. Consolidate repeated settings-panel behavior

- [ ] Compare the five legacy settings panels and identify genuinely duplicated list-building, rendering, and submission behavior.
- [ ] After or alongside the ApplicationV2 migration, extract only shared behavior into a base/helper while keeping each panel's settings list explicit.
- [ ] Add focused tests for shared behavior and verify each panel still registers and submits its own settings correctly.

**Done when:** meaningful duplication is reduced without hiding panel-specific settings or changing user-visible behavior.

### 24. Standardize naming and formatting in touched code

- [ ] Follow the repository's existing lint/Prettier configuration for changed code.
- [ ] Use one method naming convention for new or deliberately touched methods; avoid broad renames unrelated to a task.
- [ ] Run formatting/lint on changed files, then inspect the diff to ensure formatting did not create unrelated churn.

**Done when:** changed code follows one consistent convention and the diff remains scoped to the work item.

### 25. Maintain a real-world Foundry smoke checklist

- [ ] Add a short checklist for behavior that Jest cannot prove: hook timing, Application rendering, chat visibility, and D&D5E system data shapes.
- [ ] Run it in a real world on the supported Foundry/D&D5E versions after changes to those integration boundaries.
- [ ] Record the tested versions and any manual-only limitation alongside the checklist results.

**Done when:** integration-sensitive changes have a repeatable manual verification path in addition to unit tests.

## Suggested Execution Order

1. Complete Phase 1 so type diagnostics have a reliable production baseline.
2. Complete declaration/runtime alignment and remove package-internal imports (Phase 2).
3. Fix the undefined reset reference and nullability/runtime risks early in Phase 4; these can cause user-visible failures independent of the type migration.
4. Type hooks and D&D5E boundaries in small slices (Phase 3), adding focused tests with each slice.
5. Finish settings, resource, chat, and test fixture work (Phase 4).
6. Complete lint, duplication, naming, and manual integration workflow work (Phase 5).

## Completion Report Template

For each delegated task, report:

- Files changed and behavior affected.
- Validation commands run and their results.
- Any remaining diagnostics, grouped as pre-existing baseline versus newly introduced.
- Foundry/D&D5E versions used for integration validation, or why real-world validation was not possible.
- Follow-up work intentionally left out of scope.