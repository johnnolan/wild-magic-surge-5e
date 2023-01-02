import MagicSurgeCheck from "./MagicSurgeCheck";
import SpellParser from "./utils/SpellParser";
import RollTableMagicSurge from "./RollTableMagicSurge";
import IncrementalCheck from "./utils/IncrementalCheck";
import DieDescending from "./utils/DieDescending";
import TidesOfChaos from "./TidesOfChaos";
import SpellLevelTrigger from "./utils/SpellLevelTrigger";
import Chat from "./Chat";
import SurgeDetails from "./utils/SurgeDetails";
import { actor } from "../MockData/actor";
import "../__mocks__/index";
import AutoEffects from "./AutoEffects";
import { firstLevel, melee } from "../MockData/items";
import TriggerMacro from "./TriggerMacro";

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

const mockSurgeDetailsValid = jest.spyOn(
  SurgeDetails.prototype,
  "valid",
  "get"
);
const mockSurgeDetailsHasPathOfWildMagicFeat = jest.spyOn(
  SurgeDetails.prototype,
  "hasPathOfWildMagicFeat",
  "get"
);
const mockSurgeDetailsSpellLevel = jest.spyOn(
  SurgeDetails.prototype,
  "spellLevel",
  "get"
);

const mockDieDescendingCheck = jest.fn();
const mockDieDescendingReset = jest.fn();
DieDescending.Check = mockDieDescendingCheck;
DieDescending.Reset = mockDieDescendingReset;

const mockIncrementalCheckCheck = jest.fn();
const mockIncrementalCheckReset = jest.fn();
IncrementalCheck.Check = mockIncrementalCheckCheck;
IncrementalCheck.Reset = mockIncrementalCheckReset;

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

const mockTriggerMacro = jest.fn();
TriggerMacro.Run = mockTriggerMacro;

(global as any).Hooks = {
  callAll: jest.fn().mockReturnValue(undefined),
};

(global as any).ui = {
  notifications: {
    info: jest.fn(),
  },
};

beforeEach(() => {
  mockChatRunMessageCheck.mockClear();
  mockChatSend.mockClear();
  mockTidesOfChaosCheck.mockClear();
  mockTidesOfChaosIsTidesOfChaosUsed.mockClear();
  mockRollTableMagicSurgeCheck.mockClear();
  mockSpellLevelTriggerCheck.mockClear();
  mockIncrementalCheckCheck.mockClear();
  mockIncrementalCheckReset.mockClear();
  mockDieDescendingReset.mockClear();
  mockAutoEffect.mockClear();
  mockTriggerMacro.mockClear();
  mockSurgeDetailsValid.mockClear();
  mockSurgeDetailsHasPathOfWildMagicFeat.mockClear();
  mockSurgeDetailsSpellLevel.mockClear();
  mockSpellParserIsPathOfWildMagicFeat.mockClear();
  mockSpellParserIsSorcererSpell.mockClear();
  mockSpellParserSpellLevel.mockClear();
  mockSpellParserIsRage.mockClear();
  mockSpellParserIsSpell.mockClear();
  mockSpellParserIsWildMagicFeat.mockClear();
  (global as any).Hooks.callAll.mockClear();
});

