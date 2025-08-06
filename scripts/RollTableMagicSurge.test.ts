import RollTableMagicSurge from "./RollTableMagicSurge";
import Logger from "./Logger";
import "../__mocks__/index";
import { actor } from "../MockData/actor";

jest.mock("./Chat");
const mockLoggerError = jest.fn();
Logger.error = mockLoggerError;

describe("RollTableMagicSurge", () => {
  describe("If no table is found matching", () => {
    beforeEach(() => {
      global.renderTemplate = jest.fn().mockResolvedValue("Content");
      (global as any).game = {
        tables: [
          {
            name: "Wild Magic Surge",
            draw: jest.fn().mockResolvedValue({
              roll: { total: 1 },
              results: [],
            }),
            data: {
              description: "Wild Magic Surge Table Test",
            },
          },
        ],
        settings: {
          get: jest
            .fn()
            .mockReturnValueOnce("AUTO")
            .mockReturnValueOnce("undefined"),
        },
        user: {
          id: "123",
        },
      };
    });

    it("should not call the table", async () => {
      await RollTableMagicSurge.Check(undefined, actor);

      expect((global as any).game.tables[0].draw).not.toHaveBeenCalled();
      expect(mockLoggerError).toHaveBeenCalled();
    });
  });

  describe("If no table is found matching", () => {
    beforeEach(() => {
      global.renderTemplate = jest.fn().mockResolvedValue("Content");
      (global as any).game = {
        tables: [
          {
            name: "Wild Magic Surge",
            draw: jest.fn().mockResolvedValue({
              roll: { total: 1 },
              results: [],
            }),
            data: {
              description: "Wild Magic Surge Table Test",
            },
          },
        ],
        settings: {
          get: jest
            .fn()
            .mockReturnValueOnce("AUTO")
            .mockReturnValueOnce(undefined),
        },
        user: {
          id: "123",
        },
      };
    });

    it("should not call the table", async () => {
      await RollTableMagicSurge.Check(undefined, actor);

      expect((global as any).game.tables[0].draw).not.toHaveBeenCalled();
    });
  });

  describe("If the table type is not passed", () => {
    beforeEach(() => {
      global.renderTemplate = jest.fn().mockResolvedValue("Content");
      (global as any).game = {
        tables: [
          {
            name: "Wild Magic Surge",
            draw: jest.fn().mockResolvedValue({
              roll: { total: 1 },
              results: [],
            }),
            data: {
              description: "Wild Magic Surge Table Test",
            },
          },
        ],
        settings: {
          get: jest
            .fn()
            .mockReturnValueOnce("AUTO")
            .mockReturnValueOnce("Wild Magic Surge"),
        },
        user: {
          id: "123",
        },
      };
    });

    it("should call the draw function once", async () => {
      await RollTableMagicSurge.Check(undefined, actor);

      expect((global as any).game.tables[0].draw).toHaveBeenCalled();

      expect((global as any).game.tables[0].draw).toHaveBeenCalledTimes(1);
    });
  });

  describe("If the table type is Wild Magic Surge but no results passed back", () => {

    beforeEach(() => {
      global.renderTemplate = jest.fn().mockResolvedValue("Content");
      (global as any).game = {
        tables: [
          {
            name: "Wild Magic Surge",
            draw: jest.fn().mockResolvedValue({
              roll: { total: 1 },
              results: [],
            }),
            data: {
              description: "Wild Magic Surge Table",
            },
          },
        ],
        settings: {
          get: jest
            .fn()
            .mockReturnValueOnce("AUTO")
            .mockReturnValueOnce("Wild Magic Surge"),
        },
        user: {
          id: "123",
        },
      };
    });

    it("should call the draw function once", async () => {
      await RollTableMagicSurge.Check("WMS", actor);

      expect((global as any).game.tables[0].draw).toHaveBeenCalled();

      expect((global as any).game.tables[0].draw).toHaveBeenCalledTimes(1);
    });
  });

  describe("If the table type is Wild Magic Surge", () => {

    beforeEach(() => {
      global.renderTemplate = jest.fn().mockResolvedValue("Content");
      (global as any).game = {
        tables: [
          {
            name: "Wild Magic Surge",
            draw: jest.fn().mockResolvedValue({
              roll: { total: 1 },
              results: [{ text: "test" }],
            }),
            data: {
              description: "Wild Magic Surge Table",
            },
          },
        ],
        settings: {
          get: jest
            .fn()
            .mockReturnValueOnce("AUTO")
            .mockReturnValueOnce("Wild Magic Surge"),
        },
        user: {
          id: "123",
        },
      };
    });

    it("should call the draw function once", async () => {
      const result = await RollTableMagicSurge.Check("WMS", actor);

      expect((global as any).game.tables[0].draw).toHaveBeenCalled();

      expect((global as any).game.tables[0].draw).toHaveBeenCalledTimes(1);

      expect(result).toBe("test, undefined");
    });
  });

  describe("If the table type is Path of Wild Magic", () => {
    beforeEach(() => {
      global.renderTemplate = jest.fn().mockResolvedValue("Content");
      (global as any).game = {
        tables: [
          {
            name: "Path of Wild Magic",
            draw: jest.fn().mockResolvedValue({
              roll: { total: 1 },
              results: [],
            }),
            data: {
              description: "Path of Wild Magic Surge",
            },
          },
        ],
        settings: {
          get: jest
            .fn()
            .mockReturnValueOnce("AUTO")
            .mockReturnValueOnce("Path of Wild Magic"),
        },
        user: {
          id: "123",
        },
      };
    });

    it("should call the draw function once", async () => {
      await RollTableMagicSurge.Check("POWM", actor);

      expect((global as any).game.tables[0].draw).toHaveBeenCalled();

      expect((global as any).game.tables[0].draw).toHaveBeenCalledTimes(1);
    });
  });

  describe("If the roll table setting is false", () => {
    beforeEach(() => {
      global.renderTemplate = jest.fn().mockResolvedValue("Content");
      (global as any).game = {
        tables: [
          {
            name: "Wild Magic Surge",
            draw: jest.fn().mockResolvedValue({
              roll: { total: 1 },
              results: [],
            }),
            data: {
              description: "Wild Magic Surge Table",
            },
          },
        ],
        settings: {
          get: jest
            .fn()
            .mockReturnValueOnce("None")
            .mockReturnValueOnce("Wild Magic Surge"),
        },
        user: {
          id: "123",
        },
      };
    });

    it("should not call the draw function", async () => {
      await RollTableMagicSurge.Check("WMS", actor);

      expect((global as any).game.tables[0].draw).not.toHaveBeenCalled();

      expect((global as any).game.tables[0].draw).toHaveBeenCalledTimes(0);
    });
  });
});
