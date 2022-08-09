import SpellParser from "./SpellParser.js";
// @ts-expect-error TS(7016): Could not find a declaration file for module '../.... Remove this comment to see the full error message
import { actor } from "../../MockData/actor.js";
// @ts-expect-error TS(7016): Could not find a declaration file for module '../.... Remove this comment to see the full error message
import { actorRage } from "../../MockData/actorRage.js";
// @ts-expect-error TS(7016): Could not find a declaration file for module '../.... Remove this comment to see the full error message
import { actorNoWildMagic } from "../../MockData/actorNoWildMagic.js";
import "../../__mocks__/index.js";

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe("SpellParser", () => {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe("IsWildMagicFeat", () => {
    // @ts-expect-error TS(2304): Cannot find name 'global'.
    global.Hooks = {
      // @ts-expect-error TS(2304): Cannot find name 'jest'.
      callAll: jest.fn().mockReturnValue(true),
    };
    // @ts-expect-error TS(2304): Cannot find name 'global'.
    global.game = {
      settings: {
        // @ts-expect-error TS(2304): Cannot find name 'jest'.
        get: jest.fn().mockReturnValueOnce("= 4"),
      },
      tables: [
        {
          name: "Wild Magic Surge",
          // @ts-expect-error TS(2304): Cannot find name 'jest'.
          roll: jest.fn().mockResolvedValue(true),
          // @ts-expect-error TS(2304): Cannot find name 'jest'.
          results: jest.fn().mockResolvedValue([]),
        },
      ],
    };
    // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe("Has Wild Magic Feat", () => {
      let spellParser: any;
      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(() => {
        // @ts-expect-error TS(2304): Cannot find name 'jest'.
        jest.clearAllMocks();
        // @ts-expect-error TS(2304): Cannot find name 'jest'.
        jest.resetAllMocks();
        spellParser = new SpellParser(actor);
        // @ts-expect-error TS(2304): Cannot find name 'global'.
        global.game = {
          settings: {
            // @ts-expect-error TS(2304): Cannot find name 'jest'.
            get: jest.fn().mockReturnValue("Wild Magic Surge"),
          },
        };
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it("should be true", () => {
        const result = spellParser.IsWildMagicFeat(actor);
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(result).toBeTruthy();
      });
    });

    // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe("Does not have Wild Magic Feat", () => {
      let spellParser: any;
      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(() => {
        // @ts-expect-error TS(2304): Cannot find name 'jest'.
        jest.clearAllMocks();
        // @ts-expect-error TS(2304): Cannot find name 'jest'.
        jest.resetAllMocks();
        spellParser = new SpellParser(actor);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it("should be false", () => {
        const result = spellParser.IsWildMagicFeat(actorNoWildMagic);
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(result).toBeFalsy();
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe("IsPathOfWildMagicFeat", () => {
    // @ts-expect-error TS(2304): Cannot find name 'global'.
    global.Hooks = {
      // @ts-expect-error TS(2304): Cannot find name 'jest'.
      callAll: jest.fn().mockReturnValue(true),
    };
    // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe("Has Path of Wild Magic Feat", () => {
      let spellParser: any;
      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(() => {
        // @ts-expect-error TS(2304): Cannot find name 'jest'.
        jest.clearAllMocks();
        // @ts-expect-error TS(2304): Cannot find name 'jest'.
        jest.resetAllMocks();
        // @ts-expect-error TS(2304): Cannot find name 'global'.
        global.game = {
          settings: {
            // @ts-expect-error TS(2304): Cannot find name 'jest'.
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

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it("should be true", () => {
        const result = spellParser.IsPathOfWildMagicFeat();
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(result).toBeTruthy();
      });
    });

    // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe("Does not have Path of Wild Magic Feat", () => {
      let spellParser: any;
      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(() => {
        // @ts-expect-error TS(2304): Cannot find name 'jest'.
        jest.clearAllMocks();
        // @ts-expect-error TS(2304): Cannot find name 'jest'.
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

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it("should be false", () => {
        const result = spellParser.IsPathOfWildMagicFeat();
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(result).toBeFalsy();
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe("SpellLevel", () => {
    // @ts-expect-error TS(2304): Cannot find name 'global'.
    global.Hooks = {
      // @ts-expect-error TS(2304): Cannot find name 'jest'.
      callAll: jest.fn().mockReturnValue(true),
    };
    // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe("Has a level", () => {
      let spellParser: any;
      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(() => {
        // @ts-expect-error TS(2304): Cannot find name 'jest'.
        jest.clearAllMocks();
        // @ts-expect-error TS(2304): Cannot find name 'jest'.
        jest.resetAllMocks();
        spellParser = new SpellParser(actor);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it("should be true", () => {
        const result = spellParser.SpellLevel("1st Level");
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(result).toBeTruthy();
      });
    });

    // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe("No level present", () => {
      let spellParser: any;
      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(() => {
        // @ts-expect-error TS(2304): Cannot find name 'jest'.
        jest.clearAllMocks();
        // @ts-expect-error TS(2304): Cannot find name 'jest'.
        jest.resetAllMocks();
        spellParser = new SpellParser(actor);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it("should be false", async () => {
        const result = await spellParser.SpellLevel("Big Sword");
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(result).toBeFalsy();
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe("IsSpell", () => {
    // @ts-expect-error TS(2304): Cannot find name 'global'.
    global.Hooks = {
      // @ts-expect-error TS(2304): Cannot find name 'jest'.
      callAll: jest.fn().mockReturnValue(true),
    };
    // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe("Has a level", () => {
      let spellParser: any;
      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(() => {
        // @ts-expect-error TS(2304): Cannot find name 'jest'.
        jest.clearAllMocks();
        // @ts-expect-error TS(2304): Cannot find name 'jest'.
        jest.resetAllMocks();
        spellParser = new SpellParser(actor);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it("should be true", () => {
        const result = spellParser.IsSpell("1st Level");
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(result).toBeTruthy();
      });
    });

    // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe("No level present", () => {
      let spellParser: any;
      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(() => {
        // @ts-expect-error TS(2304): Cannot find name 'jest'.
        jest.clearAllMocks();
        // @ts-expect-error TS(2304): Cannot find name 'jest'.
        jest.resetAllMocks();
        spellParser = new SpellParser(actor);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it("should be false", async () => {
        const result = await spellParser.IsSpell("Big Sword");
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(result).toBeFalsy();
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe("SpellDetails", () => {
    // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe("Is a Level 1 Spell", () => {
      let spellParser: any;
      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(() => {
        // @ts-expect-error TS(2304): Cannot find name 'jest'.
        jest.clearAllMocks();
        // @ts-expect-error TS(2304): Cannot find name 'jest'.
        jest.resetAllMocks();
        spellParser = new SpellParser(actor);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it("should be 1st Level if in description", async () => {
        const result = await spellParser.SpellDetails(
          `<div data-item-id="iGoR4ePl1mTZFAAV">1st Level</div>`
        );
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(result).toBe("1st Level");
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it("should be 1st Level if in item data", async () => {
        const result = await spellParser.SpellDetails(
          `<div data-item-id="iGoR4ePl1mTZFAAV"></div>`
        );
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(result).toBe("1st Level");
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it("should be 2nd Level if in item data", async () => {
        const result = await spellParser.SpellDetails(
          `<div data-item-id="iGoR4ePl1mTZFAAQ"></div>`
        );
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(result).toBe("2nd Level");
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it("should be 3rd Level if in item data", async () => {
        const result = await spellParser.SpellDetails(
          `<div data-item-id="iGoR4ePl1mTZFAAE"></div>`
        );
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(result).toBe("3rd Level");
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it("should be 8th Level if in item data", async () => {
        const result = await spellParser.SpellDetails(
          `<div data-item-id="iGoR4ePl1mTZFAAR"></div>`
        );
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(result).toBe("8th Level");
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it("should be undefined if not less than 10", async () => {
        const result = await spellParser.SpellDetails(
          `<div data-item-id="iGoR4ePl1mTZFAVR"></div>`
        );
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(result).toBeUndefined();
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it("should be cantrip if in item data", async () => {
        const result = await spellParser.SpellDetails(
          `<div data-item-id="iGoR4ePl1mTZFAQR"></div>`
        );
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(result).toBeUndefined();
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe("IsSorcererSpell", () => {
    // @ts-expect-error TS(2304): Cannot find name 'global'.
    global.Hooks = {
      // @ts-expect-error TS(2304): Cannot find name 'jest'.
      callAll: jest.fn().mockReturnValue(true),
    };
    // @ts-expect-error TS(2304): Cannot find name 'global'.
    global.game = {
      settings: {
        // @ts-expect-error TS(2304): Cannot find name 'jest'.
        get: jest.fn().mockReturnValueOnce("\\(S\\)"),
      },
    };

    // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe("Is a Sorcerer Spell", () => {
      let spellParser: any;
      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(() => {
        // @ts-expect-error TS(2304): Cannot find name 'jest'.
        jest.clearAllMocks();
        // @ts-expect-error TS(2304): Cannot find name 'jest'.
        jest.resetAllMocks();
        spellParser = new SpellParser(actor);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it("should be true", async () => {
        const result = await spellParser.IsSorcererSpell(
          `<div data-item-id="pT9SKQEbTwje9ado"></div>`
        );
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(result).toBeTruthy();
      });
    });

    // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe("Is not a Sorcerer Spell", () => {
      let spellParser: any;
      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(() => {
        // @ts-expect-error TS(2304): Cannot find name 'jest'.
        jest.clearAllMocks();
        // @ts-expect-error TS(2304): Cannot find name 'jest'.
        jest.resetAllMocks();
        spellParser = new SpellParser(actorRage);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it("should be false", async () => {
        const result = await spellParser.IsSorcererSpell(
          `<div data-item-id="PkEkb6E3XgG0oPDB"></div>`
        );
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(result).toBeFalsy();
      });
    });

    // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe("No item id passed", () => {
      let spellParser: any;
      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(() => {
        // @ts-expect-error TS(2304): Cannot find name 'jest'.
        jest.clearAllMocks();
        // @ts-expect-error TS(2304): Cannot find name 'jest'.
        jest.resetAllMocks();
        spellParser = new SpellParser(actor);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it("should be false", async () => {
        const result = await spellParser.IsSorcererSpell(
          `<div item-id=""></div>`
        );
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(result).toBeFalsy();
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe("IsRage", () => {
    // @ts-expect-error TS(2304): Cannot find name 'global'.
    global.Hooks = {
      // @ts-expect-error TS(2304): Cannot find name 'jest'.
      callAll: jest.fn().mockReturnValue(true),
    };
    // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe("Is Rage", () => {
      let spellParser: any;
      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(() => {
        // @ts-expect-error TS(2304): Cannot find name 'jest'.
        jest.clearAllMocks();
        // @ts-expect-error TS(2304): Cannot find name 'jest'.
        jest.resetAllMocks();
        spellParser = new SpellParser(actorRage);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it("should be true", async () => {
        const result = await spellParser.IsRage(
          `<div data-item-id="RC9RDy8n0m0UDqk7"></div>`
        );
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(result).toBeTruthy();
      });
    });

    // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe("Is not Rage", () => {
      let spellParser: any;
      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(() => {
        // @ts-expect-error TS(2304): Cannot find name 'jest'.
        jest.clearAllMocks();
        // @ts-expect-error TS(2304): Cannot find name 'jest'.
        jest.resetAllMocks();
        spellParser = new SpellParser(actorRage);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it("should be false", async () => {
        const result = await spellParser.IsRage(
          `<div data-item-id="PkEkb6E3XgG0oPDB"></div>`
        );
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(result).toBeFalsy();
      });
    });

    // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe("No item id passed", () => {
      let spellParser: any;
      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(() => {
        // @ts-expect-error TS(2304): Cannot find name 'jest'.
        jest.clearAllMocks();
        // @ts-expect-error TS(2304): Cannot find name 'jest'.
        jest.resetAllMocks();
        spellParser = new SpellParser(actor);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it("should be false", async () => {
        const result = await spellParser.IsRage(`<div item-id=""></div>`);
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(result).toBeFalsy();
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe("IsNPC", () => {
    // @ts-expect-error TS(2304): Cannot find name 'global'.
    global.Hooks = {
      // @ts-expect-error TS(2304): Cannot find name 'jest'.
      callAll: jest.fn().mockReturnValue(true),
    };
    // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe("Is set to be a NPC", () => {
      let spellParser: any;
      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(() => {
        // @ts-expect-error TS(2304): Cannot find name 'jest'.
        jest.clearAllMocks();
        // @ts-expect-error TS(2304): Cannot find name 'jest'.
        jest.resetAllMocks();
        spellParser = new SpellParser({
          type: "npc",
        });
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it("should be true", () => {
        const result = spellParser.IsNPC();
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(result).toBeTruthy();
      });
    });

    // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe("Is not a NPC", () => {
      let spellParser: any;
      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(() => {
        // @ts-expect-error TS(2304): Cannot find name 'jest'.
        jest.clearAllMocks();
        // @ts-expect-error TS(2304): Cannot find name 'jest'.
        jest.resetAllMocks();
        spellParser = new SpellParser({
          type: "pc",
        });
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it("should be false", () => {
        const result = spellParser.IsNPC();
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(result).toBeFalsy();
      });
    });

    // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe("Is no Actor", () => {
      let spellParser: any;
      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(() => {
        // @ts-expect-error TS(2304): Cannot find name 'jest'.
        jest.clearAllMocks();
        // @ts-expect-error TS(2304): Cannot find name 'jest'.
        jest.resetAllMocks();
        // @ts-expect-error TS(2554): Expected 1 arguments, but got 0.
        spellParser = new SpellParser();
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it("should be false", () => {
        const result = spellParser.IsNPC();
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(result).toBeFalsy();
      });
    });
  });
});
