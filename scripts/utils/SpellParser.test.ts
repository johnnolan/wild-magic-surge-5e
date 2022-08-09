import SpellParser from "./SpellParser.js";
import { actor } from "../../MockData/actor.js";
import { actorRage } from "../../MockData/actorRage.js";
import { actorNoWildMagic } from "../../MockData/actorNoWildMagic.js";
import "../../__mocks__/index.js";

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
      let spellParser: any;

      beforeEach(() => {
        jest.clearAllMocks();

        jest.resetAllMocks();
        spellParser = new SpellParser(actor);
        (global as any).game = {
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
      let spellParser: any;

      beforeEach(() => {
        jest.clearAllMocks();

        jest.resetAllMocks();
        spellParser = new SpellParser(actor);
      });

      it("should be false", () => {
        const result = spellParser.IsWildMagicFeat(actorNoWildMagic);

        expect(result).toBeFalsy();
      });
    });
  });

  describe("IsPathOfWildMagicFeat", () => {
    (global as any).Hooks = {
      callAll: jest.fn().mockReturnValue(true),
    };

    describe("Has Path of Wild Magic Feat", () => {
      let spellParser: any;

      beforeEach(() => {
        jest.clearAllMocks();

        jest.resetAllMocks();
        (global as any).game = {
          settings: {
            get: jest.fn().mockReturnValue("POWM"),
          },
        };
        spellParser = new SpellParser({
          items: [
            {
              name: "POWM",
              type: "subclass",
            },
          ],
        });
      });

      it("should be true", () => {
        const result = spellParser.IsPathOfWildMagicFeat();

        expect(result).toBeTruthy();
      });
    });

    describe("Does not have Path of Wild Magic Feat", () => {
      let spellParser: any;

      beforeEach(() => {
        jest.clearAllMocks();

        jest.resetAllMocks();
        spellParser = new SpellParser({
          items: [
            {
              name: "WMS",
              type: "subclass",
            },
          ],
        });
      });

      it("should be false", () => {
        const result = spellParser.IsPathOfWildMagicFeat();

        expect(result).toBeFalsy();
      });
    });
  });

  describe("SpellLevel", () => {
    (global as any).Hooks = {
      callAll: jest.fn().mockReturnValue(true),
    };

    describe("Has a level", () => {
      let spellParser: any;

      beforeEach(() => {
        jest.clearAllMocks();

        jest.resetAllMocks();
        spellParser = new SpellParser(actor);
      });

      it("should be true", () => {
        const result = spellParser.SpellLevel("1st Level");

        expect(result).toBeTruthy();
      });
    });

    describe("No level present", () => {
      let spellParser: any;

      beforeEach(() => {
        jest.clearAllMocks();

        jest.resetAllMocks();
        spellParser = new SpellParser(actor);
      });

      it("should be false", async () => {
        const result = await spellParser.SpellLevel("Big Sword");

        expect(result).toBeFalsy();
      });
    });
  });

  describe("IsSpell", () => {
    (global as any).Hooks = {
      callAll: jest.fn().mockReturnValue(true),
    };

    describe("Has a level", () => {
      let spellParser: any;

      beforeEach(() => {
        jest.clearAllMocks();

        jest.resetAllMocks();
        spellParser = new SpellParser(actor);
      });

      it("should be true", () => {
        const result = spellParser.IsSpell("1st Level");

        expect(result).toBeTruthy();
      });
    });

    describe("No level present", () => {
      let spellParser: any;

      beforeEach(() => {
        jest.clearAllMocks();

        jest.resetAllMocks();
        spellParser = new SpellParser(actor);
      });

      it("should be false", async () => {
        const result = await spellParser.IsSpell("Big Sword");

        expect(result).toBeFalsy();
      });
    });
  });

  describe("SpellDetails", () => {
    describe("Is a Level 1 Spell", () => {
      let spellParser: any;

      beforeEach(() => {
        jest.clearAllMocks();

        jest.resetAllMocks();
        spellParser = new SpellParser(actor);
      });

      it("should be 1st Level if in description", async () => {
        const result = await spellParser.SpellDetails(
          `<div data-item-id="iGoR4ePl1mTZFAAV">1st Level</div>`
        );

        expect(result).toBe("1st Level");
      });

      it("should be 1st Level if in item data", async () => {
        const result = await spellParser.SpellDetails(
          `<div data-item-id="iGoR4ePl1mTZFAAV"></div>`
        );

        expect(result).toBe("1st Level");
      });

      it("should be 2nd Level if in item data", async () => {
        const result = await spellParser.SpellDetails(
          `<div data-item-id="iGoR4ePl1mTZFAAQ"></div>`
        );

        expect(result).toBe("2nd Level");
      });

      it("should be 3rd Level if in item data", async () => {
        const result = await spellParser.SpellDetails(
          `<div data-item-id="iGoR4ePl1mTZFAAE"></div>`
        );

        expect(result).toBe("3rd Level");
      });

      it("should be 8th Level if in item data", async () => {
        const result = await spellParser.SpellDetails(
          `<div data-item-id="iGoR4ePl1mTZFAAR"></div>`
        );

        expect(result).toBe("8th Level");
      });

      it("should be undefined if not less than 10", async () => {
        const result = await spellParser.SpellDetails(
          `<div data-item-id="iGoR4ePl1mTZFAVR"></div>`
        );

        expect(result).toBeUndefined();
      });

      it("should be cantrip if in item data", async () => {
        const result = await spellParser.SpellDetails(
          `<div data-item-id="iGoR4ePl1mTZFAQR"></div>`
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
      let spellParser: any;

      beforeEach(() => {
        jest.clearAllMocks();

        jest.resetAllMocks();
        spellParser = new SpellParser(actor);
      });

      it("should be true", async () => {
        const result = await spellParser.IsSorcererSpell(
          `<div data-item-id="pT9SKQEbTwje9ado"></div>`
        );

        expect(result).toBeTruthy();
      });
    });

    describe("Is not a Sorcerer Spell", () => {
      let spellParser: any;

      beforeEach(() => {
        jest.clearAllMocks();

        jest.resetAllMocks();
        spellParser = new SpellParser(actorRage);
      });

      it("should be false", async () => {
        const result = await spellParser.IsSorcererSpell(
          `<div data-item-id="PkEkb6E3XgG0oPDB"></div>`
        );

        expect(result).toBeFalsy();
      });
    });

    describe("No item id passed", () => {
      let spellParser: any;

      beforeEach(() => {
        jest.clearAllMocks();

        jest.resetAllMocks();
        spellParser = new SpellParser(actor);
      });

      it("should be false", async () => {
        const result = await spellParser.IsSorcererSpell(
          `<div item-id=""></div>`
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
      let spellParser: any;

      beforeEach(() => {
        jest.clearAllMocks();

        jest.resetAllMocks();
        spellParser = new SpellParser(actorRage);
      });

      it("should be true", async () => {
        const result = await spellParser.IsRage(
          `<div data-item-id="RC9RDy8n0m0UDqk7"></div>`
        );

        expect(result).toBeTruthy();
      });
    });

    describe("Is not Rage", () => {
      let spellParser: any;

      beforeEach(() => {
        jest.clearAllMocks();

        jest.resetAllMocks();
        spellParser = new SpellParser(actorRage);
      });

      it("should be false", async () => {
        const result = await spellParser.IsRage(
          `<div data-item-id="PkEkb6E3XgG0oPDB"></div>`
        );

        expect(result).toBeFalsy();
      });
    });

    describe("No item id passed", () => {
      let spellParser: any;

      beforeEach(() => {
        jest.clearAllMocks();

        jest.resetAllMocks();
        spellParser = new SpellParser(actor);
      });

      it("should be false", async () => {
        const result = await spellParser.IsRage(`<div item-id=""></div>`);

        expect(result).toBeFalsy();
      });
    });
  });

  describe("IsNPC", () => {
    (global as any).Hooks = {
      callAll: jest.fn().mockReturnValue(true),
    };

    describe("Is set to be a NPC", () => {
      let spellParser: any;

      beforeEach(() => {
        jest.clearAllMocks();

        jest.resetAllMocks();
        spellParser = new SpellParser({
          type: "npc",
        });
      });

      it("should be true", () => {
        const result = spellParser.IsNPC();

        expect(result).toBeTruthy();
      });
    });

    describe("Is not a NPC", () => {
      let spellParser: any;

      beforeEach(() => {
        jest.clearAllMocks();

        jest.resetAllMocks();
        spellParser = new SpellParser({
          type: "pc",
        });
      });

      it("should be false", () => {
        const result = spellParser.IsNPC();

        expect(result).toBeFalsy();
      });
    });

    describe("Is no Actor", () => {
      let spellParser: any;

      beforeEach(() => {
        jest.clearAllMocks();

        jest.resetAllMocks();
        // @ts-expect-error TS(2554): Expected 1 arguments, but got 0.
        spellParser = new SpellParser();
      });

      it("should be false", () => {
        const result = spellParser.IsNPC();

        expect(result).toBeFalsy();
      });
    });
  });
});
