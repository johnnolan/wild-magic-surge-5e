import MagicSurgeCheck from "./MagicSurgeCheck.js";
import RollTableMagicSurge from "./RollTableMagicSurge.js";
import IncrementalCheck from "./utils/IncrementalCheck.js";
import SpellLevelTrigger from "./utils/SpellLevelTrigger.js";
import Chat from "./Chat.js";
import { actor } from "../MockData/actor.js";
import { chatMessage, chatMessageNoSpell } from "../MockData/chatMessage.js";
import "../__mocks__/index.js";
import TidesOfChaos from "./TidesOfChaos.js";

jest.mock("./utils/SpellLevelTrigger.js");
jest.mock("./utils/IncrementalCheck.js");

const mockChatSend = jest.fn();
jest.mock("./Chat.js", () => {
  return jest.fn().mockImplementation(() => {
    return {
      Send: mockChatSend,
    };
  });
});

const mockTidesOfChaosCheck = jest.fn();
const mockTidesOfChaosIsTidesOfChaosUsed = jest.fn().mockReturnValue(false);
jest.mock("./TidesOfChaos.js", () => {
  return jest.fn().mockImplementation(() => {
    return {
      Check: mockTidesOfChaosCheck,
      IsTidesOfChaosUsed: mockTidesOfChaosIsTidesOfChaosUsed,
    };
  });
});

const mockRollTableMagicSurgeCheck = jest.fn();
jest.mock("./RollTableMagicSurge.js", () => {
  return jest.fn().mockImplementation(() => {
    return {
      Check: mockRollTableMagicSurgeCheck,
    };
  });
});
global.Hooks = {
  callAll: jest.fn().mockReturnValue(),
};

beforeEach(() => {
  mockChatSend.mockClear();
  mockTidesOfChaosCheck.mockClear();
  mockRollTableMagicSurgeCheck.mockClear();
  RollTableMagicSurge.mockClear();
  Chat.mockClear();
  TidesOfChaos.mockClear();
  global.Hooks.callAll.mockClear();
});

