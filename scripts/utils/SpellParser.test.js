import SpellParser from "./SpellParser.js";
import { actor } from "../../MockData/actor.js";
import { actorNoWildMagic } from "../../MockData/actorNoWildMagic.js";

describe("IsWildMagicFeat", () => {
  describe("Has Wild Magic Feat", () => {
    let spellParser;
    beforeEach(() => {
      jest.clearAllMocks();
      jest.resetAllMocks();
      spellParser = new SpellParser();
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
