import MagicSurgeCheck from "./MagicSurgeCheck";
import Chat from "./Chat";
import RollTableMagicSurge from "./RollTableMagicSurge";
import { WMSCONST } from "./WMSCONST";
import {
  actorFixture,
  itemFixture,
  setTestGame,
  setTestGlobal,
  setTestHooks,
} from "./test/FoundryFixtures";

describe.each([0, 2])("complete spell check with scaling %i", (scaling) => {
  afterEach(() => jest.restoreAllMocks());

  it.each([1, 12])(
    "checks the actual d20 result %i with Tides auto-surge disabled",
    async (total) => {
      const settings = {
        autoRollD20: true,
        OPT_SURGE_TYPE: "DEFAULT",
        customRollDiceFormula: "1d20",
        customRollResultCheck: "EQ",
        customRollResult: "1",
        wmsName: "Wild Magic Surge",
        powmName: "Path of Wild Magic",
        spellRegex: "\\(S\\)",
        spellRegexEnabled: false,
        minimumSpellLevelTrigger: "0",
        surgeTocEnabled: false,
        enableTidesOfChaosRecharge: false,
        wmsTriggerBaseLevel: true,
        wmsTriggerUpcast: true,
        tocTriggerBaseLevel: true,
        tocTriggerUpcast: true,
        autoRollD20MessageEnabled: true,
        autoRollD20Message: "Wild Magic Surge!",
        autoRollD20MessageNoSurgeEnabled: true,
        autoRollD20MessageNoSurge: "No surge",
        rollTableName: "Wild Magic Surge 5e (PHB)",
        enableRollTable: "PLAYER_TRIGGER",
      };
      setTestGame({
        settings: {
          get: jest.fn(
            (_namespace: string, key: keyof typeof settings) => settings[key],
          ),
        },
        i18n: { format: jest.fn().mockReturnValue("Roll on Table") },
      });
      const hooks = setTestHooks({ callAll: jest.fn() });
      const actor = actorFixture({
        id: "caster",
        type: "character",
        items: [itemFixture({ type: "feat", name: "Wild Magic Surge" })],
        getRollData: jest.fn().mockReturnValue({}),
        setFlag: jest.fn().mockResolvedValue(undefined),
      });
      const spell = itemFixture({
        actor,
        type: "spell",
        name: "Magic Missile",
        system: { level: 1 },
      });
      class CheckRollFixture {
        total: number | undefined;
        result = "";
        evaluate = jest.fn(async (): Promise<this> => {
          this.total = total;
          this.result = String(total);
          return this;
        });
      }
      const roll = new CheckRollFixture();
      const RollConstructor = setTestGlobal(
        "Roll",
        jest.fn(() => roll),
      );
      const send = jest.spyOn(Chat, "Send").mockResolvedValue(undefined);
      const table = jest
        .spyOn(RollTableMagicSurge, "Check")
        .mockResolvedValue(undefined);

      await new MagicSurgeCheck(actor, undefined, { scaling }).CheckItem(spell);

      expect(RollConstructor).toHaveBeenCalledWith("1d20", {});
      expect(roll.evaluate).toHaveBeenCalledWith({ allowInteractive: false });
      expect(actor.setFlag).toHaveBeenCalledWith(
        WMSCONST.MODULE_ID,
        "hassurged",
        total === 1,
      );
      expect(hooks.callAll).toHaveBeenCalledWith(
        "wild-magic-surge-5e.IsWildMagicSurge",
        {
          surge: total === 1,
          result: String(total),
          actorId: "caster",
          tokenId: undefined,
        },
      );
      expect(send).toHaveBeenCalledWith(
        WMSCONST.CHAT_TYPE.ROLL,
        total === 1 ? expect.stringContaining("Wild Magic Surge!") : "No surge",
        roll,
      );
      expect(table).toHaveBeenCalledTimes(total === 1 ? 1 : 0);
    },
  );
});
