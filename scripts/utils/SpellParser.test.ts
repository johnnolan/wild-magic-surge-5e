import SpellParser from "./SpellParser";
import { actor } from "../../MockData/actor";
import { actorRage } from "../../MockData/actorRage";
import { actorNoWildMagic } from "../../MockData/actorNoWildMagic";
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

      it("should be true", () => {
        const result = SpellParser.SpellLevel("1st Level", actor);

        expect(result).toBeTruthy();
      });
    });

    describe("No level present", () => {
      beforeEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
      });

      it("should be false", async () => {
        const result = await SpellParser.SpellLevel("Big Sword", actor);

        expect(result).toBeFalsy();
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
        const result = SpellParser.IsSpell("1st Level", actor);

        expect(result).toBeTruthy();
      });
    });

    describe("No level present", () => {
      beforeEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
      });

      it("should be false", async () => {
        const result = await SpellParser.IsSpell("Big Sword", actor);

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
        const result = await SpellParser.SpellDetails(
          `<div data-item-id="iGoR4ePl1mTZFAVV">Cantrip</div>`,
          actor
        );

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

      it("should be 1st Level if in description", async () => {
        const result = await SpellParser.SpellDetails(
          `<div data-item-id="iGoR4ePl1mTZFAVV">Cantrip</div>`,
          actor
        );

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

      it("should be 1st Level if in description", async () => {
        const result = await SpellParser.SpellDetails(
          `<div data-item-id="iGoR4ePl1mTZFAAV">1st Level</div>`,
          actor
        );

        expect(result).toBe("1st Level");
      });

      it("should be 1st Level if in item data", async () => {
        const result = await SpellParser.SpellDetails(
          `<div data-item-id="iGoR4ePl1mTZFAAV"></div>`,
          actor
        );

        expect(result).toBe("1st Level");
      });

      it("should be 2nd Level if in item data", async () => {
        const result = await SpellParser.SpellDetails(
          `<div data-item-id="iGoR4ePl1mTZFAAQ"></div>`,
          actor
        );

        expect(result).toBe("2nd Level");
      });

      it("should be 3rd Level if in item data", async () => {
        const result = await SpellParser.SpellDetails(
          `<div data-item-id="iGoR4ePl1mTZFAAE"></div>`,
          actor
        );

        expect(result).toBe("3rd Level");
      });

      it("should be 8th Level if in item data", async () => {
        const result = await SpellParser.SpellDetails(
          `<div data-item-id="iGoR4ePl1mTZFAAR"></div>`,
          actor
        );

        expect(result).toBe("8th Level");
      });

      it("should be undefined if not less than 10", async () => {
        const result = await SpellParser.SpellDetails(
          `<div data-item-id="iGoR4ePl1mTZFAVR"></div>`,
          actor
        );

        expect(result).toBeUndefined();
      });

      it("should be cantrip if in item data", async () => {
        const result = await SpellParser.SpellDetails(
          `<div data-item-id="iGoR4ePl1mTZFAQR"></div>`,
          actor
        );

        expect(result).toBeUndefined();
      });
    });
  });

  describe("IsSorcererSpell", () => {
    (global as any).Hooks = {
      callAll: jest.fn().mockReturnValue(true),
    };
    (global as any).game = {
      settings: {
        get: jest.fn().mockReturnValueOnce("\\(S\\)"),
      },
    };

    describe("Is a Sorcerer Spell", () => {
      beforeEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
      });

      it("should be true", async () => {
        const result = await SpellParser.IsSorcererSpell(
          `<div data-item-id="pT9SKQEbTwje9ado"></div>`,
          actor
        );

        expect(result).toBeTruthy();
      });
    });

    describe("Is not a Sorcerer Spell", () => {
      beforeEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
      });

      it("should be false", async () => {
        const result = await SpellParser.IsSorcererSpell(
          `<div data-item-id="PkEkb6E3XgG0oPDB"></div>`,
          actorRage
        );

        expect(result).toBeFalsy();
      });
    });

    describe("No item id passed", () => {

      beforeEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
      });

      it("should be false", async () => {
        const result = await SpellParser.IsSorcererSpell(
          `<div item-id=""></div>`, actor
        );

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
        const result = await SpellParser.IsRage(
          `<div data-item-id="RC9RDy8n0m0UDqk7"></div>`, actorRage
        );

        expect(result).toBeTruthy();
      });
    });

    describe("Is not Rage", () => {

      beforeEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
      });

      it("should be false", async () => {
        const result = await SpellParser.IsRage(
          `<div data-item-id="PkEkb6E3XgG0oPDB"></div>`, actorRage
        );

        expect(result).toBeFalsy();
      });
    });

    describe("No item id passed", () => {

      beforeEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
      });

      it("should be false", async () => {
        const result = await SpellParser.IsRage(`<div item-id=""></div>`, actor);

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
  });
});
