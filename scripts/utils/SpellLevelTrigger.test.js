import SpellLevelTrigger from "./SpellLevelTrigger.js";

describe("SpellLevelTrigger", () => {
  global.Hooks = {
    callAll: jest.fn().mockReturnValue(true),
  };
  describe("Roll 4 < 5", () => {
    let spellLevelTrigger;
    beforeEach(() => {
      jest.clearAllMocks();
      jest.resetAllMocks();
      global.game = {
        settings: {
          get: jest.fn().mockReturnValueOnce("< 5"),
        },
        tables: [
          {
            name: "Wild Magic Surge",
            roll: jest.fn().mockResolvedValue(true),
            results: jest.fn().mockResolvedValue([]),
          },
        ],
      };
      spellLevelTrigger = new SpellLevelTrigger();
    });

    it("should be true", () => {
      const result = spellLevelTrigger.Check(4, "5th Level");
      expect(result).toBeTruthy();
    });
  });

  describe("Roll 14 > 6", () => {
    let spellLevelTrigger;
    beforeEach(() => {
      jest.clearAllMocks();
      jest.resetAllMocks();
      global.game = {
        settings: {
          get: jest.fn().mockReturnValueOnce("> 6"),
        },
        tables: [
          {
            name: "Wild Magic Surge",
            roll: jest.fn().mockResolvedValue(true),
            results: jest.fn().mockResolvedValue([]),
          },
        ],
      };
      spellLevelTrigger = new SpellLevelTrigger();
    });

    it("should be true", () => {
      const result = spellLevelTrigger.Check(14, "6th Level");
      expect(result).toBeTruthy();
    });
  });

  describe("Roll 4 === 4", () => {
    let spellLevelTrigger;
    beforeEach(() => {
      jest.clearAllMocks();
      jest.resetAllMocks();
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
      spellLevelTrigger = new SpellLevelTrigger();
    });

    it("should be true", () => {
      const result = spellLevelTrigger.Check(4, "4th Level");
      expect(result).toBeTruthy();
    });
  });

  describe("Roll 5 !== 4", () => {
    let spellLevelTrigger;
    beforeEach(() => {
      jest.clearAllMocks();
      jest.resetAllMocks();
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
      spellLevelTrigger = new SpellLevelTrigger();
    });

    it("should be true", () => {
      const result = spellLevelTrigger.Check(5, "4th Level");
      expect(result).toBeFalsy();
    });
  });
});
