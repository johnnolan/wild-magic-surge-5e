import { setTestGame, testGlobals } from "../test/FoundryFixtures";
import { SettingsList, UpdateObject } from "./Helpers";
import type { SettingsFormData } from "./Helpers";
import { WMSCONST } from "../WMSCONST";

describe("settings panel helpers", () => {
  const booleanKey = WMSCONST.OPT_CHAT_MSG_ENABLED;
  const stringKey = WMSCONST.OPT_CHAT_MSG;
  const choiceKey = WMSCONST.OPT_CUSTOM_ROLL_RESULT_CHECK;
  const registration = (
    key: string,
    type: BooleanConstructor | StringConstructor | NumberConstructor,
    choices?: unknown,
  ) => ({
    namespace: WMSCONST.MODULE_ID,
    key,
    type,
    name: `${key} name`,
    hint: `${key} hint`,
    choices,
  });

  beforeEach(() => {
    const settings = new Map([
      [
        `${WMSCONST.MODULE_ID}.${booleanKey}`,
        registration(booleanKey, Boolean),
      ],
      [`${WMSCONST.MODULE_ID}.${stringKey}`, registration(stringKey, String)],
      [
        `${WMSCONST.MODULE_ID}.${choiceKey}`,
        registration(choiceKey, String, { EQ: "Equal", GT: "Greater" }),
      ],
    ]);
    const values: Record<string, boolean | string> = {
      [booleanKey]: true,
      [stringKey]: "Surge message",
      [choiceKey]: "GT",
    };
    setTestGame({
      i18n: { format: jest.fn((key: string) => `localized ${key}`) },
      settings: {
        settings,
        get: jest.fn((_namespace: string, key: string) => values[key]),
        set: jest.fn(
          async (_namespace: string, _key: string, value: unknown) => value,
        ),
      },
    });
  });

  it("builds typed checkbox, text, and choice data from registered settings", () => {
    const list = SettingsList([booleanKey, stringKey, choiceKey]);

    expect(list).toEqual([
      {
        module: WMSCONST.MODULE_ID,
        key: booleanKey,
        type: "Boolean",
        isBoolean: true,
        isString: false,
        isArray: false,
        displayname: `localized ${booleanKey} name`,
        hint: `localized ${booleanKey} hint`,
        choices: {},
        value: true,
        choicesSelect: [],
      },
      {
        module: WMSCONST.MODULE_ID,
        key: stringKey,
        type: "String",
        isBoolean: false,
        isString: true,
        isArray: false,
        displayname: `localized ${stringKey} name`,
        hint: `localized ${stringKey} hint`,
        choices: {},
        value: "Surge message",
        choicesSelect: [],
      },
      {
        module: WMSCONST.MODULE_ID,
        key: choiceKey,
        type: "String",
        isBoolean: false,
        isString: false,
        isArray: true,
        displayname: `localized ${choiceKey} name`,
        hint: `localized ${choiceKey} hint`,
        choices: { EQ: "Equal", GT: "Greater" },
        value: "GT",
        choicesSelect: [
          { key: "EQ", value: "Equal", selected: false },
          { key: "GT", value: "Greater", selected: true },
        ],
      },
    ]);
    expect(testGlobals.game.settings.get).toHaveBeenCalledWith(
      WMSCONST.MODULE_ID,
      booleanKey,
    );
  });

  it("skips absent or unsupported registration metadata", () => {
    testGlobals.game.settings.settings.set(
      `${WMSCONST.MODULE_ID}.${stringKey}`,
      registration(stringKey, Number),
    );

    expect(SettingsList([stringKey, WMSCONST.OPT_SPELL_REGEX])).toEqual([]);
    expect(testGlobals.game.settings.get).not.toHaveBeenCalled();
  });

  it("does not render a registration whose stored value has the wrong type", () => {
    testGlobals.game.settings.get.mockReturnValue("true");

    expect(SettingsList([booleanKey])).toEqual([]);
  });

  it("submits valid boolean and string form values through the typed setter", async () => {
    const formData = {
      [`${WMSCONST.MODULE_ID}.${booleanKey}`]: false,
      [`${WMSCONST.MODULE_ID}.${stringKey}`]: "New message",
      [`${WMSCONST.MODULE_ID}.${choiceKey}`]: "EQ",
    } satisfies SettingsFormData;

    await UpdateObject(formData);

    expect(testGlobals.game.settings.set).toHaveBeenNthCalledWith(
      1,
      WMSCONST.MODULE_ID,
      booleanKey,
      false,
    );
    expect(testGlobals.game.settings.set).toHaveBeenNthCalledWith(
      2,
      WMSCONST.MODULE_ID,
      stringKey,
      "New message",
    );
    expect(testGlobals.game.settings.set).toHaveBeenNthCalledWith(
      3,
      WMSCONST.MODULE_ID,
      choiceKey,
      "EQ",
    );
  });

  it.each([
    null,
    [],
    { "other.magicSurgeChatMessage": "wrong namespace" },
    { "wild-magic-surge-5e.missing": "unknown key" },
    { "wild-magic-surge-5e.autoRollD20": true },
    { "wild-magic-surge-5e.magicSurgeChatMessageEnabled": "true" },
    { "wild-magic-surge-5e.magicSurgeChatMessage": false },
    { "wild-magic-surge-5e.customRollResultCheck": "BOGUS" },
  ])(
    "rejects invalid form data without writing settings: %p",
    async (formData) => {
      await expect(UpdateObject(formData)).rejects.toThrow(TypeError);
      expect(testGlobals.game.settings.set).not.toHaveBeenCalled();
    },
  );
});
