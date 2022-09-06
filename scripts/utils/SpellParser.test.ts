import SpellParser from "./SpellParser";
import { actor } from "../../MockData/actor";
import { actorRage } from "../../MockData/actorRage";
import { actorNoWildMagic } from "../../MockData/actorNoWildMagic";
import { cantrip, eighthLevel, fifthLevel, firstLevel, fourthLevel, melee, ninthLevel, rage, secondLevel, seventhLevel, sixthLevel, sorcererSpecificSpell, tenthLevel, thirdLevel } from "../../MockData/items";
import "../../__mocks__/index";

describe("SpellParser", () => {
  describe("IsWildMagicFeat", () => {
    (global as any).Hooks = {
      callAll: jest.fn().mockReturnValue(true),
    };
    (global as any).game = {
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
      beforeEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
        (global as any).game = {
          settings: {
            get: jest.fn().mockReturnValue("Wild Magic Surge"),
          },
        };
      });

      it("should be true", () => {
        const result = SpellParser.IsWildMagicFeat(actor);

        expect(result).toBeTruthy();
      });
    });

    describe("Does not have Wild Magic Feat", () => {
      beforeEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
      });

      it("should be false", () => {
        const result = SpellParser.IsWildMagicFeat(actorNoWildMagic);

        expect(result).toBeFalsy();
      });
    });
  });

  describe("IsPathOfWildMagicFeat", () => {
    (global as any).Hooks = {
      callAll: jest.fn().mockReturnValue(true),
    };

    describe("Has Path of Wild Magic Feat", () => {
      beforeEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
        (global as any).game = {
          settings: {
            get: jest.fn().mockReturnValue("POWM"),
          },
        };
      });

      it("should be true", () => {
        const result = SpellParser.IsPathOfWildMagicFeat({
          items: [
            {
              name: "POWM",
              type: "subclass",
            },
          ],
        });

        expect(result).toBeTruthy();
      });
    });

    describe("Does not have Path of Wild Magic Feat", () => {
      beforeEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
      });

      it("should be false", () => {
        const result = SpellParser.IsPathOfWildMagicFeat({
          items: [
            {
              name: "WMS",
              type: "subclass",
            },
          ],
        });

        expect(result).toBeFalsy();
      });
    });
  });

  describe("SpellLevel", () => {
    (global as any).Hooks = {
      callAll: jest.fn().mockReturnValue(true),
    };

    describe("Has a level", () => {
      beforeEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
      });

      it("should be Level 1", () => {
        const result = SpellParser.SpellLevel(firstLevel);

        expect(result).toBe("1st Level");
      });
    });

    describe("No level present", () => {
      beforeEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
      });

      it("should be false", async () => {
        const result = SpellParser.SpellLevel(melee);

        expect(result).toBe("");
      });
    });
  });

  describe("IsSpell", () => {
    (global as any).Hooks = {
      callAll: jest.fn().mockReturnValue(true),
    };

    describe("Has a level", () => {
      beforeEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
      });

      it("should be true", () => {
        const result = SpellParser.IsSpell(firstLevel);

        expect(result).toBeTruthy();
      });
    });

    describe("No level present", () => {
      beforeEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
      });

      it("should be false", async () => {
        const result = SpellParser.IsSpell(melee);

        expect(result).toBeFalsy();
      });
    });
  });

  describe("SpellDetails", () => {
    describe("Is a Cantrip and cantrip surge is disabled", () => {
      beforeEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
        (global as any).game = {
          settings: {
            get: jest.fn().mockReturnValueOnce(false),
          },
        };
      });

      it("should be 1st Level if in description", async () => {
        const result = SpellParser.SpellDetails(cantrip);

        expect(result).toBeUndefined();
      });
    });

    describe("Is a Cantrip and cantrip surge is enabled", () => {
      beforeEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
        (global as any).game = {
          settings: {
            get: jest.fn().mockReturnValueOnce(true),
          },
        };
      });

      it("should be a cantrip", async () => {
        const result = SpellParser.SpellDetails(cantrip);

        expect(result).toBe("Cantrip");
      });
    });

    describe("Is a Level 1 Spell", () => {
      beforeEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
        (global as any).game = {
          settings: {
            get: jest.fn().mockReturnValueOnce(false),
          },
        };
      });

      it("should be undefined if spell level is 0", async () => {
        const result = SpellParser.SpellDetails(cantrip);

        expect(result).toBeUndefined();
      });

      it("should be 1st Level", async () => {
        const result = SpellParser.SpellDetails(firstLevel);

        expect(result).toBe("1st Level");
      });

      it("should be 2nd Level", async () => {
        const result = SpellParser.SpellDetails(secondLevel);

        expect(result).toBe("2nd Level");
      });

      it("should be 3rd Level", async () => {
        const result = SpellParser.SpellDetails(thirdLevel);

        expect(result).toBe("3rd Level");
      });

      it("should be 4th Level", async () => {
        const result = SpellParser.SpellDetails(fourthLevel);

        expect(result).toBe("4th Level");
      });

      it("should be 5th Level", async () => {
        const result = SpellParser.SpellDetails(fifthLevel);

        expect(result).toBe("5th Level");
      });

      it("should be 6th Level", async () => {
        const result = SpellParser.SpellDetails(sixthLevel);

        expect(result).toBe("6th Level");
      });

      it("should be 7th Level", async () => {
        const result = SpellParser.SpellDetails(seventhLevel);

        expect(result).toBe("7th Level");
      });

      it("should be 8th Level", async () => {
        const result = SpellParser.SpellDetails(eighthLevel);

        expect(result).toBe("8th Level");
      });

      it("should be 9th Level", async () => {
        const result = SpellParser.SpellDetails(ninthLevel);

        expect(result).toBe("9th Level");
      });

      it("should be undefined if not less than 10", async () => {
        const result = SpellParser.SpellDetails(tenthLevel);

        expect(result).toBeUndefined();
      });
    });
  });

  describe("IsSorcererSpell", () => {
    beforeEach(() => {
      (global as any).Hooks = {
        callAll: jest.fn().mockReturnValue(true),
      };
      (global as any).game = {
        settings: {
          get: jest.fn().mockReturnValue("\\(S\\)"),
        },
      };
    });

    describe("Is a Sorcerer Spell", () => {
      it("should be true", async () => {
        const result = SpellParser.IsSorcererSpell(sorcererSpecificSpell);

        expect(result).toBeTruthy();
      });
    });

    describe("Is not a Sorcerer Spell", () => {
      it("should be false", async () => {
        const result = SpellParser.IsSorcererSpell(firstLevel);

        expect(result).toBeFalsy();
      });
    });
  });

  describe("IsRage", () => {
    (global as any).Hooks = {
      callAll: jest.fn().mockReturnValue(true),
    };

    describe("Is Rage", () => {
      beforeEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
      });

      it("should be true", async () => {
        const result = SpellParser.IsRage(rage);

        expect(result).toBeTruthy();
      });
    });

    describe("Is not Rage", () => {
      beforeEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
      });

      it("should be false", async () => {
        const result = SpellParser.IsRage(melee);

        expect(result).toBeFalsy();
      });
    });
  });

  describe("IsNPC", () => {
    (global as any).Hooks = {
      callAll: jest.fn().mockReturnValue(true),
    };

    describe("Is set to be a NPC", () => {
      beforeEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
      });

      it("should be true", () => {
        const result = SpellParser.IsNPC({
          type: "npc",
        });

        expect(result).toBeTruthy();
      });
    });

    describe("Is not a NPC", () => {
      beforeEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
      });

      it("should be false", () => {
        const result = SpellParser.IsNPC({
          type: "pc",
        });

        expect(result).toBeFalsy();
      });
    });

    describe("Is not a valid Actor", () => {
      beforeEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
      });

      it("should be false", () => {
        const result = SpellParser.IsNPC(undefined);

        expect(result).toBeFalsy();
      });
    });
  });
});
