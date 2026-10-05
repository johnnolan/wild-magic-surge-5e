import { test, expect } from "./fixtures";
import {
  createCaster,
  grantActorToPlayer,
  refreshPlayerWorld,
} from "./support/actors";
import { castSpellFromSheet } from "./support/actions";
import {
  messagesAfter,
  readChatMessages,
  readSpellSlots,
  readSurgeResource,
  type ChatObservation,
} from "./support/observations";
import {
  configureIncrementalIncrease,
  configureStandardOutcome,
} from "./support/recipes";
import { createTestTable } from "./support/tables";

function mentions(message: ChatObservation, text: string): boolean {
  return `${message.content} ${message.flavor}`.includes(text);
}

test("a table result can stay public while the surge roll is GM-only", async ({
  gmPage,
  player,
  world,
}) => {
  test.setTimeout(180_000);
  const caster = await createCaster(gmPage, {
    name: `E2E Table Audience Caster ${Date.now()}`,
  });
  world.trackActor(caster.actorId);
  const table = await createTestTable(
    gmPage,
    `E2E Audience Table ${Date.now()}`,
  );
  world.trackTable(table.id);
  const rollText = `E2E private surge roll ${Date.now()}`;
  await configureStandardOutcome(world, "surge");
  await world.setSetting("autoRollD20Message", rollText);
  await world.setSetting("autoRollD20MessageEnabled", true);
  await world.setSetting("enableRollTable", "AUTO");
  await world.setSetting("rollTableName", table.name);
  await world.setSetting("whisperToGM", true);

  for (const tablePrivateToGM of [false, true]) {
    await world.setSetting("whisperToGMRollChat", tablePrivateToGM);
    const gmBefore = await readChatMessages(gmPage);
    const playerBefore = await readChatMessages(player.page);
    await castSpellFromSheet(gmPage, caster);
    await expect
      .poll(
        async () =>
          messagesAfter(gmBefore, await readChatMessages(gmPage)).filter(
            (message) =>
              message.content.includes("my-roll-result") &&
              message.content.includes(table.name),
          ).length,
      )
      .toBe(1);
    const gmNew = messagesAfter(gmBefore, await readChatMessages(gmPage));
    expect(gmNew.filter((message) => mentions(message, rollText))).toHaveLength(
      1,
    );
    await expect
      .poll(
        async () =>
          messagesAfter(
            playerBefore,
            await readChatMessages(player.page),
          ).filter((message) => message.speakerActorId === caster.actorId)
            .length,
      )
      .toBeGreaterThan(0);
    const playerNew = messagesAfter(
      playerBefore,
      await readChatMessages(player.page),
    );
    const playerTable = playerNew.filter(
      (message) =>
        message.content.includes("my-roll-result") &&
        message.content.includes(table.name),
    );
    if (!tablePrivateToGM) {
      await expect
        .poll(
          async () =>
            messagesAfter(
              playerBefore,
              await readChatMessages(player.page),
            ).filter(
              (message) =>
                message.content.includes("my-roll-result") &&
                message.content.includes(table.name),
            ).length,
        )
        .toBe(1);
    } else {
      expect(playerTable).toHaveLength(0);
    }
    expect(
      playerNew.filter((message) => mentions(message, rollText)),
    ).toHaveLength(0);
  }
});

async function preparePlayerCaster(
  gmPage: Parameters<typeof createCaster>[0],
  player: { page: Parameters<typeof createCaster>[0]; userId: string },
  world: { trackActor(id: string): void },
) {
  const caster = await createCaster(gmPage, {
    name: `E2E Private Chat ${Date.now()}`,
  });
  world.trackActor(caster.actorId);
  await grantActorToPlayer(gmPage, caster.actorId, player.userId);
  await refreshPlayerWorld(player.page);
  return caster;
}

