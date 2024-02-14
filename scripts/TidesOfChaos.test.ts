import TidesOfChaos from "./TidesOfChaos";
import "../__mocks__/index";

describe("TidesOfChaos", () => {
  describe("If TidesOfChaos is not enabled", () => {
    let actor: Actor;

    beforeEach(() => {
      (global as any).game = {
        settings: {
          get: jest.fn().mockReturnValueOnce(false),
        },
      };
    });

    it("should return undefined", async () => {
      const result = await TidesOfChaos.Check(actor);
      expect(result).toBeUndefined();
    });
  });

  describe("If TidesOfChaos exists on the Actor", () => {
    describe("And I want to check whether it is charged or not", () => {
      describe("And it is not charged", () => {
        let actor: Actor;

        beforeEach(() => {
          (global as any).game = {
            settings: {
              get: jest.fn().mockReturnValueOnce("Tides of Chaos"),
            },
          };
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
          const result = await TidesOfChaos.IsTidesOfChaosUsed(actor);

          expect(result).toBeTruthy();
        });
      });

      describe("And there is no target to consume", () => {
        let actor: Actor;

        beforeEach(() => {
          (global as any).game = {
            settings: {
              get: jest.fn().mockReturnValueOnce("Tides of Chaos"),
            },
          };
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
          const result = await TidesOfChaos.IsTidesOfChaosUsed(actor);

          expect(result).toBeFalsy();
        });
      });

      describe("And it is charged", () => {
        let actor: Actor;

        beforeEach(() => {
          (global as any).game = {
            settings: {
              get: jest.fn().mockReturnValueOnce("Tides of Chaos"),
            },
          };
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
          const result = await TidesOfChaos.IsTidesOfChaosUsed(actor);

          expect(result).toBeFalsy();
        });
      });
    });

    describe("And I want to check and reset if its not charged", () => {
      describe("And it is not charged", () => {
        
        let actor: Actor;

        beforeEach(() => {
          (global as any).game = {
            settings: {
              get: jest.fn().mockReturnValueOnce("Tides of Chaos"),
            },
          };
          
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
          await TidesOfChaos.Check(actor);

          expect(actor.update).toHaveBeenCalled();

          expect(actor.update).toHaveBeenCalledTimes(1);

          expect(actor.updateEmbeddedDocuments).toHaveBeenCalled();

          expect(actor.updateEmbeddedDocuments).toHaveBeenCalledTimes(1);
        });
      });

      describe("And it is not an item", () => {
        
        let actor: Actor;

        beforeEach(() => {
          (global as any).game = {
            settings: {
              get: jest.fn().mockReturnValueOnce("Tides of Chaos"),
            },
          };
          
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
          const result = await TidesOfChaos.Check(actor);

          expect(result).toBeFalsy();
        });
      });
    });
  });

  describe("If TidesOfChaos does not exist on the Actor", () => {
    
    let actor: Actor;

    beforeEach(() => {
      (global as any).game = {
        settings: {
          get: jest.fn().mockReturnValueOnce("Tides of Chaos"),
        },
      };
      
      actor = {
        items: {
          find: jest.fn().mockReturnValueOnce(undefined),
        },
      };
    });

    it("should return true", async () => {
      const result = await TidesOfChaos.IsTidesOfChaosUsed(actor);

      expect(result).toBeFalsy();
    });
  });

  describe("I want to check whether Tides of Chaos is setup correctly", () => {
    describe("And there is no Feat available", () => {
      
      let actor: Actor;

      beforeEach(() => {
        (global as any).game = {
          settings: {
            get: jest.fn().mockReturnValue("Tides of Chaos"),
          },
        };
        
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
            find: jest.fn().mockReturnValueOnce(undefined),
          },
        };
      });

      it("should return false", async () => {
        const result = await TidesOfChaos.IsTidesOfChaosSetup(actor);

        expect(result).toEqual({
          hasTidesOfChaosFeat: false,
          hasTidesOfChaosResource: false,
          isValid: false,
        });
      });
    });

    describe("And there is a Feat available and no resource", () => {
      
      let actor: Actor;

      beforeEach(() => {
        (global as any).game = {
          settings: {
            get: jest.fn().mockReturnValue("Tides of Chaos"),
          },
        };
        
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

      it("should return false for resource check", async () => {
        const result = await TidesOfChaos.IsTidesOfChaosSetup(actor);

        expect(result).toEqual({
          hasTidesOfChaosFeat: true,
          hasTidesOfChaosResource: false,
          isValid: false,
        });
      });
    });

    describe("And there is a Feat available and resource setup to wrong resource", () => {
      
      let actor: Actor;

      beforeEach(() => {
        (global as any).game = {
          settings: {
            get: jest.fn().mockReturnValue("Tides of Chaos"),
          },
        };
        
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

      it("should return false", async () => {
        const result = await TidesOfChaos.IsTidesOfChaosSetup(actor);

        expect(result).toEqual({
          hasTidesOfChaosFeat: true,
          hasTidesOfChaosResource: false,
          isValid: false,
        });
      });
    });

    describe("And there is a Feat available and resource setup", () => {
      
      let actor: Actor;

      beforeEach(() => {
        (global as any).game = {
          settings: {
            get: jest.fn().mockReturnValue("Tides of Chaos"),
          },
        };
        
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

      it("should return false", async () => {
        const result = await TidesOfChaos.IsTidesOfChaosSetup(actor);

        expect(result).toEqual({
          hasTidesOfChaosFeat: true,
          hasTidesOfChaosResource: true,
          isValid: true,
        });
      });
    });
  });
});
