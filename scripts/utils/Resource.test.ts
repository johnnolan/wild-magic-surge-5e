import { actorFixture, setTestGame, testGlobals } from "../test/FoundryFixtures";
import Resource from "./Resource";
import IncrementalCheck from "./IncrementalCheck";
import DieDescending from "./DieDescending";
import { WMSCONST } from "../WMSCONST";
import type { ResourceValue } from "../types/domain";
import MagicSurgeCheck from "../MagicSurgeCheck";
import RollTableMagicSurge from "../RollTableMagicSurge";
import TidesOfChaos from "../TidesOfChaos";
import AutoEffects from "../AutoEffects";

function actorWithResource(initial?: ResourceValue) {
  let stored = initial;
  const actor = actorFixture({
    getFlag: jest.fn(() => stored),
    setFlag: jest.fn(
      async (_module: string, _key: string, value: ResourceValue) => {
        stored = value;
      },
    ),
  });
  return { actor, stored: () => stored };
}

describe("Resource defaults", () => {
  beforeEach(() => {
    setTestGame({
      settings: {
        get: jest.fn((_module: string, key: string) => {
          if (key === WMSCONST.OPT_RESOURCE_TYPE) return "NONE";
          if (key === WMSCONST.OPT_SURGE_TYPE) return "INCREMENTAL_CHECK";
        }),
      },
    });
  });

  it("writes independent resources without changing static defaults", async () => {
    const first = actorWithResource();
    const second = actorWithResource();
    const defaultBefore = { ...IncrementalCheck.defaultValue };

    await IncrementalCheck.SetResource(first.actor, { max: 20, value: 8 });
    await IncrementalCheck.SetResource(second.actor, { max: 20, value: 2 });
    const firstWrite = first.stored();
    if (!firstWrite) throw new Error("First resource was not written");
    firstWrite.value = 12;

    expect(second.stored()?.value).toBe(2);
    expect(IncrementalCheck.defaultValue).toEqual(defaultBefore);
    expect(Resource.defaultValue).toEqual(defaultBefore);
    expect(DieDescending.defaultValue).toEqual({ ...defaultBefore, max: 6 });
    expect(Object.isFrozen(Resource.defaultValue)).toBe(true);
    expect(Object.isFrozen(IncrementalCheck.defaultValue)).toBe(true);
    expect(Object.isFrozen(DieDescending.defaultValue)).toBe(true);
    expect(first.stored()).not.toBe(second.stored());
    expect(first.stored()).not.toBe(IncrementalCheck.defaultValue);
  });

  it("returns a fresh copy of the initialized default used for a missing resource", async () => {
    testGlobals.game.settings.get.mockImplementation(
      (_module: string, key: string) => {
        if (key === WMSCONST.OPT_RESOURCE_TYPE) return "NONE";
        if (key === WMSCONST.OPT_SURGE_TYPE) return "INCREMENTAL_CHECK_CHAOTIC";
      },
    );
    const holder = actorWithResource();

    const resource = await IncrementalCheck.GetResource(holder.actor);
    expect(resource).toEqual({ ...IncrementalCheck.defaultValue, max: 10 });
    expect(holder.stored()).toEqual(resource);
    expect(resource).not.toBe(holder.stored());

    resource.value = 7;
    expect(holder.stored()?.value).toBe(1);
    expect(IncrementalCheck.defaultValue.max).toBe(20);
  });
});

describe("Tides of Chaos resource resets", () => {
  beforeEach(() => {
    jest.spyOn(RollTableMagicSurge, "Check").mockResolvedValue(undefined);
    jest.spyOn(TidesOfChaos, "Check").mockResolvedValue(undefined);
    jest.spyOn(AutoEffects, "Run").mockResolvedValue(undefined);
    jest.spyOn(MagicSurgeCheck.prototype, "_callIsSurgeHook")
      .mockResolvedValue(undefined);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe.each([
    ["PRIMARY", "primary"],
    ["SECONDARY", "secondary"],
    ["TERTIARY", "tertiary"],
  ])("with the %s sheet resource selected", (resourceType, slot) => {
    it.each([
      ["INCREMENTAL_CHECK", 20],
      ["INCREMENTAL_CHECK_CHAOTIC", 10],
      ["DIE_DESCENDING", 6],
    ])("resets %s to 1/%s after a Tides surge", async (mode, max) => {
      setTestGame({
        settings: {
          get: jest.fn((_module: string, key: string) => {
            if (key === WMSCONST.OPT_RESOURCE_TYPE) return resourceType;
            if (key === WMSCONST.OPT_SURGE_TYPE) return mode;
            return false;
          }),
        },
      });
      const resources = {
        [slot]: { ...IncrementalCheck.defaultValue, max, value: 5 },
      };
      const actor = actorFixture({
        system: { resources },
        setFlag: jest.fn().mockResolvedValue(undefined),
        update: jest.fn(async (changes: Record<string, ResourceValue>) => {
          resources[slot] = changes[`system.resources.${slot}`];
        }),
      });

      await new MagicSurgeCheck(actor, undefined).SurgeTidesOfChaos();

      expect(actor.update).toHaveBeenCalledTimes(2);
      expect(resources[slot]).toEqual({
        ...IncrementalCheck.defaultValue,
        value: 1,
        max,
      });
      expect(actor.update).toHaveBeenLastCalledWith({
        [`system.resources.${slot}`]: resources[slot],
      });
    });
  });
});
