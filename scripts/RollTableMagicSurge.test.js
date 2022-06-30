import RollTableMagicSurge from "./RollTableMagicSurge.js";
import "../__mocks__/index.js";

describe("RollTableMagicSurge", () => {
  describe("If the a table has been set and its enabled", () => {
    let rollTableMagicSurge;
    beforeEach(() => {
      jest.clearAllMocks();
      jest.resetAllMocks();
      global.renderTemplate = jest.fn().mockResolvedValue("Content");
      global.game = {
        tables: [
          {
            name: "Wild Magic Surge",
            roll: jest
              .fn()
              .mockResolvedValue({
                results: [],
                render: jest.fn().mockResolvedValue(""),
              }),
            results: jest.fn().mockResolvedValue([]),
            data: {
              description: "Wild Magic Surge Table",
            },
          },
        ],
        settings: {
          get: jest
            .fn()
            .mockReturnValueOnce("Wild Magic Surge")
            .mockReturnValueOnce(false),
        },
        user: {
          id: "123",
        },
      };
      rollTableMagicSurge = new RollTableMagicSurge();
    });

    it("should call the draw function once", async () => {
      await rollTableMagicSurge.Check();
      expect(global.game.tables[0].roll).toBeCalled();
      expect(global.game.tables[0].roll).toHaveBeenCalledTimes(1);
    });
  });

  describe("If the a table has been set and its not enabled", () => {
    let rollTableMagicSurge;
    beforeEach(() => {
      jest.clearAllMocks();
      jest.resetAllMocks();
      global.renderTemplate = jest.fn().mockResolvedValue("Content");
      global.game = {
        tables: [
          {
            name: "Wild Magic Surge",
            roll: jest
              .fn()
              .mockResolvedValue({
                results: [],
                render: jest.fn().mockResolvedValue(""),
              }),
            results: jest.fn().mockResolvedValue([]),
            data: {
              description: "Wild Magic Surge Table",
            },
          },
        ],
        settings: {
          get: jest
            .fn()
            .mockReturnValueOnce("Wild Magic Surge")
            .mockReturnValueOnce(false),
        },
        user: {
          id: "123",
        },
      };
      rollTableMagicSurge = new RollTableMagicSurge();
    });

    it("should not call the draw or roll function", async () => {
      await rollTableMagicSurge.Check();
      expect(global.renderTemplate).not.toBeCalled();
      expect(global.renderTemplate).toHaveBeenCalledTimes(0);
    });
  });
});
