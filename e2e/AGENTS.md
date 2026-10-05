# Playwright test authoring rules

Read [the test context](../docs/E2E_TEST_CONTEXT.md) for the fixture and helper map, and [the setup guide](../docs/BROWSER_TESTING.md) before running tests. These rules apply to `e2e/`.

- Import `test` and `expect` from `./fixtures` in specs. Use `gmPage` for the logged-in GM, `world` for test-owned state, and `player` only when a second user's view matters. Browser contexts do not isolate Foundry's world database.
- Give each test one observable behavior and an outcome-oriented title. Write setup, real UI action, and assertion in that order. Put scenarios in the existing behavior-specific spec or a similarly named new spec.
- Create uniquely named disposable documents with support helpers and immediately register returned actor, table, macro, scene, or combat IDs with `world.track*`. Set settings through `world.setSetting` and `world.setCoreSetting`; call `world.rememberSetting` before changing one through the UI. Never delete unowned world documents.
- For spell or feature behavior, use the real dnd5e sheet helpers in `support/actions.ts`; build actors and items with `support/actors.ts`. Prove the underlying action occurred, especially in negative cases. Direct Foundry API calls are appropriate when that API itself is under test, such as public hooks.
- Prefer accessible Playwright locators and retrying `expect`/`expect.poll` checks. Put unavoidable version-specific selectors and Foundry document shapes in narrow `support/` helpers. Avoid fixed sleeps, unbounded retries, and broad page-object wrappers.
- Use `support/recipes.ts` or the bounded real-dice seam in `support/rolls.ts` for deterministic outcomes. Do not stub the module's surge decision. Complete the observable result check before restoring a temporary dice override.
- For chat assertions, compare messages before and after the action with `support/observations.ts`. Check both GM and player views for privacy; raw player message collections can contain private documents whose content Foundry hides.
- Keep tests independent and repeatable in the dedicated world. If a timeout interrupts teardown, inspect and remove only known test-owned leftovers before rerunning. Preserve traces and screenshots for failures.
