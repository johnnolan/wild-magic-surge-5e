import IncrementalCheck from "./IncrementalCheck";
import { actor } from "../../MockData/actor";
import "../../__mocks__/index";

describe("IncrementalCheck", () => {
  (global as any).Hooks = {
    callAll: jest.fn().mockReturnValue(true),
  };

  describe("If a roll of 1 with no flag set", () => {
    let newActor: Actor;
    beforeEach(() => {
      global.hasProperty = jest.fn().mockReturnValue(false);
      newActor = {
        setFlag: jest.fn().mockResolvedValue(true),
        flags: [],
      };
    });

    it("should return true", async () => {
      const result = await IncrementalCheck.Check(newActor, 1);

      expect(result).toBeTruthy();
    });
  });

  describe("If a roll of 10 with no flag set", () => {
    let newActor: Actor;
    beforeEach(() => {
      global.hasProperty = jest.fn().mockReturnValue(false);
      newActor = {
        setFlag: jest.fn().mockResolvedValue(true),
        flags: [],
      };
    });

    it("should return false", async () => {
      const result = await IncrementalCheck.Check(newActor, 10);

      expect(result).toBeFalsy();
    });
  });

  describe("If a roll of 1 with no flag value set", () => {
    let newActor: Actor;
    beforeEach(() => {
      newActor = actor;
      // @ts-expect-error TS(2741): Property 'surge_increment' is missing in type '{}'... Remove this comment to see the full error message
      newActor.flags["wild-magic-surge-5e"] = {};
    });

    it("should return true", async () => {
      const result = await IncrementalCheck.Check(newActor, 1);

      expect(result).toBeTruthy();
    });
  });

  describe("If a roll of 4 with no flag set", () => {
    let newActor: Actor;
    beforeEach(() => {
      newActor = actor;
      // @ts-expect-error TS(2741): Property 'surge_increment' is missing in type '{}'... Remove this comment to see the full error message
      newActor.flags["wild-magic-surge-5e"] = {};
    });

    it("should return false", async () => {
      const result = await IncrementalCheck.Check(actor, 4);

      expect(result).toBeFalsy();
    });
  });

  describe("If a roll of 1 flag set as 1", () => {
    it("should return true", async () => {
      const result = await IncrementalCheck.Check(actor, 1);

      expect(result).toBeTruthy();
    });
  });

  describe("If a roll of 4 flag set as 2", () => {
    let newActor: Actor;
    beforeEach(() => {
      newActor = actor;

      newActor.getFlag = jest.fn().mockResolvedValue({
        max: 20,
        min: 1,
        value: 2,
      });
    });

    it("should return false", async () => {
      const result = await IncrementalCheck.Check(newActor, 4);

      expect(result).toBeFalsy();
    });
  });
});
