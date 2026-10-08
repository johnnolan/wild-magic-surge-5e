import {
  chatMessageFixture,
  rollFixture,
  rollTableFixture,
  tableDrawFixture,
  setTestGame,
  setTestHooks,
  testGlobals,
} from "./test/FoundryFixtures";
import { WMSCONST } from "./WMSCONST";
import Chat from "./Chat";
import "../__mocks__/index";

describe("Chat", () => {
  beforeEach(() => {
    testGlobals.game.roll = {
      get: jest.fn().mockResolvedValue(true),
      result: jest.fn().mockResolvedValue(20),
    };
    jest.clearAllMocks();

    jest.resetAllMocks();
  });

  it("resolves only after chat creation finishes and returns the created message", async () => {
    const created = chatMessageFixture({ id: "message-1" });
    let finishCreate: ((message: ChatMessage.Stored) => void) | undefined;
    const create = ChatMessage.create as jest.Mock;
    create.mockImplementation(
      () =>
        new Promise<ChatMessage.Stored>((resolve) => {
          finishCreate = resolve;
        }),
    );

    let completed = false;
    const send = Chat.Send(WMSCONST.CHAT_TYPE.DEFAULT, "Deferred message");
    void send.then(() => {
      completed = true;
    });
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(create).toHaveBeenCalled();
    expect(completed).toBe(false);
    finishCreate?.(created);
    await expect(send).resolves.toBe(created);
    expect(completed).toBe(true);
  });

  it("rejects when chat creation fails", async () => {
    const error = new Error("Cannot create chat message");
    (ChatMessage.create as jest.Mock).mockRejectedValue(error);

    await expect(
      Chat.Send(WMSCONST.CHAT_TYPE.DEFAULT, "Failed message"),
    ).rejects.toBe(error);
  });

  const routingCases = [
    {
      name: "DEFAULT public",
      type: "DEFAULT",
      whisper: false,
      tableWhisper: false,
      coreMode: "public",
      tableMode: "DEFAULT",
      expectedMode: undefined,
    },
    {
      name: "DEFAULT GM-only",
      type: "DEFAULT",
      whisper: true,
      tableWhisper: false,
      coreMode: "public",
      tableMode: "DEFAULT",
      expectedMode: "blind",
    },
    {
      name: "ROLL public",
      type: "ROLL",
      whisper: false,
      tableWhisper: false,
      coreMode: "public",
      tableMode: "DEFAULT",
      expectedMode: "public",
    },
    {
      name: "ROLL GM-only",
      type: "ROLL",
      whisper: true,
      tableWhisper: false,
      coreMode: "public",
      tableMode: "DEFAULT",
      expectedMode: "blind",
    },
    {
      name: "ROLL core self",
      type: "ROLL",
      whisper: false,
      tableWhisper: false,
      coreMode: "self",
      tableMode: "DEFAULT",
      expectedMode: "self",
    },
    {
      name: "ROLL core GM",
      type: "ROLL",
      whisper: false,
      tableWhisper: false,
      coreMode: "gm",
      tableMode: "DEFAULT",
      expectedMode: "gm",
    },
    {
      name: "ROLL ignores table whisper",
      type: "ROLL",
      whisper: false,
      tableWhisper: true,
      coreMode: "public",
      tableMode: "DEFAULT",
      expectedMode: "public",
    },
    {
      name: "ROLL player trigger overrides self",
      type: "ROLL",
      whisper: false,
      tableWhisper: false,
      coreMode: "self",
      tableMode: "PLAYER_TRIGGER",
      expectedMode: "public",
    },
    {
      name: "ROLL GM whisper overrides player trigger",
      type: "ROLL",
      whisper: true,
      tableWhisper: false,
      coreMode: "self",
      tableMode: "PLAYER_TRIGGER",
      expectedMode: "blind",
    },
    {
      name: "TABLE public despite check whisper",
      type: "TABLE",
      whisper: true,
      tableWhisper: false,
      coreMode: "self",
      tableMode: "AUTO",
      expectedMode: undefined,
    },
    {
      name: "TABLE GM-only",
      type: "TABLE",
      whisper: false,
      tableWhisper: true,
      coreMode: "public",
      tableMode: "AUTO",
      expectedMode: "blind",
    },
  ] as const;

  it.each(routingCases)(
    "routes $name with one ChatMessage.create call",
    async ({
      type,
      whisper,
      tableWhisper,
      coreMode,
      tableMode,
      expectedMode,
    }) => {
      testGlobals.game.settings.get = jest.fn(
        (namespace: string, key: string) => {
          if (namespace === "core" && key === "messageMode") return coreMode;
          if (key === WMSCONST.OPT_WHISPER_GM) return whisper;
          if (key === WMSCONST.OPT_WHISPER_GM_ROLL_CHAT) return tableWhisper;
          if (key === WMSCONST.OPT_ROLLTABLE_ENABLE) return tableMode;
          if (key === WMSCONST.OPT_WMS_NAME) return "Wild Magic Surge";
        },
      );
      const roll = rollFixture({ total: 7, formula: "1d20" });
      const draw = tableDrawFixture({
        roll: rollFixture({
          render: jest.fn().mockResolvedValue("<span>7</span>"),
        }),
        results: [{ description: "Unique table result" }],
      });
      const table = rollTableFixture({ name: "Unique table" });
      const input =
        type === "TABLE" ? draw : type === "ROLL" ? roll : undefined;

      await Chat.Send(type, "Unique check text", input, table);

      const create = ChatMessage.create as jest.Mock;
      expect(create).toHaveBeenCalledTimes(1);
      const [data, options] = create.mock.calls[0];
      expect(data.speaker).toEqual(ChatMessage.getSpeaker());
      if (type === "ROLL" && !whisper) {
        expect(data.flavor).toContain("Unique check text");
        expect(data.rolls).toEqual([roll]);
      } else if (type === "TABLE") {
        expect(data.content).toContain("Unique table result");
        expect(data.rolls).toEqual([draw.roll]);
      } else {
        expect(data.content).toContain("Unique check text");
      }
      expect(options).toEqual(
        expectedMode ? { messageMode: expectedMode } : undefined,
      );
      expect(create.mock.calls[0]).toHaveLength(expectedMode ? 2 : 1);
    },
  );

  it.each([
    {
      name: "ROLL without a roll",
      type: "ROLL",
      input: undefined,
      table: undefined,
    },
    {
      name: "ROLL with a table draw",
      type: "ROLL",
      input: tableDrawFixture({ roll: rollFixture({}), results: [] }),
      table: undefined,
    },
    {
      name: "TABLE without a draw",
      type: "TABLE",
      input: undefined,
      table: rollTableFixture({}),
    },
    {
      name: "TABLE without a table",
      type: "TABLE",
      input: tableDrawFixture({ roll: rollFixture({}), results: [] }),
      table: undefined,
    },
    {
      name: "TABLE with a plain roll",
      type: "TABLE",
      input: rollFixture({}),
      table: rollTableFixture({}),
    },
  ])(
    "skips $name without creating a message",
    async ({ type, input, table }) => {
      testGlobals.game.settings.get = jest.fn().mockReturnValue(false);

      await expect(
        Chat.Send(type, "Unused", input, table),
      ).resolves.toBeUndefined();

      expect(ChatMessage.create).not.toHaveBeenCalled();
    },
  );

  describe("createDefaultChat", () => {
    describe("Given I pass it a message", () => {
      it("It returns the just the content", async () => {
        await Chat.Send(WMSCONST.CHAT_TYPE.DEFAULT, "My Custom Message");

        expect(ChatMessage.create).toHaveBeenCalledWith({
          content: "<div>My Custom Message</div>",
          speaker: {
            scene: null,
            actor: null,
            token: null,
            alias: "Test Speaker",
          },
        });
      });
    });

    it("uses blind visibility when GM-only chat is enabled", async () => {
      testGlobals.game.settings.get = jest.fn(
        (_namespace: string, key: string) => key === WMSCONST.OPT_WHISPER_GM,
      );

      await Chat.Send(WMSCONST.CHAT_TYPE.DEFAULT, "GM message");

      expect(ChatMessage.create).toHaveBeenCalledWith(
        expect.objectContaining({ content: "<div>GM message</div>" }),
        { messageMode: "blind" },
      );
    });
  });

  describe("createRollChat", () => {
    describe("Given I pass it a message and roll but is whisper to GM", () => {
      let roll: Roll;

      beforeEach(() => {
        testGlobals.game.settings.get = jest.fn().mockResolvedValue(true);
        roll = rollFixture({
          result: 20,
          total: 20,
        });
      });

      it("It returns the just the content", async () => {
        await Chat.Send(WMSCONST.CHAT_TYPE.ROLL, "My Custom Message", roll);

        expect(ChatMessage.create).toHaveBeenCalledWith(
          {
            content: `<div>My Custom Message (${roll.total})</div>`,
            speaker: {
              scene: null,
              actor: null,
              token: null,
              alias: "Test Speaker",
            },
          },
          { messageMode: "blind" },
        );
      });
    });

    describe("Given I pass it a message and roll but its a public message", () => {
      let roll: Roll;

      beforeEach(() => {
        testGlobals.game.settings.get = jest.fn(
          (_namespace: string, key: string) => {
            if (
              key === WMSCONST.OPT_WHISPER_GM ||
              key === WMSCONST.OPT_WHISPER_GM_ROLL_CHAT
            )
              return false;
            if (key === WMSCONST.OPT_WMS_NAME) return "Wild Magic Surge";
            if (key === WMSCONST.OPT_ROLLTABLE_ENABLE) return "PLAYER_TRIGGER";
            if (key === "messageMode") return "public";
          },
        );
        roll = rollFixture({
          result: 20,
        });
      });

      it("It returns the just the content", async () => {
        await Chat.Send(WMSCONST.CHAT_TYPE.ROLL, "My Custom Message", roll);

        expect(ChatMessage.create).toHaveBeenCalledWith(
          {
            flavor: "Wild Magic Surge Check - My Custom Message",
            rolls: [roll],
            speaker: {
              scene: null,
              actor: null,
              token: null,
              alias: "Test Speaker",
            },
          },
          { messageMode: "public" },
        );
      });
    });

    it("uses the client's GM visibility mode for a normal roll", async () => {
      testGlobals.game.settings.get = jest.fn(
        (_namespace: string, key: string) => {
          if (
            key === WMSCONST.OPT_WHISPER_GM ||
            key === WMSCONST.OPT_WHISPER_GM_ROLL_CHAT
          )
            return false;
          if (key === WMSCONST.OPT_WMS_NAME) return "Wild Magic Surge";
          if (key === WMSCONST.OPT_ROLLTABLE_ENABLE) return "AUTO";
          if (key === "messageMode") return "gm";
        },
      );
      const roll = rollFixture({ result: 20 });

      await Chat.Send(WMSCONST.CHAT_TYPE.ROLL, "My Custom Message", roll);

      expect(ChatMessage.create).toHaveBeenCalledWith(
        expect.objectContaining({ rolls: [roll] }),
        { messageMode: "gm" },
      );
    });

    describe("Given I pass it a message but no roll object", () => {
      let roll: Roll;

      beforeEach(() => {
        testGlobals.game.settings.get = jest
          .fn()
          .mockResolvedValueOnce(false)
          .mockResolvedValueOnce("Wild Magic Surge")
          .mockResolvedValueOnce("public");
        roll = rollFixture({
          result: 20,
        });
      });

      it("It returns undefined", async () => {
        await Chat.Send(
          WMSCONST.CHAT_TYPE.ROLL,
          "My Custom Message",
          undefined,
        );

        expect(ChatMessage.create).not.toHaveBeenCalled();
      });
    });
  });

  describe("createRollTable", () => {
    describe("Given I pass it a message and not roll table", () => {
      let rollResult: RollTable.Draw;
      let surgeRollTable: RollTable;

      beforeEach(() => {
        testGlobals.game.settings.get = jest
          .fn()
          .mockResolvedValueOnce(false)
          .mockResolvedValueOnce("Wild Magic Surge")
          .mockResolvedValueOnce("public");
        surgeRollTable = rollTableFixture({
          data: {
            description: "Wild Magic Surge Table",
          },
        });
        rollResult = tableDrawFixture({
          results: [
            {
              description: "test text",

              getChatText: jest.fn(),
            },
          ],
          roll: {
            result: 20,

            render: jest.fn().mockResolvedValue(null),
          },
        });
      });

      it("It just returns", async () => {
        await Chat.Send(
          WMSCONST.CHAT_TYPE.TABLE,
          "",
          undefined,
          surgeRollTable,
        );

        expect(ChatMessage.create).not.toHaveBeenCalled();

        expect(global.renderTemplate).not.toHaveBeenCalled();
      });
    });

    describe("Given I set whisper gm for roll table", () => {
      let rollResult: RollTable.Draw;
      let surgeRollTable: RollTable;

      beforeEach(() => {
        testGlobals.game.settings.get = jest
          .fn()
          .mockResolvedValueOnce(false)
          .mockResolvedValueOnce(true)
          .mockResolvedValueOnce("Wild Magic Surge")
          .mockResolvedValueOnce("public");
        surgeRollTable = rollTableFixture({
          data: {
            description: "Wild Magic Surge Table",
          },
        });
        rollResult = tableDrawFixture({
          results: [
            {
              description: "test text",

              getChatText: jest.fn(),
            },
          ],
          roll: {
            result: 20,

            render: jest.fn().mockResolvedValue(null),
          },
        });
      });

      it("It returns the just the content", async () => {
        await Chat.Send(
          WMSCONST.CHAT_TYPE.TABLE,
          "",
          rollResult,
          surgeRollTable,
        );

        expect(ChatMessage.create).toHaveBeenCalledWith(
          expect.objectContaining({ rolls: [rollResult.roll] }),
          { messageMode: "blind" },
        );
      });
    });

    describe("Given I pass it a message and roll table with one result", () => {
      let rollResult: RollTable.Draw;
      let surgeRollTable: RollTable;

      beforeEach(() => {
        testGlobals.game.settings.get = jest
          .fn()
          .mockResolvedValueOnce(false)
          .mockResolvedValueOnce(false)
          .mockResolvedValueOnce("Wild Magic Surge")
          .mockResolvedValueOnce("public");
        surgeRollTable = rollTableFixture({
          data: {
            description: "Wild Magic Surge Table",
          },
        });
        rollResult = tableDrawFixture({
          results: [
            {
              description: "test text",

              getChatText: jest.fn(),
            },
          ],
          roll: {
            result: 20,

            render: jest.fn().mockResolvedValue(null),
          },
        });
      });

      it("It returns the just the content", async () => {
        await Chat.Send(
          WMSCONST.CHAT_TYPE.TABLE,
          "",
          rollResult,
          surgeRollTable,
        );

        expect(ChatMessage.create).toHaveBeenCalled();
      });
    });

    describe("Given I pass it a message and roll table with two results", () => {
      let rollResultTwoResults: RollTable.Draw;
      let surgeRollTable: RollTable;

      beforeEach(() => {
        testGlobals.game.settings.get = jest
          .fn()
          .mockResolvedValueOnce(false)
          .mockResolvedValueOnce(false)
          .mockResolvedValueOnce("Wild Magic Surge")
          .mockResolvedValueOnce("public");
        surgeRollTable = rollTableFixture({
          data: {
            description: "Wild Magic Surge Table",
          },
        });
        rollResultTwoResults = tableDrawFixture({
          results: [
            {
              description: "test text",

              getChatText: jest.fn(),
            },
            {
              description: "test text 2",

              getChatText: jest.fn(),
            },
          ],
          roll: {
            result: 20,

            render: jest.fn().mockResolvedValue(null),
          },
        });
      });

      it("It calls the correct methods", async () => {
        await Chat.Send(
          WMSCONST.CHAT_TYPE.TABLE,
          "",
          rollResultTwoResults,
          surgeRollTable,
        );

        expect(ChatMessage.create).toHaveBeenCalled();
      });
    });
  });

  describe("RunMessageCheck", () => {
    describe("Given I call RunMessageCheck to send a message to chat", () => {
      beforeEach(() => {
        setTestHooks({
          callAll: jest.fn(),
        });
        setTestGame({
          settings: {
            get: jest.fn().mockReturnValueOnce("Surge Message"),
          },
        });
      });

      it("It returns the just the content", async () => {
        await Chat.RunMessageCheck();

        expect(testGlobals.Hooks.callAll).toHaveBeenCalled();

        expect(ChatMessage.create).toHaveBeenCalled();
      });

      it("propagates chat creation failures to the caller", async () => {
        const error = new Error("Cannot create chat message");
        (ChatMessage.create as jest.Mock).mockRejectedValue(error);

        await expect(Chat.RunMessageCheck()).rejects.toBe(error);
      });
    });
  });
});
