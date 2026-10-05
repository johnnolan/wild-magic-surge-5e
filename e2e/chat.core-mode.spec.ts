import { test, expect } from "./fixtures";
import {
  createCaster,
  grantActorToPlayer,
  refreshPlayerWorld,
} from "./support/actors";
import { castAndWaitForCheck, classifyChatCards } from "./support/chat-cards";
import {
  newChatViews,
  readChatViews,
  type ChatSessions,
  type ChatViews,
} from "./support/observations";
import { configureStandardOutcome } from "./support/recipes";

async function waitForPlayersToSeeSpell(
  before: ChatViews,
  sessions: ChatSessions,
  actorId: string,
): Promise<void> {
  await expect
    .poll(async () => {
      const views = newChatViews(before, await readChatViews(sessions));
      return [views.caster, views.unrelated].map((messages) =>
        messages.some((message) => message.speakerActorId === actorId),
      );
    })
    .toEqual([true, true]);
}

for (const mode of ["public", "self"] as const) {
  test(`Given GM core ${mode} mode, a plain GM roll and module check ${mode === "self" ? "stay with the GM" : "reach all three users"}`, async ({
    gmPage,
    player,
    unrelatedPlayer,
    world,
  }) => {
    test.setTimeout(240_000);
    const caster = await createCaster(gmPage, {
      name: `E2E Core Mode ${Date.now()}`,
    });
    world.trackActor(caster.actorId);
    await grantActorToPlayer(gmPage, caster.actorId, player.userId);
    await refreshPlayerWorld(player.page);
    const marker = `E2E ${mode} check ${Date.now()}`;
    await configureStandardOutcome(world, "no surge");
    await world.setSetting("autoRollD20MessageNoSurge", marker);
    await world.setSetting("autoRollD20MessageNoSurgeEnabled", true);
    await world.setSetting("enableRollTable", "DEFAULT");
    await world.setSetting("whisperToGM", false);
    await world.setCoreSetting("messageMode", mode);
    const sessions = {
      gm: gmPage,
      caster: player.page,
      unrelated: unrelatedPlayer.page,
    };
    const rollBefore = await readChatViews(sessions);

    const plainRollId = await gmPage.evaluate(async () => {
      const { Roll } = globalThis as unknown as {
        Roll: new (formula: string) => {
          evaluate(options: { allowInteractive: boolean }): Promise<{
            toMessage(): Promise<{ id: string } | undefined>;
          }>;
        };
      };
      const roll = await new Roll("1d20").evaluate({ allowInteractive: false });
      const message = await roll.toMessage();
      if (!message) throw new Error("Foundry did not create the plain roll.");
      return message.id;
    });
    await expect
      .poll(async () => {
        const views = newChatViews(rollBefore, await readChatViews(sessions));
        return Object.values(views).map((messages) =>
          messages.some((message) => message.id === plainRollId),
        );
      })
      .toEqual([true, mode === "public", mode === "public"]);

    const checkBefore = await readChatViews(sessions);
    await castAndWaitForCheck(gmPage, player.page, caster);
    await waitForPlayersToSeeSpell(checkBefore, sessions, caster.actorId);
    await expect
      .poll(async () => {
        const views = newChatViews(checkBefore, await readChatViews(sessions));
        return Object.values(views).map(
          (messages) =>
            classifyChatCards(messages, {
              actorId: caster.actorId,
              checkText: marker,
            }).check.length,
        );
      })
      .toEqual([1, mode === "public" ? 1 : 0, mode === "public" ? 1 : 0]);
    const views = newChatViews(checkBefore, await readChatViews(sessions));
    for (const messages of Object.values(views)) {
      expect(
        classifyChatCards(messages, {
          actorId: caster.actorId,
          checkText: marker,
        }).bareCheck,
      ).toHaveLength(0);
    }
  });
}

test("Given public core mode and GM-only module checks, only the GM sees the check", async ({
  gmPage,
  player,
  unrelatedPlayer,
  world,
}) => {
  test.setTimeout(240_000);
  const caster = await createCaster(gmPage, {
    name: `E2E Whisper Override ${Date.now()}`,
  });
  world.trackActor(caster.actorId);
  await grantActorToPlayer(gmPage, caster.actorId, player.userId);
  await refreshPlayerWorld(player.page);
  const marker = `E2E whisper override ${Date.now()}`;
  await configureStandardOutcome(world, "no surge");
  await world.setSetting("autoRollD20MessageNoSurge", marker);
  await world.setSetting("autoRollD20MessageNoSurgeEnabled", true);
  await world.setSetting("whisperToGM", true);
  await world.setCoreSetting("messageMode", "public");
  const sessions = {
    gm: gmPage,
    caster: player.page,
    unrelated: unrelatedPlayer.page,
  };
  const before = await readChatViews(sessions);

  await castAndWaitForCheck(gmPage, player.page, caster);
  await waitForPlayersToSeeSpell(before, sessions, caster.actorId);
  const views = newChatViews(before, await readChatViews(sessions));
  expect(
    classifyChatCards(views.gm, {
      actorId: caster.actorId,
      checkText: marker,
    }).check,
  ).toHaveLength(1);
  for (const messages of [views.caster, views.unrelated]) {
    expect(
      classifyChatCards(messages, {
        actorId: caster.actorId,
        checkText: marker,
      }).check,
    ).toHaveLength(0);
  }
});

test("Given GM core self mode and PLAYER_TRIGGER, the module check and button stay public", async ({
  gmPage,
  player,
  unrelatedPlayer,
  world,
}) => {
  test.setTimeout(240_000);
  const caster = await createCaster(gmPage, {
    name: `E2E Trigger Override ${Date.now()}`,
  });
  world.trackActor(caster.actorId);
  await grantActorToPlayer(gmPage, caster.actorId, player.userId);
  await refreshPlayerWorld(player.page);
  const marker = `E2E trigger override ${Date.now()}`;
  await configureStandardOutcome(world, "surge");
  await world.setSetting("autoRollD20Message", marker);
  await world.setSetting("autoRollD20MessageEnabled", true);
  await world.setSetting("enableRollTable", "PLAYER_TRIGGER");
  await world.setSetting("whisperToGM", false);
  await world.setCoreSetting("messageMode", "self");
  const sessions = {
    gm: gmPage,
    caster: player.page,
    unrelated: unrelatedPlayer.page,
  };
  const before = await readChatViews(sessions);

  await castAndWaitForCheck(gmPage, player.page, caster);
  await waitForPlayersToSeeSpell(before, sessions, caster.actorId);
  await expect
    .poll(async () => {
      const views = newChatViews(before, await readChatViews(sessions));
      return Object.values(views).map((messages) => {
        const cards = classifyChatCards(messages, {
          actorId: caster.actorId,
          checkText: marker,
        });
        return [cards.check.length, cards.button.length];
      });
    })
    .toEqual([
      [1, 1],
      [1, 1],
      [1, 1],
    ]);
});
