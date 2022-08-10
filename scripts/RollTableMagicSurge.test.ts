import RollTableMagicSurge from "./RollTableMagicSurge";
import "../__mocks__/index";

jest.mock("./Chat");

describe("RollTableMagicSurge", () => {
  describe("If no table is found matching", () => {
    let rollTableMagicSurge: any;

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
            .mockReturnValueOnce(true)
            .mockReturnValueOnce(undefined),
        },
        user: {
          id: "123",
        },
      };
      rollTableMagicSurge = new RollTableMagicSurge();
    });

    it("should not call the table", async () => {
      await rollTableMagicSurge.Check();

      expect((global as any).game.tables[0].roll).not.toBeCalled();
    });
  });

  describe("If the table type is not passed", () => {
    let rollTableMagicSurge: any;

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

      expect((global as any).game.tables[0].roll).toBeCalled();

      expect((global as any).game.tables[0].roll).toHaveBeenCalledTimes(1);
    });
  });

  describe("If the table type is Wild Magic Surge", () => {
    let rollTableMagicSurge: any;

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

      expect((global as any).game.tables[0].roll).toBeCalled();

      expect((global as any).game.tables[0].roll).toHaveBeenCalledTimes(1);
    });
  });

  describe("If the table type is Path of Wild Magic", () => {
    let rollTableMagicSurge: any;

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

      expect((global as any).game.tables[0].roll).toBeCalled();

      expect((global as any).game.tables[0].roll).toHaveBeenCalledTimes(1);
    });
  });

  describe("If the roll table setting is false", () => {
    let rollTableMagicSurge: any;

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

      expect((global as any).game.tables[0].roll).not.toBeCalled();

      expect((global as any).game.tables[0].roll).toHaveBeenCalledTimes(0);
    });
  });
});
