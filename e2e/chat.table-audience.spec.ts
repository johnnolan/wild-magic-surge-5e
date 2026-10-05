import { test, expect } from "./fixtures";
import {
  createCaster,
  grantActorToPlayer,
  refreshPlayerWorld,
} from "./support/actors";
import { openChatSidebar } from "./support/actions";
import { castAndWaitForCheck, classifyChatCards } from "./support/chat-cards";
import {
  newChatViews,
  readChatViews,
  sharedMessageIds,
  type ChatSessions,
  type ChatViews,
} from "./support/observations";
import { configureStandardOutcome } from "./support/recipes";
import { createTestTable } from "./support/tables";

async function waitForSpellInBothPlayers(
  before: ChatViews,
  sessions: ChatSessions,
  actorId: string,
): Promise<void> {
  await expect
    .poll(async () => {
      const views = newChatViews(before, await readChatViews(sessions));
      return [views.caster, views.unrelated].map(
        (messages) =>
          messages.filter((message) => message.speakerActorId === actorId)
            .length,
      );
    })
    .toEqual([1, 1]);
}

for (const checkPrivate of [false, true]) {
  for (const tablePrivate of [false, true]) {
    test(`Given ${checkPrivate ? "GM-only" : "public"} checks and ${tablePrivate ? "GM-only" : "public"} automatic tables, when the player casts, each card reaches its own audience`, async ({
      gmPage,
      player,
      unrelatedPlayer,
      world,
    }) => {
      test.setTimeout(240_000);
      const caster = await createCaster(gmPage, {
        name: `E2E Table Matrix ${Date.now()}`,
      });
      world.trackActor(caster.actorId);
      await grantActorToPlayer(gmPage, caster.actorId, player.userId);
      await refreshPlayerWorld(player.page);
      const table = await createTestTable(
        gmPage,
        `E2E Matrix Table ${Date.now()}`,
      );
      world.trackTable(table.id);
      const marker = `E2E matrix check ${Date.now()}`;
      await configureStandardOutcome(world, "surge");
      await world.setSetting("autoRollD20Message", marker);
      await world.setSetting("autoRollD20MessageEnabled", true);
      await world.setSetting("enableRollTable", "AUTO");
      await world.setSetting("rollTableName", table.name);
      await world.setSetting("whisperToGM", checkPrivate);
      await world.setSetting("whisperToGMRollChat", tablePrivate);
      await world.setCoreSetting("messageMode", "public");
      const sessions = {
        gm: gmPage,
        caster: player.page,
        unrelated: unrelatedPlayer.page,
      };
      const before = await readChatViews(sessions);

      await castAndWaitForCheck(gmPage, player.page, caster);
      await waitForSpellInBothPlayers(before, sessions, caster.actorId);
      await expect
        .poll(async () => {
          const views = newChatViews(before, await readChatViews(sessions));
          return [views.gm, views.caster, views.unrelated].map((messages) => {
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
          [checkPrivate ? 0 : 1, tablePrivate ? 0 : 1],
          [checkPrivate ? 0 : 1, tablePrivate ? 0 : 1],
        ]);

      const views = newChatViews(before, await readChatViews(sessions));
      for (const messages of Object.values(views)) {
        const cards = classifyChatCards(messages, {
          actorId: caster.actorId,
          checkText: marker,
          tableName: table.name,
        });
        expect(cards.bareCheck).toHaveLength(0);
        expect(cards.button).toHaveLength(0);
      }
      const ids = sharedMessageIds(views);
      const gmCards = classifyChatCards(views.gm, {
        actorId: caster.actorId,
        checkText: marker,
        tableName: table.name,
      });
      expect(ids.all.includes(gmCards.check[0].id)).toBe(!checkPrivate);
      expect(ids.all.includes(gmCards.table[0].id)).toBe(!tablePrivate);
      expect(ids.gmOnly.includes(gmCards.check[0].id)).toBe(checkPrivate);
      expect(ids.gmOnly.includes(gmCards.table[0].id)).toBe(tablePrivate);
    });
  }
}

for (const tablePrivate of [false, true]) {
  test(`Given a public player-trigger button and ${tablePrivate ? "GM-only" : "public"} table results, one caster click makes one protected result`, async ({
    gmPage,
    player,
    unrelatedPlayer,
    world,
  }) => {
    test.setTimeout(240_000);
    const caster = await createCaster(gmPage, {
      name: `E2E Button Audience ${Date.now()}`,
    });
    world.trackActor(caster.actorId);
    await grantActorToPlayer(gmPage, caster.actorId, player.userId);
    await refreshPlayerWorld(player.page);
    const table = await createTestTable(
      gmPage,
      `E2E Button Audience Table ${Date.now()}`,
    );
    world.trackTable(table.id);
    const marker = `E2E button check ${Date.now()}`;
    await configureStandardOutcome(world, "surge");
    await world.setSetting("autoRollD20Message", marker);
    await world.setSetting("autoRollD20MessageEnabled", true);
    await world.setSetting("enableRollTable", "PLAYER_TRIGGER");
    await world.setSetting("rollTableName", table.name);
    await world.setSetting("whisperToGM", false);
    await world.setSetting("whisperToGMRollChat", tablePrivate);
    await world.setCoreSetting("messageMode", "public");
    const sessions = {
      gm: gmPage,
      caster: player.page,
      unrelated: unrelatedPlayer.page,
    };
    const before = await readChatViews(sessions);

    await castAndWaitForCheck(gmPage, player.page, caster);
    await waitForSpellInBothPlayers(before, sessions, caster.actorId);
    await expect
      .poll(async () => {
        const views = newChatViews(before, await readChatViews(sessions));
        return Object.values(views).map(
          (messages) =>
            classifyChatCards(messages, {
              actorId: caster.actorId,
              checkText: marker,
              tableName: table.name,
            }).button.length,
        );
      })
      .toEqual([1, 1, 1]);
    let views = newChatViews(before, await readChatViews(sessions));
    for (const messages of Object.values(views)) {
      const cards = classifyChatCards(messages, {
        actorId: caster.actorId,
        checkText: marker,
        tableName: table.name,
      });
      expect(cards.check).toHaveLength(1);
      expect(cards.table).toHaveLength(0);
      expect(cards.bareCheck).toHaveLength(0);
    }

    await openChatSidebar(player.page);
    const button = player.page.locator(".roll-table-wms").last();
    await expect(button).toBeVisible();
    await button.click();
    await expect
      .poll(async () => {
        const current = newChatViews(before, await readChatViews(sessions));
        return classifyChatCards(current.gm, {
          actorId: caster.actorId,
          checkText: marker,
          tableName: table.name,
        }).table.length;
      })
      .toBe(1);
    if (!tablePrivate) {
      await expect
        .poll(async () => {
          const current = newChatViews(before, await readChatViews(sessions));
          return [current.caster, current.unrelated].map(
            (messages) =>
              classifyChatCards(messages, {
                actorId: caster.actorId,
                checkText: marker,
                tableName: table.name,
              }).table.length,
          );
        })
        .toEqual([1, 1]);
    }
    views = newChatViews(before, await readChatViews(sessions));
    const result = classifyChatCards(views.gm, {
      actorId: caster.actorId,
      checkText: marker,
      tableName: table.name,
    }).table[0];
    expect(result.authorId).toBe(player.userId);
    const expectedPlayerCount = tablePrivate ? 0 : 1;
    for (const messages of [views.caster, views.unrelated]) {
      expect(
        classifyChatCards(messages, {
          actorId: caster.actorId,
          checkText: marker,
          tableName: table.name,
        }).table,
      ).toHaveLength(expectedPlayerCount);
    }
  });
}

test("Given a GM-only player-trigger check, neither player sees or uses its button", async ({
  gmPage,
  player,
  unrelatedPlayer,
  world,
}) => {
  test.setTimeout(240_000);
  const caster = await createCaster(gmPage, {
    name: `E2E Private Button ${Date.now()}`,
  });
  world.trackActor(caster.actorId);
  await grantActorToPlayer(gmPage, caster.actorId, player.userId);
  await refreshPlayerWorld(player.page);
  const table = await createTestTable(
    gmPage,
    `E2E Private Button Table ${Date.now()}`,
  );
  world.trackTable(table.id);
  const marker = `E2E private button ${Date.now()}`;
  await configureStandardOutcome(world, "surge");
  await world.setSetting("autoRollD20Message", marker);
  await world.setSetting("autoRollD20MessageEnabled", true);
  await world.setSetting("enableRollTable", "PLAYER_TRIGGER");
  await world.setSetting("rollTableName", table.name);
  await world.setSetting("whisperToGM", true);
  await world.setCoreSetting("messageMode", "public");
  const sessions = {
    gm: gmPage,
    caster: player.page,
    unrelated: unrelatedPlayer.page,
  };
  const before = await readChatViews(sessions);

  await castAndWaitForCheck(gmPage, player.page, caster);
  await waitForSpellInBothPlayers(before, sessions, caster.actorId);
  const views = newChatViews(before, await readChatViews(sessions));
  const gmCards = classifyChatCards(views.gm, {
    actorId: caster.actorId,
    checkText: marker,
    tableName: table.name,
  });
  expect(gmCards.check).toHaveLength(1);
  expect(gmCards.button).toHaveLength(1);
  expect(gmCards.table).toHaveLength(0);
  for (const messages of [views.caster, views.unrelated]) {
    const cards = classifyChatCards(messages, {
      actorId: caster.actorId,
      checkText: marker,
      tableName: table.name,
    });
    expect(cards.check).toHaveLength(0);
    expect(cards.button).toHaveLength(0);
    expect(cards.table).toHaveLength(0);
  }
  await openChatSidebar(player.page);
  await openChatSidebar(unrelatedPlayer.page);
  await expect(player.page.locator(".roll-table-wms")).toHaveCount(0);
  await expect(unrelatedPlayer.page.locator(".roll-table-wms")).toHaveCount(0);
});
