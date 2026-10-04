import { test, expect } from "./fixtures";
import { createCantripCaster, createCaster } from "./support/actors";
import { castCantripFromSheet, castSpellFromSheet } from "./support/actions";
import { recordUsedActivities } from "./support/activity-events";
import {
  messagesAfter,
  readChatMessages,
  readSpellSlots,
  readSurgedFlag,
} from "./support/observations";

test("a spell checks for Wild Magic only when its caster has the named feat", async ({
  gmPage,
  world,
}) => {
  const withoutFeat = await createCaster(gmPage, {
    name: `E2E No Feat ${Date.now()}`,
    includeFeat: false,
  });
  world.trackActor(withoutFeat.actorId);
  const withFeat = await createCaster(gmPage, {
    name: `E2E With Feat ${Date.now()}`,
  });
  world.trackActor(withFeat.actorId);
  const reminder = `E2E feat check ${Date.now()}`;
  await world.setSetting("autoRollD20", false);
  await world.setSetting("magicSurgeChatMessageEnabled", true);
  await world.setSetting("magicSurgeChatMessage", reminder);

  const chatBeforeMissingFeat = await readChatMessages(gmPage);
  const slotsWithoutFeat = await readSpellSlots(gmPage, withoutFeat.actorId, 1);
  await castSpellFromSheet(gmPage, withoutFeat);
  await expect
    .poll(() => readSpellSlots(gmPage, withoutFeat.actorId, 1))
    .toBe(slotsWithoutFeat - 1);
  expect(
    messagesAfter(chatBeforeMissingFeat, await readChatMessages(gmPage)).filter(
      (message) => message.content.includes(reminder),
    ),
  ).toHaveLength(0);
  expect(await readSurgedFlag(gmPage, withoutFeat.actorId)).toBeUndefined();

  const chatBeforeNamedFeat = await readChatMessages(gmPage);
  const slotsWithFeat = await readSpellSlots(gmPage, withFeat.actorId, 1);
  await castSpellFromSheet(gmPage, withFeat);
  await expect
    .poll(() => readSpellSlots(gmPage, withFeat.actorId, 1))
    .toBe(slotsWithFeat - 1);
  await expect
    .poll(
      async () =>
        messagesAfter(
          chatBeforeNamedFeat,
          await readChatMessages(gmPage),
        ).filter((message) => message.content.includes(reminder)).length,
    )
    .toBe(1);
});

test("a changed feat name accepts only the exact configured name", async ({
  gmPage,
  world,
}) => {
  const configuredName = `E2E Surge Feat ${Date.now()}`;
  const defaultFeat = await createCaster(gmPage, {
    name: `E2E Old Feat ${Date.now()}`,
  });
  world.trackActor(defaultFeat.actorId);
  const renamedFeat = await createCaster(gmPage, {
    name: `E2E Renamed Feat ${Date.now()}`,
    featName: configuredName,
  });
  world.trackActor(renamedFeat.actorId);
  const reminder = `E2E renamed feat reminder ${Date.now()}`;
  await world.setSetting("wmsName", configuredName);
  await world.setSetting("autoRollD20", false);
  await world.setSetting("magicSurgeChatMessageEnabled", true);
  await world.setSetting("magicSurgeChatMessage", reminder);

  for (const [caster, expectedMessages] of [
    [defaultFeat, 0],
    [renamedFeat, 1],
  ] as const) {
    const chatBefore = await readChatMessages(gmPage);
    const slotsBefore = await readSpellSlots(gmPage, caster.actorId, 1);
    await castSpellFromSheet(gmPage, caster);
    await expect
      .poll(() => readSpellSlots(gmPage, caster.actorId, 1))
      .toBe(slotsBefore - 1);
    await expect
      .poll(
        async () =>
          messagesAfter(chatBefore, await readChatMessages(gmPage)).filter(
            (message) => message.content.includes(reminder),
          ).length,
      )
      .toBe(expectedMessages);
  }
});

test("NPC spell checks follow the NPC tracking option", async ({
  gmPage,
  world,
}) => {
  const npc = await createCaster(gmPage, {
    name: `E2E NPC ${Date.now()}`,
    actorType: "npc",
  });
  world.trackActor(npc.actorId);
  const reminder = `E2E NPC reminder ${Date.now()}`;
  await world.setSetting("autoRollD20", false);
  await world.setSetting("magicSurgeChatMessageEnabled", true);
  await world.setSetting("magicSurgeChatMessage", reminder);

  for (const enabled of [false, true]) {
    await world.setSetting("enableNpcTracking", enabled);
    const chatBefore = await readChatMessages(gmPage);
    const slotsBefore = await readSpellSlots(gmPage, npc.actorId, 1);
    await castSpellFromSheet(gmPage, npc);
    await expect
      .poll(() => readSpellSlots(gmPage, npc.actorId, 1))
      .toBe(slotsBefore - 1);
    await expect
      .poll(
        async () =>
          messagesAfter(chatBefore, await readChatMessages(gmPage)).filter(
            (message) => message.content.includes(reminder),
          ).length,
      )
      .toBe(enabled ? 1 : 0);
  }
});

