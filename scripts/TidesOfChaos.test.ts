import TidesOfChaos from "./TidesOfChaos.js";
import "../__mocks__/index.js";

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe("TidesOfChaos", () => {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe("If TidesOfChaos is not enabled", () => {
    let tidesOfChaos: any;
    let actor: any;
    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(() => {
      // @ts-expect-error TS(2304): Cannot find name 'global'.
      global.game = {
        settings: {
          // @ts-expect-error TS(2304): Cannot find name 'jest'.
          get: jest.fn().mockReturnValueOnce(false),
        },
      };
      tidesOfChaos = new TidesOfChaos();
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it("should return undefined", async () => {
      const result = await tidesOfChaos.Check(actor);
      // @ts-expect-error TS(2304): Cannot find name 'expect'.
      expect(result).toBeUndefined();
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe("If TidesOfChaos exists on the Actor", () => {
    // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe("And I want to check whether it is charged or not", () => {
      // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
      describe("And it is not charged", () => {
        let tidesOfChaos: any;
        let actor: any;
        // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
        beforeEach(() => {
          // @ts-expect-error TS(2304): Cannot find name 'global'.
          global.game = {
            settings: {
              // @ts-expect-error TS(2304): Cannot find name 'jest'.
              get: jest.fn().mockReturnValueOnce("Tides of Chaos"),
            },
          };
          tidesOfChaos = new TidesOfChaos();
          actor = {
            items: {
              // @ts-expect-error TS(2304): Cannot find name 'jest'.
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

        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it("should return true", async () => {
          const result = await tidesOfChaos.IsTidesOfChaosUsed(actor);
          // @ts-expect-error TS(2304): Cannot find name 'expect'.
          expect(result).toBeTruthy();
        });
      });

      // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
      describe("And there is no target to consume", () => {
        let tidesOfChaos: any;
        let actor: any;
        // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
        beforeEach(() => {
          // @ts-expect-error TS(2304): Cannot find name 'global'.
          global.game = {
            settings: {
              // @ts-expect-error TS(2304): Cannot find name 'jest'.
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

        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it("should return false", async () => {
          const result = await tidesOfChaos.IsTidesOfChaosUsed(actor);
          // @ts-expect-error TS(2304): Cannot find name 'expect'.
          expect(result).toBeFalsy();
        });
      });

      // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
      describe("And it is charged", () => {
        let tidesOfChaos: any;
        let actor: any;
        // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
        beforeEach(() => {
          // @ts-expect-error TS(2304): Cannot find name 'global'.
          global.game = {
            settings: {
              // @ts-expect-error TS(2304): Cannot find name 'jest'.
              get: jest.fn().mockReturnValueOnce("Tides of Chaos"),
            },
          };
          tidesOfChaos = new TidesOfChaos();
          actor = {
            items: {
              // @ts-expect-error TS(2304): Cannot find name 'jest'.
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

        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it("should return false", async () => {
          const result = await tidesOfChaos.IsTidesOfChaosUsed(actor);
          // @ts-expect-error TS(2304): Cannot find name 'expect'.
          expect(result).toBeFalsy();
        });
      });
    });

    // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe("And I want to check and reset if its not charged", () => {
      // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
      describe("And it is not charged", () => {
        let tidesOfChaos: any;
        let actor: any;
        // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
        beforeEach(() => {
          // @ts-expect-error TS(2304): Cannot find name 'global'.
          global.game = {
            settings: {
              // @ts-expect-error TS(2304): Cannot find name 'jest'.
              get: jest.fn().mockReturnValueOnce("Tides of Chaos"),
            },
          };
          tidesOfChaos = new TidesOfChaos();
          actor = {
            // @ts-expect-error TS(2304): Cannot find name 'jest'.
            update: jest.fn(),
            // @ts-expect-error TS(2304): Cannot find name 'jest'.
            updateEmbeddedDocuments: jest.fn(),
            items: {
              // @ts-expect-error TS(2304): Cannot find name 'jest'.
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

        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it("should return true", async () => {
          await tidesOfChaos.Check(actor);
          // @ts-expect-error TS(2304): Cannot find name 'expect'.
          expect(actor.update).toBeCalled();
          // @ts-expect-error TS(2304): Cannot find name 'expect'.
          expect(actor.update).toHaveBeenCalledTimes(1);
          // @ts-expect-error TS(2304): Cannot find name 'expect'.
          expect(actor.updateEmbeddedDocuments).toBeCalled();
          // @ts-expect-error TS(2304): Cannot find name 'expect'.
          expect(actor.updateEmbeddedDocuments).toHaveBeenCalledTimes(1);
        });
      });

      // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
      describe("And it is not an item", () => {
        let tidesOfChaos: any;
        let actor: any;
        // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
        beforeEach(() => {
          // @ts-expect-error TS(2304): Cannot find name 'global'.
          global.game = {
            settings: {
              // @ts-expect-error TS(2304): Cannot find name 'jest'.
              get: jest.fn().mockReturnValueOnce("Tides of Chaos"),
            },
          };
          tidesOfChaos = new TidesOfChaos();
          actor = {
            // @ts-expect-error TS(2304): Cannot find name 'jest'.
            update: jest.fn(),
            // @ts-expect-error TS(2304): Cannot find name 'jest'.
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

        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it("should return false", async () => {
          const result = await tidesOfChaos.Check(actor);
          // @ts-expect-error TS(2304): Cannot find name 'expect'.
          expect(result).toBeFalsy();
        });
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe("If TidesOfChaos does not exist on the Actor", () => {
    let tidesOfChaos: any;
    let actor: any;
    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(() => {
      // @ts-expect-error TS(2304): Cannot find name 'global'.
      global.game = {
        settings: {
          // @ts-expect-error TS(2304): Cannot find name 'jest'.
          get: jest.fn().mockReturnValueOnce("Tides of Chaos"),
        },
      };
      tidesOfChaos = new TidesOfChaos();
      actor = {
        items: {
          // @ts-expect-error TS(2304): Cannot find name 'jest'.
          find: jest.fn().mockReturnValueOnce(undefined),
        },
      };
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it("should return true", async () => {
      const result = await tidesOfChaos.IsTidesOfChaosUsed(actor);
      // @ts-expect-error TS(2304): Cannot find name 'expect'.
      expect(result).toBeFalsy();
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe("I want to check whether Tides of Chaos is setup correctly", () => {
    // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe("And there is no Feat available", () => {
      let tidesOfChaos: any;
      let actor: any;
      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(() => {
        // @ts-expect-error TS(2304): Cannot find name 'global'.
        global.game = {
          settings: {
            // @ts-expect-error TS(2304): Cannot find name 'jest'.
            get: jest.fn().mockReturnValue("Tides of Chaos"),
          },
        };
        tidesOfChaos = new TidesOfChaos();
        actor = {
          system: {
            resources: {
              tertiary: {
                value: "1",
                label: "Tides of Chaos",
              },
            },
          },
          items: {
            // @ts-expect-error TS(2304): Cannot find name 'jest'.
            find: jest.fn().mockReturnValueOnce(undefined),
          },
        };
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it("should return false", async () => {
        const result = await tidesOfChaos.IsTidesOfChaosSetup(actor);
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(result).toEqual({
          hasTidesOfChaosFeat: false,
          hasTidesOfChaosResource: false,
          isValid: false,
        });
      });
    });

    // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe("And there is a Feat available and no resource", () => {
      let tidesOfChaos: any;
      let actor: any;
      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(() => {
        // @ts-expect-error TS(2304): Cannot find name 'global'.
        global.game = {
          settings: {
            // @ts-expect-error TS(2304): Cannot find name 'jest'.
            get: jest.fn().mockReturnValue("Tides of Chaos"),
          },
        };
        tidesOfChaos = new TidesOfChaos();
        actor = {
          system: {
            resources: {
              tertiary: {
                value: "",
                label: "",
              },
            },
          },
          items: {
            // @ts-expect-error TS(2304): Cannot find name 'jest'.
            find: jest.fn().mockReturnValueOnce({
              id: 1,
              name: "Tides of Chaos",
              type: "feat",
              system: {
                uses: {
                  value: 0,
                },
                consume: {
                  target: "resources.tertiary.value",
                },
              },
            }),
          },
        };
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it("should return false for resource check", async () => {
        const result = await tidesOfChaos.IsTidesOfChaosSetup(actor);
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(result).toEqual({
          hasTidesOfChaosFeat: true,
          hasTidesOfChaosResource: false,
          isValid: false,
        });
      });
    });

    // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe("And there is a Feat available and resource setup to wrong resource", () => {
      let tidesOfChaos: any;
      let actor: any;
      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(() => {
        // @ts-expect-error TS(2304): Cannot find name 'global'.
        global.game = {
          settings: {
            // @ts-expect-error TS(2304): Cannot find name 'jest'.
            get: jest.fn().mockReturnValue("Tides of Chaos"),
          },
        };
        tidesOfChaos = new TidesOfChaos();
        actor = {
          system: {
            resources: {
              tertiary: {
                value: "1",
                label: "Tides of Chaos",
              },
            },
          },
          items: {
            // @ts-expect-error TS(2304): Cannot find name 'jest'.
            find: jest.fn().mockReturnValueOnce({
              id: 1,
              name: "Tides of Chaos",
              type: "feat",
              system: {
                uses: {
                  value: 0,
                },
                consume: {
                  target: "resources.tertiary",
                },
              },
            }),
          },
        };
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it("should return false", async () => {
        const result = await tidesOfChaos.IsTidesOfChaosSetup(actor);
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(result).toEqual({
          hasTidesOfChaosFeat: true,
          hasTidesOfChaosResource: false,
          isValid: false,
        });
      });
    });

    // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe("And there is a Feat available and resource setup", () => {
      let tidesOfChaos: any;
      let actor: any;
      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(() => {
        // @ts-expect-error TS(2304): Cannot find name 'global'.
        global.game = {
          settings: {
            // @ts-expect-error TS(2304): Cannot find name 'jest'.
            get: jest.fn().mockReturnValue("Tides of Chaos"),
          },
        };
        tidesOfChaos = new TidesOfChaos();
        actor = {
          system: {
            resources: {
              tertiary: {
                value: "1",
                label: "Tides of Chaos",
              },
            },
          },
          items: {
            // @ts-expect-error TS(2304): Cannot find name 'jest'.
            find: jest.fn().mockReturnValueOnce({
              id: 1,
              name: "Tides of Chaos",
              type: "feat",
              system: {
                uses: {
                  value: 0,
                },
                consume: {
                  target: "resources.tertiary.value",
                },
              },
            }),
          },
        };
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it("should return false", async () => {
        const result = await tidesOfChaos.IsTidesOfChaosSetup(actor);
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(result).toEqual({
          hasTidesOfChaosFeat: true,
          hasTidesOfChaosResource: true,
          isValid: true,
        });
      });
    });
  });
});
