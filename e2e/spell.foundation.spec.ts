import { test, expect } from "./fixtures";
import {
  createCaster,
  grantActorToPlayer,
  refreshPlayerWorld,
} from "./support/actors";
import { castLevelOneSpellFromSheet } from "./support/actions";
import {
  messagesAfter,
  readChatMessages,
  readLevelOneSlots,
} from "./support/observations";

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
