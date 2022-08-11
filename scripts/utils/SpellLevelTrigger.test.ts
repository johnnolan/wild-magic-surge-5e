import SpellLevelTrigger from "./SpellLevelTrigger";

describe("SpellLevelTrigger", () => {
  (global as any).Hooks = {
    callAll: jest.fn().mockReturnValue(true),
  };

  describe("Roll 4 < 5", () => {
    let spellLevelTrigger: SpellLevelTrigger;

    beforeEach(() => {
      jest.clearAllMocks();

      jest.resetAllMocks();
      (global as any).game = {
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
    let spellLevelTrigger: SpellLevelTrigger;

    beforeEach(() => {
      jest.clearAllMocks();

      jest.resetAllMocks();
      (global as any).game = {
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
    let spellLevelTrigger: SpellLevelTrigger;

    beforeEach(() => {
      jest.clearAllMocks();

      jest.resetAllMocks();
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
      spellLevelTrigger = new SpellLevelTrigger();
    });

    it("should be true", () => {
      const result = spellLevelTrigger.Check(4, "4th Level");

      expect(result).toBeTruthy();
    });
  });

  describe("Roll 5 !== 3", () => {
    let spellLevelTrigger: SpellLevelTrigger;

    beforeEach(() => {
      jest.clearAllMocks();

      jest.resetAllMocks();
      (global as any).game = {
        settings: {
          get: jest.fn().mockReturnValueOnce("= 3"),
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
      const result = spellLevelTrigger.Check(5, "3rd Level");

      expect(result).toBeFalsy();
    });
  });

  describe("Roll 1 === 1", () => {
    let spellLevelTrigger: SpellLevelTrigger;

    beforeEach(() => {
      jest.clearAllMocks();

      jest.resetAllMocks();
      (global as any).game = {
        settings: {
          get: jest.fn().mockReturnValueOnce("= 1"),
        },
      };
      spellLevelTrigger = new SpellLevelTrigger();
    });

    it("should be true", () => {
      const result = spellLevelTrigger.Check(1, "1st Level");

      expect(result).toBeTruthy();
    });
  });

  describe("Roll 2 === 2", () => {
    let spellLevelTrigger: SpellLevelTrigger;

    beforeEach(() => {
      jest.clearAllMocks();

      jest.resetAllMocks();
      (global as any).game = {
        settings: {
          get: jest.fn().mockReturnValueOnce("= 2"),
        },
      };
      spellLevelTrigger = new SpellLevelTrigger();
    });

    it("should be true", () => {
      const result = spellLevelTrigger.Check(2, "2nd Level");

      expect(result).toBeTruthy();
    });
  });

  describe("Roll 3 === 3", () => {
    let spellLevelTrigger: SpellLevelTrigger;

    beforeEach(() => {
      jest.clearAllMocks();

      jest.resetAllMocks();
      (global as any).game = {
        settings: {
          get: jest.fn().mockReturnValueOnce("= 3"),
        },
      };
      spellLevelTrigger = new SpellLevelTrigger();
    });

    it("should be true", () => {
      const result = spellLevelTrigger.Check(3, "3rd Level");

      expect(result).toBeTruthy();
    });
  });

  describe("Roll 7 === 7", () => {
    let spellLevelTrigger: SpellLevelTrigger;

    beforeEach(() => {
      jest.clearAllMocks();

      jest.resetAllMocks();
      (global as any).game = {
        settings: {
          get: jest.fn().mockReturnValueOnce("= 7"),
        },
      };
      spellLevelTrigger = new SpellLevelTrigger();
    });

    it("should be true", () => {
      const result = spellLevelTrigger.Check(7, "7th Level");

      expect(result).toBeTruthy();
    });
  });

  describe("Roll 8 === 8", () => {
    let spellLevelTrigger: SpellLevelTrigger;

    beforeEach(() => {
      jest.clearAllMocks();

      jest.resetAllMocks();
      (global as any).game = {
        settings: {
          get: jest.fn().mockReturnValueOnce("= 8"),
        },
      };
      spellLevelTrigger = new SpellLevelTrigger();
    });

    it("should be true", () => {
      const result = spellLevelTrigger.Check(8, "8th Level");

      expect(result).toBeTruthy();
    });
  });

  describe("Roll 9 === 9", () => {
    let spellLevelTrigger: SpellLevelTrigger;

    beforeEach(() => {
      jest.clearAllMocks();

      jest.resetAllMocks();
      (global as any).game = {
        settings: {
          get: jest.fn().mockReturnValueOnce("= 9"),
        },
      };
      spellLevelTrigger = new SpellLevelTrigger();
    });

    it("should be true", () => {
      const result = spellLevelTrigger.Check(9, "9th Level");

      expect(result).toBeTruthy();
    });
  });

  describe("Roll 10 === 10", () => {
    let spellLevelTrigger: SpellLevelTrigger;

    beforeEach(() => {
      jest.clearAllMocks();

      jest.resetAllMocks();
      (global as any).game = {
        settings: {
          get: jest.fn().mockReturnValueOnce("= 10"),
        },
      };
      spellLevelTrigger = new SpellLevelTrigger();
    });

    it("should be true", () => {
      const result = spellLevelTrigger.Check(10, "10th Level");

      expect(result).toBeTruthy();
    });
  });

  describe("Roll return value is invalid", () => {
    let spellLevelTrigger: SpellLevelTrigger;

    beforeEach(() => {
      jest.clearAllMocks();

      jest.resetAllMocks();
      (global as any).game = {
        settings: {
          get: jest.fn().mockReturnValueOnce("11"),
        },
      };
      spellLevelTrigger = new SpellLevelTrigger();
    });

    it("should be true", () => {
      const result = spellLevelTrigger.Check(10, "10th Level");

      expect(result).toBeFalsy();
    });
  });
});
