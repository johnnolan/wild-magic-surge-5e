import { CHAT_TYPE } from "./Settings.js";
import Chat from "./Chat.js";
import "../__mocks__/index.js";

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe("Chat", () => {
  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(() => {
    // @ts-expect-error TS(2304): Cannot find name 'global'.
    global.game.roll = {
      // @ts-expect-error TS(2304): Cannot find name 'jest'.
      get: jest.fn().mockResolvedValue(true),
      // @ts-expect-error TS(2304): Cannot find name 'jest'.
      result: jest.fn().mockResolvedValue(20),
    };
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe("createDefaultChat", () => {
    // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe("Given I pass it a message", () => {
      let chat: any;
      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(() => {
        chat = new Chat();
      });
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it("It returns the just the content", async () => {
        await chat.Send(CHAT_TYPE.DEFAULT, "My Custom Message");
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(ChatMessage.create).toHaveBeenCalledWith({
          content: "<div>My Custom Message</div>",
          speaker: [""],
        });
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe("createRollChat", () => {
    // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe("Given I pass it a message and roll but is whisper to GM", () => {
      let chat: any;
      let roll: any;
      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(() => {
        // @ts-expect-error TS(2304): Cannot find name 'global'.
        global.game.settings.get = jest.fn().mockResolvedValue(true);
        chat = new Chat();
        roll = {
          result: 20,
        };
      });
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it("It returns the just the content", async () => {
        await chat.Send(CHAT_TYPE.ROLL, "My Custom Message", roll);
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(ChatMessage.create).toHaveBeenCalledWith({
          content: `<div>My Custom Message ${roll.result}</div>`,
          speaker: [""],
          whisper: [""],
          blind: true,
          type: "WHISPER",
        });
      });
    });

    // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe("Given I pass it a message and roll but its a public message", () => {
      let chat: any;
      let roll: any;
      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(() => {
        // @ts-expect-error TS(2304): Cannot find name 'global'.
        global.game.settings.get = jest
          .fn()
          .mockResolvedValueOnce(false)
          .mockResolvedValueOnce("Wild Magic Surge")
          .mockResolvedValueOnce("rollMode");
        chat = new Chat();
        roll = {
          result: 20,
        };
      });
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it("It returns the just the content", async () => {
        await chat.Send(CHAT_TYPE.ROLL, "My Custom Message", roll);
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
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

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe("createRollTable", () => {
    // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe("Given I pass it a message and roll table with one result", () => {
      let chat: any;
      let rollResult: any;
      let surgeRollTable: any;
      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(() => {
        // @ts-expect-error TS(2304): Cannot find name 'global'.
        global.game.settings.get = jest
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
              // @ts-expect-error TS(2304): Cannot find name 'jest'.
              getChatText: jest.fn(),
            },
          ],
          roll: {
            result: 20,
            // @ts-expect-error TS(2304): Cannot find name 'jest'.
            render: jest.fn().mockResolvedValue(null),
          },
        };
      });
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it("It returns the just the content", async () => {
        await chat.Send(CHAT_TYPE.TABLE, rollResult, surgeRollTable);
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(ChatMessage.create).toHaveBeenCalled();
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(global.renderTemplate).toHaveBeenCalled();
      });
    });
    // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe("Given I pass it a message and roll table with two results", () => {
      let chat: any;
      let rollResultTwoResults: any;
      let surgeRollTable: any;
      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(() => {
        // @ts-expect-error TS(2304): Cannot find name 'global'.
        global.game.settings.get = jest
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
              // @ts-expect-error TS(2304): Cannot find name 'jest'.
              getChatText: jest.fn(),
            },
            {
              text: "test text 2",
              // @ts-expect-error TS(2304): Cannot find name 'jest'.
              getChatText: jest.fn(),
            },
          ],
          roll: {
            result: 20,
            // @ts-expect-error TS(2304): Cannot find name 'jest'.
            render: jest.fn().mockResolvedValue(null),
          },
        };
      });
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it("It calls the correct methods", async () => {
        await chat.Send(CHAT_TYPE.TABLE, rollResultTwoResults, surgeRollTable);
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(ChatMessage.create).toHaveBeenCalled();
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(global.renderTemplate).toHaveBeenCalled();
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe("RunMessageCheck", () => {
    // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe("Given I call RunMessageCheck to send a message to chat", () => {
      let chat: any;
      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(() => {
        chat = new Chat();
        // @ts-expect-error TS(2304): Cannot find name 'global'.
        global.Hooks = {
          // @ts-expect-error TS(2304): Cannot find name 'jest'.
          callAll: jest.fn(),
        };
        // @ts-expect-error TS(2304): Cannot find name 'global'.
        global.game = {
          settings: {
            // @ts-expect-error TS(2304): Cannot find name 'jest'.
            get: jest.fn().mockReturnValueOnce("Surge Message"),
          },
        };
      });
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it("It returns the just the content", async () => {
        await chat.RunMessageCheck();
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(global.Hooks.callAll).toHaveBeenCalled();
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(ChatMessage.create).toHaveBeenCalled();
      });
    });
  });
});
