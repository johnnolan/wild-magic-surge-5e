import TriggerMacro from "./TriggerMacro";
import Logger from "./Logger";
import { WMSCONST } from "./WMSCONST";
import "../__mocks__/index";

const mockMacroExecute = jest.fn();
const mockLoggerError = jest.fn();
Logger.error = mockLoggerError;

describe("TriggerMacro", () => {
  const actor = { id: "actorId", name: "Actor Name" };
  const token = { id: "tokenId", name: "Token Name" };

  beforeEach(() => {
    jest.clearAllMocks();
    (global as any).game = {
      actors: { get: jest.fn().mockReturnValue(actor) },
      macros: [{ name: "WMSMacro", isOwner: true, execute: mockMacroExecute }],
      settings: {
        get: jest.fn((_module: string, key: string) => {
          if (key === WMSCONST.OPT_TRIGGERMACRO_NAME) return "WMSMacro";
          if (key === WMSCONST.OPT_TRIGGERMACRO_ENABLE) return true;
        }),
      },
    };
    (global as any).canvas = {
      tokens: { get: jest.fn().mockReturnValue(token) },
    };
  });

  it("does not call a macro when the module is disabled", async () => {
    (global as any).game.settings.get.mockImplementation(
      (_module: string, key: string) =>
        key === WMSCONST.OPT_TRIGGERMACRO_ENABLE ? false : "WMSMacro",
    );

    await TriggerMacro.Run("actorId", "tokenId");

    expect(mockMacroExecute).not.toHaveBeenCalled();
    expect((global as any).game.actors.get).not.toHaveBeenCalled();
  });

  it("does not call a missing macro", async () => {
    (global as any).game.macros = [];

    await TriggerMacro.Run("actorId", "tokenId");

    expect(mockLoggerError).toHaveBeenCalled();
    expect(mockMacroExecute).not.toHaveBeenCalled();
  });

  it("does not call an unowned macro", async () => {
    (global as any).game.macros[0].isOwner = false;

    await TriggerMacro.Run("actorId", "tokenId");

    expect(mockLoggerError).toHaveBeenCalled();
    expect(mockMacroExecute).not.toHaveBeenCalled();
  });

  it("passes the resolved actor and canvas token to the macro", async () => {
    await TriggerMacro.Run("actorId", "tokenId");

    expect((global as any).game.actors.get).toHaveBeenCalledWith("actorId");
    expect((global as any).canvas.tokens.get).toHaveBeenCalledWith("tokenId");
    expect(mockMacroExecute).toHaveBeenCalledWith({ actor, token });
  });

  it("does not look up or execute a macro without an actor ID", async () => {
    await TriggerMacro.Run(null, "tokenId");

    expect((global as any).game.actors.get).not.toHaveBeenCalled();
    expect(mockMacroExecute).not.toHaveBeenCalled();
  });

  it("does not execute a macro when the actor cannot be found", async () => {
    (global as any).game.actors.get.mockReturnValue(undefined);

    await TriggerMacro.Run("actorId", "tokenId");

    expect(mockMacroExecute).not.toHaveBeenCalled();
    expect((global as any).canvas.tokens.get).not.toHaveBeenCalled();
  });

  it("runs an actor macro without a token ID", async () => {
    await TriggerMacro.Run("actorId", undefined);

    expect((global as any).canvas.tokens.get).not.toHaveBeenCalled();
    expect(mockMacroExecute).toHaveBeenCalledWith({ actor, token: undefined });
  });

  it("runs an actor macro when the canvas has no tokens", async () => {
    (global as any).canvas = undefined;

    await TriggerMacro.Run("actorId", "tokenId");

    expect(mockMacroExecute).toHaveBeenCalledWith({ actor, token: undefined });
  });
});
