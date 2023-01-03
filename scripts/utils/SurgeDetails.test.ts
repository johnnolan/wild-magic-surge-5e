import SurgeDetails from "./SurgeDetails";
import SpellParser from "./SpellParser";
import { actor } from "../../MockData/actor";
import "../../__mocks__/index";
import { firstLevel } from "../../MockData/items";
import { actorNoWildMagic } from "../../MockData/actorNoWildMagic";

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

describe("SurgeDetails", () => {

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
        const surgeChatMessageDetails = new SurgeDetails(actor, firstLevel);

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
        const surgeChatMessageDetails = new SurgeDetails(actor, firstLevel);

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
        const surgeChatMessageDetails = new SurgeDetails(actorNoWildMagic, firstLevel);

        expect(
          surgeChatMessageDetails.isSorcererSpellRegexMatch
        ).toBeUndefined();
      });
    });
    describe("And is enabled and matches", () => {
      beforeEach(() => {
        (global as any).game = {
          settings: {
            get: jest.fn().mockReturnValueOnce("Wild Magic Surge")
            .mockReturnValue(true),
          },
        };

        mockSpellParserIsSorcererSpell.mockReturnValue(true);
      });
      it("should be true", () => {
        const surgeChatMessageDetails = new SurgeDetails(actor, firstLevel);

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
        const surgeChatMessageDetails = new SurgeDetails(actor, firstLevel);

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
              .mockReturnValueOnce(false)
              .mockReturnValueOnce(true),
          },
        };

        mockSpellParserIsSpell.mockReturnValue(true);
        mockSpellParserIsWildMagicFeat.mockReturnValue(true);
        mockSpellParserIsNPC.mockReturnValue(false);
      });
      it("should be valid", () => {
        const surgeChatMessageDetails = new SurgeDetails(actor, firstLevel);

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
        const surgeChatMessageDetails = new SurgeDetails(actor, firstLevel);

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
        const surgeChatMessageDetails = new SurgeDetails(actor, firstLevel);

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
        const surgeChatMessageDetails = new SurgeDetails(actor, firstLevel);

        expect(surgeChatMessageDetails.valid).toBeFalsy();
      });
    });
  });
});
