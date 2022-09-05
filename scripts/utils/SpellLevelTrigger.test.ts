import SpellLevelTrigger from "./SpellLevelTrigger";

describe("SpellLevelTrigger", () => {
  (global as any).Hooks = {
    callAll: jest.fn().mockReturnValue(true),
  };

  describe("Roll 4 < 5", () => {

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
    });

    it("should be true", () => {
      const result = SpellLevelTrigger.Check(4, "5th Level");

      expect(result).toBeTruthy();
    });
  });

  describe("Roll 14 > 6", () => {
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
    });

    it("should be true", () => {
      const result = SpellLevelTrigger.Check(14, "6th Level");

      expect(result).toBeTruthy();
    });
  });

  describe("Roll 4 === 4", () => {
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
    });

    it("should be true", () => {
      const result = SpellLevelTrigger.Check(4, "4th Level");

      expect(result).toBeTruthy();
    });
  });

  describe("Roll 5 !== 3", () => {
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
    });

    it("should be true", () => {
      const result = SpellLevelTrigger.Check(5, "3rd Level");

      expect(result).toBeFalsy();
    });
  });

  describe("Roll 1 === 1", () => {
    beforeEach(() => {
      jest.clearAllMocks();

      jest.resetAllMocks();
      (global as any).game = {
        settings: {
          get: jest.fn().mockReturnValueOnce("= 1"),
        },
      };
    });

    it("should be true", () => {
      const result = SpellLevelTrigger.Check(1, "1st Level");

      expect(result).toBeTruthy();
    });
  });

  describe("Roll 2 === 2", () => {
    beforeEach(() => {
      jest.clearAllMocks();

      jest.resetAllMocks();
      (global as any).game = {
        settings: {
          get: jest.fn().mockReturnValueOnce("= 2"),
        },
      };
    });

    it("should be true", () => {
      const result = SpellLevelTrigger.Check(2, "2nd Level");

      expect(result).toBeTruthy();
    });
  });

  describe("Roll 3 === 3", () => {
    beforeEach(() => {
      jest.clearAllMocks();

      jest.resetAllMocks();
      (global as any).game = {
        settings: {
          get: jest.fn().mockReturnValueOnce("= 3"),
        },
      };
    });

    it("should be true", () => {
      const result = SpellLevelTrigger.Check(3, "3rd Level");

      expect(result).toBeTruthy();
    });
  });

  describe("Roll 7 === 7", () => {
    beforeEach(() => {
      jest.clearAllMocks();

      jest.resetAllMocks();
      (global as any).game = {
        settings: {
          get: jest.fn().mockReturnValueOnce("= 7"),
        },
      };
    });

    it("should be true", () => {
      const result = SpellLevelTrigger.Check(7, "7th Level");

      expect(result).toBeTruthy();
    });
  });

  describe("Roll 8 === 8", () => {
    beforeEach(() => {
      jest.clearAllMocks();

      jest.resetAllMocks();
      (global as any).game = {
        settings: {
          get: jest.fn().mockReturnValueOnce("= 8"),
        },
      };
    });

    it("should be true", () => {
      const result = SpellLevelTrigger.Check(8, "8th Level");

      expect(result).toBeTruthy();
    });
  });

  describe("Roll 9 === 9", () => {
    beforeEach(() => {
      jest.clearAllMocks();

      jest.resetAllMocks();
      (global as any).game = {
        settings: {
          get: jest.fn().mockReturnValueOnce("= 9"),
        },
      };
    });

    it("should be true", () => {
      const result = SpellLevelTrigger.Check(9, "9th Level");

      expect(result).toBeTruthy();
    });
  });

  describe("Roll 10 === 10", () => {
    beforeEach(() => {
      jest.clearAllMocks();

      jest.resetAllMocks();
      (global as any).game = {
        settings: {
          get: jest.fn().mockReturnValueOnce("= 10"),
        },
      };
    });

    it("should be true", () => {
      const result = SpellLevelTrigger.Check(10, "10th Level");

      expect(result).toBeTruthy();
    });
  });

  describe("Roll return value is invalid", () => {
    beforeEach(() => {
      jest.clearAllMocks();

      jest.resetAllMocks();
      (global as any).game = {
        settings: {
          get: jest.fn().mockReturnValueOnce("11"),
        },
      };
    });

    it("should be false", () => {
      const result = SpellLevelTrigger.Check(10, "10th Level");

      expect(result).toBeFalsy();
    });
  });

  describe("Spell string is not set", () => {
    beforeEach(() => {
      jest.clearAllMocks();

      jest.resetAllMocks();
      (global as any).game = {
        settings: {
          get: jest.fn().mockReturnValueOnce("11"),
        },
      };
    });

    it("should be false", () => {
      const result = SpellLevelTrigger.Check(10, "11th Level");

      expect(result).toBeFalsy();
    });
  });
});
