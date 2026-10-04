import { test, expect } from "./fixtures";
import { createCaster } from "./support/actors";
import { castLevelOneSpellFromSheet } from "./support/actions";
import {
  messagesAfter,
  readChatMessages,
  readLevelOneSlots,
  readSurgedFlag,
  type ChatObservation,
} from "./support/observations";
import { configureStandardOutcome } from "./support/recipes";

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
