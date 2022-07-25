import RoundCheck from "./RoundCheck.js";
import IncrementalCheck from "./utils/IncrementalCheck.js";
import SpellParser from "./utils/SpellParser.js";
import Chat from "./Chat.js";
import { actor } from "../MockData/actor.js";
import "../__mocks__/index.js";

jest.mock("./utils/SpellParser.js");
jest.mock("./utils/IncrementalCheck.js");
jest.mock("./Chat.js");

describe("RoundCheck", () => {
  beforeEach(() => {
    global.game.actors = {
      get: jest.fn().mockResolvedValue(true),
      result: jest.fn().mockResolvedValue(20),
    };
  });

  describe("Check", () => {
    describe("Given I pass round data with a valid Actor", () => {
      let roundCheck;
      beforeEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();

        global.game = {
          actors: {
            get: jest.fn().mockReturnValueOnce(false),
          },
          settings: {
            get: jest.fn().mockReturnValueOnce(false),
          },
        };
        roundCheck = new RoundCheck(actor);
      });
      it("It should return false", async () => {
        const result = await roundCheck.Check();
        expect(result).toBeFalsy();
      });
    });

    describe("Given I pass round data with a valid Actor", () => {
      let roundCheck;
      let spellParser;
      let incrementalCheck;
      beforeEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
        incrementalCheck = new IncrementalCheck();
        spellParser = new SpellParser();

        jest.spyOn(incrementalCheck, "Check").mockReturnValue(true);
        jest.spyOn(spellParser, "IsWildMagicFeat").mockReturnValue(true);
        global.game = {
          actors: {
            get: jest.fn().mockReturnValueOnce({
              id: 1,
              data: {
                type: "pc",
                items: [
                  {
                    name: "itemName",
                    type: "feat",
                  },
                ],
              },
            }),
          },
          settings: {
            get: jest
              .fn()
              .mockReturnValueOnce(true)
              .mockReturnValueOnce("itemName")
              .mockReturnValueOnce(false),
          },
        };
        roundCheck = new RoundCheck(actor);
      });
      it("It should do the checks", async () => {
        await roundCheck.Check();
        expect(SpellParser).toHaveBeenCalled();
        expect(IncrementalCheck).toHaveBeenCalled();
      });
    });

    describe("Given I have auto D20 check disabled", () => {
      let roundCheck;
      let chat;
      beforeEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
        chat = new Chat();

        jest.spyOn(chat, "RunMessageCheck").mockReturnValue(true);
        global.game = {
          actors: {
            get: jest.fn().mockReturnValueOnce({
              id: 1,
              data: {
                type: "pc",
                items: [
                  {
                    name: "itemName",
                    type: "feat",
                  },
                ],
              },
            }),
          },
          settings: {
            get: jest.fn().mockReturnValueOnce(false),
          },
        };
        roundCheck = new RoundCheck(actor);
      });
      it("It should do the manual message checks", async () => {
        await roundCheck.Check();
        expect(Chat).toHaveBeenCalled();
      });
    });
  });
});
