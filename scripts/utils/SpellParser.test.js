import SpellParser from "./SpellParser.js";
import { actor } from "../../MockData/actor.js";
import { actorNoWildMagic } from "../../MockData/actorNoWildMagic.js";
import "../../__mocks__/index.js";

describe("SpellParser", () => {
  describe("IsWildMagicFeat", () => {
    global.Hooks = {
      callAll: jest.fn().mockReturnValue(true),
    };
    global.game = {
      settings: {
        get: jest.fn().mockReturnValueOnce("= 4"),
      },
      tables: [
        {
          name: "Wild Magic Surge",
          roll: jest.fn().mockResolvedValue(true),
          results: jest.fn().mockResolvedValue([]),
        },
      ],
    };
    describe("Has Wild Magic Feat", () => {
      let spellParser;
      beforeEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
        spellParser = new SpellParser();
        global.game = {
          settings: {
            get: jest.fn().mockReturnValue("Wild Magic Surge"),
          },
        };
      });

      it("should be true", () => {
        const result = spellParser.IsWildMagicFeat(actor);
        expect(result).toBeTruthy();
      });
    });

    describe("Does not have Wild Magic Feat", () => {
      let spellParser;
      beforeEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
        spellParser = new SpellParser();
      });

      it("should be false", () => {
        const result = spellParser.IsWildMagicFeat(actorNoWildMagic);
        expect(result).toBeFalsy();
      });
    });
  });

  describe("SpellLevel", () => {
    global.Hooks = {
      callAll: jest.fn().mockReturnValue(true),
    };
    describe("Has a level", () => {
      let spellParser;
      beforeEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
        spellParser = new SpellParser();
      });

      it("should be true", () => {
        const result = spellParser.SpellLevel("1st Level");
        expect(result).toBeTruthy();
      });
    });

    describe("No level present", () => {
      let spellParser;
      beforeEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
        spellParser = new SpellParser();
      });

      it("should be false", async () => {
        const result = await spellParser.SpellLevel("Big Sword");
        expect(result).toBeFalsy();
      });
    });
  });

  describe("IsSpell", () => {
    global.Hooks = {
      callAll: jest.fn().mockReturnValue(true),
    };
    describe("Has a level", () => {
      let spellParser;
      beforeEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
        spellParser = new SpellParser();
      });

      it("should be true", () => {
        const result = spellParser.IsSpell("1st Level");
        expect(result).toBeTruthy();
      });
    });

    describe("No level present", () => {
      let spellParser;
      beforeEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
        spellParser = new SpellParser();
      });

      it("should be false", async () => {
        const result = await spellParser.IsSpell("Big Sword");
        expect(result).toBeFalsy();
      });
    });
  });

  describe("IsNPC", () => {
    global.Hooks = {
      callAll: jest.fn().mockReturnValue(true),
    };
    describe("Is set to be a NPC", () => {
      let spellParser;
      beforeEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
        spellParser = new SpellParser();
      });

      it("should be true", () => {
        const result = spellParser.IsNPC({
          data: {
            type: "npc",
          },
        });
        expect(result).toBeTruthy();
      });
    });

    describe("Is not a NPC", () => {
      let spellParser;
      beforeEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
        spellParser = new SpellParser();
      });

      it("should be false", () => {
        const result = spellParser.IsNPC({
          data: {
            type: "pc",
          },
        });
        expect(result).toBeFalsy();
      });
    });
  });
});
