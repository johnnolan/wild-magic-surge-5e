import Resource from "./Resource";
import IncrementalCheck from "./IncrementalCheck";
import DieDescending from "./DieDescending";
import { WMSCONST } from "../WMSCONST";
import type { ResourceValue } from "../types/domain";

function actorWithResource(initial?: ResourceValue) {
  let stored = initial;
  const actor = {
    getFlag: jest.fn(() => stored),
    setFlag: jest.fn(
      async (_module: string, _key: string, value: ResourceValue) => {
        stored = value;
      },
    ),
  } as unknown as Actor;
  return { actor, stored: () => stored };
}

describe("Resource defaults", () => {
  beforeEach(() => {
    (global as any).game = {
      settings: {
        get: jest.fn((_module: string, key: string) => {
          if (key === WMSCONST.OPT_RESOURCE_TYPE) return "NONE";
          if (key === WMSCONST.OPT_SURGE_TYPE) return "INCREMENTAL_CHECK";
        }),
      },
    };
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
    (global as any).game.settings.get.mockImplementation(
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
