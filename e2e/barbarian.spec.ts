import { test, expect } from "./fixtures";
import { openChatSidebar, useFeatureFromSheet } from "./support/actions";
import { recordUsedActivities } from "./support/activity-events";
import { grantActorToPlayer, refreshPlayerWorld } from "./support/actors";
import { createWildMagicBarbarian } from "./support/barbarians";
import { messagesAfter, readChatMessages } from "./support/observations";
import { createTestTable } from "./support/tables";
import { classifyChatCards } from "./support/chat-cards";
import { newChatViews, readChatViews } from "./support/observations";

test("entering Rage as a Wild Magic Barbarian draws from the chosen table", async ({
  gmPage,
  world,
}) => {
  const barbarian = await createWildMagicBarbarian(
    gmPage,
    `E2E Wild Magic Barbarian ${Date.now()}`,
  );
  world.trackActor(barbarian.actorId);
  const table = await createTestTable(
    gmPage,
    `E2E Barbarian Table ${Date.now()}`,
  );
  world.trackTable(table.id);
  await world.setSetting("enableRollTable", "AUTO");
  await world.setSetting("powmRollTableName", table.name);
  const chatBefore = await readChatMessages(gmPage);

  const usedActivities = await recordUsedActivities(gmPage, () =>
    useFeatureFromSheet(gmPage, barbarian.actorId, barbarian.rageId),
  );

  expect(usedActivities).toContainEqual({
    itemName: "Rage",
    itemType: "feat",
    spellLevel: null,
    spellSlotFlag: true,
  });
  await expect
    .poll(
      async () =>
        messagesAfter(chatBefore, await readChatMessages(gmPage)).filter(
          (message) =>
            message.content.includes("my-roll-result") &&
            message.content.includes(table.name),
        ).length,
    )
    .toBe(1);
});

test("a player can roll the Barbarian table from the Rage chat button", async ({
  gmPage,
  player,
  world,
}) => {
  test.setTimeout(180_000);
  const barbarian = await createWildMagicBarbarian(
    gmPage,
    `E2E Button Barbarian ${Date.now()}`,
  );
  world.trackActor(barbarian.actorId);
  await grantActorToPlayer(gmPage, barbarian.actorId, player.userId);
  await refreshPlayerWorld(player.page);
  const table = await createTestTable(
    gmPage,
    `E2E Player Barbarian Table ${Date.now()}`,
  );
  world.trackTable(table.id);
  await world.setSetting("enableRollTable", "PLAYER_TRIGGER");
  await world.setSetting("powmRollTableName", table.name);
  await world.setSetting("whisperToGM", false);
  const chatBefore = await readChatMessages(gmPage);

  await useFeatureFromSheet(gmPage, barbarian.actorId, barbarian.rageId);

  await openChatSidebar(player.page);
  const button = player.page.locator(".roll-table-wms").last();
  await expect(button).toBeVisible();
  expect(
    messagesAfter(chatBefore, await readChatMessages(gmPage)).filter(
      (message) => message.content.includes("my-roll-result"),
    ),
  ).toHaveLength(0);

  await button.click();

  await expect
    .poll(
      async () =>
        messagesAfter(chatBefore, await readChatMessages(gmPage)).filter(
          (message) =>
            message.content.includes("my-roll-result") &&
            message.content.includes(table.name),
        ).length,
    )
    .toBe(1);
  expect(
    messagesAfter(chatBefore, await readChatMessages(player.page)).filter(
      (message) =>
        message.content.includes("my-roll-result") &&
        message.content.includes(table.name),
    ),
  ).toHaveLength(1);
});

test("Given Path of Wild Magic and player-triggered tables, Rage makes one public button without a sorcerer check roll", async ({
  gmPage,
  player,
  unrelatedPlayer,
  world,
}) => {
  test.setTimeout(180_000);
  const barbarian = await createWildMagicBarbarian(
    gmPage,
    `E2E Path Chat ${Date.now()}`,
  );
  world.trackActor(barbarian.actorId);
  await grantActorToPlayer(gmPage, barbarian.actorId, player.userId);
  await refreshPlayerWorld(player.page);
  const table = await createTestTable(gmPage, `E2E Path Table ${Date.now()}`);
  world.trackTable(table.id);
  const marker = `E2E Path prompt ${Date.now()}`;
  await world.setSetting("enableRollTable", "PLAYER_TRIGGER");
  await world.setSetting("powmRollTableName", table.name);
  await world.setSetting("autoRollD20Message", marker);
  await world.setSetting("whisperToGM", false);
  await world.setCoreSetting("messageMode", "public");
  const sessions = {
    gm: gmPage,
    caster: player.page,
    unrelated: unrelatedPlayer.page,
  };
  const before = await readChatViews(sessions);

  const activities = await recordUsedActivities(gmPage, () =>
    useFeatureFromSheet(gmPage, barbarian.actorId, barbarian.rageId),
  );
  expect(activities).toContainEqual({
    itemName: "Rage",
    itemType: "feat",
    spellLevel: null,
    spellSlotFlag: true,
  });
  await expect
    .poll(async () => {
      const views = newChatViews(before, await readChatViews(sessions));
      return Object.values(views).map((messages) => {
        const cards = classifyChatCards(messages, {
          actorId: barbarian.actorId,
          checkText: marker,
          tableName: table.name,
        });
        return [cards.check.length, cards.button.length];
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
      actorId: barbarian.actorId,
      checkText: marker,
      tableName: table.name,
    });
    expect(cards.table).toHaveLength(0);
    expect(cards.bareCheck).toHaveLength(0);
    expect(cards.check[0].rollFormula).toBeNull();
  }
});
