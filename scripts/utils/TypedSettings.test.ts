import {
  getModuleActorFlag,
  getModuleSetting,
  setModuleActorFlag,
  setModuleSetting,
  setModuleSettingFromForm,
} from "./TypedSettings";

if (false) {
  const actor = {} as Actor;
  // @ts-expect-error Unknown setting keys are rejected.
  getModuleSetting("misspelledSetting");
  // @ts-expect-error Setting values must match the registered value type.
  setModuleSetting("autoRollD20", "true");
  // @ts-expect-error Actor flag values must match the flag key.
  setModuleActorFlag(actor, "hassurged", {
    value: 1,
    max: 20,
    label: "x",
    lr: false,
    sr: false,
  });
  // @ts-expect-error Unknown Actor flag keys are rejected.
  getModuleActorFlag(actor, "missingFlag");
  // @ts-expect-error Resource flag keys only accept resource records.
  setModuleActorFlag(actor, "resource", true);
  // @ts-expect-error The legacy die_type flag stores a dieValue object.
  setModuleActorFlag(actor, "die_type", "1d8");
}

describe("typed module settings and flags", () => {
  beforeEach(() => {
    (global as any).game = {
      settings: {
        get: jest.fn().mockReturnValue(true),
        set: jest
          .fn()
          .mockImplementation(async (_namespace, _key, value) => value),
      },
    };
  });

  it("reads a registered setting using its mapped value type", () => {
    expect(getModuleSetting("autoRollD20")).toBe(true);
    expect(game.settings.get).toHaveBeenCalledWith(
      "wild-magic-surge-5e",
      "autoRollD20",
    );
  });

  it("writes a valid registered setting", async () => {
    await expect(setModuleSetting("autoRollD20", false)).resolves.toBe(false);
    expect(game.settings.set).toHaveBeenCalledWith(
      "wild-magic-surge-5e",
      "autoRollD20",
      false,
    );
  });

  it("rejects unknown or wrong-typed dynamic form settings", () => {
    expect(() => setModuleSettingFromForm("misspelled", true)).toThrow(
      "Unknown wild-magic-surge-5e setting",
    );
    expect(() => setModuleSettingFromForm("autoRollD20", "true")).toThrow(
      "Invalid value type for wild-magic-surge-5e.autoRollD20",
    );
    expect(() => setModuleSettingFromForm("wmsName", false)).toThrow(
      "Invalid value type for wild-magic-surge-5e.wmsName",
    );
  });

  it("validates Actor flag values when reading and writing", async () => {
    const actor = {
      getFlag: jest.fn().mockReturnValue("true"),
      setFlag: jest.fn().mockResolvedValue(undefined),
    } as unknown as Actor;

    expect(getModuleActorFlag(actor, "hassurged")).toBeUndefined();
    await setModuleActorFlag(actor, "hassurged", true);
    expect(actor.setFlag).toHaveBeenCalledWith(
      "wild-magic-surge-5e",
      "hassurged",
      true,
    );
  });

  it("normalizes resource flags and writes the matching resource shape", async () => {
    const resource = {
      label: "Surge Chance",
      lr: false,
      sr: false,
      max: 20,
      value: 4,
    };
    const actor = {
      getFlag: jest.fn().mockReturnValue(resource),
      setFlag: jest.fn().mockResolvedValue(undefined),
    } as unknown as Actor;

    expect(getModuleActorFlag(actor, "surge_increment_resource")).toEqual(
      resource,
    );
    await setModuleActorFlag(actor, "resource", resource);
    expect(actor.setFlag).toHaveBeenCalledWith(
      "wild-magic-surge-5e",
      "resource",
      resource,
    );
  });

  it("rejects malformed resource flag writes from dynamic callers", () => {
    const actor = { setFlag: jest.fn() } as unknown as Actor;

    expect(() =>
      setModuleActorFlag(actor, "resource", {
        max: 20,
        value: 1,
      } as ResourceValue),
    ).toThrow("Invalid value type for wild-magic-surge-5e.resource");
    expect(actor.setFlag).not.toHaveBeenCalled();
  });

  it("accepts only known legacy die_type values", () => {
    const actor = {
      getFlag: jest.fn().mockReturnValue({ dieValue: "1d8" }),
    } as unknown as Actor;
    expect(getModuleActorFlag(actor, "die_type")).toEqual({ dieValue: "1d8" });

    actor.getFlag = jest.fn().mockReturnValue({ dieValue: "1d3" });
    expect(getModuleActorFlag(actor, "die_type")).toBeUndefined();
  });
});
