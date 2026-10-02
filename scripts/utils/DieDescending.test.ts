import {
  actorFixture,
  deferred,
  setTestGame,
  setTestHooks,
} from "../test/FoundryFixtures";
import { WMSCONST } from "../WMSCONST";
import type { ResourceValue } from "../types/domain";
import DieDescending from "./DieDescending";
import "../../__mocks__/index";

const resource = (value: number): ResourceValue => ({
  label: "Surge Chance",
  lr: false,
  sr: false,
  max: 6,
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
        if (key === WMSCONST.OPT_SURGE_TYPE) return "DIE_DESCENDING";
      }),
    },
  });
});

describe("DieDescending", () => {
  it("initializes a missing resource before returning its formula", async () => {
    const holder = actorWithResource();

    await expect(DieDescending.DieFormula(holder.actor)).resolves.toBe("1d20");
    expect(holder.stored()).toEqual(resource(1));
  });

  it.each([
    [1, 2, "1d12"],
    [2, 3, "1d10"],
    [3, 4, "1d8"],
    [4, 5, "1d6"],
    [5, 6, "1d4"],
    [6, 6, "1d4"],
  ])("persists step %i as %i (%s)", async (start, next, formula) => {
    const holder = actorWithResource(resource(start));

    await expect(DieDescending.Check(holder.actor, 18)).resolves.toBe(false);

    expect(holder.stored()).toEqual(resource(next));
    await expect(DieDescending.DieFormula(holder.actor)).resolves.toBe(formula);
  });

  it("resets on a roll of one before reporting a surge", async () => {
    const holder = actorWithResource(resource(5));

    await expect(DieDescending.Check(holder.actor, 1)).resolves.toBe(true);
    expect(holder.stored()).toEqual(resource(1));
  });

  it("propagates a rejected resource write", async () => {
    const write = deferred<void>();
    const actor = actorFixture({
      getFlag: jest.fn().mockReturnValue(resource(3)),
      setFlag: jest.fn(() => write.promise),
    });
    const check = DieDescending.Check(actor, 18);
    const failure = new Error("resource write failed");
    write.reject(failure);

    await expect(check).rejects.toBe(failure);
  });

  it("persists an override before notifying listeners", async () => {
    const holder = actorWithResource(resource(1));

    await DieDescending.OverrideResource(holder.actor, 4);

    expect(holder.stored()).toEqual(resource(4));
  });
});
