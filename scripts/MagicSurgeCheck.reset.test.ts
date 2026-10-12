import MagicSurgeCheck from "./MagicSurgeCheck";
import RollTableMagicSurge from "./RollTableMagicSurge";
import IncrementalCheck from "./utils/IncrementalCheck";
import { WMSCONST } from "./WMSCONST";
import {
  actorFixture,
  setTestGame,
  setTestHooks,
} from "./test/FoundryFixtures";
import type { ResourceValue } from "./types/domain";

describe.each(["primary", "secondary", "tertiary"] as const)(
  "resetting the shared %s resource",
  (slot) => {
    afterEach(() => jest.restoreAllMocks());

    it.each([
      { mode: "INCREMENTAL_CHECK", max: 20 },
      { mode: "INCREMENTAL_CHECK_CHAOTIC", max: 10 },
      { mode: "DIE_DESCENDING", max: 6 },
    ])("keeps the $mode maximum after a Tides surge", async ({ mode, max }) => {
      const initial: ResourceValue = {
        label: "Surge Chance",
        lr: false,
        sr: false,
        value: 5,
        max,
      };
      const system = { resources: { [slot]: initial } };
      const actor = actorFixture({
        id: "caster",
        system,
        setFlag: jest.fn().mockResolvedValue(undefined),
        update: jest.fn(async (updates: Record<string, ResourceValue>) => {
          system.resources[slot] = updates[`system.resources.${slot}`];
        }),
      });
      setTestGame({
        settings: {
          get: jest.fn((_namespace: string, key: string) => {
            if (key === WMSCONST.OPT_RESOURCE_TYPE) return slot.toUpperCase();
            if (key === WMSCONST.OPT_SURGE_TYPE) return mode;
            return false;
          }),
        },
      });
      setTestHooks({ callAll: jest.fn() });
      jest.spyOn(RollTableMagicSurge, "Check").mockResolvedValue(undefined);

      await new MagicSurgeCheck(actor, undefined).SurgeTidesOfChaos();

      expect(system.resources[slot]).toEqual({ ...initial, value: 1 });
      if (mode !== "DIE_DESCENDING") {
        await expect(IncrementalCheck.Check(actor, max, max)).resolves.toBe(
          false,
        );
        expect(system.resources[slot]).toEqual({ ...initial, value: 2 });
      }
    });
  },
);
