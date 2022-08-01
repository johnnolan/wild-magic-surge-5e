import MagicSurgeCheck from "./MagicSurgeCheck.js";
import RollTableMagicSurge from "./RollTableMagicSurge.js";
import IncrementalCheck from "./utils/IncrementalCheck.js";
import SpellLevelTrigger from "./utils/SpellLevelTrigger.js";
import Chat from "./Chat.js";
import { actor } from "../MockData/actor.js";
import { chatMessage, chatMessageNoSpell } from "../MockData/chatMessage.js";
import "../__mocks__/index.js";
import TidesOfChaos from "./TidesOfChaos.js";
import AutoEffects from "./AutoEffects.js";

const mockDieDescendingCheck = jest.fn();
jest.mock("./utils/DieDescending.js", () => {
  return jest.fn().mockImplementation(() => {
    return {
      Check: mockDieDescendingCheck,
    };
  });
});

const mockSpellLevelTriggerCheck = jest.fn();
jest.mock("./utils/SpellLevelTrigger.js", () => {
  return jest.fn().mockImplementation(() => {
    return {
      Check: mockSpellLevelTriggerCheck,
    };
  });
});

const mockIncrementalCheckCheck = jest.fn();
jest.mock("./utils/IncrementalCheck.js", () => {
  return jest.fn().mockImplementation(() => {
    return {
      Check: mockIncrementalCheckCheck,
    };
  });
});

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

const mockAutoEffect = jest.fn();
AutoEffects.Run = mockAutoEffect;
global.Hooks = {
  callAll: jest.fn().mockReturnValue(),
};

