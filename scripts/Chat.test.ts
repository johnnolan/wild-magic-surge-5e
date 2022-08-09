import { CHAT_TYPE } from "./Settings.js";
import Chat from "./Chat.js";
import "../__mocks__/index.js";

describe("Chat", () => {
  beforeEach(() => {
    (global as any).game.roll = {
      get: jest.fn().mockResolvedValue(true),
      result: jest.fn().mockResolvedValue(20),
    };
  });

  describe("createDefaultChat", () => {
    describe("Given I pass it a message", () => {
      let chat: any;

      beforeEach(() => {
        chat = new Chat();
      });

      it("It returns the just the content", async () => {
        await chat.Send(CHAT_TYPE.DEFAULT, "My Custom Message");

        expect(ChatMessage.create).toHaveBeenCalledWith({
          content: "<div>My Custom Message</div>",
          speaker: [""],
        });
      });
    });
  });

  describe("createRollChat", () => {
    describe("Given I pass it a message and roll but is whisper to GM", () => {
      let chat: any;
      let roll: any;

      beforeEach(() => {
        (global as any).game.settings.get = jest.fn().mockResolvedValue(true);
        chat = new Chat();
        roll = {
          result: 20,
        };
      });

      it("It returns the just the content", async () => {
        await chat.Send(CHAT_TYPE.ROLL, "My Custom Message", roll);

        expect(ChatMessage.create).toHaveBeenCalledWith({
          content: `<div>My Custom Message ${roll.result}</div>`,
          speaker: [""],
          whisper: [""],
          blind: true,
          type: "WHISPER",
        });
      });
    });

    describe("Given I pass it a message and roll but its a public message", () => {
      let chat: any;
      let roll: any;

      beforeEach(() => {
        (global as any).game.settings.get = jest
          .fn()
          .mockResolvedValueOnce(false)
          .mockResolvedValueOnce("Wild Magic Surge")
          .mockResolvedValueOnce("rollMode");
        chat = new Chat();
        roll = {
          result: 20,
        };
      });

      it("It returns the just the content", async () => {
        await chat.Send(CHAT_TYPE.ROLL, "My Custom Message", roll);

        expect(ChatMessage.create).toHaveBeenCalledWith({
          flavor: "Wild Magic Surge Check - My Custom Message",
          roll: {
            result: 20,
          },
          rollMode: "rollMode",
          type: "ROLL",
          speaker: [""],
        });
      });
    });
  });

  describe("createRollTable", () => {
    describe("Given I pass it a message and roll table with one result", () => {
      let chat: any;
      let rollResult: any;
      let surgeRollTable: any;

      beforeEach(() => {
        (global as any).game.settings.get = jest
          .fn()
          .mockResolvedValueOnce(false)
          .mockResolvedValueOnce("Wild Magic Surge")
          .mockResolvedValueOnce("rollMode");
        chat = new Chat();
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
        await chat.Send(CHAT_TYPE.TABLE, rollResult, surgeRollTable);

        expect(ChatMessage.create).toHaveBeenCalled();

        expect(global.renderTemplate).toHaveBeenCalled();
      });
    });

    describe("Given I pass it a message and roll table with two results", () => {
      let chat: any;
      let rollResultTwoResults: any;
      let surgeRollTable: any;

      beforeEach(() => {
        (global as any).game.settings.get = jest
          .fn()
          .mockResolvedValueOnce(false)
          .mockResolvedValueOnce("Wild Magic Surge")
          .mockResolvedValueOnce("rollMode");
        chat = new Chat();
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
        await chat.Send(CHAT_TYPE.TABLE, rollResultTwoResults, surgeRollTable);

        expect(ChatMessage.create).toHaveBeenCalled();

        expect(global.renderTemplate).toHaveBeenCalled();
      });
    });
  });

  describe("RunMessageCheck", () => {
    describe("Given I call RunMessageCheck to send a message to chat", () => {
      let chat: any;

      beforeEach(() => {
        chat = new Chat();
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
        await chat.RunMessageCheck();

        expect((global as any).Hooks.callAll).toHaveBeenCalled();

        expect(ChatMessage.create).toHaveBeenCalled();
      });
    });
  });
});
