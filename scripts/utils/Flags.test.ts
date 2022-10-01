import IncrementalCheck from "./IncrementalCheck";
import "../../__mocks__/index";
import DieDescending from "./DieDescending";
import Flags from "./Flags";

const mockDieDescendingSetFlagResource = jest.fn();
DieDescending.SetFlagResource = mockDieDescendingSetFlagResource;

const mockIncrementalCheckSetFlagResource = jest.fn();
IncrementalCheck.SetFlagResource = mockIncrementalCheckSetFlagResource;

beforeEach(() => {
  mockDieDescendingSetFlagResource.mockClear();
  mockIncrementalCheckSetFlagResource.mockClear();
});

describe("Flags", () => {
  (global as any).Hooks = {
    callAll: jest.fn().mockReturnValue(true),
  };

  describe("If an actor has no flag set", () => {
    let newActor: Actor = {
      type: "character",
    };
    beforeEach(() => {
      global.hasProperty = jest.fn().mockReturnValue(true);
      newActor = {
        setFlag: jest.fn().mockResolvedValue(true),
        flags: [],
        getFlag: jest.fn().mockResolvedValue(undefined),
      };
    });

    it("should return true", async () => {
      const result = await Flags.Setup(newActor);

      expect(mockDieDescendingSetFlagResource).toHaveBeenCalledTimes(1);
      expect(mockIncrementalCheckSetFlagResource).toHaveBeenCalledTimes(1);
    });
  });

  describe("If an actor has no flag set", () => {
    let newActor: Actor = {};
    beforeEach(() => {
      global.hasProperty = jest.fn().mockReturnValue(true);
      newActor = {
        setFlag: jest.fn().mockResolvedValue(true),
        flags: [],
        type: "character",
        system: {
          resources: {
            wmsurgeincrement: true,
          },
        },
        getFlag: jest
          .fn()
          .mockResolvedValueOnce(undefined)
          .mockResolvedValueOnce({ value: true }),
      };
    });

    it("should return true", async () => {
      const result = await Flags.Setup(newActor);

      expect(mockDieDescendingSetFlagResource).toHaveBeenCalledTimes(1);
      expect(mockIncrementalCheckSetFlagResource).toHaveBeenCalledTimes(0);
    });
  });

  describe("If an actor has no flag set", () => {
    let newActor: Actor = {};
    beforeEach(() => {
      global.hasProperty = jest.fn().mockReturnValue(true);
      newActor = {
        setFlag: jest.fn().mockResolvedValue(true),
        flags: [],
        type: "character",
        system: {
          resources: {
            wmsurgeincrement: true,
          },
        },
        getFlag: jest
          .fn()
          .mockResolvedValueOnce({ value: true })
          .mockResolvedValueOnce(undefined),
      };
    });

    it("should return true", async () => {
      const result = await Flags.Setup(newActor);

      expect(mockDieDescendingSetFlagResource).toHaveBeenCalledTimes(1);
      expect(mockIncrementalCheckSetFlagResource).toHaveBeenCalledTimes(1);
    });
  });
});
