import { test, expect } from "./fixtures";
import { createCaster } from "./support/actors";
import { castSpellFromSheet } from "./support/actions";
import {
  messagesAfter,
  readChatMessages,
  readSurgedFlag,
} from "./support/observations";
import { configureStandardOutcome } from "./support/recipes";

test("a Standard check records both surge and no-surge outcomes", async ({
  gmPage,
  world,
}) => {
  const caster = await createCaster(gmPage, {
    name: `E2E Standard Caster ${Date.now()}`,
  });
  world.trackActor(caster.actorId);
  const surgeText = `E2E Standard surge ${Date.now()}`;
  const noSurgeText = `E2E Standard no surge ${Date.now()}`;
  await world.setSetting("autoRollD20Message", surgeText);
  await world.setSetting("autoRollD20MessageEnabled", true);
  await world.setSetting("autoRollD20MessageNoSurge", noSurgeText);
  await world.setSetting("autoRollD20MessageNoSurgeEnabled", true);

  await configureStandardOutcome(world, "surge");
  const chatBeforeSurge = await readChatMessages(gmPage);
  await castSpellFromSheet(gmPage, caster);
  await expect.poll(() => readSurgedFlag(gmPage, caster.actorId)).toBe(true);
  const surgeRoll = messagesAfter(
    chatBeforeSurge,
    await readChatMessages(gmPage),
  ).find((message) => message.rollTotal !== null);
  expect(surgeRoll?.rollTotal).toBeGreaterThanOrEqual(1);
  expect(surgeRoll?.rollTotal).toBeLessThanOrEqual(20);
  expect(
    messagesAfter(chatBeforeSurge, await readChatMessages(gmPage)).some(
      (message) => `${message.content} ${message.flavor}`.includes(surgeText),
    ),
  ).toBe(true);

  await configureStandardOutcome(world, "no surge");
  const chatBeforeNoSurge = await readChatMessages(gmPage);
  await castSpellFromSheet(gmPage, caster);
  await expect.poll(() => readSurgedFlag(gmPage, caster.actorId)).toBe(false);
  const noSurgeRoll = messagesAfter(
    chatBeforeNoSurge,
    await readChatMessages(gmPage),
  ).find((message) => message.rollTotal !== null);
  expect(noSurgeRoll?.rollTotal).toBeGreaterThanOrEqual(1);
  expect(noSurgeRoll?.rollTotal).toBeLessThanOrEqual(20);
  expect(
    messagesAfter(chatBeforeNoSurge, await readChatMessages(gmPage)).some(
      (message) => `${message.content} ${message.flavor}`.includes(noSurgeText),
    ),
  ).toBe(true);
});
