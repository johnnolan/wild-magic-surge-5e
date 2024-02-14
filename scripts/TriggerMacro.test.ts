import TriggerMacro from "./TriggerMacro";
import Logger from "./Logger";
import "../__mocks__/index";

const mockMacroExecute = jest.fn();
const mockLoggerError = jest.fn();
Logger.error = mockLoggerError;

describe("TriggerMacro", () => {
  beforeEach(() => {
    jest.resetAllMocks();
    (global as any).game = {
      actors: {
        get: jest.fn().mockReturnValue({
          actorId: "actorId",
          name: "Actor Name",
        }),
      },
    };
    (global as any).canvas = {
      tokens: {
        get: jest.fn().mockReturnValue({
          actorId: "tokenId",
          name: "Token Name",
        }),
      },
    };
  });
  describe("given module is disabled", () => {
    beforeEach(() => {
      (global as any).game = {
        macros: {
          find: jest.fn().mockResolvedValue({
            name: "WMSMacro",
          }),
        },
        settings: {
          get: jest
            .fn()
            .mockReturnValueOnce(undefined)
            .mockReturnValueOnce(false),
        },
      };
    });

    it("should not call the macro", async () => {
      await TriggerMacro.Run("actorId", "tokenId");

      expect((global as any).game.macros.find).not.toHaveBeenCalled();
      expect(mockLoggerError).not.toHaveBeenCalled();
    });
  });

  describe("given module is enabled but the macro does not exist", () => {
    beforeEach(() => {
      (global as any).game = {
        macros: {
          find: jest.fn().mockReturnValue(undefined),
        },
        settings: {
          get: jest
            .fn()
            .mockReturnValueOnce("WMSMacro Wrong Setting")
            .mockReturnValueOnce(true),
        },
      };
    });

    it("should not call the macro", async () => {
      await TriggerMacro.Run("actorId", "tokenId");

      expect((global as any).game.macros.find).toHaveBeenCalled();
      expect(mockLoggerError).toHaveBeenCalled();
      expect(mockMacroExecute).not.toHaveBeenCalled();
    });
  });

  describe("given module is enabled and setup correctly", () => {
    beforeEach(() => {
      (global as any).game = {
        macros: [
          {
            name: "WMSMacro",
            isOwner: true,
            execute: mockMacroExecute,
          },
        ],
        settings: {
          get: jest
            .fn()
            .mockReturnValueOnce("WMSMacro")
            .mockReturnValueOnce(true),
        },
      };
    });

    it("should call the macro", async () => {
      await TriggerMacro.Run("actorId", "tokenId");

      expect(mockLoggerError).not.toHaveBeenCalled();
      expect(mockMacroExecute).toHaveBeenCalled();
    });
  });

  describe("given the macro to call is not owned by the GM", () => {
    beforeEach(() => {
      (global as any).game = {
        macros: [
          {
            name: "WMSMacro",
            isOwner: false,
            execute: mockMacroExecute,
          },
        ],
        settings: {
          get: jest
            .fn()
            .mockReturnValueOnce("WMSMacro")
            .mockReturnValueOnce(true),
        },
      };
    });

    it("should not call the macro", async () => {
      await TriggerMacro.Run("actorId", "tokenId");

      expect(mockLoggerError).toHaveBeenCalled();
      expect(mockMacroExecute).not.toHaveBeenCalled();
    });
  });
});
