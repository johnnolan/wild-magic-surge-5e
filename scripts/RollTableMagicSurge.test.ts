import RollTableMagicSurge from "./RollTableMagicSurge";
import Logger from "./Logger";
import Chat from "./Chat";
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
      await RollTableMagicSurge.Check(undefined, actor);

      expect((global as any).game.tables[0].roll).not.toHaveBeenCalled();
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
      await RollTableMagicSurge.Check(undefined, actor);

      expect((global as any).game.tables[0].roll).not.toHaveBeenCalled();
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
      await RollTableMagicSurge.Check(undefined, actor);

      expect((global as any).game.tables[0].roll).toHaveBeenCalled();

      expect((global as any).game.tables[0].roll).toHaveBeenCalledTimes(1);
    });

    it("propagates a rejected table chat creation", async () => {
      const error = new Error("Cannot create table chat");
      (Chat.Send as jest.Mock).mockRejectedValueOnce(error);

      await expect(RollTableMagicSurge.Check(undefined, actor)).rejects.toBe(error);
    });
  });

  it("uses one table roll when the actor level is absent or malformed", async () => {
    const rollOnTable = jest
      .spyOn(RollTableMagicSurge, "RollOnTable")
      .mockResolvedValue("result");
    (global as any).game = {
      settings: { get: jest.fn().mockReturnValue("AUTO") },
    };

    try {
      await RollTableMagicSurge.Check("WMS", {
        system: { details: { level: "14" } },
      } as unknown as Actor);

      expect(rollOnTable).toHaveBeenCalledTimes(1);
    } finally {
      rollOnTable.mockRestore();
    }
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
      await RollTableMagicSurge.Check("WMS", actor);

      expect((global as any).game.tables[0].roll).toHaveBeenCalled();

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
      const result = await RollTableMagicSurge.Check("WMS", actor);

      expect((global as any).game.tables[0].roll).toHaveBeenCalled();

      expect((global as any).game.tables[0].roll).toHaveBeenCalledTimes(1);

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
      await RollTableMagicSurge.Check("POWM", actor);

      expect((global as any).game.tables[0].roll).toHaveBeenCalled();

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
      await RollTableMagicSurge.Check("WMS", actor);

      expect((global as any).game.tables[0].roll).not.toHaveBeenCalled();

      expect((global as any).game.tables[0].roll).toHaveBeenCalledTimes(0);
    });
  });
});
