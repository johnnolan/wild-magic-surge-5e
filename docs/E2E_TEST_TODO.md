# Browser test expansion checklist

This is an implementation backlog for an agent. It uses the current Jest suite and the behavior described in `README.md`, `HOOKS.md`, `SETTING_UP_PLAYER.md`, `TRACK_SURGE_TOKEN.md`, `SPELL_LEVEL_DEPENDENT.md`, and `POWN_BARB.md` as references. The source code is the authority for what the current build actually does. When a documented scenario fails, retain the reproduction and record whether the module or documentation needs a correction; do not change the assertion to hide the gap.

## Starting point and working rules

- The existing Playwright suite has a GM login fixture in `e2e/fixtures.ts`, a small Foundry helper in `e2e/foundry.ts`, and passing module-load and chat-setting cases in `e2e/module.spec.ts` and `e2e/settings.spec.ts`. The local tested pair is Foundry **14.367** and dnd5e **6.0.5**. Follow `docs/BROWSER_TESTING.md` to run it.
- Keep Jest for pure parsing, malformed data, rejected promises, and detailed comparison edge cases. Use the browser suite for complete Foundry flows: a user changes a setting or uses an activity, and another user can observe the resulting chat, actor, table, or hook state.
- Use a real dnd5e sheet/activity for spell and Rage actions. `page.evaluate` may create disposable documents, set initial state, record a hook, or read persisted state. It must not call `MagicSurgeCheck` or synthesize `dnd5e.postUseActivity` as the only action in an activity test.
- Name tests in plain language: `given an incremental check and GM-only chat, casting a spell hides the charge message from the player`. Keep **Given / When / Then** visible in the test body. Avoid titles consisting only of setting keys or class names.
- Do not run every possible setting combination. Group by the *behavior being observed* and use a small matrix: public vs GM-only for each **distinct message type** (reminder/charge, roll result, table result), plus one case for each meaningful interaction between settings. Keep the fuller value/comparison matrix in Jest.
- Every case owns its actor, items, token, scene, combat, table, macro, and chat messages; save and restore every world setting it changes. Browser contexts do not isolate the Foundry database. Use one worker until this cleanup is reliable. Give fixtures unique names and remove them in `finally` or fixture teardown, including after an assertion fails. Never delete non-test documents.

## Proposed layout

These paths are a target layout, not a requirement to create empty files up front. Move the current `settings.spec.ts` into `settings.panels.spec.ts` when that file gains more panel cases; retain the existing passing case.

```text
e2e/
  fixtures.ts                 # GM page; add player page and disposable-world fixture
  support/
    actors.ts                 # create a caster, NPC, barbarian, feats, Tides, spell activities
    actions.ts                # cast from sheet, use Tides/Rage, advance combat
    settings.ts               # scoped world-setting snapshot/restore; open named panels
    observations.ts           # read slots, actor flags/resources, chat, hooks, tables
    cleanup.ts                # track only documents/messages created by this test
  module.spec.ts
  settings.panels.spec.ts     # UI persistence and option availability only
  spell.eligibility.spec.ts   # who/what can trigger a check
  surge.standard.spec.ts      # standard roll, target, result messages
  surge.incremental.spec.ts   # ordinary incremental progression and reset
  surge.chaotic.spec.ts       # combat progression and cap
  surge.descending.spec.ts    # die progression and reset
  surge.spell-level.spec.ts   # level-specific rules
  chat.visibility.spec.ts     # public/GM-only for distinct message types
  chat.content.spec.ts        # enabled/disabled/custom messages
  table.spec.ts               # automatic and player-triggered table draws
  tides.spec.ts               # Tides use, surge, recharge
  hooks.spec.ts               # public hook contract and manual control
  macro.spec.ts               # GM macro execution on a real surge
  resources.spec.ts           # flag vs sheet resource and token bar
  barbarian.spec.ts           # Rage path, after compatibility investigation
  effects.spec.ts             # optional Sequencer/JB2A integration
```

`support/*` functions should describe domain actions (`createWildMagicCaster`, `castLevelOneSpellFromSheet`, `newChatMessages`) and be small enough that a reader can understand what the spec did. Put dnd5e 6.0.5 document/activity shapes and the few unavoidable sheet selectors in one place. Do not introduce a generic page-object framework.

