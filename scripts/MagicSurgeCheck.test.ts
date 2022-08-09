import MagicSurgeCheck from "./MagicSurgeCheck.js";
import RollTableMagicSurge from "./RollTableMagicSurge.js";
import IncrementalCheck from "./utils/IncrementalCheck.js";
import SpellParser from "./utils/SpellParser.js";
import SpellLevelTrigger from "./utils/SpellLevelTrigger.js";
import Chat from "./Chat.js";
import { actor } from "../MockData/actor.js";
import { actorRage } from "../MockData/actorRage.js";
import { chatMessage } from "../MockData/chatMessage.js";
import "../__mocks__/index.js";
import TidesOfChaos from "./TidesOfChaos.js";
import AutoEffects from "./AutoEffects.js";

const mockSpellParserIsPathOfWildMagicFeat = jest.fn();

const mockSpellParserSpellLevel = jest.fn();

const mockSpellParserIsRage = jest.fn();

const mockSpellParserIsSpell = jest.fn();

const mockSpellParserIsSorcererSpell = jest.fn();

const mockSpellParserIsNPC = jest.fn();

const mockSpellParserIsWildMagicFeat = jest.fn();

jest.mock("./utils/SpellParser.js", () => {
  return jest.fn().mockImplementation(() => {
    return {
      IsPathOfWildMagicFeat: mockSpellParserIsPathOfWildMagicFeat,
      SpellLevel: mockSpellParserSpellLevel,
      IsRage: mockSpellParserIsRage,
      IsSpell: mockSpellParserIsSpell,
      IsSorcererSpell: mockSpellParserIsSorcererSpell,
      IsNPC: mockSpellParserIsNPC,
      IsWildMagicFeat: mockSpellParserIsWildMagicFeat,
    };
  });
});

const mockDieDescendingCheck = jest.fn();

jest.mock("./utils/DieDescending.js", () => {
  return jest.fn().mockImplementation(() => {
    return {
      Check: mockDieDescendingCheck,
    };
  });
});

const mockSpellLevelTriggerCheck = jest.fn();

jest.mock("./utils/SpellLevelTrigger.js", () => {
  return jest.fn().mockImplementation(() => {
    return {
      Check: mockSpellLevelTriggerCheck,
    };
  });
});

const mockIncrementalCheckCheck = jest.fn();

jest.mock("./utils/IncrementalCheck.js", () => {
  return jest.fn().mockImplementation(() => {
    return {
      Check: mockIncrementalCheckCheck,
    };
  });
});

const mockChatSend = jest.fn();

const mockChatRunMessageCheck = jest.fn();

jest.mock("./Chat.js", () => {
  return jest.fn().mockImplementation(() => {
    return {
      Send: mockChatSend,
      RunMessageCheck: mockChatRunMessageCheck,
    };
  });
});

const mockTidesOfChaosCheck = jest.fn();

const mockTidesOfChaosIsTidesOfChaosUsed = jest.fn();

jest.mock("./TidesOfChaos.js", () => {
  return jest.fn().mockImplementation(() => {
    return {
      Check: mockTidesOfChaosCheck,
      IsTidesOfChaosUsed: mockTidesOfChaosIsTidesOfChaosUsed,
    };
  });
});

const mockRollTableMagicSurgeCheck = jest.fn();

jest.mock("./RollTableMagicSurge.js", () => {
  return jest.fn().mockImplementation(() => {
    return {
      Check: mockRollTableMagicSurgeCheck,
    };
  });
});

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
  mockSpellParserIsPathOfWildMagicFeat.mockClear();
  mockSpellParserIsSorcererSpell.mockClear();
  mockSpellParserSpellLevel.mockClear();
  mockSpellParserIsRage.mockClear();
  mockSpellParserIsSpell.mockClear();
  mockSpellParserIsNPC.mockClear();
  mockSpellParserIsWildMagicFeat.mockClear();
  (RollTableMagicSurge as any).mockClear();
  (Chat as any).mockClear();
  (TidesOfChaos as any).mockClear();
  (IncrementalCheck as any).mockClear();
  (SpellLevelTrigger as any).mockClear();
  (SpellParser as any).mockClear();
  (global as any).Hooks.callAll.mockClear();
});

