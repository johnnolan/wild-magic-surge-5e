import MagicSurgeCheck from "./MagicSurgeCheck.js";
import RollTableMagicSurge from "./RollTableMagicSurge.js";
import IncrementalCheck from "./utils/IncrementalCheck.js";
import SpellParser from "./utils/SpellParser.js";
import SpellLevelTrigger from "./utils/SpellLevelTrigger.js";
import Chat from "./Chat.js";
// @ts-expect-error TS(7016): Could not find a declaration file for module '../M... Remove this comment to see the full error message
import { actor } from "../MockData/actor.js";
// @ts-expect-error TS(7016): Could not find a declaration file for module '../M... Remove this comment to see the full error message
import { actorRage } from "../MockData/actorRage.js";
// @ts-expect-error TS(7016): Could not find a declaration file for module '../M... Remove this comment to see the full error message
import { chatMessage } from "../MockData/chatMessage.js";
import "../__mocks__/index.js";
import TidesOfChaos from "./TidesOfChaos.js";
import AutoEffects from "./AutoEffects.js";

// @ts-expect-error TS(2304): Cannot find name 'jest'.
const mockSpellParserIsPathOfWildMagicFeat = jest.fn();
// @ts-expect-error TS(2304): Cannot find name 'jest'.
const mockSpellParserSpellLevel = jest.fn();
// @ts-expect-error TS(2304): Cannot find name 'jest'.
const mockSpellParserIsRage = jest.fn();
// @ts-expect-error TS(2304): Cannot find name 'jest'.
const mockSpellParserIsSpell = jest.fn();
// @ts-expect-error TS(2304): Cannot find name 'jest'.
const mockSpellParserIsSorcererSpell = jest.fn();
// @ts-expect-error TS(2304): Cannot find name 'jest'.
const mockSpellParserIsNPC = jest.fn();
// @ts-expect-error TS(2304): Cannot find name 'jest'.
const mockSpellParserIsWildMagicFeat = jest.fn();
// @ts-expect-error TS(2304): Cannot find name 'jest'.
jest.mock("./utils/SpellParser.js", () => {
  // @ts-expect-error TS(2304): Cannot find name 'jest'.
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

// @ts-expect-error TS(2304): Cannot find name 'jest'.
const mockDieDescendingCheck = jest.fn();
// @ts-expect-error TS(2304): Cannot find name 'jest'.
jest.mock("./utils/DieDescending.js", () => {
  // @ts-expect-error TS(2304): Cannot find name 'jest'.
  return jest.fn().mockImplementation(() => {
    return {
      Check: mockDieDescendingCheck,
    };
  });
});

// @ts-expect-error TS(2304): Cannot find name 'jest'.
const mockSpellLevelTriggerCheck = jest.fn();
// @ts-expect-error TS(2304): Cannot find name 'jest'.
jest.mock("./utils/SpellLevelTrigger.js", () => {
  // @ts-expect-error TS(2304): Cannot find name 'jest'.
  return jest.fn().mockImplementation(() => {
    return {
      Check: mockSpellLevelTriggerCheck,
    };
  });
});

// @ts-expect-error TS(2304): Cannot find name 'jest'.
const mockIncrementalCheckCheck = jest.fn();
// @ts-expect-error TS(2304): Cannot find name 'jest'.
jest.mock("./utils/IncrementalCheck.js", () => {
  // @ts-expect-error TS(2304): Cannot find name 'jest'.
  return jest.fn().mockImplementation(() => {
    return {
      Check: mockIncrementalCheckCheck,
    };
  });
});

// @ts-expect-error TS(2304): Cannot find name 'jest'.
const mockChatSend = jest.fn();
// @ts-expect-error TS(2304): Cannot find name 'jest'.
const mockChatRunMessageCheck = jest.fn();
// @ts-expect-error TS(2304): Cannot find name 'jest'.
jest.mock("./Chat.js", () => {
  // @ts-expect-error TS(2304): Cannot find name 'jest'.
  return jest.fn().mockImplementation(() => {
    return {
      Send: mockChatSend,
      RunMessageCheck: mockChatRunMessageCheck,
    };
  });
});

// @ts-expect-error TS(2304): Cannot find name 'jest'.
const mockTidesOfChaosCheck = jest.fn();
// @ts-expect-error TS(2304): Cannot find name 'jest'.
const mockTidesOfChaosIsTidesOfChaosUsed = jest.fn();
// @ts-expect-error TS(2304): Cannot find name 'jest'.
jest.mock("./TidesOfChaos.js", () => {
  // @ts-expect-error TS(2304): Cannot find name 'jest'.
  return jest.fn().mockImplementation(() => {
    return {
      Check: mockTidesOfChaosCheck,
      IsTidesOfChaosUsed: mockTidesOfChaosIsTidesOfChaosUsed,
    };
  });
});

// @ts-expect-error TS(2304): Cannot find name 'jest'.
const mockRollTableMagicSurgeCheck = jest.fn();
// @ts-expect-error TS(2304): Cannot find name 'jest'.
jest.mock("./RollTableMagicSurge.js", () => {
  // @ts-expect-error TS(2304): Cannot find name 'jest'.
  return jest.fn().mockImplementation(() => {
    return {
      Check: mockRollTableMagicSurgeCheck,
    };
  });
});

// @ts-expect-error TS(2304): Cannot find name 'jest'.
const mockAutoEffect = jest.fn();
AutoEffects.Run = mockAutoEffect;
// @ts-expect-error TS(2304): Cannot find name 'global'.
global.Hooks = {
  // @ts-expect-error TS(2304): Cannot find name 'jest'.
  callAll: jest.fn().mockReturnValue(),
};

// @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
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
  // @ts-expect-error TS(2304): Cannot find name 'global'.
  global.Hooks.callAll.mockClear();
});

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe("MagicSurgeCheck", () => {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe("CheckChatMessage", () => {
    // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe("Is Wild Magic Surge Auto Check", () => {
      let magicSurgeCheck: any;
      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(() => {
        // @ts-expect-error TS(2304): Cannot find name 'global'.
        global.game = {
          settings: {
            // @ts-expect-error TS(2304): Cannot find name 'jest'.
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
        // @ts-expect-error TS(2304): Cannot find name 'jest'.
        jest.spyOn(magicSurgeCheck, "isValidChatMessage").mockReturnValue(true);
        // @ts-expect-error TS(2304): Cannot find name 'jest'.
        jest.spyOn(magicSurgeCheck, "AutoSurgeCheck").mockReturnValue(true);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it("It runs correctly", async () => {
        await magicSurgeCheck.CheckChatMessage(chatMessage);
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(mockSpellParserIsPathOfWildMagicFeat).toHaveBeenCalledTimes(1);
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(mockSpellParserSpellLevel).toHaveBeenCalledTimes(1);
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(magicSurgeCheck.AutoSurgeCheck).toHaveBeenCalledTimes(1);
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(mockChatRunMessageCheck).not.toHaveBeenCalled();
      });
    });

    // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe("Is Wild Magic Surge Message Only Check", () => {
      let magicSurgeCheck: any;
      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(() => {
        // @ts-expect-error TS(2304): Cannot find name 'global'.
        global.game = {
          settings: {
            // @ts-expect-error TS(2304): Cannot find name 'jest'.
            get: jest.fn().mockReturnValueOnce(false),
          },
        };
        // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
        magicSurgeCheck = new MagicSurgeCheck(actor);
        mockSpellParserIsPathOfWildMagicFeat.mockReturnValue(false);
        mockSpellParserSpellLevel.mockReturnValue("1st Level");
        // @ts-expect-error TS(2304): Cannot find name 'jest'.
        jest.spyOn(magicSurgeCheck, "isValidChatMessage").mockReturnValue(true);
        // @ts-expect-error TS(2304): Cannot find name 'jest'.
        jest.spyOn(magicSurgeCheck, "AutoSurgeCheck").mockReturnValue(true);
      });
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it("It runs correctly", async () => {
        await magicSurgeCheck.CheckChatMessage(chatMessage);
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(mockSpellParserIsPathOfWildMagicFeat).toHaveBeenCalledTimes(1);
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(mockSpellParserSpellLevel).not.toHaveBeenCalled();
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(magicSurgeCheck.AutoSurgeCheck).not.toHaveBeenCalled();
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(mockChatRunMessageCheck).toHaveBeenCalledTimes(1);
      });
    });

    // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe("Is Path of Wild Magic Surge", () => {
      let magicSurgeCheck: any;
      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(() => {
        // @ts-expect-error TS(2304): Cannot find name 'global'.
        global.game = {
          settings: {
            // @ts-expect-error TS(2304): Cannot find name 'jest'.
            get: jest.fn().mockReturnValueOnce(true),
          },
        };
        // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
        magicSurgeCheck = new MagicSurgeCheck(actor);
        mockSpellParserIsPathOfWildMagicFeat.mockReturnValue(true);
        mockSpellParserSpellLevel.mockReturnValue("1st Level");
        // @ts-expect-error TS(2304): Cannot find name 'jest'.
        jest.spyOn(magicSurgeCheck, "isValidChatMessage").mockReturnValue(true);
        // @ts-expect-error TS(2304): Cannot find name 'jest'.
        jest.spyOn(magicSurgeCheck, "AutoSurgeCheck").mockReturnValue(true);
      });
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it("It runs correctly", async () => {
        await magicSurgeCheck.CheckChatMessage(chatMessage);
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(mockSpellParserIsPathOfWildMagicFeat).toHaveBeenCalledTimes(1);
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(mockRollTableMagicSurgeCheck).toHaveBeenCalledWith("POWM");
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(mockSpellParserSpellLevel).not.toHaveBeenCalled();
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(magicSurgeCheck.AutoSurgeCheck).not.toHaveBeenCalled();
      });
    });

    // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe("Has no actor", () => {
      let magicSurgeCheck: any;
      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(() => {
        // @ts-expect-error TS(2304): Cannot find name 'global'.
        global.game = {
          actors: {
            // @ts-expect-error TS(2304): Cannot find name 'jest'.
            get: jest.fn().mockReturnValue(undefined),
          },
          tables: [
            {
              name: "Wild Magic Surge",
              // @ts-expect-error TS(2304): Cannot find name 'jest'.
              roll: jest.fn().mockResolvedValue(true),
              // @ts-expect-error TS(2304): Cannot find name 'jest'.
              results: jest.fn().mockResolvedValue([]),
            },
          ],
        };
        // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
        magicSurgeCheck = new MagicSurgeCheck(undefined);
      });
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it("It returns from module", async () => {
        const result = await magicSurgeCheck.CheckChatMessage(chatMessage);
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(result).toBeFalsy();
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe("isValidChatMessage", () => {
    // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe("Is whisper to GM but not the GM", () => {
      let magicSurgeCheck: any;
      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(() => {
        // @ts-expect-error TS(2304): Cannot find name 'global'.
        global.game = {
          user: {
            isGM: false,
          },
          settings: {
            // @ts-expect-error TS(2304): Cannot find name 'jest'.
            get: jest.fn().mockReturnValueOnce(true),
          },
        };
        // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
        magicSurgeCheck = new MagicSurgeCheck(actor);
      });
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it("It returns false", async () => {
        const result = await magicSurgeCheck.isValidChatMessage(chatMessage);
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(result).toBeFalsy();
      });
    });

    // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe("Is not whisper to GM and the game user is not the same as the message user", () => {
      let magicSurgeCheck: any;
      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(() => {
        // @ts-expect-error TS(2304): Cannot find name 'global'.
        global.game = {
          user: {
            isGM: false,
            id: "12345",
          },
          settings: {
            // @ts-expect-error TS(2304): Cannot find name 'jest'.
            get: jest.fn().mockReturnValueOnce(false),
          },
        };
        // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
        magicSurgeCheck = new MagicSurgeCheck(actor);
      });
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it("It returns false", async () => {
        const result = await magicSurgeCheck.isValidChatMessage({
          user: {
            id: "123",
          },
        });
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(result).toBeFalsy();
      });
    });

    // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe("Is a Path of Wild Magic and Rage", () => {
      let magicSurgeCheck: any;
      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(() => {
        // @ts-expect-error TS(2304): Cannot find name 'global'.
        global.game = {
          user: {
            isGM: true,
            id: "12345",
          },
          settings: {
            // @ts-expect-error TS(2304): Cannot find name 'jest'.
            get: jest.fn().mockReturnValueOnce(true),
          },
        };
        mockSpellParserIsPathOfWildMagicFeat.mockReturnValue(true);
        mockSpellParserIsRage.mockReturnValue(true);
        // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
        magicSurgeCheck = new MagicSurgeCheck(actorRage);
      });
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it("It returns true", async () => {
        const result = await magicSurgeCheck.isValidChatMessage(chatMessage);
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(mockSpellParserIsPathOfWildMagicFeat).toHaveBeenCalledTimes(1);
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(mockSpellParserIsRage).toHaveBeenCalledTimes(1);
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(result).toBeTruthy();
      });
    });

    // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe("Is not a sorcerer spell", () => {
      let magicSurgeCheck: any;
      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(() => {
        // @ts-expect-error TS(2304): Cannot find name 'global'.
        global.game = {
          user: {
            isGM: true,
            id: "12345",
          },
          settings: {
            // @ts-expect-error TS(2304): Cannot find name 'jest'.
            get: jest.fn().mockReturnValueOnce(true).mockReturnValueOnce(true),
          },
        };
        mockSpellParserIsPathOfWildMagicFeat.mockReturnValue(false);
        mockSpellParserIsSpell.mockReturnValue(true);
        mockSpellParserIsSorcererSpell.mockReturnValue(false);
        // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
        magicSurgeCheck = new MagicSurgeCheck(actor);
      });
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it("It returns true", async () => {
        const result = await magicSurgeCheck.isValidChatMessage(chatMessage);
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(mockSpellParserIsPathOfWildMagicFeat).toHaveBeenCalledTimes(1);
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(mockSpellParserIsSpell).toHaveBeenCalledTimes(1);
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(mockSpellParserIsSorcererSpell).toHaveBeenCalledTimes(1);
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(mockSpellParserIsRage).not.toHaveBeenCalled();
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(result).toBeFalsy();
      });
    });

    // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe("Is a valid message", () => {
      let magicSurgeCheck: any;
      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(() => {
        // @ts-expect-error TS(2304): Cannot find name 'global'.
        global.game = {
          user: {
            isGM: true,
            id: "12345",
          },
          settings: {
            // @ts-expect-error TS(2304): Cannot find name 'jest'.
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
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it("It returns true", async () => {
        const result = await magicSurgeCheck.isValidChatMessage(chatMessage);
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(mockSpellParserIsPathOfWildMagicFeat).toHaveBeenCalledTimes(1);
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(mockSpellParserIsSpell).toHaveBeenCalledTimes(1);
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(mockSpellParserIsNPC).toHaveBeenCalledTimes(1);
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(mockSpellParserIsWildMagicFeat).toHaveBeenCalledTimes(1);
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(mockSpellParserIsSorcererSpell).not.toHaveBeenCalled();
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(mockSpellParserIsRage).not.toHaveBeenCalled();
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(result).toBeTruthy();
      });
    });

    // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe("Is a valid message with NPCs enabled", () => {
      let magicSurgeCheck: any;
      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(() => {
        // @ts-expect-error TS(2304): Cannot find name 'global'.
        global.game = {
          user: {
            isGM: true,
            id: "12345",
          },
          settings: {
            // @ts-expect-error TS(2304): Cannot find name 'jest'.
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
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it("It returns true", async () => {
        const result = await magicSurgeCheck.isValidChatMessage(chatMessage);
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(mockSpellParserIsPathOfWildMagicFeat).toHaveBeenCalledTimes(1);
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(mockSpellParserIsSpell).toHaveBeenCalledTimes(1);
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(mockSpellParserIsNPC).not.toHaveBeenCalled();
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(mockSpellParserIsWildMagicFeat).toHaveBeenCalledTimes(1);
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(mockSpellParserIsSorcererSpell).not.toHaveBeenCalled();
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(mockSpellParserIsRage).not.toHaveBeenCalled();
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(result).toBeTruthy();
      });
    });

    // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe("Has no actor", () => {
      let magicSurgeCheck: any;
      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(() => {
        // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
        magicSurgeCheck = new MagicSurgeCheck(undefined);
      });
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it("It returns from module", async () => {
        const result = await magicSurgeCheck.isValidChatMessage({});
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(result).toBeFalsy();
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe("WildMagicSurgeRollCheck", () => {
    // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe("On a Default Surge Type", () => {
      let magicSurgeCheck: any;
      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(() => {
        // @ts-expect-error TS(2304): Cannot find name 'global'.
        global.game = {
          settings: {
            // @ts-expect-error TS(2304): Cannot find name 'jest'.
            get: jest
              .fn()
              .mockReturnValueOnce("DEFAULT")
              .mockReturnValueOnce("1D20"),
          },
        };
        // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
        magicSurgeCheck = new MagicSurgeCheck(actor);
      });
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it("It calls Roll with 1D20", async () => {
        await magicSurgeCheck.WildMagicSurgeRollCheck();
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(global.Roll).toHaveBeenCalledWith("1D20");
      });
    });

    // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe("On a SPELL_LEVEL_DEPENDENT_ROLL Surge Type", () => {
      let magicSurgeCheck: any;
      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(() => {
        // @ts-expect-error TS(2304): Cannot find name 'global'.
        global.game = {
          settings: {
            // @ts-expect-error TS(2304): Cannot find name 'jest'.
            get: jest
              .fn()
              .mockReturnValueOnce("SPELL_LEVEL_DEPENDENT_ROLL")
              .mockReturnValueOnce("1D20"),
          },
        };
        // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
        magicSurgeCheck = new MagicSurgeCheck(actor);
      });
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it("It calls Roll with 1D20", async () => {
        await magicSurgeCheck.WildMagicSurgeRollCheck();
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(global.Roll).toHaveBeenCalledWith("1D20");
      });
    });

    // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe("On a DIE_DESCENDING Surge Type with set flag", () => {
      let magicSurgeCheck: any;
      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(() => {
        // @ts-expect-error TS(2304): Cannot find name 'global'.
        global.game = {
          settings: {
            // @ts-expect-error TS(2304): Cannot find name 'jest'.
            get: jest
              .fn()
              .mockReturnValueOnce("DIE_DESCENDING")
              .mockReturnValueOnce("1D20"),
          },
        };
        // @ts-expect-error TS(2304): Cannot find name 'jest'.
        actor.getFlag = jest.fn().mockReturnValue({ value: "1D20" });
        // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
        magicSurgeCheck = new MagicSurgeCheck(actor);
      });
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it("It calls Roll with 1D20", async () => {
        await magicSurgeCheck.WildMagicSurgeRollCheck();
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(global.Roll).toHaveBeenCalledWith("1D20");
      });
    });

    // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe("On a DIE_DESCENDING Surge Type with no set flag", () => {
      let magicSurgeCheck: any;
      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(() => {
        // @ts-expect-error TS(2304): Cannot find name 'global'.
        global.game = {
          settings: {
            // @ts-expect-error TS(2304): Cannot find name 'jest'.
            get: jest
              .fn()
              .mockReturnValueOnce("DIE_DESCENDING")
              .mockReturnValueOnce("1D20"),
          },
        };
        // @ts-expect-error TS(2304): Cannot find name 'jest'.
        actor.getFlag = jest.fn().mockReturnValue(undefined);
        // @ts-expect-error TS(2304): Cannot find name 'jest'.
        actor.setFlag = jest.fn();
        // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
        magicSurgeCheck = new MagicSurgeCheck(actor);
      });
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it("It calls Roll with 1D20", async () => {
        await magicSurgeCheck.WildMagicSurgeRollCheck();
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(actor.setFlag).toHaveBeenCalledWith(
          "wild-magic-surge-5e",
          "die_type",
          { value: "1d20" }
        );
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(global.Roll).toHaveBeenCalledWith("1d20");
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe("resultCheck", () => {
    // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe("has 1 value in the result check", () => {
      let magicSurgeCheck: any;
      // @ts-expect-error TS(2304): Cannot find name 'beforeAll'.
      beforeAll(() => {
        // @ts-expect-error TS(2304): Cannot find name 'global'.
        global.game = {
          actors: actor,
          settings: {
            // @ts-expect-error TS(2304): Cannot find name 'jest'.
            get: jest.fn().mockReturnValue("2"),
          },
          tables: [
            {
              name: "Wild Magic Surge",
              // @ts-expect-error TS(2304): Cannot find name 'jest'.
              roll: jest.fn().mockResolvedValue(true),
              // @ts-expect-error TS(2304): Cannot find name 'jest'.
              results: jest.fn().mockResolvedValue([]),
            },
          ],
        };
        // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
        magicSurgeCheck = new MagicSurgeCheck(actor);
      });
      // @ts-expect-error TS(2582): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
      test("roll of 2 EQ 2", async () => {
        const result = await magicSurgeCheck.DefaultMagicSurgeRollResult(
          2,
          "EQ"
        );
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(result).toBeTruthy();
      });
      // @ts-expect-error TS(2582): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
      test("roll of 2 Not EQ 2", async () => {
        const result = await magicSurgeCheck.DefaultMagicSurgeRollResult(
          1,
          "EQ"
        );
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(result).toBeFalsy();
      });
      // @ts-expect-error TS(2582): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
      test("roll of 2 Not GT 2", async () => {
        const result = await magicSurgeCheck.DefaultMagicSurgeRollResult(
          2,
          "GT"
        );
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(result).toBeFalsy();
      });
      // @ts-expect-error TS(2582): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
      test("roll of 3 GT 2", async () => {
        const result = await magicSurgeCheck.DefaultMagicSurgeRollResult(
          3,
          "GT"
        );
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(result).toBeTruthy();
      });
      // @ts-expect-error TS(2582): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
      test("roll of 2 Not LT 2", async () => {
        const result = await magicSurgeCheck.DefaultMagicSurgeRollResult(
          2,
          "LT"
        );
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(result).toBeFalsy();
      });
      // @ts-expect-error TS(2582): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
      test("roll of 1 LT 2", async () => {
        const result = await magicSurgeCheck.DefaultMagicSurgeRollResult(
          1,
          "LT"
        );
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(result).toBeTruthy();
      });
    });

    // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe("has 2 values in the result check", () => {
      let magicSurgeCheck: any;
      // @ts-expect-error TS(2304): Cannot find name 'beforeAll'.
      beforeAll(() => {
        // @ts-expect-error TS(2554): Expected 2 arguments, but got 0.
        magicSurgeCheck = new MagicSurgeCheck();
        // @ts-expect-error TS(2304): Cannot find name 'global'.
        global.game = {
          actors: actor,
          settings: {
            // @ts-expect-error TS(2304): Cannot find name 'jest'.
            get: jest.fn().mockReturnValue("3, 4"),
          },
          tables: [
            {
              name: "Wild Magic Surge",
              // @ts-expect-error TS(2304): Cannot find name 'jest'.
              roll: jest.fn().mockResolvedValue(true),
              // @ts-expect-error TS(2304): Cannot find name 'jest'.
              results: jest.fn().mockResolvedValue([]),
            },
          ],
        };
      });
      // @ts-expect-error TS(2582): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
      test("roll of 3 EQ 3", async () => {
        const result = await magicSurgeCheck.DefaultMagicSurgeRollResult(
          3,
          "EQ"
        );
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(result).toBeTruthy();
      });
      // @ts-expect-error TS(2582): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
      test("roll of 4 EQ 4", async () => {
        const result = await magicSurgeCheck.DefaultMagicSurgeRollResult(
          4,
          "EQ"
        );
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(result).toBeTruthy();
      });
      // @ts-expect-error TS(2582): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
      test("roll of 1 Not EQ 3", async () => {
        const result = await magicSurgeCheck.DefaultMagicSurgeRollResult(
          5,
          "EQ"
        );
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(result).toBeFalsy();
      });
      // @ts-expect-error TS(2582): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
      test("roll of 3 Not GT 3", async () => {
        const result = await magicSurgeCheck.DefaultMagicSurgeRollResult(
          3,
          "GT"
        );
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(result).toBeFalsy();
      });
      // @ts-expect-error TS(2582): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
      test("roll of 4 GT 3", async () => {
        const result = await magicSurgeCheck.DefaultMagicSurgeRollResult(
          4,
          "GT"
        );
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(result).toBeTruthy();
      });
      // @ts-expect-error TS(2582): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
      test("roll of 2 Not LT 3", async () => {
        const result = await magicSurgeCheck.DefaultMagicSurgeRollResult(
          2,
          "LT"
        );
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(result).toBeTruthy();
      });
      // @ts-expect-error TS(2582): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
      test("roll of 1 LT 4", async () => {
        const result = await magicSurgeCheck.DefaultMagicSurgeRollResult(
          3,
          "LT"
        );
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(result).toBeTruthy();
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe("AutoSurgeCheck", () => {
    // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe("Is Tides of Chaos Auto Surge", () => {
      let defaultSurgeTidesOfChaosSpy: any;
      let magicSurgeCheck: any;
      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(() => {
        // @ts-expect-error TS(2304): Cannot find name 'global'.
        global.game = {
          settings: {
            // @ts-expect-error TS(2304): Cannot find name 'jest'.
            get: jest.fn().mockReturnValue(true),
          },
        };
        // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
        magicSurgeCheck = new MagicSurgeCheck(actor);
        // @ts-expect-error TS(2304): Cannot find name 'jest'.
        defaultSurgeTidesOfChaosSpy = jest.spyOn(
          magicSurgeCheck,
          "SurgeTidesOfChaos"
        );
        // @ts-expect-error TS(2304): Cannot find name 'jest'.
        jest.spyOn(magicSurgeCheck, "SurgeWildMagic").mockReturnValue(true);
        mockTidesOfChaosIsTidesOfChaosUsed.mockReturnValue(true);
      });
      // @ts-expect-error TS(2582): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
      test("Calls Tides of Chaos surge", async () => {
        await magicSurgeCheck.AutoSurgeCheck(1, "INVALID_OPTION");
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(defaultSurgeTidesOfChaosSpy).toBeCalled();
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(mockTidesOfChaosIsTidesOfChaosUsed).toBeCalled();
      });
    });
    // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe("Is Auto Surge Check", () => {
      let defaultMagicSurgeRollResultSpy: any;
      let magicSurgeCheck: any;
      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(() => {
        // @ts-expect-error TS(2304): Cannot find name 'global'.
        global.game = {
          settings: {
            // @ts-expect-error TS(2304): Cannot find name 'jest'.
            get: jest.fn().mockReturnValue(true),
          },
          actors: {
            // @ts-expect-error TS(2304): Cannot find name 'jest'.
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
        // @ts-expect-error TS(2304): Cannot find name 'jest'.
        defaultMagicSurgeRollResultSpy = jest.spyOn(
          magicSurgeCheck,
          "DefaultMagicSurgeRollResult"
        );
        // @ts-expect-error TS(2304): Cannot find name 'jest'.
        jest
          .spyOn(magicSurgeCheck, "WildMagicSurgeRollCheck")
          .mockReturnValue(true);
      });
      // @ts-expect-error TS(2582): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
      test("INVALID_OPTION", async () => {
        await magicSurgeCheck.AutoSurgeCheck(1, "INVALID_OPTION");
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(defaultMagicSurgeRollResultSpy).not.toBeCalled();
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(defaultMagicSurgeRollResultSpy).toHaveBeenCalledTimes(0);
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(mockIncrementalCheckCheck).not.toBeCalled();
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(mockIncrementalCheckCheck).toHaveBeenCalledTimes(0);
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(mockSpellLevelTriggerCheck).not.toBeCalled();
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(mockSpellLevelTriggerCheck).toHaveBeenCalledTimes(0);
      });
      // @ts-expect-error TS(2582): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
      test("DEFAULT", async () => {
        await magicSurgeCheck.AutoSurgeCheck(1, "DEFAULT");
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(defaultMagicSurgeRollResultSpy).toBeCalled();
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(defaultMagicSurgeRollResultSpy).toHaveBeenCalledTimes(1);
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(mockIncrementalCheckCheck).not.toBeCalled();
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(mockIncrementalCheckCheck).toHaveBeenCalledTimes(0);
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(mockSpellLevelTriggerCheck).not.toBeCalled();
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(mockSpellLevelTriggerCheck).toHaveBeenCalledTimes(0);
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(global.Hooks.callAll).toBeCalled();
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(global.Hooks.callAll).toHaveBeenCalledTimes(1);
      });
      // @ts-expect-error TS(2582): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
      test("INCREMENTAL_CHECK", async () => {
        await magicSurgeCheck.AutoSurgeCheck(1, "INCREMENTAL_CHECK");
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(mockIncrementalCheckCheck).toBeCalled();
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(mockIncrementalCheckCheck).toHaveBeenCalledTimes(1);
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(defaultMagicSurgeRollResultSpy).not.toBeCalled();
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(defaultMagicSurgeRollResultSpy).toHaveBeenCalledTimes(0);
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(mockSpellLevelTriggerCheck).not.toBeCalled();
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(mockSpellLevelTriggerCheck).toHaveBeenCalledTimes(0);
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(global.Hooks.callAll).toBeCalled();
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(global.Hooks.callAll).toHaveBeenCalledTimes(1);
      });
      // @ts-expect-error TS(2582): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
      test("INCREMENTAL_CHECK_CHAOTIC", async () => {
        await magicSurgeCheck.AutoSurgeCheck(1, "INCREMENTAL_CHECK_CHAOTIC");
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(mockIncrementalCheckCheck).toBeCalled();
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(mockIncrementalCheckCheck).toHaveBeenCalledTimes(1);
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(defaultMagicSurgeRollResultSpy).not.toBeCalled();
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(defaultMagicSurgeRollResultSpy).toHaveBeenCalledTimes(0);
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(mockSpellLevelTriggerCheck).not.toBeCalled();
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(mockSpellLevelTriggerCheck).toHaveBeenCalledTimes(0);
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(global.Hooks.callAll).toBeCalled();
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(global.Hooks.callAll).toHaveBeenCalledTimes(1);
      });
      // @ts-expect-error TS(2582): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
      test("SPELL_LEVEL_DEPENDENT_ROLL", async () => {
        await magicSurgeCheck.AutoSurgeCheck(1, "SPELL_LEVEL_DEPENDENT_ROLL");
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(defaultMagicSurgeRollResultSpy).not.toBeCalled();
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(defaultMagicSurgeRollResultSpy).toHaveBeenCalledTimes(0);
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(mockSpellLevelTriggerCheck).toBeCalled();
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(mockSpellLevelTriggerCheck).toHaveBeenCalledTimes(1);
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(global.Hooks.callAll).toBeCalled();
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(global.Hooks.callAll).toHaveBeenCalledTimes(1);
      });
      // @ts-expect-error TS(2582): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
      test("DIE_DESCENDING", async () => {
        await magicSurgeCheck.AutoSurgeCheck(1, "DIE_DESCENDING");
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(defaultMagicSurgeRollResultSpy).not.toBeCalled();
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(defaultMagicSurgeRollResultSpy).toHaveBeenCalledTimes(0);
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(mockDieDescendingCheck).toBeCalled();
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(mockDieDescendingCheck).toHaveBeenCalledTimes(1);
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(global.Hooks.callAll).toBeCalled();
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(global.Hooks.callAll).toHaveBeenCalledTimes(1);
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe("SurgeWildMagic", () => {
    let magicSurgeCheck: any;
    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(() => {
      // @ts-expect-error TS(2304): Cannot find name 'global'.
      global.game = {
        settings: {
          // @ts-expect-error TS(2304): Cannot find name 'jest'.
          get: jest.fn().mockReturnValue(true),
        },
      };
      // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
      magicSurgeCheck = new MagicSurgeCheck(actor);
    });
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it("It runs correctly on true", async () => {
      await magicSurgeCheck.SurgeWildMagic(true, { result: 1 });
      // @ts-expect-error TS(2304): Cannot find name 'expect'.
      expect(mockChatSend).toHaveBeenCalledTimes(1);
      // @ts-expect-error TS(2304): Cannot find name 'expect'.
      expect(mockTidesOfChaosCheck).toHaveBeenCalledTimes(1);
      // @ts-expect-error TS(2304): Cannot find name 'expect'.
      expect(mockRollTableMagicSurgeCheck).toHaveBeenCalledTimes(1);
      // @ts-expect-error TS(2304): Cannot find name 'expect'.
      expect(global.Hooks.callAll).toHaveBeenCalledTimes(1);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it("It runs correctly on false", async () => {
      await magicSurgeCheck.SurgeWildMagic(false, { result: 1 });
      // @ts-expect-error TS(2304): Cannot find name 'expect'.
      expect(mockChatSend).toHaveBeenCalledTimes(1);
      // @ts-expect-error TS(2304): Cannot find name 'expect'.
      expect(mockTidesOfChaosCheck).not.toHaveBeenCalled();
      // @ts-expect-error TS(2304): Cannot find name 'expect'.
      expect(mockRollTableMagicSurgeCheck).not.toHaveBeenCalled();
      // @ts-expect-error TS(2304): Cannot find name 'expect'.
      expect(global.Hooks.callAll).toHaveBeenCalledTimes(1);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe("SurgeTidesOfChaos", () => {
    let magicSurgeCheck: any;
    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(() => {
      // @ts-expect-error TS(2304): Cannot find name 'global'.
      global.game = {
        settings: {
          // @ts-expect-error TS(2304): Cannot find name 'jest'.
          get: jest.fn().mockReturnValue("Auto D20 Message"),
        },
      };
      // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
      magicSurgeCheck = new MagicSurgeCheck(actor);
    });
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it("It runs the correct functions", async () => {
      await magicSurgeCheck.SurgeTidesOfChaos();
      // @ts-expect-error TS(2304): Cannot find name 'expect'.
      expect(mockChatSend).toHaveBeenCalledTimes(1);
      // @ts-expect-error TS(2304): Cannot find name 'expect'.
      expect(mockTidesOfChaosCheck).toHaveBeenCalledTimes(1);
      // @ts-expect-error TS(2304): Cannot find name 'expect'.
      expect(mockRollTableMagicSurgeCheck).toHaveBeenCalledTimes(1);
      // @ts-expect-error TS(2304): Cannot find name 'expect'.
      expect(global.Hooks.callAll).toBeCalled();
      // @ts-expect-error TS(2304): Cannot find name 'expect'.
      expect(global.Hooks.callAll).toHaveBeenCalledTimes(1);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe("SplitRollResult", () => {
    let magicSurgeCheck: any;
    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(() => {
      // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
      magicSurgeCheck = new MagicSurgeCheck(actor);
    });
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it("It splits one value into an array", async () => {
      const result = await magicSurgeCheck.SplitRollResult("1");
      // @ts-expect-error TS(2304): Cannot find name 'expect'.
      expect(result).toStrictEqual(["1"]);
    });
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it("It splits more than one value into an array", async () => {
      const result = await magicSurgeCheck.SplitRollResult("1, 2, 3");
      // @ts-expect-error TS(2304): Cannot find name 'expect'.
      expect(result).toStrictEqual(["1", "2", "3"]);
    });
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it("It return an empty array if no value passed", async () => {
      const result = await magicSurgeCheck.SplitRollResult();
      // @ts-expect-error TS(2304): Cannot find name 'expect'.
      expect(result).toStrictEqual([]);
    });
  });
});
