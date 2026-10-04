import { test, expect } from "./fixtures";
import { createCaster, setSheetResource } from "./support/actors";
import { castSpellFromSheet } from "./support/actions";
import {
  messagesAfter,
  readChatMessages,
  readSheetResource,
  readSurgeResource,
} from "./support/observations";
import { configureIncrementalIncrease } from "./support/recipes";
import { withFoundryRandomValue } from "./support/rolls";
import { createSceneWithCasterToken, readTokenBar } from "./support/scenes";

test("incremental and descending checks update the chosen resource and token bar", async ({
  gmPage,
  world,
}) => {
  test.setTimeout(240_000);
  const caster = await createCaster(gmPage, {
    name: `E2E Resource Caster ${Date.now()}`,
    spellSlots: 3,
  });
  world.trackActor(caster.actorId);
  await setSheetResource(gmPage, caster.actorId, "secondary", {
    label: "Unrelated",
    value: 7,
    max: 10,
  });
  await configureIncrementalIncrease(world);

  await castSpellFromSheet(gmPage, caster);
  await expect
    .poll(async () => (await readSurgeResource(gmPage, caster.actorId))?.value)
    .toBe(2);
  expect(
    (await readSheetResource(gmPage, caster.actorId, "secondary")).value,
  ).toBe(7);

  await world.setSetting("OPT_RESOURCE_TYPE", "PRIMARY");
  await setSheetResource(gmPage, caster.actorId, "primary", {
    label: "Surge Chance",
    value: 1,
    max: 20,
  });
  const token = await createSceneWithCasterToken(
    gmPage,
    caster.actorId,
    `E2E Resource Scene ${Date.now()}`,
    "resources.primary",
  );
  world.trackScene(token.sceneId);
  expect(
    await readTokenBar(gmPage, token.sceneId, token.tokenId),
  ).toMatchObject({
    attribute: "resources.primary",
    value: 1,
    max: 20,
  });

  await castSpellFromSheet(gmPage, caster);
  await expect
    .poll(
      async () =>
        (await readSheetResource(gmPage, caster.actorId, "primary")).value,
    )
    .toBe(2);
  expect((await readSurgeResource(gmPage, caster.actorId))?.value).toBe(2);
  expect(
    (await readSheetResource(gmPage, caster.actorId, "secondary")).value,
  ).toBe(7);
  await expect
    .poll(
      async () =>
        (await readTokenBar(gmPage, token.sceneId, token.tokenId))?.value,
    )
    .toBe(2);

  await world.setSetting("OPT_SURGE_TYPE", "DIE_DESCENDING");
  await setSheetResource(gmPage, caster.actorId, "primary", {
    label: "Surge Chance",
    value: 5,
    max: 6,
  });
  const chatBefore = await readChatMessages(gmPage);
  await withFoundryRandomValue(gmPage, 0.5, async () => {
    await castSpellFromSheet(gmPage, caster);
    await expect
      .poll(
        async () =>
          (await readSheetResource(gmPage, caster.actorId, "primary")).value,
      )
      .toBe(6);
  });
  const roll = messagesAfter(chatBefore, await readChatMessages(gmPage)).find(
    (message) => message.rollTotal !== null,
  );
  expect(roll?.rollFormula?.toLowerCase()).toBe("1d6");
  await expect
    .poll(
      async () =>
        (await readTokenBar(gmPage, token.sceneId, token.tokenId))?.value,
    )
    .toBe(6);
  expect(
    (await readSheetResource(gmPage, caster.actorId, "secondary")).value,
  ).toBe(7);
});