describe("MagicSurgeCheck", () => {
  describe("CheckChatMessage", () => {
    describe("Is Wild Magic Surge Auto Check", () => {
      let magicSurgeCheck: any;

      beforeEach(() => {
        (global as any).game = {
          settings: {
            get: jest
              .fn()
              .mockReturnValueOnce(true)
              .mockReturnValueOnce("DEFAULT"),
          },
        };
        // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
        magicSurgeCheck = new MagicSurgeCheck(actor);
        mockSpellParserIsPathOfWildMagicFeat.mockReturnValue(false);
        mockSpellParserSpellLevel.mockReturnValue("1st Level");

        jest.spyOn(magicSurgeCheck, "isValidChatMessage").mockReturnValue(true);

        jest.spyOn(magicSurgeCheck, "AutoSurgeCheck").mockReturnValue(true);
      });

      it("It runs correctly", async () => {
        await magicSurgeCheck.CheckChatMessage(chatMessage);

        expect(mockSpellParserIsPathOfWildMagicFeat).toHaveBeenCalledTimes(1);

        expect(mockSpellParserSpellLevel).toHaveBeenCalledTimes(1);

        expect(magicSurgeCheck.AutoSurgeCheck).toHaveBeenCalledTimes(1);

        expect(mockChatRunMessageCheck).not.toHaveBeenCalled();
      });
    });

    describe("Is Wild Magic Surge Message Only Check", () => {
      let magicSurgeCheck: any;

      beforeEach(() => {
        (global as any).game = {
          settings: {
            get: jest.fn().mockReturnValueOnce(false),
          },
        };
        // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
        magicSurgeCheck = new MagicSurgeCheck(actor);
        mockSpellParserIsPathOfWildMagicFeat.mockReturnValue(false);
        mockSpellParserSpellLevel.mockReturnValue("1st Level");

        jest.spyOn(magicSurgeCheck, "isValidChatMessage").mockReturnValue(true);

        jest.spyOn(magicSurgeCheck, "AutoSurgeCheck").mockReturnValue(true);
      });

      it("It runs correctly", async () => {
        await magicSurgeCheck.CheckChatMessage(chatMessage);

        expect(mockSpellParserIsPathOfWildMagicFeat).toHaveBeenCalledTimes(1);

        expect(mockSpellParserSpellLevel).not.toHaveBeenCalled();

        expect(magicSurgeCheck.AutoSurgeCheck).not.toHaveBeenCalled();

        expect(mockChatRunMessageCheck).toHaveBeenCalledTimes(1);
      });
    });

    describe("Is Path of Wild Magic Surge", () => {
      let magicSurgeCheck: any;

      beforeEach(() => {
        (global as any).game = {
          settings: {
            get: jest.fn().mockReturnValueOnce(true),
          },
        };
        // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
        magicSurgeCheck = new MagicSurgeCheck(actor);
        mockSpellParserIsPathOfWildMagicFeat.mockReturnValue(true);
        mockSpellParserSpellLevel.mockReturnValue("1st Level");

        jest.spyOn(magicSurgeCheck, "isValidChatMessage").mockReturnValue(true);

        jest.spyOn(magicSurgeCheck, "AutoSurgeCheck").mockReturnValue(true);
      });

      it("It runs correctly", async () => {
        await magicSurgeCheck.CheckChatMessage(chatMessage);

        expect(mockSpellParserIsPathOfWildMagicFeat).toHaveBeenCalledTimes(1);

        expect(mockRollTableMagicSurgeCheck).toHaveBeenCalledWith("POWM");

        expect(mockSpellParserSpellLevel).not.toHaveBeenCalled();

        expect(magicSurgeCheck.AutoSurgeCheck).not.toHaveBeenCalled();
      });
    });

    describe("Has no actor", () => {
      let magicSurgeCheck: any;

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

  describe("isValidChatMessage", () => {
    describe("Is whisper to GM but not the GM", () => {
      let magicSurgeCheck: any;

      beforeEach(() => {
        (global as any).game = {
          user: {
            isGM: false,
          },
          settings: {
            get: jest.fn().mockReturnValueOnce(true),
          },
        };
        // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
        magicSurgeCheck = new MagicSurgeCheck(actor);
      });

      it("It returns false", async () => {
        const result = await magicSurgeCheck.isValidChatMessage(chatMessage);

        expect(result).toBeFalsy();
      });
    });

    describe("Is not whisper to GM and the game user is not the same as the message user", () => {
      let magicSurgeCheck: any;

      beforeEach(() => {
        (global as any).game = {
          user: {
            isGM: false,
            id: "12345",
          },
          settings: {
            get: jest.fn().mockReturnValueOnce(false),
          },
        };
        // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
        magicSurgeCheck = new MagicSurgeCheck(actor);
      });

      it("It returns false", async () => {
        const result = await magicSurgeCheck.isValidChatMessage({
          user: {
            id: "123",
          },
        });

        expect(result).toBeFalsy();
      });
    });

    describe("Is a Path of Wild Magic and Rage", () => {
      let magicSurgeCheck: any;

      beforeEach(() => {
        (global as any).game = {
          user: {
            isGM: true,
            id: "12345",
          },
          settings: {
            get: jest.fn().mockReturnValueOnce(true),
          },
        };
        mockSpellParserIsPathOfWildMagicFeat.mockReturnValue(true);
        mockSpellParserIsRage.mockReturnValue(true);
        // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
        magicSurgeCheck = new MagicSurgeCheck(actorRage);
      });

      it("It returns true", async () => {
        const result = await magicSurgeCheck.isValidChatMessage(chatMessage);

        expect(mockSpellParserIsPathOfWildMagicFeat).toHaveBeenCalledTimes(1);

        expect(mockSpellParserIsRage).toHaveBeenCalledTimes(1);

        expect(result).toBeTruthy();
      });
    });

    describe("Is not a sorcerer spell", () => {
      let magicSurgeCheck: any;

      beforeEach(() => {
        (global as any).game = {
          user: {
            isGM: true,
            id: "12345",
          },
          settings: {
            get: jest.fn().mockReturnValueOnce(true).mockReturnValueOnce(true),
          },
        };
        mockSpellParserIsPathOfWildMagicFeat.mockReturnValue(false);
        mockSpellParserIsSpell.mockReturnValue(true);
        mockSpellParserIsSorcererSpell.mockReturnValue(false);
        // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
        magicSurgeCheck = new MagicSurgeCheck(actor);
      });

      it("It returns true", async () => {
        const result = await magicSurgeCheck.isValidChatMessage(chatMessage);

        expect(mockSpellParserIsPathOfWildMagicFeat).toHaveBeenCalledTimes(1);

        expect(mockSpellParserIsSpell).toHaveBeenCalledTimes(1);

        expect(mockSpellParserIsSorcererSpell).toHaveBeenCalledTimes(1);

        expect(mockSpellParserIsRage).not.toHaveBeenCalled();

        expect(result).toBeFalsy();
      });
    });

    describe("Is a valid message", () => {
      let magicSurgeCheck: any;

      beforeEach(() => {
        (global as any).game = {
          user: {
            isGM: true,
            id: "12345",
          },
          settings: {
            get: jest.fn().mockReturnValueOnce(true).mockReturnValueOnce(false),
          },
        };
        mockSpellParserIsPathOfWildMagicFeat.mockReturnValue(false);
        mockSpellParserIsSpell.mockReturnValue(true);
        mockSpellParserIsSorcererSpell.mockReturnValue(true);
        mockSpellParserIsNPC.mockReturnValue(false);
        mockSpellParserIsWildMagicFeat.mockReturnValue(true);
        // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
        magicSurgeCheck = new MagicSurgeCheck(actor);
      });

      it("It returns true", async () => {
        const result = await magicSurgeCheck.isValidChatMessage(chatMessage);

        expect(mockSpellParserIsPathOfWildMagicFeat).toHaveBeenCalledTimes(1);

        expect(mockSpellParserIsSpell).toHaveBeenCalledTimes(1);

        expect(mockSpellParserIsNPC).toHaveBeenCalledTimes(1);

        expect(mockSpellParserIsWildMagicFeat).toHaveBeenCalledTimes(1);

        expect(mockSpellParserIsSorcererSpell).not.toHaveBeenCalled();

        expect(mockSpellParserIsRage).not.toHaveBeenCalled();

        expect(result).toBeTruthy();
      });
    });

    describe("Is a valid message with NPCs enabled", () => {
      let magicSurgeCheck: any;

      beforeEach(() => {
        (global as any).game = {
          user: {
            isGM: true,
            id: "12345",
          },
          settings: {
            get: jest
              .fn()
              .mockReturnValueOnce(true)
              .mockReturnValueOnce(false)
              .mockReturnValueOnce(true),
          },
        };
        mockSpellParserIsPathOfWildMagicFeat.mockReturnValue(false);
        mockSpellParserIsSpell.mockReturnValue(true);
        mockSpellParserIsSorcererSpell.mockReturnValue(true);
        mockSpellParserIsWildMagicFeat.mockReturnValue(true);
        // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
        magicSurgeCheck = new MagicSurgeCheck(actor);
      });

      it("It returns true", async () => {
        const result = await magicSurgeCheck.isValidChatMessage(chatMessage);

        expect(mockSpellParserIsPathOfWildMagicFeat).toHaveBeenCalledTimes(1);

        expect(mockSpellParserIsSpell).toHaveBeenCalledTimes(1);

        expect(mockSpellParserIsNPC).not.toHaveBeenCalled();

        expect(mockSpellParserIsWildMagicFeat).toHaveBeenCalledTimes(1);

        expect(mockSpellParserIsSorcererSpell).not.toHaveBeenCalled();

        expect(mockSpellParserIsRage).not.toHaveBeenCalled();

        expect(result).toBeTruthy();
      });
    });

    describe("Has no actor", () => {
      let magicSurgeCheck: any;

      beforeEach(() => {
        // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
        magicSurgeCheck = new MagicSurgeCheck(undefined);
      });

      it("It returns from module", async () => {
        const result = await magicSurgeCheck.isValidChatMessage({});

        expect(result).toBeFalsy();
      });
    });
  });

  describe("WildMagicSurgeRollCheck", () => {
    describe("On a Default Surge Type", () => {
      let magicSurgeCheck: any;

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
      let magicSurgeCheck: any;

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
      let magicSurgeCheck: any;

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
      let magicSurgeCheck: any;

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
      let magicSurgeCheck: any;
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
      let magicSurgeCheck: any;
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
      let magicSurgeCheck: any;

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
      let magicSurgeCheck: any;

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
    let magicSurgeCheck: any;

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
    let magicSurgeCheck: any;

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
    let magicSurgeCheck: any;

    beforeEach(() => {
      // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
      magicSurgeCheck = new MagicSurgeCheck(actor);
    });

    it("It splits one value into an array", async () => {
      const result = await magicSurgeCheck.SplitRollResult("1");

      expect(result).toStrictEqual(["1"]);
    });

    it("It splits more than one value into an array", async () => {
      const result = await magicSurgeCheck.SplitRollResult("1, 2, 3");

      expect(result).toStrictEqual(["1", "2", "3"]);
    });

    it("It return an empty array if no value passed", async () => {
      const result = await magicSurgeCheck.SplitRollResult();

      expect(result).toStrictEqual([]);
    });
  });
});
