import { test, expect } from "./fixtures";
import { createCaster, setIncrementalThreshold } from "./support/actors";
import { castLevelOneSpellFromSheet } from "./support/actions";
import { castAndWaitForCheck } from "./support/chat-cards";
import {
  messagesAfter,
  readChatMessages,
  readLevelOneSlots,
  readSurgedFlag,
  readSurgeResource,
  type ChatObservation,
} from "./support/observations";
import {
  configureIncrementalIncrease,
  configureStandardOutcome,
} from "./support/recipes";
import { withFoundryRandomValue } from "./support/rolls";

function containsText(message: ChatObservation, text: string): boolean {
  return `${message.content} ${message.flavor}`.includes(text);
}

test("a spell shows the configured reminder only while reminders are enabled", async ({
  gmPage,
  world,
}) => {
  const caster = await createCaster(gmPage, {
    name: `E2E Reminder Caster ${Date.now()}`,
  });
  world.trackActor(caster.actorId);
  const reminder = `E2E reminder ${Date.now()}`;
  await world.setSetting("autoRollD20", false);
  await world.setSetting("magicSurgeChatMessage", reminder);
  await world.setSetting("magicSurgeChatMessageEnabled", true);

  const chatBefore = await readChatMessages(gmPage);
  await castLevelOneSpellFromSheet(gmPage, caster);
  await expect
    .poll(
      async () =>
        messagesAfter(chatBefore, await readChatMessages(gmPage)).filter(
          (message) => containsText(message, reminder),
        ).length,
    )
    .toBe(1);

  await world.setSetting("magicSurgeChatMessageEnabled", false);
  const chatBeforeDisabledCast = await readChatMessages(gmPage);
  const slotsBefore = await readLevelOneSlots(gmPage, caster.actorId);
  await castLevelOneSpellFromSheet(gmPage, caster);
  await expect
    .poll(() => readLevelOneSlots(gmPage, caster.actorId))
    .toBe(slotsBefore - 1);
  expect(
    messagesAfter(
      chatBeforeDisabledCast,
      await readChatMessages(gmPage),
    ).filter((message) => containsText(message, reminder)),
  ).toHaveLength(0);
});

for (const outcome of ["surge", "no surge"] as const) {
  test(`the ${outcome} message follows its own display option`, async ({
    gmPage,
    world,
  }) => {
    const caster = await createCaster(gmPage, {
      name: `E2E Message Caster ${Date.now()}`,
    });
    world.trackActor(caster.actorId);
    await configureStandardOutcome(world, outcome);
    const message = `E2E ${outcome} message ${Date.now()}`;
    const messageKey =
      outcome === "surge" ? "autoRollD20Message" : "autoRollD20MessageNoSurge";
    const enabledKey = `${messageKey}Enabled`;
    await world.setSetting(messageKey, message);
    await world.setSetting(enabledKey, true);

    const chatBefore = await readChatMessages(gmPage);
    await castLevelOneSpellFromSheet(gmPage, caster);
    await expect
      .poll(() => readSurgedFlag(gmPage, caster.actorId))
      .toBe(outcome === "surge");
    await expect
      .poll(
        async () =>
          messagesAfter(chatBefore, await readChatMessages(gmPage)).filter(
            (entry) => containsText(entry, message),
          ).length,
      )
      .toBe(1);

    await world.setSetting(enabledKey, false);
    const chatBeforeDisabledCast = await readChatMessages(gmPage);
    const slotsBefore = await readLevelOneSlots(gmPage, caster.actorId);
    await castLevelOneSpellFromSheet(gmPage, caster);
    await expect
      .poll(() => readLevelOneSlots(gmPage, caster.actorId))
      .toBe(slotsBefore - 1);
    await expect
      .poll(() => readSurgedFlag(gmPage, caster.actorId))
      .toBe(outcome === "surge");
    expect(
      messagesAfter(
        chatBeforeDisabledCast,
        await readChatMessages(gmPage),
      ).filter((entry) => containsText(entry, message)),
    ).toHaveLength(0);
  });
}

test("an incremental charge card appears only for enabled increases, not a disabled increase or threshold reset", async ({
  gmPage,
  world,
}) => {
  test.setTimeout(180_000);
  const caster = await createCaster(gmPage, {
    name: `E2E Charge Switch ${Date.now()}`,
    spellSlots: 3,
  });
  world.trackActor(caster.actorId);
  await configureIncrementalIncrease(world);
  await world.setSetting("enableRollTable", "DEFAULT");
  await world.setSetting("incrementalCheckToChat", true);
  await world.setCoreSetting("messageMode", "public");
  await setIncrementalThreshold(gmPage, caster.actorId, 1);
  const chargePrefix = await gmPage.evaluate(() => {
    const { game } = globalThis as unknown as {
      game: { i18n: { format(key: string): string } };
    };
    return game.i18n.format(
      "WildMagicSurge5E.opt_incremental_check_to_chat_text_name",
    );
  });
  const chargeCards = async (
    before: Awaited<ReturnType<typeof readChatMessages>>,
  ) =>
    messagesAfter(before, await readChatMessages(gmPage)).filter((message) =>
      containsText(message, chargePrefix),
    );

  const enabledBefore = await readChatMessages(gmPage);
  await castAndWaitForCheck(gmPage, gmPage, caster);
  expect(await chargeCards(enabledBefore)).toHaveLength(1);
  expect((await readSurgeResource(gmPage, caster.actorId))?.value).toBe(2);

  await world.setSetting("incrementalCheckToChat", false);
  const disabledBefore = await readChatMessages(gmPage);
  await castAndWaitForCheck(gmPage, gmPage, caster);
  expect(await chargeCards(disabledBefore)).toHaveLength(0);
  expect((await readSurgeResource(gmPage, caster.actorId))?.value).toBe(3);

  await world.setSetting("incrementalCheckToChat", true);
  await world.setSetting("customRollDiceFormula", "1d20");
  const resetBefore = await readChatMessages(gmPage);
  await withFoundryRandomValue(gmPage, 0.999, () =>
    castAndWaitForCheck(gmPage, gmPage, caster),
  );
  expect(await chargeCards(resetBefore)).toHaveLength(0);
  expect((await readSurgeResource(gmPage, caster.actorId))?.value).toBe(1);
});
