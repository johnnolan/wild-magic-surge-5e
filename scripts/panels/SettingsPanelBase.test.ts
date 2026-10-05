import { readFileSync } from "node:fs";
import { compile } from "handlebars";
import {
  formDataFixture,
  setTestGame,
  setTestGlobal,
} from "../test/FoundryFixtures";
import { WMSCONST } from "../WMSCONST";
import type { PanelSettingKey, SettingsPanelData } from "./Helpers";
import type { SettingsPanelBase } from "./SettingsPanelBase";

class ApplicationV2Fixture {
  constructor(public readonly options: unknown) {
    // The fixture records the constructor options for title assertions.
  }
}

setTestGlobal("foundry", {
  applications: {
    api: {
      ApplicationV2: ApplicationV2Fixture,
      HandlebarsApplicationMixin: (Base: typeof ApplicationV2Fixture) =>
        class extends Base {},
    },
  },
});

// Panel classes extend a Foundry global, so install that fixture before loading them.
const {
  ChatSettingsPanel,
  IncrementalSettingsPanel,
  SpellLevelSettingsPanel,
  SpellRegexSettingsPanel,
  StandardSettingsPanel,
} = require("./index") as typeof import("./index");
const ModuleSettings = (
  require("../ModuleSettings") as typeof import("../ModuleSettings")
).default;
const settingsTemplate = compile(
  readFileSync("templates/settings.html", "utf8"),
);

const panels = [
  {
    panel: ChatSettingsPanel,
    title: "WildMagicSurge5E.settings_panel_chat_message",
    keys: [
      WMSCONST.OPT_CHAT_MSG,
      WMSCONST.OPT_CHAT_MSG_ENABLED,
      WMSCONST.OPT_AUTO_D20_MSG,
      WMSCONST.OPT_AUTO_D20_MSG_ENABLED,
      WMSCONST.OPT_AUTO_D20_MSG_NO_SURGE,
      WMSCONST.OPT_AUTO_D20_MSG_NO_SURGE_ENABLED,
    ],
  },
  {
    panel: IncrementalSettingsPanel,
    title: "WildMagicSurge5E.settings_panel_incremental",
    keys: [WMSCONST.OPT_INCREMENTAL_CHECK_TO_CHAT],
  },
  {
    panel: SpellLevelSettingsPanel,
    title: "WildMagicSurge5E.settings_panel_spell_level_dep",
    keys: [
      WMSCONST.OPT_TSL_DIE,
      WMSCONST.OPT_TSL_CANTRIP,
      WMSCONST.OPT_TSL_LVL1,
      WMSCONST.OPT_TSL_LVL2,
      WMSCONST.OPT_TSL_LVL3,
      WMSCONST.OPT_TSL_LVL4,
      WMSCONST.OPT_TSL_LVL5,
      WMSCONST.OPT_TSL_LVL6,
      WMSCONST.OPT_TSL_LVL7,
      WMSCONST.OPT_TSL_LVL8,
      WMSCONST.OPT_TSL_LVL9,
      WMSCONST.OPT_TSL_LVL10,
    ],
  },
  {
    panel: SpellRegexSettingsPanel,
    title: "WildMagicSurge5E.settings_panel_spell_regex",
    keys: [
      WMSCONST.OPT_SPELL_REGEX_ENABLED,
      WMSCONST.OPT_SPELL_REGEX,
      WMSCONST.OPT_SPELL_REGEX_INVERSE,
    ],
  },
  {
    panel: StandardSettingsPanel,
    title: "WildMagicSurge5E.settings_panel_standard_phb",
    keys: [
      WMSCONST.OPT_CUSTOM_ROLL_DICE_FORMULA,
      WMSCONST.OPT_CUSTOM_ROLL_RESULT_CHECK,
      WMSCONST.OPT_CUSTOM_ROLL_RESULT,
    ],
  },
] satisfies {
  panel: new () => SettingsPanelBase;
  title: string;
  keys: PanelSettingKey[];
}[];

