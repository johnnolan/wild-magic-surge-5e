import DieDescending from "./DieDescending";
import { actor } from "../../MockData/actor";
import "../../__mocks__/index";

describe("DieDescending", () => {
  beforeEach(() => {
    jest.resetAllMocks();
    (global as any).Hooks = {
      callAll: jest.fn().mockReturnValue(true),
    };
  });

  describe("If get resource with incorrect flag set", () => {
    const newActor: Actor = actor;

    beforeEach(() => {
      newActor.setFlag = jest.fn().mockResolvedValue(true);
      newActor.update = jest.fn().mockResolvedValue(true);
      newActor.getFlag = jest
        .fn()
        .mockResolvedValueOnce({ dieValue: "1d20", value: 1 });
    });

    it("should return default", async () => {
      const result = await DieDescending.GetResource(newActor);

      expect(result).toStrictEqual({
        value: 1,
        label: "Surge Chance",
        sr: false,
        lr: false,
        max: 6,
      });
    });
  });

  describe("If a roll of 1 with incorrect flag set", () => {
    const newActor: Actor = actor;

    beforeEach(() => {
      global.hasProperty = jest.fn().mockReturnValue(true);
      newActor.setFlag = jest.fn().mockResolvedValue(true);
      newActor.update = jest.fn().mockResolvedValue(true);
      newActor.getFlag = jest.fn().mockResolvedValueOnce({
        value: 1,
        label: "Surge Chance",
        sr: false,
        lr: false,
        max: 6,
      });
    });

    it("should return true", async () => {
      const result = await DieDescending.Check(newActor, 12);

      expect(result).toBeFalsy();
    });
  });

  describe("If no actor is passed", () => {
    const newActor: Actor = {
      setFlag: jest.fn().mockResolvedValue(true),
      update: jest.fn().mockResolvedValue(true),
      flags: [],
    };

    it("should return false", async () => {
      const result = await DieDescending.Check(undefined, 1);

      expect(result).toBeFalsy();
    });
  });

  describe("If a roll of 1 with flag set", () => {
    const newActor: Actor = actor;

    beforeEach(() => {
      global.hasProperty = jest.fn().mockReturnValue(true);
      newActor.setFlag = jest.fn().mockResolvedValue(true);
      newActor.update = jest.fn().mockResolvedValue(true);
      newActor.getFlag = jest.fn().mockResolvedValueOnce({
        value: 1,
        label: "Surge Chance",
        sr: false,
        lr: false,
        max: 6,
      });
    });

    it("should return true", async () => {
      const result = await DieDescending.Check(newActor, 1);

      expect(result).toBeTruthy();
    });
  });

  describe("If a roll of 1 with no flag set", () => {
    const newActor: Actor = {
      setFlag: jest.fn().mockResolvedValue(true),
      update: jest.fn().mockResolvedValue(true),
      flags: [],
    };

    it("should return true", async () => {
      const result = await DieDescending.Check(newActor, 1);

      expect(result).toBeTruthy();
    });
  });

  describe("If a roll of 10 with no flag set", () => {
    const newActor: Actor = {
      setFlag: jest.fn().mockResolvedValue(true),
      update: jest.fn().mockResolvedValue(true),
      flags: [],
    };

    it("should return false", async () => {
      const result = await DieDescending.Check(newActor, 10);

      expect(result).toBeFalsy();
    });
  });

  describe("If a roll of 1 with no flag value set", () => {
    const newActor: Actor = actor;
    beforeEach(() => {
      // @ts-expect-error TS(2741): Property 'surge_increment' is missing in type '{}'... Remove this comment to see the full error message
      newActor.flags["wild-magic-surge-5e"] = {};
    });

    it("should return true", async () => {
      const result = await DieDescending.Check(newActor, 1);

      expect(result).toBeTruthy();
    });
  });

  describe("If a roll of 4 with no flag set", () => {
    const newActor: Actor = actor;
    beforeEach(() => {
      // @ts-expect-error TS(2741): Property 'surge_increment' is missing in type '{}'... Remove this comment to see the full error message
      newActor.flags["wild-magic-surge-5e"] = {};
    });

    it("should return false", async () => {
      const result = await DieDescending.Check(actor, 4);

      expect(result).toBeFalsy();
    });
  });

  describe("If a roll of 1 flag set as 1", () => {
    const newActor: Actor = actor;
    beforeEach(() => {
      newActor.getFlag = jest.fn().mockResolvedValueOnce({
        value: 1,
        label: "Surge Chance",
        sr: false,
        lr: false,
        max: 6,
      });
    });

    it("should return true", async () => {
      const result = await DieDescending.Check(newActor, 1);

      expect(result).toBeTruthy();
    });
  });

  describe("If a roll of 18 flag set as 1d20", () => {
    let newActor: Actor;

    beforeEach(() => {
      newActor = actor;
      newActor.getFlag = jest.fn().mockResolvedValueOnce({
        dieValue: "1d20",
        value: 1,
        max: 6,
        min: 1,
      });
    });

    it("should change to D12", async () => {
      const result = await DieDescending.Check(newActor, 18);

      expect(result).toBeFalsy();
    });
  });

  describe("If a roll of 18 flag set as 1d12", () => {
    const newActor: Actor = actor;

    beforeEach(() => {
      newActor.getFlag = jest.fn().mockResolvedValueOnce({
        value: 2,
        label: "Surge Chance",
        sr: false,
        lr: false,
        max: 6,
      });
    });

    it("should change to D10", async () => {
      const result = await DieDescending.Check(newActor, 18);

      expect(result).toBeFalsy();
    });
  });

  describe("If a roll of 18 flag set as 1d10", () => {
    const newActor: Actor = actor;

    beforeEach(() => {
      newActor.getFlag = jest.fn().mockResolvedValueOnce({
        value: 3,
        label: "Surge Chance",
        sr: false,
        lr: false,
        max: 6,
      });
    });

    it("should change to D8", async () => {
      const result = await DieDescending.Check(newActor, 18);

      expect(result).toBeFalsy();
    });
  });

  describe("If a roll of 18 flag set as 1d8", () => {
    const newActor: Actor = actor;

    beforeEach(() => {
      newActor.getFlag = jest.fn().mockResolvedValueOnce({
        value: 4,
        label: "Surge Chance",
        sr: false,
        lr: false,
        max: 6,
      });
    });

    it("should change to D6", async () => {
      const result = await DieDescending.Check(newActor, 18);

      expect(result).toBeFalsy();
    });
  });

  describe("If a roll of 18 flag set as 1d6", () => {
    const newActor: Actor = actor;

    beforeEach(() => {
      newActor.getFlag = jest.fn().mockResolvedValueOnce({
        value: 6,
        label: "Surge Chance",
        sr: false,
        lr: false,
        max: 6,
      });
    });

    it("should change to D4", async () => {
      const result = await DieDescending.Check(newActor, 18);

      expect(result).toBeFalsy();
    });
  });

  describe("If a roll of 18 flag set as 1d4", () => {
    const newActor: Actor = actor;

    beforeEach(() => {
      newActor.getFlag = jest.fn().mockResolvedValueOnce({
        value: 6,
        label: "Surge Chance",
        sr: false,
        lr: false,
        max: 6,
      });
    });

    it("should stay as D4", async () => {
      const result = await DieDescending.Check(newActor, 18);

      expect(result).toBeFalsy();
    });
  });

  /*describe("If a DIE_DESCENDING_FLAG_OPTION is not set", () => {
    const newActor: Actor = actor;

    beforeEach(() => {
      jest.resetAllMocks();
      global.hasProperty = jest.fn().mockReturnValue(false);
      newActor.getFlag = jest.fn().mockResolvedValue(undefined);
      newActor.setFlag = jest.fn().mockResolvedValue(true);
      newActor.update = jest.fn().mockResolvedValue(true);
      newActor.flags = [];
    });

    it("should set the flag as default values", async () => {
      const result = await DieDescending.Check(newActor, "18");

      expect(result).toBeFalsy();

      expect(newActor.setFlag).toBeCalledWith(
        WMSCONST.MODULE_FLAG_NAME,
        WMSCONST.DIE_DESCENDING_FLAG_OPTION,
        { dieValue: "1d20", value: 1, max: 6, min: 1 }
      );
    });
  });*/
});