## Phase 1 — make the fixture trustworthy

- [x] **E2E-01 — Record the baseline.** Run `yarn test`, `yarn typecheck:test`, `yarn typecheck:e2e`, `yarn lint:check`, `yarn build`, and `yarn test:e2e`. Record versions, failures, and whether the dedicated world is empty before adding cases. Keep the existing two browser cases passing.
- [x] **E2E-02 — Seed a real caster.** Add a disposable character with a feat *named* `Wild Magic Surge`, a level-1 sorcerer spell with a usable dnd5e activity, and an available spell slot. Assert the created item subtype, activity, slot, and actor ID before use. Open its sheet, use the spell activity, and prove a slot was consumed. This is the common path for most scenarios. References: `SETTING_UP_PLAYER.md`, `scripts/utils/Dnd5eActivity.test.ts`, `scripts/utils/SpellParser.test.ts`.
- [x] **E2E-03 — Add isolation and observations.** Snapshot only settings a case changes; restore them even on failure. Track created document and chat IDs. Supply narrow readers for the actor's `hassurged` flag, surge resource, spell slots, and messages since a recorded baseline. Wait with `expect.poll` or a visible locator, never fixed sleeps. Test cleanup by running a case alone, twice, and after a deliberate assertion failure. References: `scripts/utils/Resource.test.ts`, `scripts/Chat.test.ts`.
- [x] **E2E-04 — Add a player session.** Create a disposable non-GM user with ownership of the test actor and log in through a separate browser context while the GM is connected. Add an observation helper that checks *both* GM and player chat timelines for the same event. Close both contexts before deleting the user. The single GM fixture cannot establish whether a message is private. Reference: `scripts/utils/Dnd5eActivity.test.ts` (player socket route).
- [x] **E2E-05 — Prove the player-to-GM route.** Have the player cast the seeded slot-consuming spell through the sheet. Assert the slot changes and exactly one module reminder or check appears to the GM. Repeat with the GM casting the same type of spell. This validates the socket route before adding privacy assertions. Reference: `scripts/module.test.ts`, `scripts/utils/Dnd5eActivity.test.ts`.
- [x] **E2E-06 — Add deterministic outcome recipes.** For Standard mode, `1d20` with equality targets `1,2,...,20` guarantees a surge; target `0` guarantees no surge. For Spell Level mode, `< 21` and `> 20` on `1d20` give the same distinction. For Incremental mode, a stored threshold of 20 guarantees a surge on `1d20`; validate an accepted formula such as `1d20+20` for guaranteed non-surge increments. Keep these recipes named in test support, and verify each recipe with the actual Foundry roll. Do not stub the module's result function. Reference: `scripts/MagicSurgeCheck.test.ts`.
- [x] **E2E-07 — Keep a brief fixture guide.** Add to `docs/BROWSER_TESTING.md` how to run a single spec, how a test actor/activity is built, how GM/player sessions work, what the cleanup owns, and the exact Foundry/dnd5e pair verified. Document any version-specific selector in the corresponding helper.

## Phase 2 — implement observable scenarios

Each checkbox is a separately reviewable task. Start with the first row in each group, then add the remaining rows. For negative cases, assert the underlying action happened (for example, the spell slot changed) **and** the module outcome did not happen.

### Settings and chat text

- [ ] **E2E-08 — Settings panels save and reopen** (`settings.panels.spec.ts`). Keep the existing Chat Message Options case. Add focused cases for Standard roll settings, Incremental charge display, Spell Level rules, and spell regex. Use the actual panel controls and reopen each panel to verify persisted values; restore originals. Do not put spell-casting assertions in this file. References: `scripts/panels/SettingsPanelBase.test.ts`, `scripts/panels/Helpers.test.ts`, `scripts/ModuleSettings.ts`.
- [ ] **E2E-09 — Reminder text and switch** (`chat.content.spec.ts`). Given auto checking is off, cast a level-1 spell and assert the custom reminder appears once. Turn `magicSurgeChatMessageEnabled` off and cast again: slot consumption still happens, but no reminder is added. Observe `CheckForSurge` separately in `hooks.spec.ts`; disabling chat must not be treated as disabling the hook. References: `README.md`, `scripts/Chat.test.ts`, `scripts/MagicSurgeCheck.test.ts`.
- [ ] **E2E-10 — Surge and no-surge text** (`chat.content.spec.ts`). Use deterministic Standard recipes. Verify custom surge text only after the surge outcome and custom no-surge text only after the no-surge outcome. Toggle each corresponding `*MessageEnabled` setting and assert it suppresses its message without changing the roll or `hassurged` flag. References: `README.md`, `scripts/MagicSurgeCheck.test.ts`, `scripts/Chat.test.ts`.