test("a minimum spell level ignores a lower spell but checks a higher spell", async ({
  gmPage,
  world,
}) => {
  const levelOne = await createCaster(gmPage, {
    name: `E2E Level One ${Date.now()}`,
  });
  world.trackActor(levelOne.actorId);
  const levelThree = await createCaster(gmPage, {
    name: `E2E Level Three ${Date.now()}`,
    spellName: "Blink",
  });
  world.trackActor(levelThree.actorId);
  expect(levelThree.spellLevel).toBe(3);
  const reminder = `E2E minimum level ${Date.now()}`;
  await world.setSetting("minimumSpellLevelTrigger", "3");
  await world.setSetting("autoRollD20", false);
  await world.setSetting("magicSurgeChatMessageEnabled", true);
  await world.setSetting("magicSurgeChatMessage", reminder);

  for (const [caster, expectedMessages] of [
    [levelOne, 0],
    [levelThree, 1],
  ] as const) {
    const chatBefore = await readChatMessages(gmPage);
    const slotsBefore = await readSpellSlots(
      gmPage,
      caster.actorId,
      caster.spellLevel,
    );
    if (caster === levelThree) {
      const activities = await recordUsedActivities(gmPage, () =>
        castSpellFromSheet(gmPage, caster),
      );
      expect(activities).toContainEqual({
        itemName: "Blink",
        itemType: "spell",
        spellLevel: 3,
        spellSlotFlag: true,
      });
    } else {
      await castSpellFromSheet(gmPage, caster);
    }
    await expect
      .poll(() => readSpellSlots(gmPage, caster.actorId, caster.spellLevel))
      .toBe(slotsBefore - 1);
    await expect
      .poll(
        async () =>
          messagesAfter(chatBefore, await readChatMessages(gmPage)).filter(
            (message) => message.content.includes(reminder),
          ).length,
      )
      .toBe(expectedMessages);
  }
});

test("a cantrip reports a spell-slot activity without spending a slot", async ({
  gmPage,
  world,
}) => {
  const caster = await createCantripCaster(
    gmPage,
    `E2E Cantrip Activity ${Date.now()}`,
  );
  world.trackActor(caster.actorId);
  expect(caster.spellLevel).toBe(0);
  const slotsBefore = await readSpellSlots(gmPage, caster.actorId, 1);

  const usedActivities = await recordUsedActivities(gmPage, () =>
    castCantripFromSheet(gmPage, caster),
  );

  expect(usedActivities).toContainEqual({
    itemName: "Light",
    itemType: "spell",
    spellLevel: 0,
    spellSlotFlag: true,
  });
  expect(await readSpellSlots(gmPage, caster.actorId, 1)).toBe(slotsBefore);
});

test("the spell-name filter can include or exclude the same marked spell", async ({
  gmPage,
  world,
}) => {
  test.setTimeout(150_000);
  const marked = await createCaster(gmPage, {
    name: `E2E Marked Spell ${Date.now()}`,
    displaySpellName: "Magic Missile (S)",
  });
  world.trackActor(marked.actorId);
  const unmarked = await createCaster(gmPage, {
    name: `E2E Unmarked Spell ${Date.now()}`,
  });
  world.trackActor(unmarked.actorId);
  const reminder = `E2E spell-name filter ${Date.now()}`;
  await world.setSetting("autoRollD20", false);
  await world.setSetting("magicSurgeChatMessageEnabled", true);
  await world.setSetting("magicSurgeChatMessage", reminder);
  await world.setSetting("spellRegexEnabled", true);
  await world.setSetting("spellRegex", "\\(S\\)");

  for (const inverse of [false, true]) {
    await world.setSetting("spellRegexInverse", inverse);
    for (const [caster, expectedMessages] of [
      [marked, inverse ? 0 : 1],
      [unmarked, inverse ? 1 : 0],
    ] as const) {
      const chatBefore = await readChatMessages(gmPage);
      const slotsBefore = await readSpellSlots(gmPage, caster.actorId, 1);
      await castSpellFromSheet(gmPage, caster);
      await expect
        .poll(() => readSpellSlots(gmPage, caster.actorId, 1))
        .toBe(slotsBefore - 1);
      await expect
        .poll(
          async () =>
            messagesAfter(chatBefore, await readChatMessages(gmPage)).filter(
              (message) => message.content.includes(reminder),
            ).length,
        )
        .toBe(expectedMessages);
    }
  }
});
