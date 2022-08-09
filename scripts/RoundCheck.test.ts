import RoundCheck from "./RoundCheck.js";
import IncrementalCheck from "./utils/IncrementalCheck.js";
import SpellParser from "./utils/SpellParser.js";
import Chat from "./Chat.js";
import { actor } from "../MockData/actor.js";
import "../__mocks__/index.js";

const mockIncrementalCheckCheck = jest.fn();

jest.mock("./utils/IncrementalCheck.js", () => {
  return jest.fn().mockImplementation(() => {
    return {
      Check: mockIncrementalCheckCheck,
    };
  });
});

const mockChatRunMessageCheck = jest.fn();

jest.mock("./Chat.js", () => {
  return jest.fn().mockImplementation(() => {
    return {
      RunMessageCheck: mockChatRunMessageCheck,
    };
  });
});

const mockSpellParserIsWildMagicFeat = jest.fn();

const mockSpellParserIsNPC = jest.fn();

jest.mock("./utils/SpellParser.js", () => {
  return jest.fn().mockImplementation(() => {
    return {
      IsWildMagicFeat: mockSpellParserIsWildMagicFeat,
      IsNPC: mockSpellParserIsNPC,
    };
  });
});

beforeEach(() => {
  mockChatRunMessageCheck.mockClear();
  mockSpellParserIsWildMagicFeat.mockClear();
  mockSpellParserIsNPC.mockClear();
  mockIncrementalCheckCheck.mockClear();
  (Chat as any).mockClear();
  (SpellParser as any).mockClear();
  (IncrementalCheck as any).mockClear();
});

describe("RoundCheck", () => {
  describe("Check", () => {
    describe("Given Auto D20 setting is false", () => {
      let roundCheck: any;

      beforeEach(() => {
        (global as any).game = {
    settings: {
        get: jest.fn().mockReturnValueOnce(false),
    },
};
        roundCheck = new RoundCheck(actor);
      });

      it("It should call RunMessageCheck", async () => {
        await roundCheck.Check();

        expect(mockChatRunMessageCheck).toHaveBeenCalledTimes(1);
      });
    });

    describe("Given Auto D20 setting is true and IsWildMagicFeat is false", () => {
      let roundCheck: any;

      beforeEach(() => {
        (global as any).game = {
    settings: {
        get: jest.fn().mockReturnValueOnce(true).mockReturnValueOnce(true),
    },
};
        roundCheck = new RoundCheck(actor);
        mockSpellParserIsWildMagicFeat.mockReturnValueOnce(false);
      });

      it("It should not call anything", async () => {
        await roundCheck.Check();

        expect(mockChatRunMessageCheck).not.toHaveBeenCalled();

        expect(mockIncrementalCheckCheck).not.toHaveBeenCalled();
      });
    });

    describe("Given Auto D20 setting and enable npcs is true", () => {
      beforeEach(() => {
        (global as any).game = {
    settings: {
        get: jest.fn().mockReturnValueOnce(true).mockReturnValueOnce(true),
    },
};
      });

      describe("Given IsWildMagicFeat is true", () => {
        let roundCheck: any;

        beforeEach(() => {
          roundCheck = new RoundCheck(actor);
          mockSpellParserIsWildMagicFeat.mockReturnValueOnce(true);
        });

        it("It should call correctly", async () => {
          await roundCheck.Check();

          expect(mockChatRunMessageCheck).not.toHaveBeenCalled();

          expect(mockIncrementalCheckCheck).toHaveBeenCalledTimes(1);
        });
      });
    });

    describe("Given Auto D20 setting and enable npcs is false", () => {
      beforeEach(() => {
        (global as any).game = {
    settings: {
        get: jest.fn().mockReturnValueOnce(true).mockReturnValueOnce(false),
    },
};
      });

      describe("Given IsWildMagicFeat is true and not IsNPC", () => {
        let roundCheck: any;

        beforeEach(() => {
          roundCheck = new RoundCheck(actor);
          mockSpellParserIsWildMagicFeat.mockReturnValueOnce(true);
          mockSpellParserIsNPC.mockReturnValueOnce(true);
        });

        it("It should call correctly", async () => {
          await roundCheck.Check();

          expect(mockChatRunMessageCheck).not.toHaveBeenCalled();

          expect(mockIncrementalCheckCheck).not.toHaveBeenCalled();

          expect(mockSpellParserIsNPC).toHaveBeenCalledTimes(1);
        });
      });

      describe("Given IsWildMagicFeat is true and  IsNPC", () => {
        let roundCheck: any;

        beforeEach(() => {
          roundCheck = new RoundCheck(actor);
          mockSpellParserIsWildMagicFeat.mockReturnValueOnce(true);
          mockSpellParserIsNPC.mockReturnValueOnce(false);
        });

        it("It should call correctly", async () => {
          await roundCheck.Check();

          expect(mockChatRunMessageCheck).not.toHaveBeenCalled();

          expect(mockIncrementalCheckCheck).toHaveBeenCalledTimes(1);

          expect(mockSpellParserIsNPC).toHaveBeenCalledTimes(1);
        });
      });
    });
  });
});
