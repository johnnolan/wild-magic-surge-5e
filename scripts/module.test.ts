import { actorFixture, deferred, itemFixture, rollFixture, setTestCanvas, setTestGame, setTestHooks, testGlobals } from "./test/FoundryFixtures";
import { WMSCONST } from "./WMSCONST";
import MagicSurgeCheck from "./MagicSurgeCheck";

jest.mock("./ModuleSettings", () => ({
  __esModule: true,
  default: { Register: jest.fn() },
}));
jest.mock("./panels/ActorHelperPanel", () => ({
  ActorHelperPanel: class {},
}));

describe("module hooks", () => {
  const listeners = new Map<string, (...args: unknown[]) => unknown>();
  const onceListeners = new Map<string, (...args: unknown[]) => unknown>();

  beforeAll(async () => {
    setTestHooks({
      on: jest.fn((name: string, listener: (...args: unknown[]) => unknown) => {
        listeners.set(name, listener);
      }),
      once: jest.fn((name: string, listener: (...args: unknown[]) => unknown) => {
        onceListeners.set(name, listener);
      }),
    });
    setTestGame({
      settings: {
        get: jest.fn(),
      },
    });

    require("./module");
    await listeners.get("init")?.();
  });

  it("resets the supplied actor's surge resource without triggering a surge", async () => {
    const settings = {
      [WMSCONST.OPT_RESOURCE_TYPE]: "NONE",
      [WMSCONST.OPT_SURGE_TYPE]: WMSCONST.ROLL_CHECK_TYPE.DIE_DESCENDING,
    };
    testGlobals.game.settings.get = jest.fn(
      (_module: string, key: keyof typeof settings) => settings[key],
    );

    let resource = {
      label: "Surge Chance",
      lr: false,
      sr: false,
      max: 6,
      value: 5,
    };
    const actor = actorFixture({
      id: "actor-1",
      setFlag: jest.fn(
        async (_module: string, key: string, value: typeof resource) => {
          if (key === "resource") resource = value;
        },
      ),
    });

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

  it("awaits a socket reset write and exposes a failed flag update", async () => {
    const write = deferred<void>();
    const actor = actorFixture({
      id: "actor-1",
      setFlag: jest.fn(() => write.promise),
    });
    setTestGame({
      user: { isGM: false },
      actors: { get: jest.fn().mockReturnValue(actor) },
      settings: {
        get: jest.fn((_module: string, key: string) => {
          if (key === WMSCONST.OPT_RESOURCE_TYPE) return "NONE";
          if (key === WMSCONST.OPT_SURGE_TYPE) return "INCREMENTAL_CHECK";
        }),
      },
    });
    await onceListeners.get("ready")?.();
    const reset = listeners.get("wild-magic-surge-5e.Reset");
    expect(reset).toBeDefined();

    const pending = reset?.("actor-1");
    await Promise.resolve();
    expect(actor.setFlag).toHaveBeenCalledTimes(1);
    const failure = new Error("reset write failed");
    write.reject(failure);
    await expect(pending).rejects.toBe(failure);
  });

  it("passes a found canvas token to the manual surge and tolerates its absence", async () => {
    const actor = actorFixture({ id: "actor-1" });
    const roll = rollFixture({ result: "1" });
    const seenTokenIds: Array<string | undefined> = [];
    const surge = jest
      .spyOn(MagicSurgeCheck.prototype, "SurgeWildMagic")
      .mockImplementation(async function (this: MagicSurgeCheck) {
        seenTokenIds.push(this._tokenId);
      });
    try {
      setTestCanvas({
        tokens: { placeables: [{ id: "token-1", actor }] },
      });
      await listeners.get("wild-magic-surge-5e.manualTriggerWMS")?.(
        actor,
        roll,
      );

      setTestCanvas(undefined);
      await listeners.get("wild-magic-surge-5e.manualTriggerWMS")?.(
        actor,
        roll,
      );

      expect(surge).toHaveBeenCalledTimes(2);
      expect(seenTokenIds).toEqual(["token-1", undefined]);
    } finally {
      surge.mockRestore();
    }
  });

  it("ignores socket checks without a saved actor and preserves an optional token", async () => {
    const actor = actorFixture({ id: "actor-1" });
    const item = itemFixture({ name: "spell" });
    const getActor = jest.fn().mockReturnValue(actor);
    const socketOn = jest.fn();
    setTestGame({
      user: { isGM: true },
      actors: { get: getActor },
      socket: { on: socketOn },
      settings: { get: jest.fn().mockReturnValue(undefined) },
    });
    await onceListeners.get("ready")?.();
    const socketHandler = socketOn.mock.calls[0][1];

    const checked: Array<{
      actor: Actor;
      tokenId: string | undefined;
      item: Item;
    }> = [];
    const checkItem = jest
      .spyOn(MagicSurgeCheck.prototype, "CheckItem")
      .mockImplementation(async function (this: MagicSurgeCheck, checkedItem) {
        checked.push({
          actor: this._actor,
          tokenId: this._tokenId,
          item: checkedItem,
        });
      });
    try {
      await socketHandler({
        event: "SurgeCheck",
        data: { actorId: null, item },
      });
      getActor.mockReturnValueOnce(undefined);
      await socketHandler({
        event: "SurgeCheck",
        data: { actorId: "missing", item },
      });
      expect(checkItem).not.toHaveBeenCalled();

      await socketHandler({
        event: "SurgeCheck",
        data: { actorId: actor.id, item, tokenId: "token-1" },
      });
      await socketHandler({
        event: "SurgeCheck",
        data: { actorId: actor.id, item },
      });
      expect(checked).toEqual([
        { actor, tokenId: "token-1", item },
        { actor, tokenId: undefined, item },
      ]);
    } finally {
      checkItem.mockRestore();
    }
  });
});
