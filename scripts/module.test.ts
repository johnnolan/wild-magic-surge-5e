import {
  actorFixture,
  deferred,
  itemFixture,
  rollFixture,
  setTestCanvas,
  setTestGame,
  setTestHooks,
  testGlobals,
} from "./test/FoundryFixtures";
import { WMSCONST } from "./WMSCONST";
import MagicSurgeCheck from "./MagicSurgeCheck";
import RollTableMagicSurge from "./RollTableMagicSurge";

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
      once: jest.fn(
        (name: string, listener: (...args: unknown[]) => unknown) => {
          onceListeners.set(name, listener);
        },
      ),
    });
    setTestGame({
      settings: {
        get: jest.fn(),
      },
    });

    require("./module");
    await listeners.get("init")?.();
  });

  it("binds roll-table buttons in new and re-rendered chat messages", () => {
    const render = listeners.get("renderChatMessageHTML");
    expect(render).toBeDefined();
    const roll = jest
      .spyOn(RollTableMagicSurge, "RollOnTable")
      .mockResolvedValue("surge result");
    const markup =
      '<div class="card-buttons wms-roll-table-buttons"><button class="roll-table-wms">Roll</button></div>';

    try {
      const firstMessage = document.createElement("li");
      firstMessage.innerHTML = markup;
      render?.(undefined, firstMessage);
      firstMessage.querySelector<HTMLButtonElement>(".roll-table-wms")?.click();

      const secondMessage = document.createElement("li");
      secondMessage.innerHTML = markup;
      render?.(undefined, secondMessage);
      secondMessage
        .querySelector<HTMLButtonElement>(".roll-table-wms")
        ?.click();

      firstMessage.innerHTML = markup;
      render?.(undefined, firstMessage);
      firstMessage.querySelector<HTMLButtonElement>(".roll-table-wms")?.click();

      expect(roll).toHaveBeenCalledTimes(3);
    } finally {
      roll.mockRestore();
    }
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

  it.each([
    { mode: "INCREMENTAL_CHECK", max: 20 },
    { mode: "INCREMENTAL_CHECK_CHAOTIC", max: 10 },
    { mode: "DIE_DESCENDING", max: 6 },
  ])(
    "keeps the $mode sheet resource maximum for both reset hooks",
    async ({ mode, max }) => {
      const initial = {
        label: "Surge Chance",
        lr: false,
        sr: false,
        value: 5,
        max,
      };
      const system = { resources: { primary: initial } };
      const actor = actorFixture({
        id: "caster",
        system,
        update: jest.fn(async (updates: Record<string, typeof initial>) => {
          system.resources.primary = updates["system.resources.primary"];
        }),
      });
      setTestGame({
        user: { isGM: false },
        actors: { get: jest.fn().mockReturnValue(actor) },
        settings: {
          get: jest.fn((_namespace: string, key: string) => {
            if (key === WMSCONST.OPT_RESOURCE_TYPE) return "PRIMARY";
            if (key === WMSCONST.OPT_SURGE_TYPE) return mode;
          }),
        },
      });
      await onceListeners.get("ready")?.();

      await listeners.get("wild-magic-surge-5e.reset")?.(actor);
      expect(system.resources.primary).toEqual({ ...initial, value: 1 });

      system.resources.primary = { ...initial };
      await listeners.get("wild-magic-surge-5e.Reset")?.(actor.id);
      expect(system.resources.primary).toEqual({ ...initial, value: 1 });
    },
  );

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
      scaling: number;
    }> = [];
    const checkItem = jest
      .spyOn(MagicSurgeCheck.prototype, "CheckItem")
      .mockImplementation(async function (this: MagicSurgeCheck, checkedItem) {
        checked.push({
          actor: this._actor,
          tokenId: this._tokenId,
          item: checkedItem,
          scaling: this._usageConfig.scaling,
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
        { actor, tokenId: "token-1", item, scaling: 0 },
        { actor, tokenId: undefined, item, scaling: 0 },
      ]);
    } finally {
      checkItem.mockRestore();
    }
  });

  it.each([0, 2])(
    "preserves scaling %i for GM casts and player socket checks",
    async (scaling) => {
      const actor = actorFixture({ id: "actor-1" });
      const item = itemFixture({ actor, name: "spell" });
      const activity = { item, consumption: { spellSlot: true } };
      const socketOn = jest.fn();
      const socketEmit = jest.fn();
      const seenScaling: number[] = [];
      const check = jest
        .spyOn(MagicSurgeCheck.prototype, "CheckItem")
        .mockImplementation(async function (this: MagicSurgeCheck) {
          seenScaling.push(this._usageConfig.scaling);
        });
      try {
        setTestCanvas({ tokens: { placeables: [{ id: "token-1", actor }] } });
        setTestGame({
          user: { isGM: true },
          actors: { get: jest.fn().mockReturnValue(actor) },
          socket: { on: socketOn, emit: socketEmit },
          settings: { get: jest.fn() },
        });
        await onceListeners.get("ready")?.();
        await listeners.get("dnd5e.postUseActivity")?.(activity, { scaling });
        expect(seenScaling).toEqual([scaling]);
        expect(socketEmit).not.toHaveBeenCalled();
        const receive = socketOn.mock.calls[0][1];

        setTestGame({
          user: { isGM: false },
          socket: { emit: socketEmit },
          settings: { get: jest.fn() },
        });
        await onceListeners.get("ready")?.();
        await listeners.get("dnd5e.postUseActivity")?.(activity, { scaling });
        expect(check).toHaveBeenCalledTimes(1);
        expect(socketEmit).toHaveBeenCalledWith("module.wild-magic-surge-5e", {
          event: "SurgeCheck",
          data: {
            actorId: actor.id,
            item,
            tokenId: "token-1",
            usageConfig: { scaling },
          },
        });

        setTestGame({
          user: { isGM: true },
          actors: { get: jest.fn().mockReturnValue(actor) },
          settings: { get: jest.fn() },
        });
        await receive(socketEmit.mock.calls[0][1]);
        expect(seenScaling).toEqual([scaling, scaling]);
      } finally {
        check.mockRestore();
      }
    },
  );
});
