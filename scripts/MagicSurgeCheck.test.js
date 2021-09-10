import MagicSurgeCheck from "./MagicSurgeCheck.js";
import IncrementalCheck from "./IncrementalCheck.js";
import SpellLevelTrigger from "./utils/SpellLevelTrigger.js";
import SpellParser from "./utils/SpellParser.js";
import { actor } from "../MockData/actor.js";
import { chatMessage } from "../MockData/chatMessage.js";

jest.mock("./utils/SpellLevelTrigger.js");
jest.mock("./IncrementalCheck.js");

/*
describe("Check", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });
  describe("OPT_AUTO_D20 is true", () => {
    let magicSurgeCheck;
    beforeAll(() => {
      magicSurgeCheck = new MagicSurgeCheck();
      global.game = {
        actors: {
          get: jest.fn().mockReturnValue({
            items: [
              {
                id: "WWb4vAmh18sMAxfY",
                data: {
                  name: "Flame Tongue Greatsword",
                  data: { actionType: "mwak" },
                },
                token: {
                  _id: "5H4YnyD6zf9vcJ3Q",
                },
              },
            ],
          }),
        },
        user: {
          id: "123",
          isGM: true,
        },
        settings: {
          get: jest.fn().mockReturnValue(true),
        },
      };
    });
    it("It auto checks", async () => {
      const result = await magicSurgeCheck.Check(chatMessage);
      expect(SpellParser).toBeCalled();
      expect(SpellParser).toHaveBeenCalledTimes(1);
    });
  });
  describe("OPT_AUTO_D20 is false", () => {
    let magicSurgeCheck;
    beforeAll(() => {
      magicSurgeCheck = new MagicSurgeCheck();
      global.game = {
        actors: {
          get: jest.fn().mockReturnValue({
            items: [
              {
                id: "WWb4vAmh18sMAxfY",
                data: {
                  name: "Flame Tongue Greatsword",
                  data: { actionType: "mwak" },
                },
                token: {
                  _id: "5H4YnyD6zf9vcJ3Q",
                },
              },
            ],
          }),
        },
        user: {
          id: "1234",
          isGM: true,
        },
        settings: {
          get: jest.fn().mockReturnValue(false),
        },
      };
    });
    test("It sends a message", async () => {
      const result = await magicSurgeCheck.Check(chatMessage);
      expect(SpellParser).not.toBeCalled();
      expect(SpellParser).toHaveBeenCalledTimes(0);
    });
  });
});
*/
describe("resultCheck", () => {
  let magicSurgeCheck;
  beforeAll(() => {
    magicSurgeCheck = new MagicSurgeCheck();
    global.game = {
      actors: actor,
      settings: {
        get: jest.fn().mockReturnValue(2),
      },
    };
  });
  test("roll of 2 EQ 2", async () => {
    const result = await magicSurgeCheck.ResultCheck(2, "EQ");
    expect(result).toBeTruthy();
  });
  test("roll of 2 Not EQ 2", async () => {
    const result = await magicSurgeCheck.ResultCheck(1, "EQ");
    expect(result).toBeFalsy();
  });
  test("roll of 2 Not GT 2", async () => {
    const result = await magicSurgeCheck.ResultCheck(2, "GT");
    expect(result).toBeFalsy();
  });
  test("roll of 3 GT 2", async () => {
    const result = await magicSurgeCheck.ResultCheck(3, "GT");
    expect(result).toBeTruthy();
  });
  test("roll of 2 Not LT 2", async () => {
    const result = await magicSurgeCheck.ResultCheck(2, "LT");
    expect(result).toBeFalsy();
  });
  test("roll of 1 LT 2", async () => {
    const result = await magicSurgeCheck.ResultCheck(1, "LT");
    expect(result).toBeTruthy();
  });
});

describe("RunAutoCheck", () => {
  let resultCheckSpy;
  let magicSurgeCheck;
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
    magicSurgeCheck = new MagicSurgeCheck();
    resultCheckSpy = jest.spyOn(magicSurgeCheck, "ResultCheck");
  });
  test("DEFAULT", async () => {
    await magicSurgeCheck.RunAutoCheck(actor, 1, 1, "DEFAULT");
    expect(resultCheckSpy).toBeCalled();
    expect(resultCheckSpy).toHaveBeenCalledTimes(1);
    expect(IncrementalCheck).not.toBeCalled();
    expect(IncrementalCheck).toHaveBeenCalledTimes(0);
    expect(SpellLevelTrigger).not.toBeCalled();
    expect(SpellLevelTrigger).toHaveBeenCalledTimes(0);
  });
  test("INCREMENTAL_CHECK", async () => {
    await magicSurgeCheck.RunAutoCheck(actor, 1, 1, "INCREMENTAL_CHECK");
    expect(IncrementalCheck).toBeCalled();
    expect(IncrementalCheck).toHaveBeenCalledTimes(1);
    expect(resultCheckSpy).not.toBeCalled();
    expect(resultCheckSpy).toHaveBeenCalledTimes(0);
    expect(SpellLevelTrigger).not.toBeCalled();
    expect(SpellLevelTrigger).toHaveBeenCalledTimes(0);
  });
  test("SPELL_LEVEL_DEPENDENT_ROLL", async () => {
    await magicSurgeCheck.RunAutoCheck(
      actor,
      1,
      1,
      "SPELL_LEVEL_DEPENDENT_ROLL"
    );
    expect(resultCheckSpy).not.toBeCalled();
    expect(resultCheckSpy).toHaveBeenCalledTimes(0);
    expect(SpellLevelTrigger).toBeCalled();
    expect(SpellLevelTrigger).toHaveBeenCalledTimes(1);
    expect(IncrementalCheck).not.toBeCalled();
    expect(IncrementalCheck).toHaveBeenCalledTimes(0);
  });
  afterEach(() => {
    resultCheckSpy.mockRestore();
    resultCheckSpy.mockReset();
  });
});