### Spell eligibility and configuration

- [ ] **E2E-11 — Feat and actor gates** (`spell.eligibility.spec.ts`). Cast the same real spell with and without the `Wild Magic Surge` feat; then cast as an NPC with `enableNpcTracking` off and on. Change `wmsName` once and prove only a feat with the new exact name qualifies. Assert slot consumption in every case and check only the expected module chat/flag outcome. Use a deterministic Standard recipe when an outcome is needed. References: `SETTING_UP_PLAYER.md`, `README.md`, `scripts/utils/SurgeDetails.test.ts`.
- [ ] **E2E-12 — Spell level gates** (`spell.eligibility.spec.ts`). Create level-1 and level-3 spells and vary `minimumSpellLevelTrigger`. Assert the lower spell is ignored and the higher one checks. Create a cantrip and inspect whether dnd5e emits `consumption.spellSlot`; see E2E-30 before asserting that `cantripTriggerSurgeCheckEnabled` makes it work. References: `README.md`, `scripts/utils/SpellParser.test.ts`, `scripts/utils/Dnd5eActivity.test.ts`.
- [ ] **E2E-13 — Include/exclude spell names** (`spell.eligibility.spec.ts`). Enable `spellRegex` with a rule such as `\\(S\\)`; cast otherwise identical names with and without `(S)`, then toggle `spellRegexInverse`. Assert only the intended name checks in each mode. The player guide says to set Source Class to Sorcerer, but the current parser filters by name when regex is enabled; record that distinction rather than inventing a Source Class assertion. References: `README.md`, `SETTING_UP_PLAYER.md`, `scripts/utils/SpellParser.test.ts`, `scripts/utils/SurgeDetails.test.ts`.

### Roll modes

- [ ] **E2E-14 — Standard mode** (`surge.standard.spec.ts`). Prove one guaranteed surge, one guaranteed no-surge, and the resulting `hassurged` value and chat outcome. Add one UI setting case for a non-default formula/comparison if E2E-08 does not already exercise it. Leave the full `=`, `<`, `>` and comma-list edge matrix in `scripts/MagicSurgeCheck.test.ts`. References: `README.md`, `scripts/MagicSurgeCheck.test.ts`.
- [ ] **E2E-15 — Incremental mode** (`surge.incremental.spec.ts`). Start at threshold 1, cast once with a validated guaranteed non-surge recipe, and assert the persisted threshold becomes 2. Force a later surge by setting threshold 20, cast through the sheet, and assert it resets to 1. With `incrementalCheckToChat` on, assert one charge message for an increment and none for a reset unless the implementation really emits one. Reference: `README.md`, `scripts/utils/IncrementalCheck.test.ts`.
- [ ] **E2E-16 — Chaotic mode** (`surge.chaotic.spec.ts`). Build a disposable scene/combat with the test caster as combatant. Advance turns through the UI and assert the threshold increases from combat updates, caps at 10, and returns to 1 after a guaranteed surge. Check that a noncombat spell behaves according to the current mode. Record whether update events cause more than one increment per turn; do not write a fragile count assertion until observed. References: `README.md`, `scripts/RoundCheck.test.ts`, `scripts/utils/IncrementalCheck.test.ts`.
- [ ] **E2E-17 — Descending Dice** (`surge.descending.spec.ts`). Cast from the sheet, read the actual roll and stored stage, and assert the next die follows d20 → d12 → d10 → d8 → d6 → d4 on non-one results; a roll of one resets to d20. Since this mode owns its die formula, investigate a safe deterministic Foundry dice seam before requiring the entire chain in one test. If none exists, assert transitions against the observed roll and leave full transition coverage in `scripts/utils/DieDescending.test.ts`; do not use an unbounded retry-until-one test. References: `README.md`, `scripts/utils/DieDescending.test.ts`.
- [ ] **E2E-18 — Spell Level Dependent Rolls** (`surge.spell-level.spec.ts`). Save distinct cantrip, level-1, and level-2 expressions in the panel. Cast levels 1 and 2 through real activities, using deterministic comparisons to prove different outcomes and the configured roll formula. Cover one valid advantage/disadvantage-style formula from `SPELL_LEVEL_DEPENDENT.md` without making the outcome depend on luck. Verify another level follows its configured/default rule. Put cantrip behavior behind E2E-30's activity check. References: `SPELL_LEVEL_DEPENDENT.md`, `scripts/utils/SpellLevelTrigger.test.ts`.

