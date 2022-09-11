import TriggerMacro from "./TriggerMacro";
import Logger from "./Logger";
import "../__mocks__/index";

const mockMacroExecute = jest.fn();
const mockLoggerError = jest.fn();
Logger.error = mockLoggerError;

describe("TriggerMacro", () => {
  beforeEach(() => {
    jest.resetAllMocks();
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

    it("should not call the table", async () => {
      await TriggerMacro.Run();

      expect((global as any).game.macros.find).not.toBeCalled();
      expect(mockLoggerError).not.toBeCalled();
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

    it("should not call the table", async () => {
      await TriggerMacro.Run();

      expect((global as any).game.macros.find).toBeCalled();
      expect(mockLoggerError).toBeCalled();
      expect(mockMacroExecute).not.toBeCalled();
    });
  });

  describe("given module is enabled and setup correctly", () => {
    beforeEach(() => {
      (global as any).game = {
        macros: [
          {
            name: "WMSMacro",
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

    it("should not call the table", async () => {
      await TriggerMacro.Run();

      expect(mockLoggerError).not.toBeCalled();
      expect(mockMacroExecute).toBeCalled();
    });
  });
});
