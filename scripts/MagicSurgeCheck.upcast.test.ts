import MagicSurgeCheck from "./MagicSurgeCheck";
import TidesOfChaos from "./TidesOfChaos";
import { actorFixture, rollFixture, setTestGame } from "./test/FoundryFixtures";
import type { CastWhen } from "./types/domain";

describe.each<CastWhen>(["ALL", "UPCAST"])("WMS casts %s", (wmsCastWhen) => {
  describe.each<CastWhen>(["ALL", "UPCAST"])("ToC casts %s", (tocCastWhen) => {
    afterEach(() => jest.restoreAllMocks());
    it.each([
      [false, false, true],
      [true, false, true],
      [false, true, true],
      [true, true, true],
      [false, true, false],
      [true, true, false],
    ])(
      "upcast=%s, ToC spent=%s, ToC enabled=%s",
      async (isUpcast, spent, enabled) => {
        const settings = {
          wmsCastWhen,
          tocCastWhen,
          surgeTocEnabled: enabled,
          customRollResultCheck: "EQ",
          customRollResult: "1",
        };
        setTestGame({
          settings: {
            get: jest.fn(
              (_namespace, key: keyof typeof settings) => settings[key],
            ),
          },
        });
        jest.spyOn(TidesOfChaos, "IsTidesOfChaosUsed").mockResolvedValue(spent);
        const check = new MagicSurgeCheck(
          actorFixture({}),
          undefined,
          isUpcast,
        );
        const tides = jest
          .spyOn(check, "SurgeTidesOfChaos")
          .mockResolvedValue(undefined);
        const roll = jest
          .spyOn(check, "WildMagicSurgeRollCheck")
          .mockResolvedValue(rollFixture({ total: 1 }));
        const surge = jest
          .spyOn(check, "SurgeWildMagic")
          .mockResolvedValue(undefined);
        await check.AutoSurgeCheck("1st Level", "DEFAULT");
        const expectTides =
          enabled && spent && (tocCastWhen === "ALL" || isUpcast);
        const expectRoll = !expectTides && (wmsCastWhen === "ALL" || isUpcast);
        expect(tides).toHaveBeenCalledTimes(expectTides ? 1 : 0);
        expect(roll).toHaveBeenCalledTimes(expectRoll ? 1 : 0);
        expect(surge).toHaveBeenCalledTimes(expectRoll ? 1 : 0);
      },
    );
  });
});
