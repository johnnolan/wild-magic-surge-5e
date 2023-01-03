import { WMSCONST } from "./WMSCONST";
import Chat from "./Chat";
import "../__mocks__/index";

describe("Chat", () => {
  beforeEach(() => {
    (global as any).game.roll = {
      get: jest.fn().mockResolvedValue(true),
      result: jest.fn().mockResolvedValue(20),
    };
    jest.clearAllMocks();

    jest.resetAllMocks();
  });

  describe("createDefaultChat", () => {
    describe("Given I pass it a message", () => {

      it("It returns the just the content", async () => {
        await Chat.Send(WMSCONST.CHAT_TYPE.DEFAULT, "My Custom Message", null);

        expect(ChatMessage.create).toHaveBeenCalledWith({
          content: "<div>My Custom Message</div>",
          speaker: [undefined],
        });
      });
    });
  });

  describe("createRollChat", () => {
    describe("Given I pass it a message and roll but is whisper to GM", () => {
      let roll: any;

      beforeEach(() => {
        (global as any).game.settings.get = jest.fn().mockResolvedValue(true);
        roll = {
          result: 20,
          total: 20,
        };
      });

      it("It returns the just the content", async () => {
        await Chat.Send(WMSCONST.CHAT_TYPE.ROLL, "My Custom Message", roll);

        expect(ChatMessage.create).toHaveBeenCalledWith({
          content: `<div>My Custom Message (${roll.total})</div>`,
          speaker: [undefined],
          whisper: [undefined],
          blind: true,
          type: "WHISPER",
        });
      });
    });

    describe("Given I pass it a message and roll but its a public message", () => {
      let roll: any;

      beforeEach(() => {
        (global as any).game.settings.get = jest
          .fn()
          .mockResolvedValueOnce(false)
          .mockResolvedValueOnce(false)
          .mockResolvedValueOnce("Wild Magic Surge")
          .mockResolvedValueOnce("rollMode");
        roll = {
          result: 20,
        };
      });

      it("It returns the just the content", async () => {
        await Chat.Send(WMSCONST.CHAT_TYPE.ROLL, "My Custom Message", roll);

        expect(ChatMessage.create).toHaveBeenCalledWith({
          flavor: "Wild Magic Surge Check - My Custom Message",
          roll: {
            result: 20,
          },
          rollMode: "rollMode",
          type: "ROLL",
          speaker: [undefined],
        });
      });
    });

    describe("Given I pass it a message but no roll object", () => {
      let roll: any;

      beforeEach(() => {
        (global as any).game.settings.get = jest
          .fn()
          .mockResolvedValueOnce(false)
          .mockResolvedValueOnce("Wild Magic Surge")
          .mockResolvedValueOnce("rollMode");
        roll = {
          result: 20,
        };
      });

      it("It returns undefined", async () => {
        await Chat.Send(WMSCONST.CHAT_TYPE.ROLL, "My Custom Message", undefined);

        expect(ChatMessage.create).not.toBeCalled();
      });
    });
  });

  describe("createRollTable", () => {
    describe("Given I pass it a message and not roll table", () => {
      let rollResult: any;
      let surgeRollTable: any;

      beforeEach(() => {
        (global as any).game.settings.get = jest
          .fn()
          .mockResolvedValueOnce(false)
          .mockResolvedValueOnce("Wild Magic Surge")
          .mockResolvedValueOnce("rollMode");
        surgeRollTable = {
          data: {
            description: "Wild Magic Surge Table",
          },
        };
        rollResult = {
          results: [
            {
              text: "test text",

              getChatText: jest.fn(),
            },
          ],
          roll: {
            result: 20,

            render: jest.fn().mockResolvedValue(null),
          },
        };
      });

      it("It just returns", async () => {
        await Chat.Send(WMSCONST.CHAT_TYPE.TABLE, "", undefined, surgeRollTable);

        expect(ChatMessage.create).not.toHaveBeenCalled();

        expect(global.renderTemplate).not.toHaveBeenCalled();
      });
    });

    describe("Given I set whisper gm for roll table", () => {
      let rollResult: any;
      let surgeRollTable: any;

      beforeEach(() => {
        (global as any).game.settings.get = jest
          .fn()
          .mockResolvedValueOnce(false)
          .mockResolvedValueOnce(true)
          .mockResolvedValueOnce("Wild Magic Surge")
          .mockResolvedValueOnce("rollMode");
        surgeRollTable = {
          data: {
            description: "Wild Magic Surge Table",
          },
        };
        rollResult = {
          results: [
            {
              text: "test text",

              getChatText: jest.fn(),
            },
          ],
          roll: {
            result: 20,

            render: jest.fn().mockResolvedValue(null),
          },
        };
      });

      it("It returns the just the content", async () => {
        await Chat.Send(WMSCONST.CHAT_TYPE.TABLE, "", rollResult, surgeRollTable);

        expect(ChatMessage.create).toHaveBeenCalled();

        expect(global.renderTemplate).toHaveBeenCalled();
      });
    });

    describe("Given I pass it a message and roll table with one result", () => {
      let rollResult: any;
      let surgeRollTable: any;

      beforeEach(() => {
        (global as any).game.settings.get = jest
          .fn()
          .mockResolvedValueOnce(false)
          .mockResolvedValueOnce(false)
          .mockResolvedValueOnce("Wild Magic Surge")
          .mockResolvedValueOnce("rollMode");
        surgeRollTable = {
          data: {
            description: "Wild Magic Surge Table",
          },
        };
        rollResult = {
          results: [
            {
              text: "test text",

              getChatText: jest.fn(),
            },
          ],
          roll: {
            result: 20,

            render: jest.fn().mockResolvedValue(null),
          },
        };
      });

      it("It returns the just the content", async () => {
        await Chat.Send(WMSCONST.CHAT_TYPE.TABLE, "", rollResult, surgeRollTable);

        expect(ChatMessage.create).toHaveBeenCalled();

        expect(global.renderTemplate).toHaveBeenCalled();
      });
    });

    describe("Given I pass it a message and roll table with two results", () => {
      let rollResultTwoResults: any;
      let surgeRollTable: any;

      beforeEach(() => {
        (global as any).game.settings.get = jest
          .fn()
          .mockResolvedValueOnce(false)
          .mockResolvedValueOnce(false)
          .mockResolvedValueOnce("Wild Magic Surge")
          .mockResolvedValueOnce("rollMode");
        surgeRollTable = {
          data: {
            description: "Wild Magic Surge Table",
          },
        };
        rollResultTwoResults = {
          results: [
            {
              text: "test text",

              getChatText: jest.fn(),
            },
            {
              text: "test text 2",

              getChatText: jest.fn(),
            },
          ],
          roll: {
            result: 20,

            render: jest.fn().mockResolvedValue(null),
          },
        };
      });

      it("It calls the correct methods", async () => {
        await Chat.Send(WMSCONST.CHAT_TYPE.TABLE, "", rollResultTwoResults, surgeRollTable);

        expect(ChatMessage.create).toHaveBeenCalled();

        expect(global.renderTemplate).toHaveBeenCalled();
      });
    });
  });

  describe("RunMessageCheck", () => {
    describe("Given I call RunMessageCheck to send a message to chat", () => {

      beforeEach(() => {
        (global as any).Hooks = {
          callAll: jest.fn(),
        };
        (global as any).game = {
          settings: {
            get: jest.fn().mockReturnValueOnce("Surge Message"),
          },
        };
      });

      it("It returns the just the content", async () => {
        await Chat.RunMessageCheck();

        expect((global as any).Hooks.callAll).toHaveBeenCalled();

        expect(ChatMessage.create).toHaveBeenCalled();
      });
    });
  });
});