### Visibility and table actions

- [ ] **E2E-19 — Public vs GM-only non-roll chat** (`chat.visibility.spec.ts`). Use two sessions. With Incremental Check, `incrementalCheckToChat` on, and a guaranteed non-surge increment, compare `whisperToGM=false` against `true`: the charge message is visible to both users when public, and only to GM when private. Repeat the same setting pair for a prompt-only reminder if the path is distinct. This is the concrete case for “Given Roll Type is Incremental Check … only GM sees the message.” References: `README.md`, `scripts/Chat.test.ts`, `scripts/utils/IncrementalCheck.test.ts`.
- [ ] **E2E-20 — Roll-result visibility** (`chat.visibility.spec.ts`). Force a surge/no-surge check with `autoRollD20=true`; compare `whisperToGM=false` and `true` in GM and player timelines. Assert the roll-result message is hidden from the player only when private. Also verify the configured Foundry chat mode does not accidentally override the explicit GM-only option. Reference: `scripts/Chat.test.ts`.
- [ ] **E2E-21 — Table-result visibility** (`chat.visibility.spec.ts`). Roll a disposable test table automatically with `whisperToGMRollChat=false` and `true`; assert the table-result message's audience in both sessions. Keep this separate from `whisperToGM`, which controls default and roll chat. One mixed case should prove that roll chat can be private while table output remains public. References: `POWN_BARB.md`, `scripts/Chat.test.ts`.
- [ ] **E2E-22 — Auto table and player-trigger table** (`table.spec.ts`). Create a two-result RollTable with a unique name, save that name, and force a surge. With `enableRollTable=AUTO`, assert one table draw/result (and the documented two-draw behavior for an actor above level 13, if the dnd5e level fixture supports it). With `PLAYER_TRIGGER`, assert a button appears in surge chat, a player clicks it once, and one table result is posted. With `None`, assert no table result/button. References: `README.md`, `scripts/RollTableMagicSurge.test.ts`, `scripts/utils/ChatMessageHooks.test.ts`.

### Tides, resources, hooks, and macro

