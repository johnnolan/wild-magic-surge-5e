# Browser test verification history

These are past results from the browser suite expansion, not the current expected test count or a list of work to complete. For current setup and commands, use [BROWSER_TESTING.md](BROWSER_TESTING.md); for adding tests, use [E2E_TEST_CONTEXT.md](E2E_TEST_CONTEXT.md).

At the Phase 1 baseline, `yarn test` passed 250 tests, `yarn typecheck:e2e`, `yarn lint:check`, and `yarn build` passed, and the two original browser cases passed. `yarn typecheck:test` was already over its recorded diagnostic limit: 200 diagnostics against a limit of 145. This is separate from the new E2E TypeScript project.

On Foundry **14.367** with dnd5e **6.0.5**, the completed Phase 2 suite passed **42 browser cases twice** without resetting the world. The Sequencer/JB2A animation assertion was skipped because those optional modules were absent. The missing-dependency fallback passed, and the suite's last case confirmed that its temporary documents and chat messages were removed.

The completed Phase 3 suite passed **46 browser cases twice** on Foundry **14.367.0** and dnd5e **6.0.5**, without resetting the dedicated world. The Sequencer/JB2A animation case remained the sole skip; cleanup passed at the end of both runs. Jest passed **251 tests**, and `yarn typecheck:e2e`, `yarn lint:check`, and `yarn build` passed.
