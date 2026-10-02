import RoundCheck from "./RoundCheck";
import SpellParser from "./utils/SpellParser";
import IncrementalCheck from "./utils/IncrementalCheck";
import Chat from "./Chat";
import { actor } from "../MockData/actor";
import "../__mocks__/index";

const mockIncrementalCheckCheck = jest.fn();
IncrementalCheck.Check = mockIncrementalCheckCheck;

const mockChatRunMessageCheck = jest.fn();
Chat.RunMessageCheck = mockChatRunMessageCheck;

const mockSpellParserIsNPC = jest.spyOn(
  SpellParser,
  "IsNPC"
);

const mockSpellParserIsWildMagicFeat = jest.spyOn(
  SpellParser,
  "IsWildMagicFeat"
);

beforeEach(() => {
  mockChatRunMessageCheck.mockClear();
  mockSpellParserIsWildMagicFeat.mockClear();
  mockSpellParserIsNPC.mockClear();
  mockIncrementalCheckCheck.mockClear();
});

describe("RoundCheck", () => {
  describe("Check", () => {
    describe("Given Auto D20 setting is false", () => {
      beforeEach(() => {
        (global as any).game = {
          settings: {
            get: jest.fn().mockReturnValueOnce(false),
          },
        };
      });

      it("It should call RunMessageCheck", async () => {
        await RoundCheck.Check(actor);

        expect(mockChatRunMessageCheck).toHaveBeenCalledTimes(1);
      });
    });

    describe("Given Auto D20 setting is true and IsWildMagicFeat is false", () => {
      beforeEach(() => {
        (global as any).game = {
          settings: {
            get: jest.fn().mockReturnValueOnce(true).mockReturnValueOnce(true),
          },
        };
        mockSpellParserIsWildMagicFeat.mockReturnValueOnce(false);
      });

      it("It should not call anything", async () => {
        await RoundCheck.Check(actor);

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

        beforeEach(() => {
          mockSpellParserIsWildMagicFeat.mockReturnValueOnce(true);
        });

        it("It should call correctly", async () => {
          await RoundCheck.Check(actor);

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
        beforeEach(() => {
          mockSpellParserIsWildMagicFeat.mockReturnValueOnce(true);
          mockSpellParserIsNPC.mockReturnValueOnce(true);
        });

        it("It should call correctly", async () => {
          await RoundCheck.Check(actor);

          expect(mockChatRunMessageCheck).not.toHaveBeenCalled();

          expect(mockIncrementalCheckCheck).not.toHaveBeenCalled();

          expect(mockSpellParserIsNPC).toHaveBeenCalledTimes(1);
        });
      });

      describe("Given IsWildMagicFeat is true and  IsNPC", () => {
        beforeEach(() => {
          mockSpellParserIsWildMagicFeat.mockReturnValueOnce(true);
          mockSpellParserIsNPC.mockReturnValueOnce(false);
        });

        it("It should call correctly", async () => {
          await RoundCheck.Check(actor);

          expect(mockChatRunMessageCheck).not.toHaveBeenCalled();

          expect(mockIncrementalCheckCheck).toHaveBeenCalledTimes(1);

          expect(mockSpellParserIsNPC).toHaveBeenCalledTimes(1);
        });
      });
    });
  });
});

describe("RoundCheck.OnCombatUpdate", () => {
  const mockRoundCheck = jest.spyOn(RoundCheck, "Check");

  beforeEach(() => {
    (global as any).game = {
      settings: {
        get: jest.fn().mockReturnValue("INCREMENTAL_CHECK_CHAOTIC"),
      },
    };
    mockRoundCheck.mockClear();
    mockRoundCheck.mockResolvedValue();
  });

  afterAll(() => {
    mockRoundCheck.mockRestore();
  });

  it("does not check when combat has no current combatant", async () => {
    const combat = { combatant: undefined } as unknown as Combat;

    await expect(RoundCheck.OnCombatUpdate(combat)).resolves.toBe(false);
    expect(mockRoundCheck).not.toHaveBeenCalled();
  });

  it("does not check when the current combatant has no actor", async () => {
    const combat = { combatant: { actor: undefined } } as unknown as Combat;

    await expect(RoundCheck.OnCombatUpdate(combat)).resolves.toBe(false);
    expect(mockRoundCheck).not.toHaveBeenCalled();
  });

  it("checks the actor on the current combatant", async () => {
    const combat = { combatant: { actor } } as unknown as Combat;

    await RoundCheck.OnCombatUpdate(combat);

    expect(mockRoundCheck).toHaveBeenCalledTimes(1);
    expect(mockRoundCheck).toHaveBeenCalledWith(actor);
  });
});