beforeEach(() => {
  mockChatSend.mockClear();
  mockTidesOfChaosCheck.mockClear();
  mockRollTableMagicSurgeCheck.mockClear();
  mockSpellLevelTriggerCheck.mockClear();
  mockIncrementalCheckCheck.mockClear();
  mockAutoEffect.mockClear();
  RollTableMagicSurge.mockClear();
  Chat.mockClear();
  TidesOfChaos.mockClear();
  IncrementalCheck.mockClear();
  SpellLevelTrigger.mockClear();
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
        const result = await magicSurgeCheck.CheckChatMessage(chatMessage);
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
          jest.spyOn(magicSurgeCheck, "AutoSurgeCheck").mockReturnValue(true);
        });
        it("It returns from module", async () => {
          await magicSurgeCheck.CheckChatMessage(chatMessageNoSpell);
          expect(Chat).toHaveBeenCalled();
          expect(magicSurgeCheck.AutoSurgeCheck).not.toBeCalled();
          expect(magicSurgeCheck.AutoSurgeCheck).toHaveBeenCalledTimes(0);
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
          jest.spyOn(magicSurgeCheck, "AutoSurgeCheck").mockReturnValue(true);
          jest
            .spyOn(magicSurgeCheck, "WildMagicSurgeRollCheck")
            .mockReturnValue(true);
        });
        it("It auto checks", async () => {
          await magicSurgeCheck.CheckChatMessage(chatMessage);
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
        const result = await magicSurgeCheck.DefaultMagicSurgeRollResult(
          2,
          "EQ"
        );
        expect(result).toBeTruthy();
      });
      test("roll of 2 Not EQ 2", async () => {
        const result = await magicSurgeCheck.DefaultMagicSurgeRollResult(
          1,
          "EQ"
        );
        expect(result).toBeFalsy();
      });
      test("roll of 2 Not GT 2", async () => {
        const result = await magicSurgeCheck.DefaultMagicSurgeRollResult(
          2,
          "GT"
        );
        expect(result).toBeFalsy();
      });
      test("roll of 3 GT 2", async () => {
        const result = await magicSurgeCheck.DefaultMagicSurgeRollResult(
          3,
          "GT"
        );
        expect(result).toBeTruthy();
      });
      test("roll of 2 Not LT 2", async () => {
        const result = await magicSurgeCheck.DefaultMagicSurgeRollResult(
          2,
          "LT"
        );
        expect(result).toBeFalsy();
      });
      test("roll of 1 LT 2", async () => {
        const result = await magicSurgeCheck.DefaultMagicSurgeRollResult(
          1,
          "LT"
        );
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
            get: jest.fn().mockReturnValue("3, 4"),
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
      test("roll of 3 EQ 3", async () => {
        const result = await magicSurgeCheck.DefaultMagicSurgeRollResult(
          3,
          "EQ"
        );
        expect(result).toBeTruthy();
      });
      test("roll of 4 EQ 4", async () => {
        const result = await magicSurgeCheck.DefaultMagicSurgeRollResult(
          4,
          "EQ"
        );
        expect(result).toBeTruthy();
      });
      test("roll of 1 Not EQ 3", async () => {
        const result = await magicSurgeCheck.DefaultMagicSurgeRollResult(
          5,
          "EQ"
        );
        expect(result).toBeFalsy();
      });
      test("roll of 3 Not GT 3", async () => {
        const result = await magicSurgeCheck.DefaultMagicSurgeRollResult(
          3,
          "GT"
        );
        expect(result).toBeFalsy();
      });
      test("roll of 4 GT 3", async () => {
        const result = await magicSurgeCheck.DefaultMagicSurgeRollResult(
          4,
          "GT"
        );
        expect(result).toBeTruthy();
      });
      test("roll of 2 Not LT 3", async () => {
        const result = await magicSurgeCheck.DefaultMagicSurgeRollResult(
          2,
          "LT"
        );
        expect(result).toBeTruthy();
      });
      test("roll of 1 LT 4", async () => {
        const result = await magicSurgeCheck.DefaultMagicSurgeRollResult(
          3,
          "LT"
        );
        expect(result).toBeTruthy();
      });
    });
  });

  describe("AutoSurgeCheck", () => {
    let defaultMagicSurgeRollResultSpy;
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
      defaultMagicSurgeRollResultSpy = jest.spyOn(
        magicSurgeCheck,
        "DefaultMagicSurgeRollResult"
      );
      jest
        .spyOn(magicSurgeCheck, "WildMagicSurgeRollCheck")
        .mockReturnValue(true);
    });
    test("INVALID_OPTION", async () => {
      await magicSurgeCheck.AutoSurgeCheck(1, "INVALID_OPTION");
      expect(defaultMagicSurgeRollResultSpy).not.toBeCalled();
      expect(defaultMagicSurgeRollResultSpy).toHaveBeenCalledTimes(0);
      expect(mockIncrementalCheckCheck).not.toBeCalled();
      expect(mockIncrementalCheckCheck).toHaveBeenCalledTimes(0);
      expect(mockSpellLevelTriggerCheck).not.toBeCalled();
      expect(mockSpellLevelTriggerCheck).toHaveBeenCalledTimes(0);
    });
    test("DEFAULT", async () => {
      await magicSurgeCheck.AutoSurgeCheck(1, "DEFAULT");
      expect(defaultMagicSurgeRollResultSpy).toBeCalled();
      expect(defaultMagicSurgeRollResultSpy).toHaveBeenCalledTimes(1);
      expect(mockIncrementalCheckCheck).not.toBeCalled();
      expect(mockIncrementalCheckCheck).toHaveBeenCalledTimes(0);
      expect(mockSpellLevelTriggerCheck).not.toBeCalled();
      expect(mockSpellLevelTriggerCheck).toHaveBeenCalledTimes(0);
      expect(global.Hooks.callAll).toBeCalled();
      expect(global.Hooks.callAll).toHaveBeenCalledTimes(1);
    });
    test("INCREMENTAL_CHECK", async () => {
      await magicSurgeCheck.AutoSurgeCheck(1, "INCREMENTAL_CHECK");
      expect(mockIncrementalCheckCheck).toBeCalled();
      expect(mockIncrementalCheckCheck).toHaveBeenCalledTimes(1);
      expect(defaultMagicSurgeRollResultSpy).not.toBeCalled();
      expect(defaultMagicSurgeRollResultSpy).toHaveBeenCalledTimes(0);
      expect(mockSpellLevelTriggerCheck).not.toBeCalled();
      expect(mockSpellLevelTriggerCheck).toHaveBeenCalledTimes(0);
      expect(global.Hooks.callAll).toBeCalled();
      expect(global.Hooks.callAll).toHaveBeenCalledTimes(1);
    });
    test("INCREMENTAL_CHECK_CHAOTIC", async () => {
      await magicSurgeCheck.AutoSurgeCheck(1, "INCREMENTAL_CHECK_CHAOTIC");
      expect(mockIncrementalCheckCheck).toBeCalled();
      expect(mockIncrementalCheckCheck).toHaveBeenCalledTimes(1);
      expect(defaultMagicSurgeRollResultSpy).not.toBeCalled();
      expect(defaultMagicSurgeRollResultSpy).toHaveBeenCalledTimes(0);
      expect(mockSpellLevelTriggerCheck).not.toBeCalled();
      expect(mockSpellLevelTriggerCheck).toHaveBeenCalledTimes(0);
      expect(global.Hooks.callAll).toBeCalled();
      expect(global.Hooks.callAll).toHaveBeenCalledTimes(1);
    });
    test("SPELL_LEVEL_DEPENDENT_ROLL", async () => {
      await magicSurgeCheck.AutoSurgeCheck(1, "SPELL_LEVEL_DEPENDENT_ROLL");
      expect(defaultMagicSurgeRollResultSpy).not.toBeCalled();
      expect(defaultMagicSurgeRollResultSpy).toHaveBeenCalledTimes(0);
      expect(mockSpellLevelTriggerCheck).toBeCalled();
      expect(mockSpellLevelTriggerCheck).toHaveBeenCalledTimes(1);
      expect(global.Hooks.callAll).toBeCalled();
      expect(global.Hooks.callAll).toHaveBeenCalledTimes(1);
    });
    test("DIE_DESCENDING", async () => {
      await magicSurgeCheck.AutoSurgeCheck(1, "DIE_DESCENDING");
      expect(defaultMagicSurgeRollResultSpy).not.toBeCalled();
      expect(defaultMagicSurgeRollResultSpy).toHaveBeenCalledTimes(0);
      expect(mockDieDescendingCheck).toBeCalled();
      expect(mockDieDescendingCheck).toHaveBeenCalledTimes(1);
      expect(global.Hooks.callAll).toBeCalled();
      expect(global.Hooks.callAll).toHaveBeenCalledTimes(1);
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
