import { test, expect } from "./fixtures";
import {
  createCaster,
  grantActorToPlayer,
  refreshPlayerWorld,
  setIncrementalThreshold,
} from "./support/actors";
import { castAndWaitForCheck, classifyChatCards } from "./support/chat-cards";
import {
  newChatViews,
  readChatMessages,
  readChatViews,
  readSurgedFlag,
} from "./support/observations";
import {
  configureIncrementalIncrease,
  configureStandardOutcome,
} from "./support/recipes";
import { withFoundryRandomValue } from "./support/rolls";
import { openChatSidebar } from "./support/actions";

test("Given Incremental Check and a non-surge, when the player casts, one labelled result has no bare duplicate", async ({
  gmPage,
  player,
  unrelatedPlayer,
  world,
}) => {
  test.setTimeout(240_000);
  const caster = await createCaster(gmPage, {
    name: `E2E Screenshot Caster ${Date.now()}`,
  });
  world.trackActor(caster.actorId);
  await grantActorToPlayer(gmPage, caster.actorId, player.userId);
  await refreshPlayerWorld(player.page);
  const marker = `E2E no surge ${Date.now()}`;
  await configureIncrementalIncrease(world);
  await world.setSetting("customRollDiceFormula", "1d20");
  await world.setSetting("enableRollTable", "PLAYER_TRIGGER");
  await world.setSetting("whisperToGM", false);
  await world.setSetting("whisperToGMRollChat", true);
  await world.setSetting("incrementalCheckToChat", true);
  await world.setSetting("autoRollD20MessageNoSurge", marker);
  await world.setSetting("autoRollD20MessageNoSurgeEnabled", true);
  await world.setCoreSetting("messageMode", "public");
  await setIncrementalThreshold(gmPage, caster.actorId, 1);
  const chargeText = await gmPage.evaluate(() => {
    const { game } = globalThis as unknown as {
      game: { i18n: { format(key: string): string } };
    };
    return `${game.i18n.format("WildMagicSurge5E.opt_incremental_check_to_chat_text_name")} 2`;
  });
  const sessions = {
    gm: gmPage,
    caster: player.page,
    unrelated: unrelatedPlayer.page,
  };
  const before = await readChatViews(sessions);

  await withFoundryRandomValue(gmPage, 0.95, async () => {
    await castAndWaitForCheck(gmPage, player.page, caster);
    await expect
      .poll(
        async () =>
          newChatViews(before, await readChatViews(sessions)).gm.filter(
            (message) =>
              `${message.content} ${message.flavor}`.includes(marker),
          ).length,
      )
      .toBe(1);
  });
  await expect.poll(() => readSurgedFlag(gmPage, caster.actorId)).toBe(false);
  await expect
    .poll(async () => {
      const views = newChatViews(before, await readChatViews(sessions));
      return [views.caster, views.unrelated].map(
        (messages) =>
          messages.filter((message) =>
            `${message.content} ${message.flavor}`.includes(marker),
          ).length,
      );
    })
    .toEqual([1, 1]);

  const views = newChatViews(before, await readChatViews(sessions));
  for (const messages of Object.values(views)) {
    const cards = classifyChatCards(messages, {
      actorId: caster.actorId,
      checkText: marker,
      chargeText,
    });
    expect(cards.spell).toHaveLength(1);
    expect(cards.charge).toHaveLength(1);
    expect(cards.check).toHaveLength(1);
    expect(cards.bareCheck).toHaveLength(0);
    expect(cards.table).toHaveLength(0);
    expect(cards.button).toHaveLength(0);
  }
  await openChatSidebar(gmPage);
  await expect(gmPage.locator("body")).toContainText(marker);
});

for (const outcome of ["surge", "no surge"] as const) {
  test(`Given a Standard ${outcome}, when the player casts, one labelled check has no bare duplicate`, async ({
    gmPage,
    player,
    unrelatedPlayer,
    world,
  }) => {
    test.setTimeout(240_000);
    const caster = await createCaster(gmPage, {
      name: `E2E Standard ${outcome} ${Date.now()}`,
    });
    world.trackActor(caster.actorId);
    await grantActorToPlayer(gmPage, caster.actorId, player.userId);
    await refreshPlayerWorld(player.page);
    const marker = `E2E ${outcome} check ${Date.now()}`;
    await configureStandardOutcome(world, outcome);
    await world.setSetting("enableRollTable", "DEFAULT");
    await world.setSetting("whisperToGM", false);
    await world.setCoreSetting("messageMode", "public");
    const messageKey =
      outcome === "surge" ? "autoRollD20Message" : "autoRollD20MessageNoSurge";
    await world.setSetting(messageKey, marker);
    await world.setSetting(`${messageKey}Enabled`, true);
    const sessions = {
      gm: gmPage,
      caster: player.page,
      unrelated: unrelatedPlayer.page,
    };
    const before = await readChatViews(sessions);

    await castAndWaitForCheck(gmPage, player.page, caster);
    await expect
      .poll(() => readSurgedFlag(gmPage, caster.actorId))
      .toBe(outcome === "surge");
    await expect
      .poll(async () => {
        const views = newChatViews(before, await readChatViews(sessions));
        return Object.values(views).map(
          (messages) =>
            classifyChatCards(messages, {
              actorId: caster.actorId,
              checkText: marker,
            }).check.length,
        );
      })
      .toEqual([1, 1, 1]);
    const views = newChatViews(before, await readChatViews(sessions));
    for (const messages of Object.values(views)) {
      const cards = classifyChatCards(messages, {
        actorId: caster.actorId,
        checkText: marker,
      });
      expect(cards.check).toHaveLength(1);
      expect(cards.bareCheck).toHaveLength(0);
      expect(cards.table).toHaveLength(0);
      expect(new Set(cards.check.map((message) => message.id)).size).toBe(1);
    }

    await world.setSetting(`${messageKey}Enabled`, false);
    const disabledBefore = await readChatMessages(gmPage);
    await castAndWaitForCheck(gmPage, player.page, caster);
    await expect
      .poll(() => readSurgedFlag(gmPage, caster.actorId))
      .toBe(outcome === "surge");
    const disabledCards = classifyChatCards(
      (await readChatMessages(gmPage)).filter(
        (message) => !disabledBefore.some((old) => old.id === message.id),
      ),
      {
        actorId: caster.actorId,
        checkText: marker,
      },
    );
    expect(disabledCards.check).toHaveLength(0);
    expect(disabledCards.bareCheck).toHaveLength(0);
  });
}
