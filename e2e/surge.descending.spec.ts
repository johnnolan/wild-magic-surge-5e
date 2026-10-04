import { test, expect } from "./fixtures";
import { createCaster, setSurgeStage } from "./support/actors";
import { castSpellFromSheet } from "./support/actions";
import {
  messagesAfter,
  readChatMessages,
  readSurgedFlag,
  readSurgeResource,
} from "./support/observations";
import { withFoundryRandomValue } from "./support/rolls";

const stages = [
  { stage: 1, die: "1d20" },
  { stage: 2, die: "1d12" },
  { stage: 3, die: "1d10" },
  { stage: 4, die: "1d8" },
  { stage: 5, die: "1d6" },
  { stage: 6, die: "1d4" },
] as const;

for (const group of [stages.slice(0, 3), stages.slice(3)]) {
  test(`a descending die advances through stages ${group.map(({ stage }) => stage).join(", ")}`, async ({
    gmPage,
    world,
  }) => {
    test.setTimeout(240_000);
    const caster = await createCaster(gmPage, {
      name: `E2E Descending Dice ${Date.now()}`,
      spellSlots: group.length + (group[0].stage === 4 ? 1 : 0),
    });
    world.trackActor(caster.actorId);
    await world.setSetting("autoRollD20", true);
    await world.setSetting("OPT_SURGE_TYPE", "DIE_DESCENDING");
    await world.setSetting("OPT_RESOURCE_TYPE", "NONE");
    await setSurgeStage(gmPage, caster.actorId, group[0].stage, 6, "resource");

    for (const { stage, die } of group) {
      const chatBefore = await readChatMessages(gmPage);
      await withFoundryRandomValue(gmPage, 0.5, async () => {
        await castSpellFromSheet(gmPage, caster);
        await expect
          .poll(
            async () =>
              messagesAfter(chatBefore, await readChatMessages(gmPage)).filter(
                (message) => message.rollTotal !== null,
              ).length,
          )
          .toBeGreaterThan(0);
        await expect
          .poll(
            async () =>
              (await readSurgeResource(gmPage, caster.actorId, "resource"))
                ?.value,
          )
          .toBe(Math.min(stage + 1, 6));
      });
      const newMessages = messagesAfter(
        chatBefore,
        await readChatMessages(gmPage),
      );
      const checkRoll = newMessages.find(
        (message) => message.rollTotal !== null,
      );
      expect(checkRoll?.rollFormula?.toLowerCase()).toBe(die);
      const total = checkRoll?.rollTotal;
      expect(total).toBeGreaterThan(1);
      expect(total).toBeLessThanOrEqual(Number(die.slice(2)));
      await expect
        .poll(() => readSurgedFlag(gmPage, caster.actorId))
        .toBe(false);
    }

    if (group[0].stage === 4) {
      const chatBeforeReset = await readChatMessages(gmPage);
      await withFoundryRandomValue(gmPage, 0.999, async () => {
        await castSpellFromSheet(gmPage, caster);
        await expect
          .poll(
            async () =>
              (await readSurgeResource(gmPage, caster.actorId, "resource"))
                ?.value,
          )
          .toBe(1);
      });
      const resetRoll = messagesAfter(
        chatBeforeReset,
        await readChatMessages(gmPage),
      ).find((message) => message.rollTotal !== null);
      expect(resetRoll?.rollFormula?.toLowerCase()).toBe("1d4");
      expect(resetRoll?.rollTotal).toBe(1);
      await expect
        .poll(() => readSurgedFlag(gmPage, caster.actorId))
        .toBe(true);
    }
  });
}
