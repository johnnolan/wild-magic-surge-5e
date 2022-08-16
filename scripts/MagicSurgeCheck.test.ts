import MagicSurgeCheck from "./MagicSurgeCheck";
import SpellParser from "./utils/SpellParser";
import RollTableMagicSurge from "./RollTableMagicSurge";
import IncrementalCheck from "./utils/IncrementalCheck";
import DieDescending from "./utils/DieDescending";
import TidesOfChaos from "./TidesOfChaos";
import SpellLevelTrigger from "./utils/SpellLevelTrigger";
import Chat from "./Chat";
import SurgeChatMessageDetails from "./utils/SurgeChatMessageDetails";
import { actor } from "../MockData/actor";
import { chatMessage } from "../MockData/chatMessage";
import "../__mocks__/index";
import AutoEffects from "./AutoEffects";

const mockSpellParserIsPathOfWildMagicFeat = jest.spyOn(
  SpellParser,
  "IsPathOfWildMagicFeat"
);
const mockSpellParserSpellLevel = jest.spyOn(SpellParser, "SpellLevel");
const mockSpellParserIsRage = jest.spyOn(SpellParser, "IsRage");
const mockSpellParserIsSpell = jest.spyOn(SpellParser, "IsSpell");
const mockSpellParserIsSorcererSpell = jest.spyOn(
  SpellParser,
  "IsSorcererSpell"
);
const mockSpellParserIsWildMagicFeat = jest.spyOn(
  SpellParser,
  "IsWildMagicFeat"
);

const mockSurgeChatMessageDetailsValid = jest.spyOn(
  SurgeChatMessageDetails.prototype,
  "valid", "get"
);
const mockSurgeChatMessageDetailsHasPathOfWildMagicFeat = jest.spyOn(
  SurgeChatMessageDetails.prototype,
  "hasPathOfWildMagicFeat", "get"
);
const mockSurgeChatMessageDetailsSpellLevel = jest.spyOn(
  SurgeChatMessageDetails.prototype,
  "spellLevel", "get"
);

const mockDieDescendingCheck = jest.fn();
DieDescending.Check = mockDieDescendingCheck;

const mockIncrementalCheckCheck = jest.fn();
IncrementalCheck.Check = mockIncrementalCheckCheck;

const mockTidesOfChaosCheck = jest.fn();
const mockTidesOfChaosIsTidesOfChaosUsed = jest.fn();
TidesOfChaos.Check = mockTidesOfChaosCheck;
TidesOfChaos.IsTidesOfChaosUsed = mockTidesOfChaosIsTidesOfChaosUsed;

const mockRollTableMagicSurgeCheck = jest.fn();
RollTableMagicSurge.Check = mockRollTableMagicSurgeCheck;

const mockChatSend = jest.fn();
const mockChatRunMessageCheck = jest.fn();
Chat.RunMessageCheck = mockChatRunMessageCheck;
Chat.Send = mockChatSend;

const mockSpellLevelTriggerCheck = jest.fn();
SpellLevelTrigger.Check = mockSpellLevelTriggerCheck;

const mockAutoEffect = jest.fn();
AutoEffects.Run = mockAutoEffect;

(global as any).Hooks = {
  callAll: jest.fn().mockReturnValue(undefined),
};

beforeEach(() => {
  mockChatRunMessageCheck.mockClear();
  mockChatSend.mockClear();
  mockTidesOfChaosCheck.mockClear();
  mockTidesOfChaosIsTidesOfChaosUsed.mockClear();
  mockRollTableMagicSurgeCheck.mockClear();
  mockSpellLevelTriggerCheck.mockClear();
  mockIncrementalCheckCheck.mockClear();
  mockAutoEffect.mockClear();
  mockSurgeChatMessageDetailsValid.mockClear();
  mockSurgeChatMessageDetailsHasPathOfWildMagicFeat.mockClear();
  mockSurgeChatMessageDetailsSpellLevel.mockClear();
  mockSpellParserIsPathOfWildMagicFeat.mockClear();
  mockSpellParserIsSorcererSpell.mockClear();
  mockSpellParserSpellLevel.mockClear();
  mockSpellParserIsRage.mockClear();
  mockSpellParserIsSpell.mockClear();
  mockSpellParserIsWildMagicFeat.mockClear();
  (global as any).Hooks.callAll.mockClear();
});

