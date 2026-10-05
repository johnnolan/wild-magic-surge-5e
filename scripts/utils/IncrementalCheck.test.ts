import {
  actorFixture,
  deferred,
  setTestGame,
  setTestHooks,
} from "../test/FoundryFixtures";
import { WMSCONST } from "../WMSCONST";
import type { ResourceValue } from "../types/domain";
import IncrementalCheck from "./IncrementalCheck";
import "../../__mocks__/index";

const resource = (value: number): ResourceValue => ({
  label: "Surge Chance",
  lr: false,
  sr: false,
  max: 20,
  value,
});

function actorWithResource(initial?: ResourceValue) {
  let stored = initial;
  const actor = actorFixture({
    getFlag: jest.fn(() => stored),
    setFlag: jest.fn(
      async (_module: string, _key: string, next: ResourceValue) => {
        stored = next;
      },
    ),
  });
  return { actor, stored: () => stored };
}

beforeEach(() => {
  setTestHooks({ callAll: jest.fn() });
  setTestGame({
    settings: {
      get: jest.fn((_module: string, key: string) => {
        if (key === WMSCONST.OPT_RESOURCE_TYPE) return "NONE";
        if (key === WMSCONST.OPT_SURGE_TYPE) return "INCREMENTAL_CHECK";
        if (key === WMSCONST.OPT_INCREMENTAL_CHECK_TO_CHAT) return false;
      }),
    },
  });
});

describe("IncrementalCheck", () => {
  it("persists the initial resource before reporting a surge", async () => {
    const holder = actorWithResource();

    await expect(IncrementalCheck.Check(holder.actor, 1)).resolves.toBe(true);

    expect(holder.stored()).toEqual(resource(1));
    expect(holder.actor.setFlag).toHaveBeenCalledTimes(2);
  });

  it("persists an increased chance before returning false", async () => {
    const holder = actorWithResource(resource(2));

    await expect(IncrementalCheck.Check(holder.actor, 4)).resolves.toBe(false);

    expect(holder.stored()).toEqual(resource(3));
    expect(holder.actor.setFlag).toHaveBeenCalledTimes(1);
  });

  it("waits for a reset write and propagates its failure", async () => {
    const write = deferred<void>();
    const actor = actorFixture({
      getFlag: jest.fn().mockReturnValue(resource(2)),
      setFlag: jest.fn(() => write.promise),
    });
    const check = IncrementalCheck.Check(actor, 1);
    let settled = false;
    void check
      .finally(() => {
        settled = true;
      })
      .catch(() => undefined);
    await Promise.resolve();
    expect(settled).toBe(false);

    const failure = new Error("flag write failed");
    write.reject(failure);
    await expect(check).rejects.toBe(failure);
    expect(settled).toBe(true);
  });

  it("waits for an override write before reading the persisted resource", async () => {
    const holder = actorWithResource(resource(1));
    await IncrementalCheck.OverrideResource(holder.actor, 7);

    expect(holder.stored()).toEqual(resource(7));
    expect(holder.actor.getFlag).toHaveBeenCalled();
  });
});