- [ ] **E2E-23 — Tides of Chaos** (`tides.spec.ts`). Seed a real `Tides of Chaos` feat with one use and a Use activity. Use it through the sheet, verify it is spent, then cast a level-1 spell. With `surgeTocEnabled=true`, assert an automatic surge; with `enableTidesOfChaosRecharge=true`, assert the use is restored. Separately force an ordinary Standard-mode surge to prove the recharge option works without the auto-surge option. Add a control case with auto surge off so a spent use alone does not force a surge. Observe the effective dnd5e `uses.value`/`uses.spent` state rather than assuming one field from the guide. References: `SETTING_UP_PLAYER.md`, `README.md`, `scripts/TidesOfChaos.test.ts`.
- [ ] **E2E-24 — Resource storage and token bar** (`resources.spec.ts`). In Incremental mode, compare `OPT_RESOURCE_TYPE=NONE` (module actor flag) with `PRIMARY` (visible dnd5e resource). Cast and verify the selected store changes while an unrelated pre-existing slot stays intact. Then bind a disposable token bar to the primary resource and verify the displayed value tracks it. Repeat one representative Descending Dice case; do not multiply all modes × all three resource slots. References: `TRACK_SURGE_TOKEN.md`, `scripts/utils/Resource.test.ts`.
- [ ] **E2E-25 — Public notifications and manual controls** (`hooks.spec.ts`). Attach temporary listeners for `CheckForSurge`, `IsWildMagicSurge`, `IncrementalCheckChanged`, and `DieDescendingChanged`. Trigger each by a real UI action and assert its documented payload, then remove listeners. Separately call the documented `manualTriggerWMS`, `Reset`, `ResetIncrementalCheck`, `SetIncrementalCheck`, `ResetDieDescending`, and `SetDieDescending` hooks with a disposable actor and assert persisted state. Manual hook tests may call `Hooks.callAll` because the hook itself is the public API under test; they do not substitute for spell-cast tests. The code also has a lowercase internal `reset` hook: check the documented capitalized name. References: `HOOKS.md`, `scripts/module.test.ts`, `scripts/utils/IncrementalCheck.test.ts`, `scripts/utils/DieDescending.test.ts`.
- [ ] **E2E-26 — GM macro on surge** (`macro.spec.ts`). Create a disposable GM-owned macro that writes a test marker to a safe actor flag or chat, enable `enableTriggerMacro`, set its name, and force a surge via a real spell. Assert one execution with the expected actor/token context. Add a negative case for a missing or unowned macro. References: `README.md`, `scripts/TriggerMacro.test.ts`, `scripts/MagicSurgeCheck.test.ts`.
- [ ] **E2E-27 — Optional visual effect** (`effects.spec.ts`). Keep this outside the core required suite unless Sequencer and JB2A are installed in the dedicated world. With dependencies available, force a surge on a token and assert the animation is requested; with effects off, assert no animation request. Without dependencies, verify a surge still completes, but leave animation detail to `scripts/AutoEffects.test.ts`. References: `README.md`, `scripts/AutoEffects.test.ts`.
- [ ] **E2E-28 — Actor helper button** (`settings.panels.spec.ts`). When `showWMSDebugOption` is enabled at world startup, open a caster sheet, click its WMS header control, and verify it reports whether the named feat and Tides setup are present. Because this setting requires a reload, configure it before launching the test world rather than toggling it mid-case. Reference: `SETTING_UP_PLAYER.md`, `scripts/panels/ActorHelperPanel.ts`.

## Phase 3 — investigate documented paths with a likely entry-point gap

- [ ] **E2E-29 — Path of Wild Magic Barbarian** (`barbarian.spec.ts`). Seed a barbarian with a `Path of Wild Magic` subclass, a usable Rage activity, and a named test table. Observe whether using Rage emits `dnd5e.postUseActivity` with `consumption.spellSlot=true`. The current `HandlePostUseActivity` returns early otherwise, so the README/`POWN_BARB.md` behavior may not be reachable. Write a reproduction with the real Rage button. If it fails, report/fix the production entry point and then cover automatic and player-trigger table options. Do not call `RollTableMagicSurge.Check` directly to claim Rage works.
- [ ] **E2E-30 — Cantrip-trigger setting** (`spell.eligibility.spec.ts`). With `cantripTriggerSurgeCheckEnabled=true` and a valid cantrip activity, observe the dnd5e post-use payload and whether the module checks. A normal cantrip does not consume a spell slot, while the current handler requires `consumption.spellSlot=true`. If the documented option fails, retain the reproduction, correct the entry point, and assert enabled vs disabled behavior after the fix. Reference: `README.md`, `scripts/utils/Dnd5eActivity.test.ts`, `scripts/utils/SpellParser.test.ts`.
- [ ] **E2E-31 — Compare docs with live UI**. Verify the displayed Roll Type values, default mode, feature names, Source Class note, Tides usage fields, and documented hook signatures against Foundry 14.367/dnd5e 6.0.5. Update docs or product code where evidence warrants. Keep a short note of each discrepancy and the test that guards it.

## Completion gate for each task

1. The spec reads as setup → user action → observable outcome; its title describes the outcome in ordinary language.
2. The action reaches the real Foundry/dnd5e path relevant to that task. Assertions use the UI or persisted document/chat state; hook listeners are used only for hook contract cases.
3. The task passes alone, with its sibling file, and in the full suite, including a second run without resetting the world manually. No test relies on a previous test's documents or settings.
4. The agent runs `yarn typecheck:e2e`, `yarn lint:check`, and `yarn test:e2e` after the change. When a product defect prevents a passing case, keep a clear failing reproduction or a separately marked expected-failure case with an issue reference, and report the exact observed Foundry/dnd5e behavior.
5. Cleanup leaves the dedicated world as it was before the test, and failures retain a useful Playwright trace. Record the exact Foundry and dnd5e versions in the test report.