async function renderData(
  panel: SettingsPanelBase,
): Promise<SettingsPanelData> {
  const application = panel as unknown as {
    _prepareContext(): Promise<SettingsPanelData>;
  };
  return application._prepareContext();
}

describe("settings panels", () => {
  const registrations = new Map<string, { default: unknown; type: Function }>();
  const values = new Map<string, unknown>();
  const registerMenu = jest.fn();
  const set = jest.fn(
    async (_namespace: string, key: string, value: unknown) => {
      values.set(key, value);
      return value;
    },
  );

  beforeEach(() => {
    registrations.clear();
    values.clear();
    registerMenu.mockClear();
    set.mockClear();
    setTestGame({
      i18n: { format: jest.fn((key: string) => key) },
      settings: {
        settings: registrations,
        register: jest.fn(
          (
            _namespace: string,
            key: string,
            data: { default: unknown; type: Function },
          ) => {
            registrations.set(`${WMSCONST.MODULE_ID}.${key}`, data);
            values.set(key, data.default);
          },
        ),
        registerMenu,
        get: jest.fn((_namespace: string, key: string) => values.get(key)),
        set,
      },
    });
    ModuleSettings.Register();
  });

  it("registers each panel with its own menu and the shared rendering options", () => {
    expect(registerMenu).toHaveBeenCalledTimes(panels.length);
    for (const { panel, title } of panels) {
      expect(registerMenu).toHaveBeenCalledWith(
        WMSCONST.MODULE_ID,
        panel.name,
        expect.objectContaining({ name: title, type: panel, restricted: true }),
      );
      expect(panel.DEFAULT_OPTIONS).toEqual({
        id: `${WMSCONST.MODULE_FLAG_NAME}-chat-settings`,
        tag: "form",
        position: { width: 520, height: 500 },
        form: {
          handler: expect.any(Function),
          submitOnChange: false,
          closeOnSubmit: true,
        },
      });
      expect(panel.PARTS.settings.template).toBe(
        "modules/wild-magic-surge-5e/templates/settings.html",
      );
      expect(new panel().options).toEqual({ window: { title } });
    }
  });

  it.each(panels)(
    "renders and submits $panel.name settings",
    async ({ panel, keys }) => {
      const instance = new panel();
      const context = await renderData(instance);
      expect(context.modules.map(({ key }) => key)).toEqual(keys);
      const form = document.createElement("form");
      form.innerHTML = settingsTemplate(context);
      expect(form.querySelector("form")).toBeNull();
      expect(
        Array.from(
          form.querySelectorAll<HTMLInputElement | HTMLSelectElement>(
            "input[name], select[name]",
          ),
        ).map((field) => field.name),
      ).toEqual(keys.map((key) => `${WMSCONST.MODULE_ID}.${key}`));
      for (const input of form.querySelectorAll<HTMLInputElement>(
        'input[type="text"]',
      )) {
        expect(input.autocomplete).toBe("off");
      }
      expect(form.querySelector('button[type="submit"]')).not.toBeNull();

      const key = keys[0];
      const registration = registrations.get(`${WMSCONST.MODULE_ID}.${key}`);
      if (!registration) throw new Error(`Missing registration for ${key}`);
      const submittedValue =
        registration.type === Boolean
          ? !registration.default
          : registration.default;

      await panel.DEFAULT_OPTIONS.form.handler(
        new Event("submit"),
        form,
        formDataFixture({ [`${WMSCONST.MODULE_ID}.${key}`]: submittedValue }),
      );

      expect(set).toHaveBeenCalledWith(WMSCONST.MODULE_ID, key, submittedValue);
      expect(values.get(key)).toBe(submittedValue);
    },
  );

  it("propagates a failed settings write to the submitting panel", async () => {
    const failure = new Error("setting write failed");
    set.mockRejectedValueOnce(failure);

    await expect(
      ChatSettingsPanel.DEFAULT_OPTIONS.form.handler(
        new Event("submit"),
        document.createElement("form"),
        formDataFixture({
          [`${WMSCONST.MODULE_ID}.${WMSCONST.OPT_CHAT_MSG}`]: "new message",
        }),
      ),
    ).rejects.toBe(failure);
  });
});