describe("MagicSurgeCheck", () => {
  describe("Check", () => {
    describe("Has no actor", () => {
      let magicSurgeCheck;
      beforeEach(() => {
        global.game = {
          actors: {
            get: jest.fn().mockReturnValue(undefined),
          },
          tables: [
            {
              name: "Wild Magic Surge",
              roll: jest.fn().mockResolvedValue(true),
              results: jest.fn().mockResolvedValue([]),
            },
          ],
        };
        magicSurgeCheck = new MagicSurgeCheck(undefined);
      });
      it("It returns from module", async () => {
        const result = await magicSurgeCheck.Check(chatMessage);
        expect(result).toBeFalsy();
      });
    });
    describe("OPT_AUTO_D20 is true", () => {
      describe("Has no Wild Magic Feat", () => {
        let magicSurgeCheck;
        beforeEach(() => {
          global.Hooks = {
            callAll: jest.fn().mockReturnValue(true),
          };
          global.game = {
            actors: {
              get: jest.fn().mockReturnValue({
                data: {
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
                },
              }),
            },
            user: {
              id: "123",
              isGM: true,
            },
            settings: {
              get: jest.fn().mockReturnValue(true),
            },
            tables: [
              {
                name: "Wild Magic Surge",
                roll: jest.fn().mockResolvedValue(true),
                results: jest.fn().mockResolvedValue([]),
              },
            ],
          };
          magicSurgeCheck = new MagicSurgeCheck(actor);
          jest.spyOn(magicSurgeCheck, "RunAutoCheck").mockReturnValue(true);
        });
        it("It returns from module", async () => {
          await magicSurgeCheck.Check(chatMessageNoSpell);
          expect(Chat).toHaveBeenCalled();
          expect(magicSurgeCheck.RunAutoCheck).not.toBeCalled();
          expect(magicSurgeCheck.RunAutoCheck).toHaveBeenCalledTimes(0);
        });
      });

      describe("Has Wild Magic Feat", () => {
        let magicSurgeCheck;
        beforeEach(() => {
          global.Hooks = {
            callAll: jest.fn().mockReturnValue(),
          };
          global.game = {
            tables: [
              {
                name: "Wild Magic Surge",
                roll: jest.fn().mockResolvedValue(true),
                results: jest.fn().mockResolvedValue([]),
              },
            ],
            actors: {
              get: jest.fn().mockReturnValue({
                data: {
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
                    {
                      _id: "iGoR4ePl1mTZFAAM",
                      name: "Wild Magic Surge",
                      type: "feat",
                      img: "systems/dnd5e/icons/spells/lightning-magenta-3.jpg",
                      data: {
                        source: "Sorcerer : Wild Magic",
                      },
                    },
                  ],
                },
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
          magicSurgeCheck = new MagicSurgeCheck(actor);
          jest.spyOn(magicSurgeCheck, "RunAutoCheck").mockReturnValue(true);
          jest
            .spyOn(magicSurgeCheck, "WildMagicSurgeRollCheck")
            .mockReturnValue(true);
        });
        it("It auto checks", async () => {
          await magicSurgeCheck.Check(chatMessage);
          expect(Chat).toHaveBeenCalled();
          expect(magicSurgeCheck.WildMagicSurgeRollCheck).not.toBeCalled();
          expect(magicSurgeCheck.WildMagicSurgeRollCheck).toHaveBeenCalledTimes(
            0
          );
        });
      });
    });
  });

  describe("resultCheck", () => {
    describe("has 1 value in the result check", () => {
      let magicSurgeCheck;
      beforeAll(() => {
        global.game = {
          actors: actor,
          settings: {
            get: jest.fn().mockReturnValue("2"),
          },
          tables: [
            {
              name: "Wild Magic Surge",
              roll: jest.fn().mockResolvedValue(true),
              results: jest.fn().mockResolvedValue([]),
            },
          ],
        };
        magicSurgeCheck = new MagicSurgeCheck(actor);
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

    describe("has 2 values in the result check", () => {
      let magicSurgeCheck;
      beforeAll(() => {
        magicSurgeCheck = new MagicSurgeCheck();
        global.game = {
          actors: actor,
          settings: {
            get: jest.fn().mockReturnValue("2, 4"),
          },
          tables: [
            {
              name: "Wild Magic Surge",
              roll: jest.fn().mockResolvedValue(true),
              results: jest.fn().mockResolvedValue([]),
            },
          ],
        };
      });
      test("roll of 2 EQ 2", async () => {
        const result = await magicSurgeCheck.ResultCheck(2, "EQ");
        expect(result).toBeTruthy();
      });
      test("roll of 4 EQ 4", async () => {
        const result = await magicSurgeCheck.ResultCheck(4, "EQ");
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
        expect(result).toBeTruthy();
      });
      test("roll of 1 LT 2", async () => {
        const result = await magicSurgeCheck.ResultCheck(1, "LT");
        expect(result).toBeTruthy();
      });
    });
  });

  describe("RunAutoCheck", () => {
    let resultCheckSpy;
    let magicSurgeCheck;
    beforeEach(() => {
      global.game = {
        settings: {
          get: jest.fn().mockReturnValue(true),
        },
        actors: {
          get: jest.fn().mockReturnValue({
            data: {
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
                {
                  _id: "iGoR4ePl1mTZFAAM",
                  name: "Wild Magic Surge",
                  type: "feat",
                  img: "systems/dnd5e/icons/spells/lightning-magenta-3.jpg",
                  data: {
                    source: "Sorcerer : Wild Magic",
                  },
                },
              ],
            },
          }),
        },
      };
      magicSurgeCheck = new MagicSurgeCheck(actor);
      resultCheckSpy = jest.spyOn(magicSurgeCheck, "ResultCheck");
      jest
        .spyOn(magicSurgeCheck, "WildMagicSurgeRollCheck")
        .mockReturnValue(true);
    });
    test("INVALID_OPTION", async () => {
      await magicSurgeCheck.RunAutoCheck(1, "INVALID_OPTION");
      expect(resultCheckSpy).not.toBeCalled();
      expect(resultCheckSpy).toHaveBeenCalledTimes(0);
      expect(IncrementalCheck).not.toBeCalled();
      expect(IncrementalCheck).toHaveBeenCalledTimes(0);
      expect(SpellLevelTrigger).not.toBeCalled();
      expect(SpellLevelTrigger).toHaveBeenCalledTimes(0);
    });
    test("DEFAULT", async () => {
      await magicSurgeCheck.RunAutoCheck(1, "DEFAULT");
      expect(resultCheckSpy).toBeCalled();
      expect(resultCheckSpy).toHaveBeenCalledTimes(1);
      expect(IncrementalCheck).not.toBeCalled();
      expect(IncrementalCheck).toHaveBeenCalledTimes(0);
      expect(SpellLevelTrigger).not.toBeCalled();
      expect(SpellLevelTrigger).toHaveBeenCalledTimes(0);
      expect(global.Hooks.callAll).toBeCalled();
      expect(global.Hooks.callAll).toHaveBeenCalledTimes(1);
    });
    test("INCREMENTAL_CHECK", async () => {
      await magicSurgeCheck.RunAutoCheck(1, "INCREMENTAL_CHECK");
      expect(IncrementalCheck).toBeCalled();
      expect(IncrementalCheck).toHaveBeenCalledTimes(1);
      expect(resultCheckSpy).not.toBeCalled();
      expect(resultCheckSpy).toHaveBeenCalledTimes(0);
      expect(SpellLevelTrigger).not.toBeCalled();
      expect(SpellLevelTrigger).toHaveBeenCalledTimes(0);
      expect(global.Hooks.callAll).toBeCalled();
      expect(global.Hooks.callAll).toHaveBeenCalledTimes(1);
    });
    test("SPELL_LEVEL_DEPENDENT_ROLL", async () => {
      await magicSurgeCheck.RunAutoCheck(1, "SPELL_LEVEL_DEPENDENT_ROLL");
      expect(resultCheckSpy).not.toBeCalled();
      expect(resultCheckSpy).toHaveBeenCalledTimes(0);
      expect(SpellLevelTrigger).toBeCalled();
      expect(SpellLevelTrigger).toHaveBeenCalledTimes(1);
      expect(global.Hooks.callAll).toBeCalled();
      expect(global.Hooks.callAll).toHaveBeenCalledTimes(1);
    });
    afterEach(() => {
      resultCheckSpy.mockRestore();
      resultCheckSpy.mockReset();
    });
  });

  describe("SurgeWildMagic", () => {
    let magicSurgeCheck;
    beforeEach(() => {
      global.game = {
        settings: {
          get: jest.fn().mockReturnValue(true),
        },
      };
      magicSurgeCheck = new MagicSurgeCheck(actor);
    });
    it("It runs correctly on true", async () => {
      await magicSurgeCheck.SurgeWildMagic(true, { result: 1 });
      expect(mockChatSend).toHaveBeenCalledTimes(1);
      expect(mockTidesOfChaosCheck).toHaveBeenCalledTimes(1);
      expect(mockRollTableMagicSurgeCheck).toHaveBeenCalledTimes(1);
      expect(global.Hooks.callAll).toHaveBeenCalledTimes(1);
    });

    it("It runs correctly on false", async () => {
      await magicSurgeCheck.SurgeWildMagic(false, { result: 1 });
      expect(mockChatSend).toHaveBeenCalledTimes(1);
      expect(mockTidesOfChaosCheck).not.toHaveBeenCalled();
      expect(mockRollTableMagicSurgeCheck).not.toHaveBeenCalled();
      expect(global.Hooks.callAll).toHaveBeenCalledTimes(1);
    });
  });

  describe("SurgeTidesOfChaos", () => {
    let magicSurgeCheck;
    beforeEach(() => {
      global.game = {
        settings: {
          get: jest.fn().mockReturnValue("Auto D20 Message"),
        },
      };
      magicSurgeCheck = new MagicSurgeCheck(actor);
    });
    it("It runs the correct functions", async () => {
      await magicSurgeCheck.SurgeTidesOfChaos();
      expect(mockChatSend).toHaveBeenCalledTimes(1);
      expect(mockTidesOfChaosCheck).toHaveBeenCalledTimes(1);
      expect(mockRollTableMagicSurgeCheck).toHaveBeenCalledTimes(1);
      expect(global.Hooks.callAll).toBeCalled();
      expect(global.Hooks.callAll).toHaveBeenCalledTimes(1);
    });
  });
});
