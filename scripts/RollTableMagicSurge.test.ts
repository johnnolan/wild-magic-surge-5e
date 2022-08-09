import RollTableMagicSurge from "./RollTableMagicSurge.js";
import "../__mocks__/index.js";

// @ts-expect-error TS(2304): Cannot find name 'jest'.
jest.mock("./Chat.js");

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe("RollTableMagicSurge", () => {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe("If no table is found matching", () => {
    let rollTableMagicSurge: any;
    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(() => {
      // @ts-expect-error TS(2304): Cannot find name 'global'.
      global.renderTemplate = jest.fn().mockResolvedValue("Content");
      // @ts-expect-error TS(2304): Cannot find name 'global'.
      global.game = {
        tables: [
          {
            name: "Wild Magic Surge",
            // @ts-expect-error TS(2304): Cannot find name 'jest'.
            roll: jest.fn().mockResolvedValue({
              results: [],
              // @ts-expect-error TS(2304): Cannot find name 'jest'.
              render: jest.fn().mockResolvedValue(""),
            }),
            // @ts-expect-error TS(2304): Cannot find name 'jest'.
            results: jest.fn().mockResolvedValue([]),
            data: {
              description: "Wild Magic Surge Table Test",
            },
          },
        ],
        settings: {
          // @ts-expect-error TS(2304): Cannot find name 'jest'.
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

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it("should not call the table", async () => {
      await rollTableMagicSurge.Check();
      // @ts-expect-error TS(2304): Cannot find name 'expect'.
      expect(global.game.tables[0].roll).not.toBeCalled();
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe("If the table type is not passed", () => {
    let rollTableMagicSurge: any;
    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(() => {
      // @ts-expect-error TS(2304): Cannot find name 'global'.
      global.renderTemplate = jest.fn().mockResolvedValue("Content");
      // @ts-expect-error TS(2304): Cannot find name 'global'.
      global.game = {
        tables: [
          {
            name: "Wild Magic Surge",
            // @ts-expect-error TS(2304): Cannot find name 'jest'.
            roll: jest.fn().mockResolvedValue({
              results: [],
              // @ts-expect-error TS(2304): Cannot find name 'jest'.
              render: jest.fn().mockResolvedValue(""),
            }),
            // @ts-expect-error TS(2304): Cannot find name 'jest'.
            results: jest.fn().mockResolvedValue([]),
            data: {
              description: "Wild Magic Surge Table Test",
            },
          },
        ],
        settings: {
          // @ts-expect-error TS(2304): Cannot find name 'jest'.
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

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it("should call the draw function once", async () => {
      await rollTableMagicSurge.Check();
      // @ts-expect-error TS(2304): Cannot find name 'expect'.
      expect(global.game.tables[0].roll).toBeCalled();
      // @ts-expect-error TS(2304): Cannot find name 'expect'.
      expect(global.game.tables[0].roll).toHaveBeenCalledTimes(1);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe("If the table type is Wild Magic Surge", () => {
    let rollTableMagicSurge: any;
    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(() => {
      // @ts-expect-error TS(2304): Cannot find name 'global'.
      global.renderTemplate = jest.fn().mockResolvedValue("Content");
      // @ts-expect-error TS(2304): Cannot find name 'global'.
      global.game = {
        tables: [
          {
            name: "Wild Magic Surge",
            // @ts-expect-error TS(2304): Cannot find name 'jest'.
            roll: jest.fn().mockResolvedValue({
              results: [],
              // @ts-expect-error TS(2304): Cannot find name 'jest'.
              render: jest.fn().mockResolvedValue(""),
            }),
            // @ts-expect-error TS(2304): Cannot find name 'jest'.
            results: jest.fn().mockResolvedValue([]),
            data: {
              description: "Wild Magic Surge Table",
            },
          },
        ],
        settings: {
          // @ts-expect-error TS(2304): Cannot find name 'jest'.
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

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it("should call the draw function once", async () => {
      await rollTableMagicSurge.Check("WMS");
      // @ts-expect-error TS(2304): Cannot find name 'expect'.
      expect(global.game.tables[0].roll).toBeCalled();
      // @ts-expect-error TS(2304): Cannot find name 'expect'.
      expect(global.game.tables[0].roll).toHaveBeenCalledTimes(1);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe("If the table type is Path of Wild Magic", () => {
    let rollTableMagicSurge: any;
    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(() => {
      // @ts-expect-error TS(2304): Cannot find name 'global'.
      global.renderTemplate = jest.fn().mockResolvedValue("Content");
      // @ts-expect-error TS(2304): Cannot find name 'global'.
      global.game = {
        tables: [
          {
            name: "Path of Wild Magic",
            // @ts-expect-error TS(2304): Cannot find name 'jest'.
            roll: jest.fn().mockResolvedValue({
              results: [],
              // @ts-expect-error TS(2304): Cannot find name 'jest'.
              render: jest.fn().mockResolvedValue(""),
            }),
            // @ts-expect-error TS(2304): Cannot find name 'jest'.
            results: jest.fn().mockResolvedValue([]),
            data: {
              description: "Path of Wild Magic Surge",
            },
          },
        ],
        settings: {
          // @ts-expect-error TS(2304): Cannot find name 'jest'.
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

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it("should call the draw function once", async () => {
      await rollTableMagicSurge.Check("POWM");
      // @ts-expect-error TS(2304): Cannot find name 'expect'.
      expect(global.game.tables[0].roll).toBeCalled();
      // @ts-expect-error TS(2304): Cannot find name 'expect'.
      expect(global.game.tables[0].roll).toHaveBeenCalledTimes(1);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe("If the roll table setting is false", () => {
    let rollTableMagicSurge: any;
    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(() => {
      // @ts-expect-error TS(2304): Cannot find name 'global'.
      global.renderTemplate = jest.fn().mockResolvedValue("Content");
      // @ts-expect-error TS(2304): Cannot find name 'global'.
      global.game = {
        tables: [
          {
            name: "Wild Magic Surge",
            // @ts-expect-error TS(2304): Cannot find name 'jest'.
            roll: jest.fn().mockResolvedValue({
              results: [],
              // @ts-expect-error TS(2304): Cannot find name 'jest'.
              render: jest.fn().mockResolvedValue(""),
            }),
            // @ts-expect-error TS(2304): Cannot find name 'jest'.
            results: jest.fn().mockResolvedValue([]),
            data: {
              description: "Wild Magic Surge Table",
            },
          },
        ],
        settings: {
          // @ts-expect-error TS(2304): Cannot find name 'jest'.
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

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it("should not call the draw function", async () => {
      await rollTableMagicSurge.Check("WMS");
      // @ts-expect-error TS(2304): Cannot find name 'expect'.
      expect(global.game.tables[0].roll).not.toBeCalled();
      // @ts-expect-error TS(2304): Cannot find name 'expect'.
      expect(global.game.tables[0].roll).toHaveBeenCalledTimes(0);
    });
  });
});
