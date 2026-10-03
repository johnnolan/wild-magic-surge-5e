import { test, expect } from "./fixtures";
import {
  createCaster,
  grantActorToPlayer,
  refreshPlayerWorld,
  setIncrementalThreshold,
} from "./support/actors";
import { castLevelOneSpellFromSheet } from "./support/actions";
import {
  messagesAfter,
  readChatMessages,
  readLevelOneSlots,
  readSurgedFlag,
  readSurgeResource,
} from "./support/observations";
import {
  configureIncrementalIncrease,
  configureSpellLevelOutcome,
  configureStandardOutcome,
} from "./support/recipes";

test("a Wild Magic caster can use a level-one spell from the sheet", async ({
  gmPage,
  world,
}) => {
  const caster = await createCaster(gmPage, {
    name: `E2E Caster ${Date.now()}`,
  });
  world.trackActor(caster.actorId);
  await world.setSetting("autoRollD20", false);
  await world.setSetting("magicSurgeChatMessageEnabled", true);

  const slotsBefore = await readLevelOneSlots(gmPage, caster.actorId);
  const chatBefore = await readChatMessages(gmPage);

  await castLevelOneSpellFromSheet(gmPage, caster);

  await expect
    .poll(() => readLevelOneSlots(gmPage, caster.actorId))
    .toBe(slotsBefore - 1);
  await expect
    .poll(
      async () =>
        messagesAfter(chatBefore, await readChatMessages(gmPage)).filter(
          (message) => message.content.includes("Wild Magic Check"),
        ).length,
    )
    .toBe(1);
});

test("a player's spell reaches the GM's Wild Magic check", async ({
  gmPage,
  player,
  world,
}) => {
  test.setTimeout(150_000);
  const caster = await createCaster(gmPage, {
    name: `E2E Player Caster ${Date.now()}`,
  });
  world.trackActor(caster.actorId);
  await grantActorToPlayer(gmPage, caster.actorId, player.userId);
  await refreshPlayerWorld(player.page);
  await world.setSetting("autoRollD20", false);
  await world.setSetting("magicSurgeChatMessageEnabled", true);

  const slotsBefore = await readLevelOneSlots(player.page, caster.actorId);
  const gmChatBefore = await readChatMessages(gmPage);

  await castLevelOneSpellFromSheet(player.page, caster);

  await expect
    .poll(() => readLevelOneSlots(player.page, caster.actorId))
    .toBe(slotsBefore - 1);
  await expect
    .poll(
      async () =>
        messagesAfter(gmChatBefore, await readChatMessages(gmPage)).filter(
          (message) => message.content.includes("Wild Magic Check"),
        ).length,
    )
    .toBe(1);
});

test("a real Standard roll can reliably surge and then not surge", async ({
  gmPage,
  world,
}) => {
  const caster = await createCaster(gmPage, {
    name: `E2E Standard Caster ${Date.now()}`,
  });
  world.trackActor(caster.actorId);

  await configureStandardOutcome(world, "surge");
  const chatBeforeSurge = await readChatMessages(gmPage);
  await castLevelOneSpellFromSheet(gmPage, caster);
  await expect.poll(() => readSurgedFlag(gmPage, caster.actorId)).toBe(true);
  const surgeRoll = messagesAfter(
    chatBeforeSurge,
    await readChatMessages(gmPage),
  ).find((message) => message.rollTotal !== null);
  expect(surgeRoll?.rollTotal).toBeGreaterThanOrEqual(1);
  expect(surgeRoll?.rollTotal).toBeLessThanOrEqual(20);

  await configureStandardOutcome(world, "no surge");
  const chatBeforeNoSurge = await readChatMessages(gmPage);
  await castLevelOneSpellFromSheet(gmPage, caster);
  await expect.poll(() => readSurgedFlag(gmPage, caster.actorId)).toBe(false);
  const noSurgeRoll = messagesAfter(
    chatBeforeNoSurge,
    await readChatMessages(gmPage),
  ).find((message) => message.rollTotal !== null);
  expect(noSurgeRoll?.rollTotal).toBeGreaterThanOrEqual(1);
  expect(noSurgeRoll?.rollTotal).toBeLessThanOrEqual(20);
});

test("an incremental check can increase without relying on luck", async ({
  gmPage,
  world,
}) => {
  const caster = await createCaster(gmPage, {
    name: `E2E Incremental Caster ${Date.now()}`,
  });
  world.trackActor(caster.actorId);
  await configureIncrementalIncrease(world);

  const chatBefore = await readChatMessages(gmPage);
  await castLevelOneSpellFromSheet(gmPage, caster);

  await expect
    .poll(async () => (await readSurgeResource(gmPage, caster.actorId))?.value)
    .toBe(2);
  const roll = messagesAfter(chatBefore, await readChatMessages(gmPage)).find(
    (message) => message.rollTotal !== null,
  );
  expect(roll?.rollTotal).toBeGreaterThan(20);

  await world.setSetting("customRollDiceFormula", "1d20");
  await setIncrementalThreshold(gmPage, caster.actorId, 20);
  await castLevelOneSpellFromSheet(gmPage, caster);
  await expect
    .poll(async () => (await readSurgeResource(gmPage, caster.actorId))?.value)
    .toBe(1);
  await expect.poll(() => readSurgedFlag(gmPage, caster.actorId)).toBe(true);
});

test("a spell-level rule can force either roll outcome", async ({
  gmPage,
  world,
}) => {
  const caster = await createCaster(gmPage, {
    name: `E2E Level Caster ${Date.now()}`,
  });
  world.trackActor(caster.actorId);

  await configureSpellLevelOutcome(world, "surge");
  await castLevelOneSpellFromSheet(gmPage, caster);
  await expect.poll(() => readSurgedFlag(gmPage, caster.actorId)).toBe(true);

  await configureSpellLevelOutcome(world, "no surge");
  await castLevelOneSpellFromSheet(gmPage, caster);
  await expect.poll(() => readSurgedFlag(gmPage, caster.actorId)).toBe(false);
});
