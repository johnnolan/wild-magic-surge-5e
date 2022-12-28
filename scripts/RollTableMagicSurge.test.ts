import RollTableMagicSurge from "./RollTableMagicSurge";
import Logger from "./Logger";
import "../__mocks__/index";

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
            .mockReturnValueOnce("AUTO")
            .mockReturnValueOnce("undefined"),
        },
        user: {
          id: "123",
        },
      };
    });

    it("should not call the table", async () => {
      await RollTableMagicSurge.Check();

      expect((global as any).game.tables[0].roll).not.toBeCalled();
      expect(mockLoggerError).toBeCalled();
    });
  });

  describe("If no table is found matching", () => {
    beforeEach(() => {
      global.renderTemplate = jest.fn().mockResolvedValue("Content");
      (global as any).game = {
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
            .mockReturnValueOnce("AUTO")
            .mockReturnValueOnce(undefined),
        },
        user: {
          id: "123",
        },
      };
    });

    it("should not call the table", async () => {
      await RollTableMagicSurge.Check();

      expect((global as any).game.tables[0].roll).not.toBeCalled();
    });
  });

  describe("If the table type is not passed", () => {
    beforeEach(() => {
      global.renderTemplate = jest.fn().mockResolvedValue("Content");
      (global as any).game = {
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
            .mockReturnValueOnce("AUTO")
            .mockReturnValueOnce("Wild Magic Surge"),
        },
        user: {
          id: "123",
        },
      };
    });

    it("should call the draw function once", async () => {
      await RollTableMagicSurge.Check();

      expect((global as any).game.tables[0].roll).toBeCalled();

      expect((global as any).game.tables[0].roll).toHaveBeenCalledTimes(1);
    });
  });

  describe("If the table type is Wild Magic Surge but no results passed back", () => {

    beforeEach(() => {
      global.renderTemplate = jest.fn().mockResolvedValue("Content");
      (global as any).game = {
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
            .mockReturnValueOnce("AUTO")
            .mockReturnValueOnce("Wild Magic Surge"),
        },
        user: {
          id: "123",
        },
      };
    });

    it("should call the draw function once", async () => {
      await RollTableMagicSurge.Check("WMS");

      expect((global as any).game.tables[0].roll).toBeCalled();

      expect((global as any).game.tables[0].roll).toHaveBeenCalledTimes(1);
    });
  });

  describe("If the table type is Wild Magic Surge", () => {

    beforeEach(() => {
      global.renderTemplate = jest.fn().mockResolvedValue("Content");
      (global as any).game = {
        tables: [
          {
            name: "Wild Magic Surge",
            roll: jest.fn().mockResolvedValue({
              results: [{
                text: "test"
              }],
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
            .mockReturnValueOnce("AUTO")
            .mockReturnValueOnce("Wild Magic Surge"),
        },
        user: {
          id: "123",
        },
      };
    });

    it("should call the draw function once", async () => {
      const result = await RollTableMagicSurge.Check("WMS");

      expect((global as any).game.tables[0].roll).toBeCalled();

      expect((global as any).game.tables[0].roll).toHaveBeenCalledTimes(1);

      expect(result).toBe("test");
    });
  });

  describe("If the table type is Path of Wild Magic", () => {
    beforeEach(() => {
      global.renderTemplate = jest.fn().mockResolvedValue("Content");
      (global as any).game = {
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
            .mockReturnValueOnce("AUTO")
            .mockReturnValueOnce("Path of Wild Magic"),
        },
        user: {
          id: "123",
        },
      };
    });

    it("should call the draw function once", async () => {
      await RollTableMagicSurge.Check("POWM");

      expect((global as any).game.tables[0].roll).toBeCalled();

      expect((global as any).game.tables[0].roll).toHaveBeenCalledTimes(1);
    });
  });

  describe("If the roll table setting is false", () => {
    beforeEach(() => {
      global.renderTemplate = jest.fn().mockResolvedValue("Content");
      (global as any).game = {
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
            .mockReturnValueOnce("None")
            .mockReturnValueOnce("Wild Magic Surge"),
        },
        user: {
          id: "123",
        },
      };
    });

    it("should not call the draw function", async () => {
      await RollTableMagicSurge.Check("WMS");

      expect((global as any).game.tables[0].roll).not.toBeCalled();

      expect((global as any).game.tables[0].roll).toHaveBeenCalledTimes(0);
    });
  });
});
