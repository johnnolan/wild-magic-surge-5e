import RoundCheck from "./RoundCheck.js";
import IncrementalCheck from "./utils/IncrementalCheck.js";
import SpellParser from "./utils/SpellParser.js";
import Chat from "./Chat.js";
// @ts-expect-error TS(7016): Could not find a declaration file for module '../M... Remove this comment to see the full error message
import { actor } from "../MockData/actor.js";
import "../__mocks__/index.js";

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
const mockChatRunMessageCheck = jest.fn();
// @ts-expect-error TS(2304): Cannot find name 'jest'.
jest.mock("./Chat.js", () => {
  // @ts-expect-error TS(2304): Cannot find name 'jest'.
  return jest.fn().mockImplementation(() => {
    return {
      RunMessageCheck: mockChatRunMessageCheck,
    };
  });
});

// @ts-expect-error TS(2304): Cannot find name 'jest'.
const mockSpellParserIsWildMagicFeat = jest.fn();
// @ts-expect-error TS(2304): Cannot find name 'jest'.
const mockSpellParserIsNPC = jest.fn();
// @ts-expect-error TS(2304): Cannot find name 'jest'.
jest.mock("./utils/SpellParser.js", () => {
  // @ts-expect-error TS(2304): Cannot find name 'jest'.
  return jest.fn().mockImplementation(() => {
    return {
      IsWildMagicFeat: mockSpellParserIsWildMagicFeat,
      IsNPC: mockSpellParserIsNPC,
    };
  });
});

// @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
beforeEach(() => {
  mockChatRunMessageCheck.mockClear();
  mockSpellParserIsWildMagicFeat.mockClear();
  mockSpellParserIsNPC.mockClear();
  mockIncrementalCheckCheck.mockClear();
  (Chat as any).mockClear();
  (SpellParser as any).mockClear();
  (IncrementalCheck as any).mockClear();
});

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe("RoundCheck", () => {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe("Check", () => {
    // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe("Given Auto D20 setting is false", () => {
      let roundCheck: any;
      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(() => {
        // @ts-expect-error TS(2304): Cannot find name 'global'.
        global.game = {
          settings: {
            // @ts-expect-error TS(2304): Cannot find name 'jest'.
            get: jest.fn().mockReturnValueOnce(false),
          },
        };
        roundCheck = new RoundCheck(actor);
      });
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it("It should call RunMessageCheck", async () => {
        await roundCheck.Check();
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(mockChatRunMessageCheck).toHaveBeenCalledTimes(1);
      });
    });

    // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe("Given Auto D20 setting is true and IsWildMagicFeat is false", () => {
      let roundCheck: any;
      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(() => {
        // @ts-expect-error TS(2304): Cannot find name 'global'.
        global.game = {
          settings: {
            // @ts-expect-error TS(2304): Cannot find name 'jest'.
            get: jest.fn().mockReturnValueOnce(true).mockReturnValueOnce(true),
          },
        };
        roundCheck = new RoundCheck(actor);
        mockSpellParserIsWildMagicFeat.mockReturnValueOnce(false);
      });
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it("It should not call anything", async () => {
        await roundCheck.Check();
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(mockChatRunMessageCheck).not.toHaveBeenCalled();
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(mockIncrementalCheckCheck).not.toHaveBeenCalled();
      });
    });

    // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe("Given Auto D20 setting and enable npcs is true", () => {
      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(() => {
        // @ts-expect-error TS(2304): Cannot find name 'global'.
        global.game = {
          settings: {
            // @ts-expect-error TS(2304): Cannot find name 'jest'.
            get: jest.fn().mockReturnValueOnce(true).mockReturnValueOnce(true),
          },
        };
      });
      // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
      describe("Given IsWildMagicFeat is true", () => {
        let roundCheck: any;
        // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
        beforeEach(() => {
          roundCheck = new RoundCheck(actor);
          mockSpellParserIsWildMagicFeat.mockReturnValueOnce(true);
        });
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it("It should call correctly", async () => {
          await roundCheck.Check();
          // @ts-expect-error TS(2304): Cannot find name 'expect'.
          expect(mockChatRunMessageCheck).not.toHaveBeenCalled();
          // @ts-expect-error TS(2304): Cannot find name 'expect'.
          expect(mockIncrementalCheckCheck).toHaveBeenCalledTimes(1);
        });
      });
    });

    // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe("Given Auto D20 setting and enable npcs is false", () => {
      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(() => {
        // @ts-expect-error TS(2304): Cannot find name 'global'.
        global.game = {
          settings: {
            // @ts-expect-error TS(2304): Cannot find name 'jest'.
            get: jest.fn().mockReturnValueOnce(true).mockReturnValueOnce(false),
          },
        };
      });
      // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
      describe("Given IsWildMagicFeat is true and not IsNPC", () => {
        let roundCheck: any;
        // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
        beforeEach(() => {
          roundCheck = new RoundCheck(actor);
          mockSpellParserIsWildMagicFeat.mockReturnValueOnce(true);
          mockSpellParserIsNPC.mockReturnValueOnce(true);
        });
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it("It should call correctly", async () => {
          await roundCheck.Check();
          // @ts-expect-error TS(2304): Cannot find name 'expect'.
          expect(mockChatRunMessageCheck).not.toHaveBeenCalled();
          // @ts-expect-error TS(2304): Cannot find name 'expect'.
          expect(mockIncrementalCheckCheck).not.toHaveBeenCalled();
          // @ts-expect-error TS(2304): Cannot find name 'expect'.
          expect(mockSpellParserIsNPC).toHaveBeenCalledTimes(1);
        });
      });
      // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
      describe("Given IsWildMagicFeat is true and  IsNPC", () => {
        let roundCheck: any;
        // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
        beforeEach(() => {
          roundCheck = new RoundCheck(actor);
          mockSpellParserIsWildMagicFeat.mockReturnValueOnce(true);
          mockSpellParserIsNPC.mockReturnValueOnce(false);
        });
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it("It should call correctly", async () => {
          await roundCheck.Check();
          // @ts-expect-error TS(2304): Cannot find name 'expect'.
          expect(mockChatRunMessageCheck).not.toHaveBeenCalled();
          // @ts-expect-error TS(2304): Cannot find name 'expect'.
          expect(mockIncrementalCheckCheck).toHaveBeenCalledTimes(1);
          // @ts-expect-error TS(2304): Cannot find name 'expect'.
          expect(mockSpellParserIsNPC).toHaveBeenCalledTimes(1);
        });
      });
    });
  });
});
