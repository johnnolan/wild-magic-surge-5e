import TidesOfChaos from "./TidesOfChaos.js";
import "../__mocks__/index.js";

describe("TidesOfChaos", () => {
  describe("If TidesOfChaos is not enabled", () => {
    let tidesOfChaos;
    let actor;
    beforeEach(() => {
      global.game = {
        settings: {
          get: jest.fn().mockReturnValueOnce(false),
        },
      };
      tidesOfChaos = new TidesOfChaos();
    });

    it("should return undefined", async () => {
      const result = await tidesOfChaos.Check(actor);
      expect(result).toBeUndefined();
    });
  });

  describe("If TidesOfChaos exists on the Actor", () => {
    describe("And I want to check whether it is charged or not", () => {
      describe("And it is not charged", () => {
        let tidesOfChaos;
        let actor;
        beforeEach(() => {
          global.game = {
            settings: {
              get: jest.fn().mockReturnValueOnce("Tides of Chaos"),
            },
          };
          tidesOfChaos = new TidesOfChaos();
          actor = {
            items: {
              find: jest.fn().mockReturnValueOnce({
                id: 1,
                name: "Tides of Chaos",
                type: "feat",
                system: {
                  uses: {
                    value: 0,
                  },
                  consume: {
                    target: "test",
                  },
                },
              }),
            },
          };
        });

        it("should return true", async () => {
          const result = await tidesOfChaos.IsTidesOfChaosUsed(actor);
          expect(result).toBeTruthy();
        });
      });

      describe("And there is no target to consume", () => {
        let tidesOfChaos;
        let actor;
        beforeEach(() => {
          global.game = {
            settings: {
              get: jest.fn().mockReturnValueOnce("Tides of Chaos"),
            },
          };
          tidesOfChaos = new TidesOfChaos();
          actor = {
            items: [
              {
                id: 1,
                name: "Tides of Chaos",
                type: "feat",
                system: {
                  uses: {
                    value: 0,
                  },
                },
              },
            ],
          };
        });

        it("should return false", async () => {
          const result = await tidesOfChaos.IsTidesOfChaosUsed(actor);
          expect(result).toBeFalsy();
        });
      });

      describe("And it is charged", () => {
        let tidesOfChaos;
        let actor;
        beforeEach(() => {
          global.game = {
            settings: {
              get: jest.fn().mockReturnValueOnce("Tides of Chaos"),
            },
          };
          tidesOfChaos = new TidesOfChaos();
          actor = {
            items: {
              find: jest.fn().mockReturnValueOnce({
                id: 1,
                name: "Tides of Chaos",
                type: "feat",
                system: {
                  uses: {
                    value: 1,
                  },
                  consume: {
                    target: "test",
                  },
                },
              }),
            },
          };
        });

        it("should return false", async () => {
          const result = await tidesOfChaos.IsTidesOfChaosUsed(actor);
          expect(result).toBeFalsy();
        });
      });
    });

    describe("And I want to check and reset if its not charged", () => {
      describe("And it is not charged", () => {
        let tidesOfChaos;
        let actor;
        beforeEach(() => {
          global.game = {
            settings: {
              get: jest.fn().mockReturnValueOnce("Tides of Chaos"),
            },
          };
          tidesOfChaos = new TidesOfChaos();
          actor = {
            update: jest.fn(),
            updateEmbeddedDocuments: jest.fn(),
            items: {
              find: jest.fn().mockReturnValueOnce({
                id: 1,
                name: "Tides of Chaos",
                type: "feat",
                system: {
                  uses: {
                    value: 0,
                  },
                  consume: {
                    target: "test",
                  },
                },
              }),
            },
          };
        });

        it("should return true", async () => {
          await tidesOfChaos.Check(actor);
          expect(actor.update).toBeCalled();
          expect(actor.update).toHaveBeenCalledTimes(1);
          expect(actor.updateEmbeddedDocuments).toBeCalled();
          expect(actor.updateEmbeddedDocuments).toHaveBeenCalledTimes(1);
        });
      });

      describe("And it is not an item", () => {
        let tidesOfChaos;
        let actor;
        beforeEach(() => {
          global.game = {
            settings: {
              get: jest.fn().mockReturnValueOnce("Tides of Chaos"),
            },
          };
          tidesOfChaos = new TidesOfChaos();
          actor = {
            update: jest.fn(),
            updateEmbeddedDocuments: jest.fn(),
            items: [
              {
                id: 1,
                name: "Tides of Chaos 2",
                type: "feat",
                system: {
                  uses: {
                    value: 0,
                  },
                  consume: {
                    target: "test",
                  },
                },
              },
            ],
          };
        });

        it("should return false", async () => {
          const result = await tidesOfChaos.Check(actor);
          expect(result).toBeFalsy();
        });
      });
    });
  });

  describe("If TidesOfChaos does not exist on the Actor", () => {
    let tidesOfChaos;
    let actor;
    beforeEach(() => {
      global.game = {
        settings: {
          get: jest.fn().mockReturnValueOnce("Tides of Chaos"),
        },
      };
      tidesOfChaos = new TidesOfChaos();
      actor = {
        items: {
          find: jest.fn().mockReturnValueOnce(undefined),
        },
      };
    });

    it("should return true", async () => {
      const result = await tidesOfChaos.IsTidesOfChaosUsed(actor);
      expect(result).toBeFalsy();
    });
  });
});
