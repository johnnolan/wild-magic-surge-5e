import { test, expect } from "./fixtures";
import { addClassLevels, createCaster } from "./support/actors";
import { castSpellFromSheet, openChatSidebar } from "./support/actions";
import { messagesAfter, readChatMessages } from "./support/observations";
import { configureStandardOutcome } from "./support/recipes";
import { createTestTable } from "./support/tables";

function tableMessages(
  messages: Awaited<ReturnType<typeof readChatMessages>>,
  name: string,
) {
  return messages.filter(
    (message) =>
      message.content.includes("my-roll-result") &&
      message.content.includes(name),
  );
}

test("automatic table draws happen once and the None option draws nothing", async ({
  gmPage,
  world,
}) => {
  const caster = await createCaster(gmPage, {
    name: `E2E Automatic Table Caster ${Date.now()}`,
  });
  world.trackActor(caster.actorId);
  const table = await createTestTable(gmPage, `E2E Surge Table ${Date.now()}`);
  world.trackTable(table.id);
  await configureStandardOutcome(world, "surge");
  await world.setSetting("rollTableName", table.name);

  await world.setSetting("enableRollTable", "AUTO");
  const chatBeforeAuto = await readChatMessages(gmPage);
  await castSpellFromSheet(gmPage, caster);
  await expect
    .poll(
      async () =>
        tableMessages(
          messagesAfter(chatBeforeAuto, await readChatMessages(gmPage)),
          table.name,
        ).length,
    )
    .toBe(1);

  await world.setSetting("enableRollTable", "DEFAULT");
  const chatBeforeNone = await readChatMessages(gmPage);
  await castSpellFromSheet(gmPage, caster);
  const newMessages = messagesAfter(
    chatBeforeNone,
    await readChatMessages(gmPage),
  );
  expect(tableMessages(newMessages, table.name)).toHaveLength(0);
  expect(
    newMessages.some((message) => message.content.includes("roll-table-wms")),
  ).toBe(false);
});

test("a player can draw once from the surge chat button", async ({
  gmPage,
  player,
  world,
}) => {
  test.setTimeout(240_000);
  const caster = await createCaster(gmPage, {
    name: `E2E Button Table Caster ${Date.now()}`,
  });
  world.trackActor(caster.actorId);
  const table = await createTestTable(gmPage, `E2E Player Table ${Date.now()}`);
  world.trackTable(table.id);
  await configureStandardOutcome(world, "surge");
  await world.setSetting("rollTableName", table.name);
  await world.setSetting("enableRollTable", "PLAYER_TRIGGER");
  await world.setSetting("whisperToGM", false);

  const chatBefore = await readChatMessages(gmPage);
  await castSpellFromSheet(gmPage, caster);
  await openChatSidebar(player.page);
  const button = player.page.locator(".roll-table-wms").last();
  await expect(button).toBeVisible();
  expect(
    tableMessages(
      messagesAfter(chatBefore, await readChatMessages(gmPage)),
      table.name,
    ),
  ).toHaveLength(0);

  await button.click();
  await expect
    .poll(
      async () =>
        tableMessages(
          messagesAfter(chatBefore, await readChatMessages(gmPage)),
          table.name,
        ).length,
    )
    .toBe(1);
  const playerResults = tableMessages(
    messagesAfter(chatBefore, await readChatMessages(player.page)),
    table.name,
  );
  expect(playerResults).toHaveLength(1);
});

test("a caster above level thirteen draws twice from an automatic table", async ({
  gmPage,
  world,
}) => {
  const caster = await createCaster(gmPage, {
    name: `E2E High Level Caster ${Date.now()}`,
  });
  world.trackActor(caster.actorId);
  const level = await addClassLevels(gmPage, caster.actorId, 14);
  test.skip(
    level <= 13,
    "The installed dnd5e class fixture did not derive level 14.",
  );
  const table = await createTestTable(
    gmPage,
    `E2E High Level Table ${Date.now()}`,
  );
  world.trackTable(table.id);
  await configureStandardOutcome(world, "surge");
  await world.setSetting("enableRollTable", "AUTO");
  await world.setSetting("rollTableName", table.name);

  const chatBefore = await readChatMessages(gmPage);
  await castSpellFromSheet(gmPage, caster);

  await expect
    .poll(
      async () =>
        tableMessages(
          messagesAfter(chatBefore, await readChatMessages(gmPage)),
          table.name,
        ).length,
    )
    .toBe(2);
});