describe("MagicSurgeCheck", () => {
  describe("CheckChatMessage", () => {
    describe("Is Wild Magic Surge Auto Check", () => {
      let magicSurgeCheck: MagicSurgeCheck;

      beforeEach(() => {
        (global as any).game = {
          settings: {
            get: jest
              .fn()
              .mockReturnValue(true)
          },
        };
        // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
        magicSurgeCheck = new MagicSurgeCheck(actor);

        mockSurgeChatMessageDetailsValid.mockReturnValue(true);
        mockSurgeChatMessageDetailsHasPathOfWildMagicFeat.mockReturnValue(
          false
        );

        jest.spyOn(magicSurgeCheck, "AutoSurgeCheck").mockReturnValue(true);
      });

      it("It runs correctly", async () => {
        await magicSurgeCheck.CheckChatMessage(chatMessage);

        expect(mockSurgeChatMessageDetailsHasPathOfWildMagicFeat).toHaveBeenCalledTimes(1);

        expect(mockSurgeChatMessageDetailsValid).toHaveBeenCalledTimes(1);

        expect(magicSurgeCheck.AutoSurgeCheck).toHaveBeenCalledTimes(1);

        expect(mockChatRunMessageCheck).not.toHaveBeenCalled();
      });
    });

    describe("Is Wild Magic Surge Message Only Check", () => {
      let magicSurgeCheck: MagicSurgeCheck;

      beforeEach(() => {
        (global as any).game = {
          settings: {
            get: jest.fn().mockReturnValueOnce(false),
          },
        };
        // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
        magicSurgeCheck = new MagicSurgeCheck(actor);

        mockSurgeChatMessageDetailsValid.mockReturnValue(true);
        mockSurgeChatMessageDetailsHasPathOfWildMagicFeat.mockReturnValue(
          false
        );

        jest.spyOn(magicSurgeCheck, "AutoSurgeCheck").mockReturnValue(true);
      });

      it("It runs correctly", async () => {
        await magicSurgeCheck.CheckChatMessage(chatMessage);

        expect(mockSurgeChatMessageDetailsHasPathOfWildMagicFeat).toHaveBeenCalledTimes(1);

        expect(mockSurgeChatMessageDetailsValid).toHaveBeenCalledTimes(1);

        expect(magicSurgeCheck.AutoSurgeCheck).not.toHaveBeenCalled();

        expect(mockChatRunMessageCheck).toHaveBeenCalledTimes(1);
      });
    });

    describe("Is Path of Wild Magic Surge", () => {
      let magicSurgeCheck: MagicSurgeCheck;

      beforeEach(() => {
        (global as any).game = {
          settings: {
            get: jest.fn().mockReturnValueOnce(true),
          },
        };
        // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
        magicSurgeCheck = new MagicSurgeCheck(actor);

        mockSurgeChatMessageDetailsValid.mockReturnValue(true);
        mockSurgeChatMessageDetailsHasPathOfWildMagicFeat.mockReturnValue(
          true
        );

        jest.spyOn(magicSurgeCheck, "AutoSurgeCheck").mockReturnValue(true);
      });

      it("It runs correctly", async () => {
        await magicSurgeCheck.CheckChatMessage(chatMessage);

        expect(mockSpellParserIsPathOfWildMagicFeat).toHaveBeenCalledTimes(1);

        expect(mockRollTableMagicSurgeCheck).toHaveBeenCalledWith("POWM");

        expect(magicSurgeCheck.AutoSurgeCheck).not.toHaveBeenCalled();
      });
    });

    describe("Has no actor", () => {
      let magicSurgeCheck: MagicSurgeCheck;

      beforeEach(() => {
        (global as any).game = {
          actors: {
            get: jest.fn().mockReturnValue(undefined),
          },
          tables: [
            {
              name: "Wild Magic Surge",
              roll: jest.fn().mockResolvedValue(true),
              results: jest.fn().mockResolvedValue([]),
            },
          ],
        };
        // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
        magicSurgeCheck = new MagicSurgeCheck(undefined);
      });

      it("It returns from module", async () => {
        const result = await magicSurgeCheck.CheckChatMessage(chatMessage);

        expect(result).toBeFalsy();
      });
    });
  });

  describe("WildMagicSurgeRollCheck", () => {
    describe("On a Default Surge Type", () => {
      let magicSurgeCheck: MagicSurgeCheck;

      beforeEach(() => {
        (global as any).game = {
          settings: {
            get: jest
              .fn()
              .mockReturnValueOnce("DEFAULT")
              .mockReturnValueOnce("1D20"),
          },
        };
        // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
        magicSurgeCheck = new MagicSurgeCheck(actor);
      });

      it("It calls Roll with 1D20", async () => {
        await magicSurgeCheck.WildMagicSurgeRollCheck();

        expect((global as any).Roll).toHaveBeenCalledWith("1D20");
      });
    });

    describe("On a SPELL_LEVEL_DEPENDENT_ROLL Surge Type", () => {
      let magicSurgeCheck: MagicSurgeCheck;

      beforeEach(() => {
        (global as any).game = {
          settings: {
            get: jest
              .fn()
              .mockReturnValueOnce("SPELL_LEVEL_DEPENDENT_ROLL")
              .mockReturnValueOnce("1D20"),
          },
        };
        // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
        magicSurgeCheck = new MagicSurgeCheck(actor);
      });

      it("It calls Roll with 1D20", async () => {
        await magicSurgeCheck.WildMagicSurgeRollCheck();

        expect((global as any).Roll).toHaveBeenCalledWith("1D20");
      });
    });

    describe("On a DIE_DESCENDING Surge Type with set flag", () => {
      let magicSurgeCheck: MagicSurgeCheck;

      beforeEach(() => {
        (global as any).game = {
          settings: {
            get: jest
              .fn()
              .mockReturnValueOnce("DIE_DESCENDING")
              .mockReturnValueOnce("1D20"),
          },
        };

        actor.getFlag = jest.fn().mockReturnValue({ value: "1D20" });
        // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
        magicSurgeCheck = new MagicSurgeCheck(actor);
      });

      it("It calls Roll with 1D20", async () => {
        await magicSurgeCheck.WildMagicSurgeRollCheck();

        expect((global as any).Roll).toHaveBeenCalledWith("1D20");
      });
    });

    describe("On a DIE_DESCENDING Surge Type with no set flag", () => {
      let magicSurgeCheck: MagicSurgeCheck;

      beforeEach(() => {
        (global as any).game = {
          settings: {
            get: jest
              .fn()
              .mockReturnValueOnce("DIE_DESCENDING")
              .mockReturnValueOnce("1D20"),
          },
        };

        actor.getFlag = jest.fn().mockReturnValue(undefined);

        actor.setFlag = jest.fn();
        // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
        magicSurgeCheck = new MagicSurgeCheck(actor);
      });

      it("It calls Roll with 1D20", async () => {
        await magicSurgeCheck.WildMagicSurgeRollCheck();

        expect(actor.setFlag).toHaveBeenCalledWith(
          "wild-magic-surge-5e",
          "die_type",
          { value: "1d20" }
        );

        expect((global as any).Roll).toHaveBeenCalledWith("1d20");
      });
    });
  });

  describe("resultCheck", () => {
    describe("has 1 value in the result check", () => {
      let magicSurgeCheck: MagicSurgeCheck;
      beforeAll(() => {
        (global as any).game = {
          actors: actor,
          settings: {
            get: jest.fn().mockReturnValue("2"),
          },
          tables: [
            {
              name: "Wild Magic Surge",
              roll: jest.fn().mockResolvedValue(true),
              results: jest.fn().mockResolvedValue([]),
            },
          ],
        };
        // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
        magicSurgeCheck = new MagicSurgeCheck(actor);
      });
      test("roll of 2 EQ 2", async () => {
        const result = await magicSurgeCheck.DefaultMagicSurgeRollResult(
          2,
          "EQ"
        );

        expect(result).toBeTruthy();
      });
      test("roll of 2 Not EQ 2", async () => {
        const result = await magicSurgeCheck.DefaultMagicSurgeRollResult(
          1,
          "EQ"
        );

        expect(result).toBeFalsy();
      });
      test("roll of 2 Not GT 2", async () => {
        const result = await magicSurgeCheck.DefaultMagicSurgeRollResult(
          2,
          "GT"
        );

        expect(result).toBeFalsy();
      });
      test("roll of 3 GT 2", async () => {
        const result = await magicSurgeCheck.DefaultMagicSurgeRollResult(
          3,
          "GT"
        );

        expect(result).toBeTruthy();
      });
      test("roll of 2 Not LT 2", async () => {
        const result = await magicSurgeCheck.DefaultMagicSurgeRollResult(
          2,
          "LT"
        );

        expect(result).toBeFalsy();
      });
      test("roll of 1 LT 2", async () => {
        const result = await magicSurgeCheck.DefaultMagicSurgeRollResult(
          1,
          "LT"
        );

        expect(result).toBeTruthy();
      });
    });

    describe("has 2 values in the result check", () => {
      let magicSurgeCheck: MagicSurgeCheck;
      beforeAll(() => {
        // @ts-expect-error TS(2554): Expected 2 arguments, but got 0.
        magicSurgeCheck = new MagicSurgeCheck();
        (global as any).game = {
          actors: actor,
          settings: {
            get: jest.fn().mockReturnValue("3, 4"),
          },
          tables: [
            {
              name: "Wild Magic Surge",
              roll: jest.fn().mockResolvedValue(true),
              results: jest.fn().mockResolvedValue([]),
            },
          ],
        };
      });
      test("roll of 3 EQ 3", async () => {
        const result = await magicSurgeCheck.DefaultMagicSurgeRollResult(
          3,
          "EQ"
        );

        expect(result).toBeTruthy();
      });
      test("roll of 4 EQ 4", async () => {
        const result = await magicSurgeCheck.DefaultMagicSurgeRollResult(
          4,
          "EQ"
        );

        expect(result).toBeTruthy();
      });
      test("roll of 1 Not EQ 3", async () => {
        const result = await magicSurgeCheck.DefaultMagicSurgeRollResult(
          5,
          "EQ"
        );

        expect(result).toBeFalsy();
      });
      test("roll of 3 Not GT 3", async () => {
        const result = await magicSurgeCheck.DefaultMagicSurgeRollResult(
          3,
          "GT"
        );

        expect(result).toBeFalsy();
      });
      test("roll of 4 GT 3", async () => {
        const result = await magicSurgeCheck.DefaultMagicSurgeRollResult(
          4,
          "GT"
        );

        expect(result).toBeTruthy();
      });
      test("roll of 2 Not LT 3", async () => {
        const result = await magicSurgeCheck.DefaultMagicSurgeRollResult(
          2,
          "LT"
        );

        expect(result).toBeTruthy();
      });
      test("roll of 1 LT 4", async () => {
        const result = await magicSurgeCheck.DefaultMagicSurgeRollResult(
          3,
          "LT"
        );

        expect(result).toBeTruthy();
      });
    });
  });

  describe("AutoSurgeCheck", () => {
    describe("Is Tides of Chaos Auto Surge", () => {
      let defaultSurgeTidesOfChaosSpy: any;
      let magicSurgeCheck: MagicSurgeCheck;

      beforeEach(() => {
        (global as any).game = {
          settings: {
            get: jest.fn().mockReturnValue(true),
          },
        };
        // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
        magicSurgeCheck = new MagicSurgeCheck(actor);

        defaultSurgeTidesOfChaosSpy = jest.spyOn(
          magicSurgeCheck,
          "SurgeTidesOfChaos"
        );

        jest.spyOn(magicSurgeCheck, "SurgeWildMagic").mockReturnValue(true);
        mockTidesOfChaosIsTidesOfChaosUsed.mockReturnValue(true);
      });
      test("Calls Tides of Chaos surge", async () => {
        await magicSurgeCheck.AutoSurgeCheck(1, "INVALID_OPTION");

        expect(defaultSurgeTidesOfChaosSpy).toBeCalled();

        expect(mockTidesOfChaosIsTidesOfChaosUsed).toBeCalled();
      });
    });

    describe("Is Auto Surge Check", () => {
      let defaultMagicSurgeRollResultSpy: any;
      let magicSurgeCheck: MagicSurgeCheck;

      beforeEach(() => {
        (global as any).game = {
          settings: {
            get: jest.fn().mockReturnValue(true),
          },
          actors: {
            get: jest.fn().mockReturnValue({
              data: {
                items: [
                  {
                    id: "WWb4vAmh18sMAxfY",
                    data: {
                      name: "Flame Tongue Greatsword",
                      data: { actionType: "mwak" },
                    },
                    token: {
                      _id: "5H4YnyD6zf9vcJ3Q",
                    },
                  },
                  {
                    _id: "iGoR4ePl1mTZFAAM",
                    name: "Wild Magic Surge",
                    type: "feat",
                    img: "systems/dnd5e/icons/spells/lightning-magenta-3.jpg",
                    data: {
                      source: "Sorcerer : Wild Magic",
                    },
                  },
                ],
              },
            }),
          },
        };
        // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
        magicSurgeCheck = new MagicSurgeCheck(actor);
        mockTidesOfChaosIsTidesOfChaosUsed.mockReturnValue(false);

        defaultMagicSurgeRollResultSpy = jest.spyOn(
          magicSurgeCheck,
          "DefaultMagicSurgeRollResult"
        );

        jest
          .spyOn(magicSurgeCheck, "WildMagicSurgeRollCheck")
          .mockReturnValue(true);
      });
      test("INVALID_OPTION", async () => {
        await magicSurgeCheck.AutoSurgeCheck(1, "INVALID_OPTION");

        expect(defaultMagicSurgeRollResultSpy).not.toBeCalled();

        expect(defaultMagicSurgeRollResultSpy).toHaveBeenCalledTimes(0);

        expect(mockIncrementalCheckCheck).not.toBeCalled();

        expect(mockIncrementalCheckCheck).toHaveBeenCalledTimes(0);

        expect(mockSpellLevelTriggerCheck).not.toBeCalled();

        expect(mockSpellLevelTriggerCheck).toHaveBeenCalledTimes(0);
      });
      test("DEFAULT", async () => {
        await magicSurgeCheck.AutoSurgeCheck(1, "DEFAULT");

        expect(defaultMagicSurgeRollResultSpy).toBeCalled();

        expect(defaultMagicSurgeRollResultSpy).toHaveBeenCalledTimes(1);

        expect(mockIncrementalCheckCheck).not.toBeCalled();

        expect(mockIncrementalCheckCheck).toHaveBeenCalledTimes(0);

        expect(mockSpellLevelTriggerCheck).not.toBeCalled();

        expect(mockSpellLevelTriggerCheck).toHaveBeenCalledTimes(0);

        expect((global as any).Hooks.callAll).toBeCalled();

        expect((global as any).Hooks.callAll).toHaveBeenCalledTimes(1);
      });
      test("INCREMENTAL_CHECK", async () => {
        await magicSurgeCheck.AutoSurgeCheck(1, "INCREMENTAL_CHECK");

        expect(mockIncrementalCheckCheck).toBeCalled();

        expect(mockIncrementalCheckCheck).toHaveBeenCalledTimes(1);

        expect(defaultMagicSurgeRollResultSpy).not.toBeCalled();

        expect(defaultMagicSurgeRollResultSpy).toHaveBeenCalledTimes(0);

        expect(mockSpellLevelTriggerCheck).not.toBeCalled();

        expect(mockSpellLevelTriggerCheck).toHaveBeenCalledTimes(0);

        expect((global as any).Hooks.callAll).toBeCalled();

        expect((global as any).Hooks.callAll).toHaveBeenCalledTimes(1);
      });
      test("INCREMENTAL_CHECK_CHAOTIC", async () => {
        await magicSurgeCheck.AutoSurgeCheck(1, "INCREMENTAL_CHECK_CHAOTIC");

        expect(mockIncrementalCheckCheck).toBeCalled();

        expect(mockIncrementalCheckCheck).toHaveBeenCalledTimes(1);

        expect(defaultMagicSurgeRollResultSpy).not.toBeCalled();

        expect(defaultMagicSurgeRollResultSpy).toHaveBeenCalledTimes(0);

        expect(mockSpellLevelTriggerCheck).not.toBeCalled();

        expect(mockSpellLevelTriggerCheck).toHaveBeenCalledTimes(0);

        expect((global as any).Hooks.callAll).toBeCalled();

        expect((global as any).Hooks.callAll).toHaveBeenCalledTimes(1);
      });
      test("SPELL_LEVEL_DEPENDENT_ROLL", async () => {
        await magicSurgeCheck.AutoSurgeCheck(1, "SPELL_LEVEL_DEPENDENT_ROLL");

        expect(defaultMagicSurgeRollResultSpy).not.toBeCalled();

        expect(defaultMagicSurgeRollResultSpy).toHaveBeenCalledTimes(0);

        expect(mockSpellLevelTriggerCheck).toBeCalled();

        expect(mockSpellLevelTriggerCheck).toHaveBeenCalledTimes(1);

        expect((global as any).Hooks.callAll).toBeCalled();

        expect((global as any).Hooks.callAll).toHaveBeenCalledTimes(1);
      });
      test("DIE_DESCENDING", async () => {
        await magicSurgeCheck.AutoSurgeCheck(1, "DIE_DESCENDING");

        expect(defaultMagicSurgeRollResultSpy).not.toBeCalled();

        expect(defaultMagicSurgeRollResultSpy).toHaveBeenCalledTimes(0);

        expect(mockDieDescendingCheck).toBeCalled();

        expect(mockDieDescendingCheck).toHaveBeenCalledTimes(1);

        expect((global as any).Hooks.callAll).toBeCalled();

        expect((global as any).Hooks.callAll).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe("SurgeWildMagic", () => {
    let magicSurgeCheck: MagicSurgeCheck;

    beforeEach(() => {
      (global as any).game = {
        settings: {
          get: jest.fn().mockReturnValue(true),
        },
      };
      // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
      magicSurgeCheck = new MagicSurgeCheck(actor);
    });

    it("It runs correctly on true", async () => {
      await magicSurgeCheck.SurgeWildMagic(true, { result: 1 });

      expect(mockChatSend).toHaveBeenCalledTimes(1);

      expect(mockTidesOfChaosCheck).toHaveBeenCalledTimes(1);

      expect(mockRollTableMagicSurgeCheck).toHaveBeenCalledTimes(1);

      expect((global as any).Hooks.callAll).toHaveBeenCalledTimes(1);
    });

    it("It runs correctly on false", async () => {
      await magicSurgeCheck.SurgeWildMagic(false, { result: 1 });

      expect(mockChatSend).toHaveBeenCalledTimes(1);

      expect(mockTidesOfChaosCheck).not.toHaveBeenCalled();

      expect(mockRollTableMagicSurgeCheck).not.toHaveBeenCalled();

      expect((global as any).Hooks.callAll).toHaveBeenCalledTimes(1);
    });
  });

  describe("SurgeTidesOfChaos", () => {
    let magicSurgeCheck: MagicSurgeCheck;

    beforeEach(() => {
      (global as any).game = {
        settings: {
          get: jest.fn().mockReturnValue("Auto D20 Message"),
        },
      };
      // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
      magicSurgeCheck = new MagicSurgeCheck(actor);
    });

    it("It runs the correct functions", async () => {
      await magicSurgeCheck.SurgeTidesOfChaos();

      expect(mockChatSend).toHaveBeenCalledTimes(1);

      expect(mockTidesOfChaosCheck).toHaveBeenCalledTimes(1);

      expect(mockRollTableMagicSurgeCheck).toHaveBeenCalledTimes(1);

      expect((global as any).Hooks.callAll).toBeCalled();

      expect((global as any).Hooks.callAll).toHaveBeenCalledTimes(1);
    });
  });

  describe("SplitRollResult", () => {
    let magicSurgeCheck: MagicSurgeCheck;

    beforeEach(() => {
      // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
      magicSurgeCheck = new MagicSurgeCheck(actor);
    });

    it("It splits one value into an array", async () => {
      const result = magicSurgeCheck.SplitRollResult("1");

      expect(result).toStrictEqual(["1"]);
    });

    it("It splits more than one value into an array", async () => {
      const result = magicSurgeCheck.SplitRollResult("1, 2, 3");

      expect(result).toStrictEqual(["1", "2", "3"]);
    });
  });
});