describe("MagicSurgeCheck", () => {
  describe("CheckItem", () => {
    describe("Is Wild Magic Surge Auto Check but not valid item", () => {
      let magicSurgeCheck: MagicSurgeCheck;

      beforeEach(() => {
        (global as any).game = {
          modules: {
            get: () => {
              return { active: false };
            },
          },
          i18n: {
            format: jest.fn().mockReturnValue("TestKeyValue"),
          },
          settings: {
            get: jest.fn().mockReturnValue(true),
          },
        };
        magicSurgeCheck = new MagicSurgeCheck(actor, "rMyoELkOwFNPGEK4");

        mockSurgeDetailsValid.mockReturnValue(false);

        jest.spyOn(magicSurgeCheck, "AutoSurgeCheck").mockReturnValue(true);
      });

      it("It returns as invalid", async () => {
        await magicSurgeCheck.CheckItem(melee);

        expect(mockSurgeDetailsHasPathOfWildMagicFeat).not.toHaveBeenCalled();

        expect(mockSurgeDetailsValid).toHaveBeenCalledTimes(1);

        expect(magicSurgeCheck.AutoSurgeCheck).not.toHaveBeenCalled();

        expect(mockChatRunMessageCheck).not.toHaveBeenCalled();
      });
    });

    describe("Is Wild Magic Surge Auto Check", () => {
      let magicSurgeCheck: MagicSurgeCheck;

      beforeEach(() => {
        (global as any).game = {
          modules: {
            get: () => {
              return { active: false };
            },
          },
          i18n: {
            format: jest.fn().mockReturnValue("TestKeyValue"),
          },
          settings: {
            get: jest.fn().mockReturnValue(true),
          },
        };
        magicSurgeCheck = new MagicSurgeCheck(actor, "rMyoELkOwFNPGEK4");

        mockSurgeDetailsValid.mockReturnValue(true);
        mockSurgeDetailsHasPathOfWildMagicFeat.mockReturnValue(false);

        jest.spyOn(magicSurgeCheck, "AutoSurgeCheck").mockReturnValue(true);
      });

      it("It runs correctly", async () => {
        await magicSurgeCheck.CheckItem(firstLevel);

        expect(mockSurgeDetailsHasPathOfWildMagicFeat).toHaveBeenCalledTimes(1);

        expect(mockSurgeDetailsValid).toHaveBeenCalledTimes(1);

        expect(magicSurgeCheck.AutoSurgeCheck).toHaveBeenCalledTimes(1);

        expect(mockChatRunMessageCheck).not.toHaveBeenCalled();
      });
    });

    describe("Is Wild Magic Surge Message Only Check", () => {
      let magicSurgeCheck: MagicSurgeCheck;

      beforeEach(() => {
        (global as any).game = {
          modules: {
            get: () => {
              return { active: false };
            },
          },
          i18n: {
            format: jest.fn().mockReturnValue("TestKeyValue"),
          },
          settings: {
            get: jest.fn().mockReturnValueOnce(false),
          },
        };

        magicSurgeCheck = new MagicSurgeCheck(actor, "rMyoELkOwFNPGEK4");

        mockSurgeDetailsValid.mockReturnValue(true);
        mockSurgeDetailsHasPathOfWildMagicFeat.mockReturnValue(false);

        jest.spyOn(magicSurgeCheck, "AutoSurgeCheck").mockReturnValue(true);
      });

      it("It runs correctly", async () => {
        await magicSurgeCheck.CheckItem(firstLevel);

        expect(mockSurgeDetailsHasPathOfWildMagicFeat).toHaveBeenCalledTimes(1);

        expect(mockSurgeDetailsValid).toHaveBeenCalledTimes(1);

        expect(magicSurgeCheck.AutoSurgeCheck).not.toHaveBeenCalled();

        expect(mockChatRunMessageCheck).toHaveBeenCalledTimes(1);
      });
    });

    describe("Is Path of Wild Magic Surge", () => {
      let magicSurgeCheck: MagicSurgeCheck;

      beforeEach(() => {
        (global as any).game = {
          modules: {
            get: () => {
              return { active: false };
            },
          },
          i18n: {
            format: jest.fn().mockReturnValue("TestKeyValue"),
          },
          settings: {
            get: jest.fn().mockReturnValueOnce(true),
          },
        };

        magicSurgeCheck = new MagicSurgeCheck(actor, "rMyoELkOwFNPGEK4");

        mockSurgeDetailsValid.mockReturnValue(true);
        mockSurgeDetailsHasPathOfWildMagicFeat.mockReturnValue(true);

        jest.spyOn(magicSurgeCheck, "AutoSurgeCheck").mockReturnValue(true);
      });

      it("It runs correctly", async () => {
        await magicSurgeCheck.CheckItem(firstLevel);

        expect(mockSpellParserIsPathOfWildMagicFeat).toHaveBeenCalledTimes(1);

        expect(mockRollTableMagicSurgeCheck).toHaveBeenCalledWith("POWM");

        expect(magicSurgeCheck.AutoSurgeCheck).not.toHaveBeenCalled();
      });
    });
  });

  describe("WildMagicSurgeRollCheck", () => {
    describe("On a Default Surge Type", () => {
      let magicSurgeCheck: MagicSurgeCheck;

      beforeEach(() => {
        (global as any).game = {
          modules: {
            get: () => {
              return { active: false };
            },
          },
          i18n: {
            format: jest.fn().mockReturnValue("TestKeyValue"),
          },
          settings: {
            get: jest
              .fn()
              .mockReturnValueOnce("DEFAULT")
              .mockReturnValueOnce("1D20"),
          },
        };

        magicSurgeCheck = new MagicSurgeCheck(actor, "rMyoELkOwFNPGEK4");
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
          modules: {
            get: () => {
              return { active: false };
            },
          },
          i18n: {
            format: jest.fn().mockReturnValue("TestKeyValue"),
          },
          settings: {
            get: jest
              .fn()
              .mockReturnValueOnce("SPELL_LEVEL_DEPENDENT_ROLL")
              .mockReturnValueOnce("1D20"),
          },
        };

        magicSurgeCheck = new MagicSurgeCheck(actor, "rMyoELkOwFNPGEK4");
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
          modules: {
            get: () => {
              return { active: false };
            },
          },
          i18n: {
            format: jest.fn().mockReturnValue("TestKeyValue"),
          },
          settings: {
            get: jest
              .fn()
              .mockReturnValueOnce("DIE_DESCENDING")
              .mockReturnValueOnce("1D20"),
          },
        };

        actor.getFlag = jest.fn().mockReturnValue({ value: "1D20" });
        magicSurgeCheck = new MagicSurgeCheck(actor, "rMyoELkOwFNPGEK4");
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
          modules: {
            get: () => {
              return { active: false };
            },
          },
          i18n: {
            format: jest.fn().mockReturnValue("TestKeyValue"),
          },
          settings: {
            get: jest
              .fn()
              .mockReturnValueOnce("DIE_DESCENDING")
              .mockReturnValueOnce("1D20"),
          },
        };

        actor.getFlag = jest.fn().mockReturnValue(undefined);

        actor.setFlag = jest.fn();
        magicSurgeCheck = new MagicSurgeCheck(actor, "rMyoELkOwFNPGEK4");
      });

      it("It calls Roll with 1D20", async () => {
        await magicSurgeCheck.WildMagicSurgeRollCheck();
        expect((global as any).Roll).toHaveBeenCalledWith("1d20");
      });
    });
  });

  describe("resultCheck", () => {
    describe("has 1 value in the result check", () => {
      let magicSurgeCheck: MagicSurgeCheck;
      beforeAll(() => {
        (global as any).game = {
          modules: {
            get: () => {
              return { active: false };
            },
          },
          i18n: {
            format: jest.fn().mockReturnValue("TestKeyValue"),
          },
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
        magicSurgeCheck = new MagicSurgeCheck(actor, "rMyoELkOwFNPGEK4");
      });
      test("roll of 2 EQ 2", async () => {
        const result = magicSurgeCheck.DefaultMagicSurgeRollResult(2, "EQ");

        expect(result).toBeTruthy();
      });
      test("roll of 2 Not EQ 2", async () => {
        const result = magicSurgeCheck.DefaultMagicSurgeRollResult(1, "EQ");

        expect(result).toBeFalsy();
      });
      test("roll of 2 Not GT 2", async () => {
        const result = magicSurgeCheck.DefaultMagicSurgeRollResult(2, "GT");

        expect(result).toBeFalsy();
      });
      test("roll of 3 GT 2", async () => {
        const result = magicSurgeCheck.DefaultMagicSurgeRollResult(3, "GT");

        expect(result).toBeTruthy();
      });
      test("roll of 2 Not LT 2", async () => {
        const result = magicSurgeCheck.DefaultMagicSurgeRollResult(2, "LT");

        expect(result).toBeFalsy();
      });
      test("roll of 1 LT 2", async () => {
        const result = magicSurgeCheck.DefaultMagicSurgeRollResult(1, "LT");

        expect(result).toBeTruthy();
      });
    });

    describe("has 2 values in the result check", () => {
      let magicSurgeCheck: MagicSurgeCheck;
      beforeAll(() => {
        magicSurgeCheck = new MagicSurgeCheck(actor, "rMyoELkOwFNPGEK4");
        (global as any).game = {
          modules: {
            get: () => {
              return { active: false };
            },
          },
          i18n: {
            format: jest.fn().mockReturnValue("TestKeyValue"),
          },
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
        const result = magicSurgeCheck.DefaultMagicSurgeRollResult(3, "EQ");

        expect(result).toBeTruthy();
      });
      test("roll of 4 EQ 4", async () => {
        const result = magicSurgeCheck.DefaultMagicSurgeRollResult(4, "EQ");

        expect(result).toBeTruthy();
      });
      test("roll of 1 Not EQ 3", async () => {
        const result = magicSurgeCheck.DefaultMagicSurgeRollResult(5, "EQ");

        expect(result).toBeFalsy();
      });
      test("roll of 3 Not GT 3", async () => {
        const result = magicSurgeCheck.DefaultMagicSurgeRollResult(3, "GT");

        expect(result).toBeFalsy();
      });
      test("roll of 4 GT 3", async () => {
        const result = magicSurgeCheck.DefaultMagicSurgeRollResult(4, "GT");

        expect(result).toBeTruthy();
      });
      test("roll of 2 Not LT 3", async () => {
        const result = magicSurgeCheck.DefaultMagicSurgeRollResult(2, "LT");

        expect(result).toBeTruthy();
      });
      test("roll of 1 LT 4", async () => {
        const result = magicSurgeCheck.DefaultMagicSurgeRollResult(3, "LT");

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
          modules: {
            get: () => {
              return { active: false };
            },
          },
          i18n: {
            format: jest.fn().mockReturnValue("TestKeyValue"),
          },
          settings: {
            get: jest.fn().mockReturnValue(true),
          },
        };
        magicSurgeCheck = new MagicSurgeCheck(actor, "rMyoELkOwFNPGEK4");

        defaultSurgeTidesOfChaosSpy = jest.spyOn(
          magicSurgeCheck,
          "SurgeTidesOfChaos"
        );

        jest.spyOn(magicSurgeCheck, "SurgeWildMagic").mockReturnValue(true);
        mockTidesOfChaosIsTidesOfChaosUsed.mockReturnValue(true);
      });
      test("Calls Tides of Chaos surge", async () => {
        await magicSurgeCheck.AutoSurgeCheck("1", "INVALID_OPTION");

        expect(defaultSurgeTidesOfChaosSpy).toBeCalled();

        expect(mockTidesOfChaosIsTidesOfChaosUsed).toBeCalled();
      });
    });

    describe("Is Auto Surge Check", () => {
      let defaultMagicSurgeRollResultSpy: any;
      let magicSurgeCheck: MagicSurgeCheck;

      beforeEach(() => {
        (global as any).game = {
          modules: {
            get: () => {
              return { active: false };
            },
          },
          i18n: {
            format: jest.fn().mockReturnValue("TestKeyValue"),
          },
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
        magicSurgeCheck = new MagicSurgeCheck(actor, "rMyoELkOwFNPGEK4");
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
        await magicSurgeCheck.AutoSurgeCheck("1", "INVALID_OPTION");

        expect(defaultMagicSurgeRollResultSpy).not.toBeCalled();

        expect(defaultMagicSurgeRollResultSpy).toHaveBeenCalledTimes(0);

        expect(mockIncrementalCheckCheck).not.toBeCalled();

        expect(mockIncrementalCheckCheck).toHaveBeenCalledTimes(0);

        expect(mockSpellLevelTriggerCheck).not.toBeCalled();

        expect(mockSpellLevelTriggerCheck).toHaveBeenCalledTimes(0);
      });
      test("DEFAULT", async () => {
        await magicSurgeCheck.AutoSurgeCheck("1", "DEFAULT");

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
        await magicSurgeCheck.AutoSurgeCheck("1", "INCREMENTAL_CHECK");

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
        await magicSurgeCheck.AutoSurgeCheck("1", "INCREMENTAL_CHECK_CHAOTIC");

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
        await magicSurgeCheck.AutoSurgeCheck("1", "SPELL_LEVEL_DEPENDENT_ROLL");

        expect(defaultMagicSurgeRollResultSpy).not.toBeCalled();

        expect(defaultMagicSurgeRollResultSpy).toHaveBeenCalledTimes(0);

        expect(mockSpellLevelTriggerCheck).toBeCalled();

        expect(mockSpellLevelTriggerCheck).toHaveBeenCalledTimes(1);

        expect((global as any).Hooks.callAll).toBeCalled();

        expect((global as any).Hooks.callAll).toHaveBeenCalledTimes(1);
      });
      test("DIE_DESCENDING", async () => {
        await magicSurgeCheck.AutoSurgeCheck("1", "DIE_DESCENDING");

        expect(defaultMagicSurgeRollResultSpy).not.toBeCalled();

        expect(defaultMagicSurgeRollResultSpy).toHaveBeenCalledTimes(0);

        expect(mockDieDescendingCheck).toBeCalled();

        expect(mockDieDescendingCheck).toHaveBeenCalledTimes(1);

        expect((global as any).Hooks.callAll).toBeCalled();

        expect((global as any).Hooks.callAll).toHaveBeenCalledTimes(1);
      });
    });

    describe("Is Auto Surge Check but no roll", () => {
      let defaultMagicSurgeRollResultSpy: any;
      let magicSurgeCheck: MagicSurgeCheck;

      beforeEach(() => {
        (global as any).game = {
          modules: {
            get: () => {
              return { active: false };
            },
          },
          i18n: {
            format: jest.fn().mockReturnValue("TestKeyValue"),
          },
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
        magicSurgeCheck = new MagicSurgeCheck(actor, "rMyoELkOwFNPGEK4");
        mockTidesOfChaosIsTidesOfChaosUsed.mockReturnValue(false);

        defaultMagicSurgeRollResultSpy = jest.spyOn(
          magicSurgeCheck,
          "DefaultMagicSurgeRollResult"
        );

        jest
          .spyOn(magicSurgeCheck, "WildMagicSurgeRollCheck")
          .mockReturnValue(undefined);
      });
      test("It should return", async () => {
        await magicSurgeCheck.AutoSurgeCheck("1", "INVALID_OPTION");

        expect(defaultMagicSurgeRollResultSpy).not.toBeCalled();

        expect(mockIncrementalCheckCheck).not.toBeCalled();

        expect(mockSpellLevelTriggerCheck).not.toBeCalled();
      });
    });
  });

  describe("SurgeWildMagic", () => {
    describe("Encounter Stats Not Active", () => {
      let magicSurgeCheck: MagicSurgeCheck;

      beforeEach(() => {
        (global as any).game = {
          i18n: {
            format: jest.fn().mockReturnValue("TestKeyValue"),
          },
          settings: {
            get: jest.fn().mockReturnValue(true),
          },
          modules: {
            get: () => {
              return { active: false };
            },
          },
        };
        magicSurgeCheck = new MagicSurgeCheck(actor, "rMyoELkOwFNPGEK4");
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
    describe("Encounter Stats Active", () => {
      let magicSurgeCheck: MagicSurgeCheck;

      beforeEach(() => {
        (global as any).game = {
          i18n: {
            format: jest.fn().mockReturnValue("TestKeyValue"),
          },
          settings: {
            get: jest.fn().mockReturnValue(true),
          },
          modules: {
            get: () => {
              return { active: true };
            },
          },
        };
        magicSurgeCheck = new MagicSurgeCheck(actor, "rMyoELkOwFNPGEK4");
        mockRollTableMagicSurgeCheck.mockResolvedValueOnce("test result");
      });

      it("It runs correctly on true", async () => {
        await magicSurgeCheck.SurgeWildMagic(true, { result: 1 });

        expect(mockChatSend).toHaveBeenCalledTimes(1);

        expect(mockTidesOfChaosCheck).toHaveBeenCalledTimes(1);

        expect(mockRollTableMagicSurgeCheck).toHaveBeenCalledTimes(1);

        expect((global as any).Hooks.callAll).toHaveBeenCalledTimes(2);
      });

      it("It runs correctly on false", async () => {
        await magicSurgeCheck.SurgeWildMagic(false, { result: 1 });

        expect(mockChatSend).toHaveBeenCalledTimes(1);

        expect(mockTidesOfChaosCheck).not.toHaveBeenCalled();

        expect(mockRollTableMagicSurgeCheck).not.toHaveBeenCalled();

        expect((global as any).Hooks.callAll).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe("SurgeTidesOfChaos", () => {
    describe("If table result is returned", () => {
      let magicSurgeCheck: MagicSurgeCheck;

      beforeEach(() => {
        (global as any).game = {
          i18n: {
            format: jest.fn().mockReturnValue("TestKeyValue"),
          },
          settings: {
            get: jest.fn().mockReturnValue("Auto D20 Message"),
          },
          modules: {
            get: () => {
              return { active: false };
            },
          },
        };
        magicSurgeCheck = new MagicSurgeCheck(actor, "rMyoELkOwFNPGEK4");
        mockRollTableMagicSurgeCheck.mockResolvedValueOnce("test result");
      });

      it("It runs the correct functions", async () => {
        await magicSurgeCheck.SurgeTidesOfChaos();

        expect(mockChatSend).toHaveBeenCalledTimes(1);

        expect(mockTidesOfChaosCheck).toHaveBeenCalledTimes(1);

        expect(mockRollTableMagicSurgeCheck).toHaveBeenCalledTimes(1);

        expect(mockIncrementalCheckReset).toHaveBeenCalledTimes(1);

        expect(mockDieDescendingReset).toHaveBeenCalledTimes(1);

        expect((global as any).Hooks.callAll).toBeCalled();

        expect((global as any).Hooks.callAll).toHaveBeenCalledTimes(1);
      });
    });

    describe("If no table result is returned", () => {
      let magicSurgeCheck: MagicSurgeCheck;

      beforeEach(() => {
        (global as any).game = {
          i18n: {
            format: jest.fn().mockReturnValue("TestKeyValue"),
          },
          settings: {
            get: jest.fn().mockReturnValue("Auto D20 Message"),
          },
          modules: {
            get: () => {
              return { active: false };
            },
          },
        };
        magicSurgeCheck = new MagicSurgeCheck(actor, "rMyoELkOwFNPGEK4");
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
  });

  describe("SplitRollResult", () => {
    let magicSurgeCheck: MagicSurgeCheck;

    beforeEach(() => {
      magicSurgeCheck = new MagicSurgeCheck(actor, "rMyoELkOwFNPGEK4");
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
