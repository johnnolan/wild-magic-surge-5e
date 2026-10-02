import { WMSCONST } from "./WMSCONST";

jest.mock("./ModuleSettings", () => ({
  __esModule: true,
  default: { Register: jest.fn() },
}));
jest.mock("./panels/ActorHelperPanel", () => ({
  ActorHelperPanel: class {},
}));

describe("wild-magic-surge-5e.reset", () => {
  it("resets the supplied actor's surge resource without triggering a surge", async () => {
    const listeners = new Map<string, (...args: any[]) => unknown>();
    (global as any).Hooks = {
      on: jest.fn((name: string, listener: (...args: any[]) => unknown) => {
        listeners.set(name, listener);
      }),
      once: jest.fn(),
    };

    const settings = {
      [WMSCONST.OPT_RESOURCE_TYPE]: "NONE",
      [WMSCONST.OPT_SURGE_TYPE]: WMSCONST.ROLL_CHECK_TYPE.DIE_DESCENDING,
    };
    (global as any).game = {
      settings: {
        get: jest.fn(
          (_module: string, key: keyof typeof settings) => settings[key],
        ),
      },
    };

    require("./module");
    await listeners.get("init")?.();

    let resource = {
      label: "Surge Chance",
      lr: false,
      sr: false,
      max: 6,
      value: 5,
    };
    const actor = {
      id: "actor-1",
      setFlag: jest.fn(
        async (_module: string, key: string, value: typeof resource) => {
          if (key === "resource") resource = value;
        },
      ),
    } as unknown as Actor;

    const reset = listeners.get("wild-magic-surge-5e.reset");
    expect(reset).toBeDefined();
    await expect(reset?.(actor)).resolves.toBeUndefined();

    expect(resource).toEqual({
      label: "Surge Chance",
      lr: false,
      sr: false,
      max: 6,
      value: 1,
    });
    expect(actor.setFlag).toHaveBeenCalledTimes(2);
    expect(actor.setFlag).toHaveBeenCalledWith(
      WMSCONST.MODULE_ID,
      "resource",
      resource,
    );
  });
});
