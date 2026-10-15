import { test, expect } from "./fixtures";
import { openSettingsPanel, readSetting } from "./foundry";

test("the live settings show the documented modes and valid defaults", async ({
  gmPage,
}) => {
  const registrations = await gmPage.evaluate(() => {
    const { game } = globalThis as unknown as {
      game: {
        settings: {
          settings: {
            get(
              id: string,
            ):
              { default: string; choices?: Record<string, string> } | undefined;
          };
          sheet: { render(options: { force: boolean }): Promise<unknown> };
        };
      };
    };
    const namespace = "wild-magic-surge-5e";
    const keys = [
      "OPT_SURGE_TYPE",
      "enableRollTable",
      "wmsName",
      "tocName",
      "powmName",
      "wmsCastWhen",
      "tocCastWhen",
    ];
    const values = Object.fromEntries(
      keys.map((key) => {
        const setting = game.settings.settings.get(`${namespace}.${key}`);
        if (!setting) throw new Error(`${key} is not registered.`);
        return [key, { default: setting.default, choices: setting.choices }];
      }),
    );
    void game.settings.sheet.render({ force: true });
    return values;
  });

  expect(registrations.OPT_SURGE_TYPE.default).toBe("DEFAULT");
  expect(registrations.enableRollTable.default).toBe("DEFAULT");
  expect(registrations.wmsName.default).toBe("Wild Magic Surge");
  expect(registrations.tocName.default).toBe("Tides of Chaos");
  expect(registrations.powmName.default).toBe("Path of Wild Magic");
  expect(registrations.wmsCastWhen.default).toBe("DEFAULT");
  expect(registrations.tocCastWhen.default).toBe("DEFAULT");

  const settings = gmPage.locator("#settings-config");
  await expect(settings).toBeVisible();
  await settings.locator('button[data-tab="wild-magic-surge-5e"]').click();
  const choices = async (key: string) =>
    settings
      .locator(`select[name="wild-magic-surge-5e.${key}"] option`)
      .evaluateAll((options) =>
        options.map((option) => ({
          value: (option as HTMLOptionElement).value,
          label: option.textContent?.trim(),
        })),
      );
  expect(await choices("OPT_SURGE_TYPE")).toEqual([
    { value: "DEFAULT", label: "Standard" },
    {
      value: "SPELL_LEVEL_DEPENDENT_ROLL",
      label: "Spell Level Dependent Rolls",
    },
    { value: "INCREMENTAL_CHECK", label: "Incremental Check" },
    {
      value: "INCREMENTAL_CHECK_CHAOTIC",
      label: "Incremental Check (Chaotic)",
    },
    { value: "DIE_DESCENDING", label: "Descending Dice" },
  ]);
  expect(await choices("enableRollTable")).toEqual([
    { value: "DEFAULT", label: "None" },
    { value: "AUTO", label: "Auto Roll Table" },
    { value: "PLAYER_TRIGGER", label: "Player Trigger Roll" },
  ]);
  await openSettingsPanel(gmPage, "UpcastSpellSettingsPanel", "wmsCastWhen");
  for (const key of ["wmsCastWhen", "tocCastWhen"]) {
    expect(
      await gmPage
        .locator(`select[name="wild-magic-surge-5e.${key}"] option`)
        .evaluateAll((options) =>
          options.map((option) => ({
            value: (option as HTMLOptionElement).value,
            label: option.textContent?.trim(),
          })),
        ),
    ).toEqual([
      { value: "BASE", label: "Base-level only" },
      { value: "UPCAST", label: "Upcast only" },
      { value: "DEFAULT", label: "Default behavior" },
    ]);
  }
});

test("the cast options panel saves and reopens all four selections", async ({
  gmPage,
  world,
}) => {
  const keys = ["wmsCastWhen", "tocCastWhen"];
  for (const key of keys) await world.rememberSetting(key);
  for (const mode of ["BASE", "UPCAST", "DEFAULT"]) {
    await openSettingsPanel(gmPage, "UpcastSpellSettingsPanel", "wmsCastWhen");
    const field = gmPage.locator(
      'select[name="wild-magic-surge-5e.wmsCastWhen"]',
    );
    const form = gmPage.locator("form").filter({ has: field });
    for (const key of keys)
      await form
        .locator(`select[name="wild-magic-surge-5e.${key}"]`)
        .selectOption(mode);
    await form.getByRole("button", { name: "Save Changes" }).click();
    for (const key of keys)
      await expect.poll(() => readSetting(gmPage, key)).toBe(mode);
    await openSettingsPanel(gmPage, "UpcastSpellSettingsPanel", "wmsCastWhen");
    for (const key of keys)
      await expect(
        gmPage.locator(`select[name="wild-magic-surge-5e.${key}"]`),
      ).toHaveValue(mode);
    await gmPage
      .locator("form")
      .filter({ has: field })
      .getByRole("button", { name: "Save Changes" })
      .click();
  }
});