for (const kind of ["reminder", "incremental charge", "roll result"] as const) {
  const article = kind === "incremental charge" ? "an" : "a";
  test(`${article} ${kind} is visible to all users or only the GM as configured`, async ({
    gmPage,
    player,
    unrelatedPlayer,
    world,
  }) => {
    test.setTimeout(240_000);
    const caster = await preparePlayerCaster(gmPage, player, world);
    const marker = `E2E ${kind} ${Date.now()}`;
    await world.setCoreSetting("messageMode", "public");
    if (kind === "incremental charge") {
      await configureIncrementalIncrease(world);
      await world.setSetting("incrementalCheckToChat", true);
    } else if (kind === "roll result") {
      await configureStandardOutcome(world, "no surge");
      await world.setSetting("autoRollD20MessageNoSurge", marker);
      await world.setSetting("autoRollD20MessageNoSurgeEnabled", true);
      await world.setCoreSetting("messageMode", "public");
    } else {
      await world.setSetting("autoRollD20", false);
      await world.setSetting("magicSurgeChatMessage", marker);
      await world.setSetting("magicSurgeChatMessageEnabled", true);
    }
    const chargePrefix =
      kind === "incremental charge"
        ? await gmPage.evaluate(() => {
            const { game } = globalThis as unknown as {
              game: { i18n: { format(key: string): string } };
            };
            return game.i18n.format(
              "WildMagicSurge5E.opt_incremental_check_to_chat_text_name",
            );
          })
        : "";

    for (const privateToGM of [false, true]) {
      await world.setSetting("whisperToGM", privateToGM);
      const gmBefore = await readChatMessages(gmPage);
      const playerBefore = await readChatMessages(player.page);
      const unrelatedBefore = await readChatMessages(unrelatedPlayer.page);
      const slotsBefore = await readSpellSlots(player.page, caster.actorId, 1);

      await castSpellFromSheet(player.page, caster);

      await expect
        .poll(() => readSpellSlots(player.page, caster.actorId, 1))
        .toBe(slotsBefore - 1);
      if (kind === "incremental charge") {
        await expect
          .poll(
            async () =>
              (await readSurgeResource(gmPage, caster.actorId))?.value,
          )
          .toBe(privateToGM ? 3 : 2);
      }
      const expectedText =
        kind === "incremental charge"
          ? `${chargePrefix} ${privateToGM ? 3 : 2}`
          : marker;
      await expect
        .poll(
          async () =>
            messagesAfter(gmBefore, await readChatMessages(gmPage)).filter(
              (message) => mentions(message, expectedText),
            ).length,
        )
        .toBe(1);
      if (!privateToGM) {
        await expect
          .poll(
            async () =>
              messagesAfter(
                playerBefore,
                await readChatMessages(player.page),
              ).filter((message) => mentions(message, expectedText)).length,
          )
          .toBe(1);
        await expect
          .poll(
            async () =>
              messagesAfter(
                unrelatedBefore,
                await readChatMessages(unrelatedPlayer.page),
              ).filter((message) => mentions(message, expectedText)).length,
          )
          .toBe(1);
      } else {
        await expect
          .poll(
            async () =>
              messagesAfter(
                playerBefore,
                await readChatMessages(player.page),
              ).filter((message) => message.speakerActorId === caster.actorId)
                .length,
          )
          .toBeGreaterThan(0);
        expect(
          messagesAfter(
            playerBefore,
            await readChatMessages(player.page),
          ).filter((message) => mentions(message, expectedText)),
        ).toHaveLength(0);
        await expect
          .poll(
            async () =>
              messagesAfter(
                unrelatedBefore,
                await readChatMessages(unrelatedPlayer.page),
              ).filter((message) => message.speakerActorId === caster.actorId)
                .length,
          )
          .toBeGreaterThan(0);
        expect(
          messagesAfter(
            unrelatedBefore,
            await readChatMessages(unrelatedPlayer.page),
          ).filter((message) => mentions(message, expectedText)),
        ).toHaveLength(0);
      }
    }
  });
}
