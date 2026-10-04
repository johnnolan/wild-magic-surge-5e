import { test, expect } from "./fixtures";
import { createCaster, setIncrementalThreshold } from "./support/actors";
import { castSpellFromSheet } from "./support/actions";
import {
  messagesAfter,
  readChatMessages,
  readSurgedFlag,
  readSurgeResource,
} from "./support/observations";
import { configureIncrementalIncrease } from "./support/recipes";

test("an incremental charge is announced after a miss and resets after a surge", async ({
  gmPage,
  world,
}) => {
  const caster = await createCaster(gmPage, {
    name: `E2E Incremental Messages ${Date.now()}`,
  });
  world.trackActor(caster.actorId);
  await configureIncrementalIncrease(world);
  await world.setSetting("incrementalCheckToChat", true);
  const chargePrefix = await gmPage.evaluate(() => {
    const { game } = globalThis as unknown as {
      game: { i18n: { format(key: string): string } };
    };
    return game.i18n.format(
      "WildMagicSurge5E.opt_incremental_check_to_chat_text_name",
    );
  });

  const chatBeforeIncrease = await readChatMessages(gmPage);
  await castSpellFromSheet(gmPage, caster);
  await expect
    .poll(async () => (await readSurgeResource(gmPage, caster.actorId))?.value)
    .toBe(2);
  const increasedMessages = messagesAfter(
    chatBeforeIncrease,
    await readChatMessages(gmPage),
  );
  expect(
    increasedMessages.filter((message) =>
      message.content.includes(`${chargePrefix} 2`),
    ),
  ).toHaveLength(1);
  expect(await readSurgedFlag(gmPage, caster.actorId)).toBe(false);

  await world.setSetting("customRollDiceFormula", "1d20");
  await setIncrementalThreshold(gmPage, caster.actorId, 20);
  const chatBeforeSurge = await readChatMessages(gmPage);
  await castSpellFromSheet(gmPage, caster);
  await expect
    .poll(async () => (await readSurgeResource(gmPage, caster.actorId))?.value)
    .toBe(1);
  await expect.poll(() => readSurgedFlag(gmPage, caster.actorId)).toBe(true);
  const resetMessages = messagesAfter(
    chatBeforeSurge,
    await readChatMessages(gmPage),
  );
  expect(
    resetMessages.filter((message) => message.content.includes(chargePrefix)),
  ).toHaveLength(0);
});
