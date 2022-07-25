import RollTableMagicSurge from "./RollTableMagicSurge.js";
import "../__mocks__/index.js";

jest.mock("./Chat.js");

describe("RollTableMagicSurge", () => {
  describe("If the table type is not passed", () => {
    let rollTableMagicSurge;
    beforeEach(() => {
      global.renderTemplate = jest.fn().mockResolvedValue("Content");
      global.game = {
        tables: [
          {
            name: "Wild Magic Surge",
            roll: jest.fn().mockResolvedValue({
              results: [],
              render: jest.fn().mockResolvedValue(""),
            }),
            results: jest.fn().mockResolvedValue([]),
            data: {
              description: "Wild Magic Surge Table Test",
            },
          },
        ],
        settings: {
          get: jest
            .fn()
            .mockReturnValueOnce(true)
            .mockReturnValueOnce("Wild Magic Surge"),
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

  describe("If the table type is Wild Magic Surge", () => {
    let rollTableMagicSurge;
    beforeEach(() => {
      global.renderTemplate = jest.fn().mockResolvedValue("Content");
      global.game = {
        tables: [
          {
            name: "Wild Magic Surge",
            roll: jest.fn().mockResolvedValue({
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
            .mockReturnValueOnce(true)
            .mockReturnValueOnce("Wild Magic Surge"),
        },
        user: {
          id: "123",
        },
      };
      rollTableMagicSurge = new RollTableMagicSurge();
    });

    it("should call the draw function once", async () => {
      await rollTableMagicSurge.Check("WMS");
      expect(global.game.tables[0].roll).toBeCalled();
      expect(global.game.tables[0].roll).toHaveBeenCalledTimes(1);
    });
  });

  describe("If the table type is Path of Wild Magic", () => {
    let rollTableMagicSurge;
    beforeEach(() => {
      global.renderTemplate = jest.fn().mockResolvedValue("Content");
      global.game = {
        tables: [
          {
            name: "Path of Wild Magic",
            roll: jest.fn().mockResolvedValue({
              results: [],
              render: jest.fn().mockResolvedValue(""),
            }),
            results: jest.fn().mockResolvedValue([]),
            data: {
              description: "Path of Wild Magic Surge",
            },
          },
        ],
        settings: {
          get: jest
            .fn()
            .mockReturnValueOnce(true)
            .mockReturnValueOnce("Path of Wild Magic"),
        },
        user: {
          id: "123",
        },
      };
      rollTableMagicSurge = new RollTableMagicSurge();
    });

    it("should call the draw function once", async () => {
      await rollTableMagicSurge.Check("POWM");
      expect(global.game.tables[0].roll).toBeCalled();
      expect(global.game.tables[0].roll).toHaveBeenCalledTimes(1);
    });
  });

  describe("If the roll table setting is false", () => {
    let rollTableMagicSurge;
    beforeEach(() => {
      global.renderTemplate = jest.fn().mockResolvedValue("Content");
      global.game = {
        tables: [
          {
            name: "Wild Magic Surge",
            roll: jest.fn().mockResolvedValue({
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
            .mockReturnValueOnce(false)
            .mockReturnValueOnce("Wild Magic Surge"),
        },
        user: {
          id: "123",
        },
      };
      rollTableMagicSurge = new RollTableMagicSurge();
    });

    it("should not call the draw function", async () => {
      await rollTableMagicSurge.Check("WMS");
      expect(global.game.tables[0].roll).not.toBeCalled();
      expect(global.game.tables[0].roll).toHaveBeenCalledTimes(0);
    });
  });
});
