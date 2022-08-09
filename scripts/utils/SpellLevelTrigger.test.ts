import SpellLevelTrigger from "./SpellLevelTrigger.js";

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe("SpellLevelTrigger", () => {
  // @ts-expect-error TS(2304): Cannot find name 'global'.
  global.Hooks = {
    // @ts-expect-error TS(2304): Cannot find name 'jest'.
    callAll: jest.fn().mockReturnValue(true),
  };
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe("Roll 4 < 5", () => {
    let spellLevelTrigger: any;
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
          get: jest.fn().mockReturnValueOnce("< 5"),
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
      spellLevelTrigger = new SpellLevelTrigger();
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it("should be true", () => {
      const result = spellLevelTrigger.Check(4, "5th Level");
      // @ts-expect-error TS(2304): Cannot find name 'expect'.
      expect(result).toBeTruthy();
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe("Roll 14 > 6", () => {
    let spellLevelTrigger: any;
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
          get: jest.fn().mockReturnValueOnce("> 6"),
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
      spellLevelTrigger = new SpellLevelTrigger();
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it("should be true", () => {
      const result = spellLevelTrigger.Check(14, "6th Level");
      // @ts-expect-error TS(2304): Cannot find name 'expect'.
      expect(result).toBeTruthy();
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe("Roll 4 === 4", () => {
    let spellLevelTrigger: any;
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
      spellLevelTrigger = new SpellLevelTrigger();
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it("should be true", () => {
      const result = spellLevelTrigger.Check(4, "4th Level");
      // @ts-expect-error TS(2304): Cannot find name 'expect'.
      expect(result).toBeTruthy();
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe("Roll 5 !== 3", () => {
    let spellLevelTrigger: any;
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
          get: jest.fn().mockReturnValueOnce("= 3"),
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
      spellLevelTrigger = new SpellLevelTrigger();
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it("should be true", () => {
      const result = spellLevelTrigger.Check(5, "3rd Level");
      // @ts-expect-error TS(2304): Cannot find name 'expect'.
      expect(result).toBeFalsy();
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe("Roll 1 === 1", () => {
    let spellLevelTrigger: any;
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
          get: jest.fn().mockReturnValueOnce("= 1"),
        },
      };
      spellLevelTrigger = new SpellLevelTrigger();
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it("should be true", () => {
      const result = spellLevelTrigger.Check(1, "1st Level");
      // @ts-expect-error TS(2304): Cannot find name 'expect'.
      expect(result).toBeTruthy();
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe("Roll 2 === 2", () => {
    let spellLevelTrigger: any;
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
          get: jest.fn().mockReturnValueOnce("= 2"),
        },
      };
      spellLevelTrigger = new SpellLevelTrigger();
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it("should be true", () => {
      const result = spellLevelTrigger.Check(2, "2nd Level");
      // @ts-expect-error TS(2304): Cannot find name 'expect'.
      expect(result).toBeTruthy();
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe("Roll 3 === 3", () => {
    let spellLevelTrigger: any;
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
          get: jest.fn().mockReturnValueOnce("= 3"),
        },
      };
      spellLevelTrigger = new SpellLevelTrigger();
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it("should be true", () => {
      const result = spellLevelTrigger.Check(3, "3rd Level");
      // @ts-expect-error TS(2304): Cannot find name 'expect'.
      expect(result).toBeTruthy();
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe("Roll 7 === 7", () => {
    let spellLevelTrigger: any;
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
          get: jest.fn().mockReturnValueOnce("= 7"),
        },
      };
      spellLevelTrigger = new SpellLevelTrigger();
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it("should be true", () => {
      const result = spellLevelTrigger.Check(7, "7th Level");
      // @ts-expect-error TS(2304): Cannot find name 'expect'.
      expect(result).toBeTruthy();
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe("Roll 8 === 8", () => {
    let spellLevelTrigger: any;
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
          get: jest.fn().mockReturnValueOnce("= 8"),
        },
      };
      spellLevelTrigger = new SpellLevelTrigger();
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it("should be true", () => {
      const result = spellLevelTrigger.Check(8, "8th Level");
      // @ts-expect-error TS(2304): Cannot find name 'expect'.
      expect(result).toBeTruthy();
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe("Roll 9 === 9", () => {
    let spellLevelTrigger: any;
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
          get: jest.fn().mockReturnValueOnce("= 9"),
        },
      };
      spellLevelTrigger = new SpellLevelTrigger();
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it("should be true", () => {
      const result = spellLevelTrigger.Check(9, "9th Level");
      // @ts-expect-error TS(2304): Cannot find name 'expect'.
      expect(result).toBeTruthy();
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe("Roll 10 === 10", () => {
    let spellLevelTrigger: any;
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
          get: jest.fn().mockReturnValueOnce("= 10"),
        },
      };
      spellLevelTrigger = new SpellLevelTrigger();
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it("should be true", () => {
      const result = spellLevelTrigger.Check(10, "10th Level");
      // @ts-expect-error TS(2304): Cannot find name 'expect'.
      expect(result).toBeTruthy();
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe("Roll return value is invalid", () => {
    let spellLevelTrigger: any;
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
          get: jest.fn().mockReturnValueOnce("11"),
        },
      };
      spellLevelTrigger = new SpellLevelTrigger();
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it("should be true", () => {
      const result = spellLevelTrigger.Check(10, "10th Level");
      // @ts-expect-error TS(2304): Cannot find name 'expect'.
      expect(result).toBeFalsy();
    });
  });
});
