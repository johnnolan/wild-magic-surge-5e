import { test, expect } from "./fixtures";
import {
  getReminderMessage,
  openChatSettingsPanel,
  openSettingsPanel,
  readSetting,
} from "./foundry";
import { createCaster } from "./support/actors";
import { openActorSheet } from "./support/actions";
import { addTidesOfChaos } from "./support/feats";

test("saves a reminder message from Chat Message Options", async ({
  gmPage,
  world,
}) => {
  await world.rememberSetting("magicSurgeChatMessage");
  const newMessage = `Browser test reminder ${Date.now()}`;
  const messageField = gmPage.getByLabel("Message to check for surge");

  await openChatSettingsPanel(gmPage);
  await messageField.fill(newMessage);
  await gmPage.getByRole("button", { name: "Save Changes" }).click();

  await expect.poll(() => getReminderMessage(gmPage)).toBe(newMessage);
  await openChatSettingsPanel(gmPage);
  await expect(messageField).toHaveValue(newMessage);
});

const textSettings = [
  {
    title: "saves a Standard dice formula",
    panel: "StandardSettingsPanel",
    key: "customRollDiceFormula",
    label: "Dice Formula",
    value: "1d12",
  },
  {
    title: "saves a level-one spell rule",
    panel: "SpellLevelSettingsPanel",
    key: "OPT_TSL_LVL1",
    label: "Level 1",
    value: "1d20 < 21",
  },
  {
    title: "saves a spell-name filter",
    panel: "SpellRegexSettingsPanel",
    key: "spellRegex",
    label: "Spell Filter Include Regex",
    value: "\\(S\\)$",
  },
] as const;

for (const setting of textSettings) {
  test(setting.title, async ({ gmPage, world }) => {
    await world.rememberSetting(setting.key);
    const field = gmPage.getByLabel(setting.label, { exact: true });

    await openSettingsPanel(gmPage, setting.panel, setting.key);
    await field.fill(setting.value);
    await gmPage.getByRole("button", { name: "Save Changes" }).click();

    await expect
      .poll(() => readSetting<string>(gmPage, setting.key))
      .toBe(setting.value);
    await openSettingsPanel(gmPage, setting.panel, setting.key);
    await expect(field).toHaveValue(setting.value);
  });
}

test("saves the Incremental charge-to-chat option", async ({
  gmPage,
  world,
}) => {
  const key = "incrementalCheckToChat";
  const original = await readSetting<boolean>(gmPage, key);
  await world.rememberSetting(key);

  await openSettingsPanel(gmPage, "IncrementalSettingsPanel", key);
  await gmPage.getByLabel("Send to chat").setChecked(!original);
  await gmPage.getByRole("button", { name: "Save Changes" }).click();

  await expect.poll(() => readSetting<boolean>(gmPage, key)).toBe(!original);
  await openSettingsPanel(gmPage, "IncrementalSettingsPanel", key);
  await expect(gmPage.getByLabel("Send to chat")).toBeChecked({
    checked: !original,
  });
});

test("the actor helper reports which Wild Magic features are ready", async ({
  gmPage,
  world,
}) => {
  await world.setSetting("showWMSDebugOption", true);
  await gmPage.reload();
  await gmPage.waitForFunction(() => {
    const { game } = globalThis as unknown as { game?: { ready?: boolean } };
    return game?.ready === true;
  });
  const caster = await createCaster(gmPage, {
    name: `E2E Actor Helper ${Date.now()}`,
  });
  world.trackActor(caster.actorId);
  const sheet = await openActorSheet(gmPage, caster.actorId);
  // Foundry renders the expanded header menu in a portal outside the sheet.
  const helperButton = gmPage.getByText("WMS", { exact: true });
  await sheet.getByRole("button", { name: "Toggle Controls" }).click();
  await helperButton.click();

  const helper = gmPage.locator("#wild-magic-config");
  await expect(helper).toBeVisible();
  await expect(
    helper
      .locator(".form-group")
      .filter({ hasText: "Wild Magic Feat Setup" })
      .locator(".fa-check-circle"),
  ).toBeVisible();
  await expect(
    helper
      .locator(".form-group")
      .filter({ hasText: "Tides Of Chaos Feat" })
      .locator(".fa-circle-xmark"),
  ).toBeVisible();

  await helper.getByRole("button", { name: "Close Window" }).click();
  await addTidesOfChaos(gmPage, caster.actorId);
  await sheet.getByRole("button", { name: "Toggle Controls" }).click();
  await helperButton.click();
  await expect(
    helper
      .locator(".form-group")
      .filter({ hasText: "Tides Of Chaos Feat" })
      .locator(".fa-check-circle"),
  ).toBeVisible();
  await expect(
    helper
      .locator(".form-group")
      .filter({ hasText: "Tides Of Chaos Resource Setup" })
      .locator(".fa-check-circle"),
  ).toBeVisible();
});
