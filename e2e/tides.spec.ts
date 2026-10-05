import { test, expect } from "./fixtures";
import {
  createCaster,
  grantActorToPlayer,
  refreshPlayerWorld,
} from "./support/actors";
import { castSpellFromSheet, useFeatureFromSheet } from "./support/actions";
import { castAndWaitForCheck, classifyChatCards } from "./support/chat-cards";
import { addTidesOfChaos, readTidesUses } from "./support/feats";
import {
  newChatViews,
  readChatViews,
  readSurgedFlag,
} from "./support/observations";
import { configureStandardOutcome } from "./support/recipes";
import { createTestTable } from "./support/tables";

test("using Tides forces a surge and restores its spent use when enabled", async ({
  gmPage,
  world,
}) => {
  test.setTimeout(180_000);
  const caster = await createCaster(gmPage, {
    name: `E2E Tides Caster ${Date.now()}`,
  });
  world.trackActor(caster.actorId);
  const featId = await addTidesOfChaos(gmPage, caster.actorId);
  await world.setSetting("surgeTocEnabled", true);
  await world.setSetting("enableTidesOfChaosRecharge", true);
  await configureStandardOutcome(world, "no surge");

  await useFeatureFromSheet(gmPage, caster.actorId, featId);
  await expect
    .poll(
      async () => (await readTidesUses(gmPage, caster.actorId, featId)).value,
    )
    .toBe(0);
  expect((await readTidesUses(gmPage, caster.actorId, featId)).spent).toBe(1);
  await castSpellFromSheet(gmPage, caster);

  await expect.poll(() => readSurgedFlag(gmPage, caster.actorId)).toBe(true);
  await expect
    .poll(
      async () => (await readTidesUses(gmPage, caster.actorId, featId)).value,
    )
    .toBe(1);
  expect((await readTidesUses(gmPage, caster.actorId, featId)).spent).toBe(0);
});

test("a spent Tides use waits for an ordinary surge when auto surge is off", async ({
  gmPage,
  world,
}) => {
  test.setTimeout(180_000);
  const caster = await createCaster(gmPage, {
    name: `E2E Tides Control ${Date.now()}`,
  });
  world.trackActor(caster.actorId);
  const featId = await addTidesOfChaos(gmPage, caster.actorId);
  await world.setSetting("surgeTocEnabled", false);
  await world.setSetting("enableTidesOfChaosRecharge", true);
  await useFeatureFromSheet(gmPage, caster.actorId, featId);
  await expect
    .poll(
      async () => (await readTidesUses(gmPage, caster.actorId, featId)).value,
    )
    .toBe(0);
  expect((await readTidesUses(gmPage, caster.actorId, featId)).spent).toBe(1);

  await configureStandardOutcome(world, "no surge");
  await castSpellFromSheet(gmPage, caster);
  await expect.poll(() => readSurgedFlag(gmPage, caster.actorId)).toBe(false);
  expect((await readTidesUses(gmPage, caster.actorId, featId)).value).toBe(0);
  expect((await readTidesUses(gmPage, caster.actorId, featId)).spent).toBe(1);

  await configureStandardOutcome(world, "surge");
  await castSpellFromSheet(gmPage, caster);
  await expect.poll(() => readSurgedFlag(gmPage, caster.actorId)).toBe(true);
  await expect
    .poll(
      async () => (await readTidesUses(gmPage, caster.actorId, featId)).value,
    )
    .toBe(1);
  expect((await readTidesUses(gmPage, caster.actorId, featId)).spent).toBe(0);
});

test("Given a spent Tides use, when the player casts, one surge message and table result appear without a check d20", async ({
  gmPage,
  player,
  unrelatedPlayer,
  world,
}) => {
  test.setTimeout(240_000);
  const caster = await createCaster(gmPage, {
    name: `E2E Tides Chat ${Date.now()}`,
  });
  world.trackActor(caster.actorId);
  await grantActorToPlayer(gmPage, caster.actorId, player.userId);
  await refreshPlayerWorld(player.page);
  const featId = await addTidesOfChaos(gmPage, caster.actorId);
  const table = await createTestTable(gmPage, `E2E Tides Table ${Date.now()}`);
  world.trackTable(table.id);
  const marker = `E2E Tides message ${Date.now()}`;
  await configureStandardOutcome(world, "no surge");
  await world.setSetting("surgeTocEnabled", true);
  await world.setSetting("enableTidesOfChaosRecharge", true);
  await world.setSetting("autoRollD20Message", marker);
  await world.setSetting("autoRollD20MessageEnabled", true);
  await world.setSetting("enableRollTable", "AUTO");
  await world.setSetting("rollTableName", table.name);
  await world.setSetting("whisperToGM", false);
  await world.setSetting("whisperToGMRollChat", false);
  await world.setCoreSetting("messageMode", "public");

  await useFeatureFromSheet(gmPage, caster.actorId, featId);
  await expect
    .poll(
      async () => (await readTidesUses(gmPage, caster.actorId, featId)).value,
    )
    .toBe(0);
  const sessions = {
    gm: gmPage,
    caster: player.page,
    unrelated: unrelatedPlayer.page,
  };
  const before = await readChatViews(sessions);
  await castAndWaitForCheck(gmPage, player.page, caster);
  await expect.poll(() => readSurgedFlag(gmPage, caster.actorId)).toBe(true);
  await expect
    .poll(async () => {
      const views = newChatViews(before, await readChatViews(sessions));
      return Object.values(views).map((messages) => {
        const cards = classifyChatCards(messages, {
          actorId: caster.actorId,
          checkText: marker,
          tableName: table.name,
        });
        return [cards.check.length, cards.table.length];
      });
    })
    .toEqual([
      [1, 1],
      [1, 1],
      [1, 1],
    ]);
  const views = newChatViews(before, await readChatViews(sessions));
  for (const messages of Object.values(views)) {
    const cards = classifyChatCards(messages, {
      actorId: caster.actorId,
      checkText: marker,
      tableName: table.name,
    });
    expect(cards.spell).toHaveLength(1);
    expect(cards.bareCheck).toHaveLength(0);
    expect(cards.button).toHaveLength(0);
    expect(cards.check[0].rollFormula).toBeNull();
  }
  expect((await readTidesUses(gmPage, caster.actorId, featId)).value).toBe(1);
});
