import DieDescending from "./DieDescending.js";
import { actor } from "../../MockData/actor.js";

describe("Check", () => {
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
        data: {
          flags: [],
        },
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
        data: {
          flags: [],
        },
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
      newActor.data.flags["wild-magic-surge-5e"] = {};
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
      newActor.data.flags["wild-magic-surge-5e"] = {};
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
      dieDescending = new DieDescending(actor, "1");
    });

    it("should return true", async () => {
      const result = await dieDescending.Check();
      expect(result).toBeTruthy();
    });
  });

  describe("If a roll of 4 flag set as 2", () => {
    let dieDescending;
    beforeEach(() => {
      let newActor = actor;
      newActor.getFlag = jest.fn().mockResolvedValue({
        max: 20,
        min: 1,
        value: 2,
      });
      dieDescending = new DieDescending(actor, "4");
    });

    it("should return false", async () => {
      const result = await dieDescending.Check();
      expect(result).toBeFalsy();
    });
  });
});
