import RollTableMagicSurge from "./RollTableMagicSurge.js";

describe("Check", () => {
  describe("If the a table has been set and its enabled", () => {
    let rollTableMagicSurge;
    beforeEach(() => {
      jest.clearAllMocks();
      jest.resetAllMocks();
      global.game = {
        tables: [
          {
            name: "Wild Magic Surge",
            roll: jest.fn().mockResolvedValue(true),
          },
        ],
        settings: {
          get: jest
            .fn()
            .mockReturnValueOnce("Wild Magic Surge")
            .mockReturnValueOnce(true),
        },
      };
      rollTableMagicSurge = new RollTableMagicSurge();
    });

    it("should call the draw function once", () => {
      rollTableMagicSurge.Check();
      expect(global.game.tables[0].roll).toBeCalled();
      expect(global.game.tables[0].roll).toHaveBeenCalledTimes(1);
    });
  });

  describe("If the a table has been set and its not enabled", () => {
    let rollTableMagicSurge;
    beforeEach(() => {
      jest.clearAllMocks();
      jest.resetAllMocks();
      global.game = {
        tables: [
          {
            name: "Wild Magic Surge",
            roll: jest.fn().mockResolvedValue(true),
          },
        ],
        settings: {
          get: jest
            .fn()
            .mockReturnValueOnce("Wild Magic Surge")
            .mockReturnValueOnce(false),
        },
      };
      rollTableMagicSurge = new RollTableMagicSurge();
    });

    it("should not call the draw or roll function", () => {
      rollTableMagicSurge.Check();
      expect(global.game.tables[0].roll).not.toBeCalled();
      expect(global.game.tables[0].roll).toHaveBeenCalledTimes(0);
    });
  });
});
