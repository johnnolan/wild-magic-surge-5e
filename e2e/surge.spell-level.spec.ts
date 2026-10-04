import { test, expect } from "./fixtures";
import { openSettingsPanel } from "./foundry";
import { createCaster } from "./support/actors";
import { castSpellFromSheet } from "./support/actions";
import {
  messagesAfter,
  readChatMessages,
  readSpellSlots,
  readSurgedFlag,
} from "./support/observations";

test("different spell levels use their saved roll rules", async ({
  gmPage,
  world,
}) => {
  test.setTimeout(180_000);
  const levelOne = await createCaster(gmPage, {
    name: `E2E Rule Level One ${Date.now()}`,
  });
  world.trackActor(levelOne.actorId);
  const levelTwo = await createCaster(gmPage, {
    name: `E2E Rule Level Two ${Date.now()}`,
    spellName: "Mirror Image",
  });
  world.trackActor(levelTwo.actorId);
  const levelThree = await createCaster(gmPage, {
    name: `E2E Rule Level Three ${Date.now()}`,
    spellName: "Blink",
  });
  world.trackActor(levelThree.actorId);
  expect([
    levelOne.spellLevel,
    levelTwo.spellLevel,
    levelThree.spellLevel,
  ]).toEqual([1, 2, 3]);

  const rules = {
    OPT_TSL_DIE: "1d1",
    OPT_TSL_CANTRIP: "1d20 < 21",
    OPT_TSL_LVL1: "2d20kh < 21",
    OPT_TSL_LVL2: "1d20 > 20",
    OPT_TSL_LVL3: "= 1",
  };
  for (const key of Object.keys(rules)) await world.rememberSetting(key);
  await openSettingsPanel(gmPage, "SpellLevelSettingsPanel", "OPT_TSL_DIE");
  for (const [key, value] of Object.entries(rules)) {
    await gmPage.locator(`[name="wild-magic-surge-5e.${key}"]`).fill(value);
  }
  await gmPage.getByRole("button", { name: "Save Changes" }).click();
  await world.setSetting("autoRollD20", true);
  await world.setSetting("OPT_SURGE_TYPE", "SPELL_LEVEL_DEPENDENT_ROLL");

  for (const [caster, expectedSurge, expectedFormula, expectedTotal] of [
    [levelOne, true, "2d20kh", null],
    [levelTwo, false, "1d20", null],
    [levelThree, true, "1d1", 1],
  ] as const) {
    const chatBefore = await readChatMessages(gmPage);
    const slotsBefore = await readSpellSlots(
      gmPage,
      caster.actorId,
      caster.spellLevel,
    );
    await castSpellFromSheet(gmPage, caster);
    await expect
      .poll(() => readSpellSlots(gmPage, caster.actorId, caster.spellLevel))
      .toBe(slotsBefore - 1);
    await expect
      .poll(() => readSurgedFlag(gmPage, caster.actorId))
      .toBe(expectedSurge);
    const rollMessages = messagesAfter(
      chatBefore,
      await readChatMessages(gmPage),
    ).filter((message) => message.rollTotal !== null);
    expect(rollMessages.length).toBeGreaterThan(0);
    const checkRoll = rollMessages[0];
    expect(checkRoll.rollFormula?.toLowerCase()).toBe(expectedFormula);
    if (expectedTotal !== null) expect(checkRoll.rollTotal).toBe(expectedTotal);
    else {
      expect(checkRoll.rollTotal).toBeGreaterThanOrEqual(1);
      expect(checkRoll.rollTotal).toBeLessThanOrEqual(20);
    }
  }
});
