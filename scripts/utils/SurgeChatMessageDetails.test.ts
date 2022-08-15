import SurgeChatMessageDetails from "./SurgeChatMessageDetails";
import SpellParser from "./SpellParser";
import { actor } from "../../MockData/actor";
import { chatMessage } from "../../MockData/chatMessage";
import "../../__mocks__/index";

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
const mockSpellParserIsNPC = jest.spyOn(SpellParser, "IsNPC");
const mockSpellParserIsWildMagicFeat = jest.spyOn(
  SpellParser,
  "IsWildMagicFeat"
);

beforeEach(() => {
  mockSpellParserIsPathOfWildMagicFeat.mockClear();
  mockSpellParserIsSorcererSpell.mockClear();
  mockSpellParserSpellLevel.mockClear();
  mockSpellParserIsRage.mockClear();
  mockSpellParserIsSpell.mockClear();
  mockSpellParserIsNPC.mockClear();
  mockSpellParserIsWildMagicFeat.mockClear();
});

describe("SurgeChatMessageDetails", () => {
  describe("User on Message is not valid", () => {
    describe("If whisper to GM is true but the message is not a GM", () => {
      beforeEach(() => {
        (global as any).game = {
          settings: {
            get: jest.fn().mockReturnValueOnce(true),
          },
        };
      });
      it("should be false", () => {
        const surgeChatMessageDetails = new SurgeChatMessageDetails(
          chatMessage,
          actor,
          "1",
          false
        );

        expect(surgeChatMessageDetails.valid).toBeFalsy();
        expect(surgeChatMessageDetails.isUserOnMessageValid).toBeFalsy();
      });
    });

    describe("If whisper to GM is false but the message is a GM", () => {
      beforeEach(() => {
        (global as any).game = {
          settings: {
            get: jest.fn().mockReturnValueOnce(false),
          },
        };
      });
      it("should be false", () => {
        const surgeChatMessageDetails = new SurgeChatMessageDetails(
          chatMessage,
          actor,
          "1",
          true
        );

        expect(surgeChatMessageDetails.valid).toBeFalsy();
        expect(surgeChatMessageDetails.isUserOnMessageValid).toBeFalsy();
      });
    });
  });

  describe("User on Message is valid", () => {
    describe("If whisper to GM is true and the message is a GM", () => {
      beforeEach(() => {
        (global as any).game = {
          settings: {
            get: jest.fn().mockReturnValueOnce(true),
          },
        };
      });
      it("should be true", () => {
        const surgeChatMessageDetails = new SurgeChatMessageDetails(
          chatMessage,
          actor,
          "1",
          true
        );

        expect(surgeChatMessageDetails.isUserOnMessageValid).toBeTruthy();
      });
    });

    describe("If whisper to GM is false and the message is the player who rolled", () => {
      beforeEach(() => {
        (global as any).game = {
          settings: {
            get: jest.fn().mockReturnValueOnce(false),
          },
        };
      });
      it("should be true", () => {
        const surgeChatMessageDetails = new SurgeChatMessageDetails(
          chatMessage,
          actor,
          "123",
          true
        );

        expect(surgeChatMessageDetails.isUserOnMessageValid).toBeTruthy();
      });
    });
  });

  describe("Has Path of Wild Magic Feat", () => {
    describe("And is Raging", () => {
      beforeEach(() => {
        (global as any).game = {
          settings: {
            get: jest.fn().mockReturnValueOnce(true),
          },
        };

        mockSpellParserIsPathOfWildMagicFeat.mockReturnValue(true);
        mockSpellParserIsRage.mockReturnValue(true);
      });
      it("should be true", () => {
        const surgeChatMessageDetails = new SurgeChatMessageDetails(
          chatMessage,
          actor,
          "1",
          true
        );

        expect(surgeChatMessageDetails.hasPathOfWildMagicFeat).toBeTruthy();
        expect(surgeChatMessageDetails.valid).toBeTruthy();
      });
    });
    describe("And is not Raging", () => {
      beforeEach(() => {
        (global as any).game = {
          settings: {
            get: jest.fn().mockReturnValueOnce(true),
          },
        };

        mockSpellParserIsPathOfWildMagicFeat.mockReturnValue(true);
        mockSpellParserIsRage.mockReturnValue(false);
      });
      it("should be true", () => {
        const surgeChatMessageDetails = new SurgeChatMessageDetails(
          chatMessage,
          actor,
          "1",
          true
        );

        expect(surgeChatMessageDetails.hasPathOfWildMagicFeat).toBeTruthy();
        expect(surgeChatMessageDetails.valid).toBeFalsy();
      });
    });
  });

  describe("Custom Sorcerer Spell Regex", () => {
    describe("And is not enabled in settings", () => {
      beforeEach(() => {
        (global as any).game = {
          settings: {
            get: jest.fn().mockReturnValueOnce(true).mockReturnValueOnce(false),
          },
        };

        mockSpellParserIsPathOfWildMagicFeat.mockReturnValue(false);
      });
      it("should be undefined", () => {
        const surgeChatMessageDetails = new SurgeChatMessageDetails(
          chatMessage,
          actor,
          "1",
          true
        );

        expect(
          surgeChatMessageDetails.isSorcererSpellRegexMatch
        ).toBeUndefined();
      });
    });
    describe("And is enabled and matches", () => {
      beforeEach(() => {
        (global as any).game = {
          settings: {
            get: jest.fn().mockReturnValue(true),
          },
        };

        mockSpellParserIsSorcererSpell.mockReturnValue(true);
      });
      it("should be true", () => {
        const surgeChatMessageDetails = new SurgeChatMessageDetails(
          chatMessage,
          actor,
          "1",
          true
        );

        expect(surgeChatMessageDetails.isSorcererSpellRegexMatch).toBeTruthy();
        expect(surgeChatMessageDetails.valid).toBeTruthy();
      });
    });
    describe("And is enabled and does not match", () => {
      beforeEach(() => {
        (global as any).game = {
          settings: {
            get: jest.fn().mockReturnValue(true),
          },
        };

        mockSpellParserIsSorcererSpell.mockReturnValue(false);
      });
      it("should be false", () => {
        const surgeChatMessageDetails = new SurgeChatMessageDetails(
          chatMessage,
          actor,
          "1",
          true
        );

        expect(surgeChatMessageDetails.isSorcererSpellRegexMatch).toBeFalsy();
        expect(surgeChatMessageDetails.valid).toBeFalsy();
      });
    });
  });

  describe("NPCs are not enabled", () => {
    describe("And it is a valid spell and the actor has the Wild Magic Feat", () => {
      beforeEach(() => {
        (global as any).game = {
          settings: {
            get: jest
              .fn()
              .mockReturnValueOnce(true)
              .mockReturnValueOnce(false)
              .mockReturnValueOnce(false),
          },
        };

        mockSpellParserIsSpell.mockReturnValue(true);
        mockSpellParserIsWildMagicFeat.mockReturnValue(true);
        mockSpellParserIsNPC.mockReturnValue(false);
      });
      it("should be valid", () => {
        const surgeChatMessageDetails = new SurgeChatMessageDetails(
          chatMessage,
          actor,
          "1",
          true
        );

        expect(surgeChatMessageDetails.valid).toBeTruthy();
      });
    });
    describe("And it is a valid spell and the actor has the Wild Magic Feat but is an NPC", () => {
      beforeEach(() => {
        (global as any).game = {
          settings: {
            get: jest
              .fn()
              .mockReturnValueOnce(true)
              .mockReturnValueOnce(false)
              .mockReturnValueOnce(false),
          },
        };

        mockSpellParserIsSpell.mockReturnValue(true);
        mockSpellParserIsWildMagicFeat.mockReturnValue(true);
        mockSpellParserIsNPC.mockReturnValue(true);
      });
      it("should not be valid", () => {
        const surgeChatMessageDetails = new SurgeChatMessageDetails(
          chatMessage,
          actor,
          "1",
          true
        );

        expect(surgeChatMessageDetails.valid).toBeFalsy();
      });
    });
    describe("And it is not a valid spell and the actor has the Wild Magic Feat", () => {
      beforeEach(() => {
        (global as any).game = {
          settings: {
            get: jest
              .fn()
              .mockReturnValueOnce(true)
              .mockReturnValueOnce(false)
              .mockReturnValueOnce(false),
          },
        };

        mockSpellParserIsSpell.mockReturnValue(false);
        mockSpellParserIsWildMagicFeat.mockReturnValue(true);
        mockSpellParserIsNPC.mockReturnValue(false);
      });
      it("should not be valid", () => {
        const surgeChatMessageDetails = new SurgeChatMessageDetails(
          chatMessage,
          actor,
          "1",
          true
        );

        expect(surgeChatMessageDetails.valid).toBeFalsy();
      });
    });
    describe("And it is a valid spell but the actor does not have the Wild Magic Feat", () => {
      beforeEach(() => {
        (global as any).game = {
          settings: {
            get: jest
              .fn()
              .mockReturnValueOnce(true)
              .mockReturnValueOnce(false)
              .mockReturnValueOnce(false),
          },
        };

        mockSpellParserIsSpell.mockReturnValue(true);
        mockSpellParserIsWildMagicFeat.mockReturnValue(false);
        mockSpellParserIsNPC.mockReturnValue(false);
      });
      it("should not be valid", () => {
        const surgeChatMessageDetails = new SurgeChatMessageDetails(
          chatMessage,
          actor,
          "1",
          true
        );

        expect(surgeChatMessageDetails.valid).toBeFalsy();
      });
    });
  });

  describe("NPCs are enabled", () => {
    describe("And it is a valid spell and the actor has the Wild Magic Feat", () => {
      beforeEach(() => {
        (global as any).game = {
          settings: {
            get: jest
              .fn()
              .mockReturnValueOnce(true)
              .mockReturnValueOnce(false)
              .mockReturnValueOnce(true),
          },
        };

        mockSpellParserIsSpell.mockReturnValue(true);
        mockSpellParserIsWildMagicFeat.mockReturnValue(true);
        mockSpellParserIsNPC.mockReturnValue(true);
      });
      it("should be valid", () => {
        const surgeChatMessageDetails = new SurgeChatMessageDetails(
          chatMessage,
          actor,
          "1",
          true
        );

        expect(surgeChatMessageDetails.valid).toBeTruthy();
      });
    });
  });
});
