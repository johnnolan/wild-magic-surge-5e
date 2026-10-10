import Chat from "./Chat";
import { WMSCONST } from "./WMSCONST";
import {
  chatMessageFixture,
  rollFixture,
  rollTableFixture,
  setTestGame,
  setTestGlobal,
  tableDrawFixture,
} from "./test/FoundryFixtures";

describe("Chat on Foundry with core.rollMode", () => {
  const speaker = { alias: "Caster" };
  const created = chatMessageFixture({ id: "legacy-message" });
  const settings = new Map<string, unknown>();
  let coreMode: string;
  let whisper: boolean;
  let tableWhisper: boolean;
  let tableMode: string;
  const get = jest.fn((namespace: string, key: string) => {
    if (namespace === "core") {
      if (!settings.has(`core.${key}`)) {
        throw new Error(`"core.${key}" is not a registered game setting`);
      }
      return key === "messageMode" ? "self" : coreMode;
    }
    if (key === WMSCONST.OPT_WHISPER_GM) return whisper;
    if (key === WMSCONST.OPT_WHISPER_GM_ROLL_CHAT) return tableWhisper;
    if (key === WMSCONST.OPT_ROLLTABLE_ENABLE) return tableMode;
    if (key === WMSCONST.OPT_WMS_NAME) return "Wild Magic Surge";
  });
  const create = jest.fn();
  const applyRollMode = jest.fn(
    (data: ChatMessage.CreateData, mode: string) => {
      // Model the documented legacy API, including text-only chat messages.
      data.whisper =
        mode === "selfroll"
          ? ["caster-id"]
          : mode === "publicroll"
            ? []
            : ["gm-id"];
      data.blind = mode === "blindroll";
      return data;
    },
  );

  beforeEach(() => {
    jest.clearAllMocks();
    settings.clear();
    settings.set("core.rollMode", {});
    coreMode = "publicroll";
    whisper = false;
    tableWhisper = false;
    tableMode = "AUTO";
    create.mockResolvedValue(created);
    setTestGame({
      settings: { get, settings },
      user: { id: "caster-id" },
      i18n: { format: () => "Wild Magic Surge" },
    });
    setTestGlobal("CONFIG", { ChatMessage: {} });
    setTestGlobal("ChatMessage", {
      create,
      getSpeaker: () => speaker,
      applyRollMode,
    });
  });

  it.each([
    { mode: "publicroll", recipients: [], blind: false },
    { mode: "gmroll", recipients: ["gm-id"], blind: false },
    { mode: "blindroll", recipients: ["gm-id"], blind: true },
    { mode: "selfroll", recipients: ["caster-id"], blind: false },
  ])("creates a roll using the client's $mode mode", async (testCase) => {
    coreMode = testCase.mode;
    const roll = rollFixture({ total: 7 });

    await expect(
      Chat.Send(WMSCONST.CHAT_TYPE.ROLL, "Surge check", roll),
    ).resolves.toBe(created);

    expect(get).not.toHaveBeenCalledWith("core", "messageMode");
    expect(applyRollMode).toHaveBeenCalledWith(
      expect.objectContaining({ rolls: [roll] }),
      testCase.mode,
    );
    expect(create).toHaveBeenCalledTimes(1);
    expect(create).toHaveBeenCalledWith(
      expect.objectContaining({
        rolls: [roll],
        speaker,
        whisper: testCase.recipients,
        blind: testCase.blind,
      }),
    );
  });

  it("makes player-trigger rolls public even when the client uses self rolls", async () => {
    coreMode = "selfroll";
    tableMode = "PLAYER_TRIGGER";

    await Chat.Send("ROLL", "Surge check", rollFixture({ total: 7 }));

    expect(applyRollMode).toHaveBeenCalledWith(
      expect.any(Object),
      "publicroll",
    );
    expect(create).toHaveBeenCalledWith(
      expect.objectContaining({ whisper: [], blind: false }),
    );
  });

  it.each(["DEFAULT", "ROLL"])(
    "keeps a GM-only %s message private without a rolls field",
    async (type) => {
      whisper = true;
      tableMode = "PLAYER_TRIGGER";

      await Chat.Send(type, "GM check", rollFixture({ total: 7 }));

      expect(applyRollMode).toHaveBeenCalledWith(
        expect.any(Object),
        "blindroll",
      );
      expect(create).toHaveBeenCalledTimes(1);
      expect(create).toHaveBeenCalledWith(
        expect.objectContaining({
          content: expect.stringContaining("GM check"),
          whisper: ["gm-id"],
          blind: true,
        }),
      );
      expect(create.mock.calls[0][0]).not.toHaveProperty("rolls");
    },
  );

  it("keeps an automatic GM-only table roll private", async () => {
    tableWhisper = true;
    const roll = rollFixture({
      render: jest.fn().mockResolvedValue("<span>7</span>"),
    });
    const draw = tableDrawFixture({
      roll,
      results: [{ description: "Table result" }],
    });

    await Chat.Send("TABLE", "", draw, rollTableFixture({}));

    expect(applyRollMode).toHaveBeenCalledWith(expect.any(Object), "blindroll");
    expect(create).toHaveBeenCalledWith(
      expect.objectContaining({
        rolls: [roll],
        whisper: ["gm-id"],
        blind: true,
      }),
    );
  });

  it("uses messageMode when both core settings are registered", async () => {
    settings.set("core.messageMode", {});
    setTestGlobal("CONFIG", { ChatMessage: { modes: { self: {} } } });
    const roll = rollFixture({ total: 7 });

    await Chat.Send("ROLL", "Surge check", roll);

    expect(get).toHaveBeenCalledWith("core", "messageMode");
    expect(get).not.toHaveBeenCalledWith("core", "rollMode");
    expect(applyRollMode).not.toHaveBeenCalled();
    expect(create).toHaveBeenCalledWith(
      expect.objectContaining({ rolls: [roll] }),
      { messageMode: "self" },
    );
  });
});
