import MagicSurgeCheck from "./MagicSurgeCheck";
import TidesOfChaos from "./TidesOfChaos";
import { WMSCONST } from "./WMSCONST";
import { actorFixture, rollFixture, setTestGame } from "./test/FoundryFixtures";

describe.each([
  {
    cast: "base-level",
    scaling: 0,
    wmsKey: WMSCONST.OPT_UPCAST_WMS_TRIGGER_BASE,
    otherWmsKey: WMSCONST.OPT_UPCAST_WMS_TRIGGER_UPCAST,
    tocKey: WMSCONST.OPT_UPCAST_TOC_TRIGGER_BASE,
    otherTocKey: WMSCONST.OPT_UPCAST_TOC_TRIGGER_UPCAST,
  },
  {
    cast: "upcast",
    scaling: 2,
    wmsKey: WMSCONST.OPT_UPCAST_WMS_TRIGGER_UPCAST,
    otherWmsKey: WMSCONST.OPT_UPCAST_WMS_TRIGGER_BASE,
    tocKey: WMSCONST.OPT_UPCAST_TOC_TRIGGER_UPCAST,
    otherTocKey: WMSCONST.OPT_UPCAST_TOC_TRIGGER_BASE,
  },
])(
  "$cast surge settings",
  ({ scaling, wmsKey, otherWmsKey, tocKey, otherTocKey }) => {
    let check: MagicSurgeCheck;
    let settings: Record<string, boolean>;
    let tidesUsed: jest.SpiedFunction<typeof TidesOfChaos.IsTidesOfChaosUsed>;

    beforeEach(() => {
      settings = {
        [WMSCONST.OPT_SURGE_TOC_ENABLED]: false,
        [wmsKey]: true,
        [otherWmsKey]: false,
        [tocKey]: true,
        [otherTocKey]: false,
      };
      setTestGame({
        settings: {
          get: jest.fn((_module: string, key: string) => settings[key]),
        },
      });
      check = new MagicSurgeCheck(actorFixture({ id: "actor-1" }), undefined, {
        scaling,
      });
      jest
        .spyOn(check, "WildMagicSurgeRollCheck")
        .mockResolvedValue(rollFixture({ total: 1 }));
      jest.spyOn(check, "DefaultMagicSurgeRollResult").mockReturnValue(true);
      jest.spyOn(check, "SurgeWildMagic").mockResolvedValue(undefined);
      jest.spyOn(check, "SurgeTidesOfChaos").mockResolvedValue(undefined);
      tidesUsed = jest
        .spyOn(TidesOfChaos, "IsTidesOfChaosUsed")
        .mockResolvedValue(true);
    });

    afterEach(() => jest.restoreAllMocks());

    it("rolls when its WMS option is enabled even if the other cast option is disabled", async () => {
      await check.AutoSurgeCheck("1", "DEFAULT");

      expect(check.WildMagicSurgeRollCheck).toHaveBeenCalledWith("1");
      expect(check.SurgeWildMagic).toHaveBeenCalledWith(
        true,
        expect.anything(),
      );
      expect(check.SurgeTidesOfChaos).not.toHaveBeenCalled();
    });

    it.each([
      "DEFAULT",
      "INCREMENTAL_CHECK",
      "INCREMENTAL_CHECK_CHAOTIC",
      "SPELL_LEVEL_DEPENDENT_ROLL",
      "DIE_DESCENDING",
    ])(
      "skips %s when its WMS option is disabled even if the other cast option is enabled",
      async (mode) => {
        settings[wmsKey] = false;
        settings[otherWmsKey] = true;

        await check.AutoSurgeCheck("1", mode);

        expect(check.WildMagicSurgeRollCheck).not.toHaveBeenCalled();
        expect(check.SurgeWildMagic).not.toHaveBeenCalled();
        expect(check.SurgeTidesOfChaos).not.toHaveBeenCalled();
      },
    );

    it("triggers spent Tides of Chaos when its option is enabled even with WMS rolls disabled", async () => {
      settings[WMSCONST.OPT_SURGE_TOC_ENABLED] = true;
      settings[wmsKey] = false;

      await check.AutoSurgeCheck("1", "DEFAULT");

      expect(check.SurgeTidesOfChaos).toHaveBeenCalledTimes(1);
      expect(check.WildMagicSurgeRollCheck).not.toHaveBeenCalled();
      expect(check.SurgeWildMagic).not.toHaveBeenCalled();
    });

    it.each([true, false])(
      "uses the WMS setting (%s) when this cast's Tides option is disabled",
      async (wmsEnabled) => {
        settings[WMSCONST.OPT_SURGE_TOC_ENABLED] = true;
        settings[tocKey] = false;
        settings[otherTocKey] = true;
        settings[wmsKey] = wmsEnabled;

        await check.AutoSurgeCheck("1", "DEFAULT");

        expect(check.SurgeTidesOfChaos).not.toHaveBeenCalled();
        expect(check.WildMagicSurgeRollCheck).toHaveBeenCalledTimes(
          wmsEnabled ? 1 : 0,
        );
        expect(check.SurgeWildMagic).toHaveBeenCalledTimes(wmsEnabled ? 1 : 0);
      },
    );

    it("uses the normal WMS check when Tides of Chaos has not been spent", async () => {
      settings[WMSCONST.OPT_SURGE_TOC_ENABLED] = true;
      tidesUsed.mockResolvedValue(false);

      await check.AutoSurgeCheck("1", "DEFAULT");

      expect(check.SurgeTidesOfChaos).not.toHaveBeenCalled();
      expect(check.SurgeWildMagic).toHaveBeenCalledTimes(1);
    });
  },
);
