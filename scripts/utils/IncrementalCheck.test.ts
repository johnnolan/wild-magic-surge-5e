import IncrementalCheck from "./IncrementalCheck";
import { actor } from "../../MockData/actor";
import "../../__mocks__/index";

describe("IncrementalCheck", () => {
  (global as any).Hooks = {
    callAll: jest.fn().mockReturnValue(true),
  };

  describe("If a roll of 1 with no actor", () => {
    let incrementalCheck: any;

    beforeEach(() => {
      incrementalCheck = new IncrementalCheck(undefined, 1);
    });

    it("should return false", async () => {
      const result = await incrementalCheck.Check();

      expect(result).toBeFalsy();
    });
  });

  describe("If a roll of 1 with no flag set", () => {
    let incrementalCheck: any;

    beforeEach(() => {
      const newActor = {
        setFlag: jest.fn().mockResolvedValue(true),
        flags: [],
      };
      incrementalCheck = new IncrementalCheck(newActor, 1);
    });

    it("should return true", async () => {
      const result = await incrementalCheck.Check();

      expect(result).toBeTruthy();
    });
  });

  describe("If a roll of 10 with no flag set", () => {
    let incrementalCheck: any;

    beforeEach(() => {
      const newActor = {
        setFlag: jest.fn().mockResolvedValue(true),
        flags: [],
      };
      incrementalCheck = new IncrementalCheck(newActor, 10);
    });

    it("should return false", async () => {
      const result = await incrementalCheck.Check();

      expect(result).toBeFalsy();
    });
  });

  describe("If a roll of 1 with no flag value set", () => {
    let incrementalCheck: any;

    beforeEach(() => {
      const newActor = actor;
      // @ts-expect-error TS(2741): Property 'surge_increment' is missing in type '{}'... Remove this comment to see the full error message
      newActor.flags["wild-magic-surge-5e"] = {};
      incrementalCheck = new IncrementalCheck(newActor, 1);
    });

    it("should return true", async () => {
      const result = await incrementalCheck.Check();

      expect(result).toBeTruthy();
    });
  });

  describe("If a roll of 4 with no flag set", () => {
    let incrementalCheck: any;

    beforeEach(() => {
      const newActor = actor;
      // @ts-expect-error TS(2741): Property 'surge_increment' is missing in type '{}'... Remove this comment to see the full error message
      newActor.flags["wild-magic-surge-5e"] = {};
      incrementalCheck = new IncrementalCheck(actor, 4);
    });

    it("should return false", async () => {
      const result = await incrementalCheck.Check();

      expect(result).toBeFalsy();
    });
  });

  describe("If a roll of 1 flag set as 1", () => {
    let incrementalCheck: any;

    beforeEach(() => {
      incrementalCheck = new IncrementalCheck(actor, 1);
    });

    it("should return true", async () => {
      const result = await incrementalCheck.Check();

      expect(result).toBeTruthy();
    });
  });

  describe("If a roll of 4 flag set as 2", () => {
    let incrementalCheck: any;

    beforeEach(() => {
      const newActor = actor;

      newActor.getFlag = jest.fn().mockResolvedValue({
        max: 20,
        min: 1,
        value: 2,
      });
      incrementalCheck = new IncrementalCheck(actor, 4);
    });

    it("should return false", async () => {
      const result = await incrementalCheck.Check();

      expect(result).toBeFalsy();
    });
  });
});
