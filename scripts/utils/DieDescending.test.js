import { MODULE_FLAG_NAME, DIE_DESCENDING_FLAG_OPTION } from "../Settings.js";
import DieDescending from "./DieDescending.js";
import { actor } from "../../MockData/actor.js";
import "../../__mocks__/index.js";

describe("DieDescending", () => {
  global.Hooks = {
    callAll: jest.fn().mockReturnValue(true),
  };

  describe("If a roll of 1 with no actor", () => {
    let dieDescending;
    beforeEach(() => {
      dieDescending = new DieDescending(undefined, "1");
    });

    it("should return false", async () => {
      const result = await dieDescending.Check();
      expect(result).toBeFalsy();
    });
  });

  describe("If a roll of 1 with no flag set", () => {
    let dieDescending;
    beforeEach(() => {
      let newActor = {
        setFlag: jest.fn().mockResolvedValue(true),
        flags: [],
      };
      dieDescending = new DieDescending(newActor, "1");
    });

    it("should return true", async () => {
      const result = await dieDescending.Check();
      expect(result).toBeTruthy();
    });
  });

  describe("If a roll of 10 with no flag set", () => {
    let dieDescending;
    beforeEach(() => {
      let newActor = {
        setFlag: jest.fn().mockResolvedValue(true),
        flags: [],
      };
      dieDescending = new DieDescending(newActor, "10");
    });

    it("should return false", async () => {
      const result = await dieDescending.Check();
      expect(result).toBeFalsy();
    });
  });

  describe("If a roll of 1 with no flag value set", () => {
    let dieDescending;
    beforeEach(() => {
      let newActor = actor;
      newActor.flags["wild-magic-surge-5e"] = {};
      dieDescending = new DieDescending(newActor, "1");
    });

    it("should return true", async () => {
      const result = await dieDescending.Check();
      expect(result).toBeTruthy();
    });
  });

  describe("If a roll of 4 with no flag set", () => {
    let dieDescending;
    beforeEach(() => {
      let newActor = actor;
      newActor.flags["wild-magic-surge-5e"] = {};
      dieDescending = new DieDescending(actor, "4");
    });

    it("should return false", async () => {
      const result = await dieDescending.Check();
      expect(result).toBeFalsy();
    });
  });

  describe("If a roll of 1 flag set as 1", () => {
    let dieDescending;
    beforeEach(() => {
      let newActor = actor;
      newActor.getFlag = jest.fn().mockResolvedValue({
        value: "1d20",
      });
      dieDescending = new DieDescending(newActor, "1");
    });

    it("should return true", async () => {
      const result = await dieDescending.Check();
      expect(result).toBeTruthy();
    });
  });

  describe("If a roll of 18 flag set as 1d20", () => {
    let dieDescending;
    let newActor = actor;
    beforeEach(() => {
      newActor.getFlag = jest.fn().mockResolvedValue({
        value: "1d20",
      });
      dieDescending = new DieDescending(newActor, "18");
    });

    it("should change to D12", async () => {
      const result = await dieDescending.Check();
      expect(result).toBeFalsy();
      expect(newActor.setFlag).toBeCalledWith(
        MODULE_FLAG_NAME,
        DIE_DESCENDING_FLAG_OPTION,
        { value: "1d12" }
      );
    });
  });

  describe("If a roll of 18 flag set as 1d20", () => {
    let dieDescending;
    let newActor = actor;
    beforeEach(() => {
      newActor.getFlag = jest.fn().mockResolvedValue({
        value: "1d20",
      });
      dieDescending = new DieDescending(newActor, "18");
    });

    it("should change to D12", async () => {
      const result = await dieDescending.Check();
      expect(result).toBeFalsy();
      expect(newActor.setFlag).toBeCalledWith(
        MODULE_FLAG_NAME,
        DIE_DESCENDING_FLAG_OPTION,
        { value: "1d12" }
      );
    });
  });

  describe("If a roll of 18 flag set as 1d12", () => {
    let dieDescending;
    let newActor = actor;
    beforeEach(() => {
      newActor.getFlag = jest.fn().mockResolvedValue({
        value: "1d12",
      });
      dieDescending = new DieDescending(newActor, "18");
    });

    it("should change to D10", async () => {
      const result = await dieDescending.Check();
      expect(result).toBeFalsy();
      expect(newActor.setFlag).toBeCalledWith(
        MODULE_FLAG_NAME,
        DIE_DESCENDING_FLAG_OPTION,
        { value: "1d10" }
      );
    });
  });

  describe("If a roll of 18 flag set as 1d10", () => {
    let dieDescending;
    let newActor = actor;
    beforeEach(() => {
      newActor.getFlag = jest.fn().mockResolvedValue({
        value: "1d10",
      });
      dieDescending = new DieDescending(newActor, "18");
    });

    it("should change to D8", async () => {
      const result = await dieDescending.Check();
      expect(result).toBeFalsy();
      expect(newActor.setFlag).toBeCalledWith(
        MODULE_FLAG_NAME,
        DIE_DESCENDING_FLAG_OPTION,
        { value: "1d8" }
      );
    });
  });

  describe("If a roll of 18 flag set as 1d8", () => {
    let dieDescending;
    let newActor = actor;
    beforeEach(() => {
      newActor.getFlag = jest.fn().mockResolvedValue({
        value: "1d8",
      });
      dieDescending = new DieDescending(newActor, "18");
    });

    it("should change to D6", async () => {
      const result = await dieDescending.Check();
      expect(result).toBeFalsy();
      expect(newActor.setFlag).toBeCalledWith(
        MODULE_FLAG_NAME,
        DIE_DESCENDING_FLAG_OPTION,
        { value: "1d6" }
      );
    });
  });

  describe("If a roll of 18 flag set as 1d6", () => {
    let dieDescending;
    let newActor = actor;
    beforeEach(() => {
      newActor.getFlag = jest.fn().mockResolvedValue({
        value: "1d6",
      });
      dieDescending = new DieDescending(newActor, "18");
    });

    it("should change to D4", async () => {
      const result = await dieDescending.Check();
      expect(result).toBeFalsy();
      expect(newActor.setFlag).toBeCalledWith(
        MODULE_FLAG_NAME,
        DIE_DESCENDING_FLAG_OPTION,
        { value: "1d4" }
      );
    });
  });

  describe("If a roll of 18 flag set as 1d4", () => {
    let dieDescending;
    let newActor = actor;
    beforeEach(() => {
      newActor.getFlag = jest.fn().mockResolvedValue({
        value: "1d4",
      });
      dieDescending = new DieDescending(newActor, "18");
    });

    it("should stay as D4", async () => {
      const result = await dieDescending.Check();
      expect(result).toBeFalsy();
      expect(newActor.setFlag).toBeCalledWith(
        MODULE_FLAG_NAME,
        DIE_DESCENDING_FLAG_OPTION,
        { value: "1d4" }
      );
    });
  });

  describe("If a DIE_DESCENDING_FLAG_OPTION is not set", () => {
    let dieDescending;
    let newActor = actor;
    beforeEach(() => {
      newActor.getFlag = jest.fn().mockResolvedValue(undefined);
      dieDescending = new DieDescending(newActor, "18");
    });

    it("should set the flag as default values", async () => {
      const result = await dieDescending.Check();
      expect(result).toBeFalsy();
      expect(newActor.setFlag).toBeCalledWith(
        MODULE_FLAG_NAME,
        DIE_DESCENDING_FLAG_OPTION,
        { value: "1d20" }
      );
    });
  });
});
