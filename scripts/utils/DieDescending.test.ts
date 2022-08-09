import { MODULE_FLAG_NAME, DIE_DESCENDING_FLAG_OPTION } from "../Settings.js";
import DieDescending from "./DieDescending.js";
// @ts-expect-error TS(7016): Could not find a declaration file for module '../.... Remove this comment to see the full error message
import { actor } from "../../MockData/actor.js";
import "../../__mocks__/index.js";

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe("DieDescending", () => {
  // @ts-expect-error TS(2304): Cannot find name 'global'.
  global.Hooks = {
    // @ts-expect-error TS(2304): Cannot find name 'jest'.
    callAll: jest.fn().mockReturnValue(true),
  };

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe("If a roll of 1 with no actor", () => {
    let dieDescending: any;
    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(() => {
      dieDescending = new DieDescending(undefined, "1");
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it("should return false", async () => {
      const result = await dieDescending.Check();
      // @ts-expect-error TS(2304): Cannot find name 'expect'.
      expect(result).toBeFalsy();
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe("If a roll of 1 with no flag set", () => {
    let dieDescending: any;
    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(() => {
      let newActor = {
        // @ts-expect-error TS(2304): Cannot find name 'jest'.
        setFlag: jest.fn().mockResolvedValue(true),
        flags: [],
      };
      dieDescending = new DieDescending(newActor, "1");
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it("should return true", async () => {
      const result = await dieDescending.Check();
      // @ts-expect-error TS(2304): Cannot find name 'expect'.
      expect(result).toBeTruthy();
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe("If a roll of 10 with no flag set", () => {
    let dieDescending: any;
    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(() => {
      let newActor = {
        // @ts-expect-error TS(2304): Cannot find name 'jest'.
        setFlag: jest.fn().mockResolvedValue(true),
        flags: [],
      };
      dieDescending = new DieDescending(newActor, "10");
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it("should return false", async () => {
      const result = await dieDescending.Check();
      // @ts-expect-error TS(2304): Cannot find name 'expect'.
      expect(result).toBeFalsy();
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe("If a roll of 1 with no flag value set", () => {
    let dieDescending: any;
    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(() => {
      let newActor = actor;
      newActor.flags["wild-magic-surge-5e"] = {};
      dieDescending = new DieDescending(newActor, "1");
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it("should return true", async () => {
      const result = await dieDescending.Check();
      // @ts-expect-error TS(2304): Cannot find name 'expect'.
      expect(result).toBeTruthy();
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe("If a roll of 4 with no flag set", () => {
    let dieDescending: any;
    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(() => {
      let newActor = actor;
      newActor.flags["wild-magic-surge-5e"] = {};
      dieDescending = new DieDescending(actor, "4");
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it("should return false", async () => {
      const result = await dieDescending.Check();
      // @ts-expect-error TS(2304): Cannot find name 'expect'.
      expect(result).toBeFalsy();
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe("If a roll of 1 flag set as 1", () => {
    let dieDescending: any;
    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(() => {
      let newActor = actor;
      // @ts-expect-error TS(2304): Cannot find name 'jest'.
      newActor.getFlag = jest.fn().mockResolvedValue({
        value: "1d20",
      });
      dieDescending = new DieDescending(newActor, "1");
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it("should return true", async () => {
      const result = await dieDescending.Check();
      // @ts-expect-error TS(2304): Cannot find name 'expect'.
      expect(result).toBeTruthy();
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe("If a roll of 18 flag set as 1d20", () => {
    let dieDescending: any;
    let newActor = actor;
    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(() => {
      // @ts-expect-error TS(2304): Cannot find name 'jest'.
      newActor.getFlag = jest.fn().mockResolvedValue({
        value: "1d20",
      });
      dieDescending = new DieDescending(newActor, "18");
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it("should change to D12", async () => {
      const result = await dieDescending.Check();
      // @ts-expect-error TS(2304): Cannot find name 'expect'.
      expect(result).toBeFalsy();
      // @ts-expect-error TS(2304): Cannot find name 'expect'.
      expect(newActor.setFlag).toBeCalledWith(
        MODULE_FLAG_NAME,
        DIE_DESCENDING_FLAG_OPTION,
        { value: "1d12" }
      );
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe("If a roll of 18 flag set as 1d12", () => {
    let dieDescending: any;
    let newActor = actor;
    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(() => {
      // @ts-expect-error TS(2304): Cannot find name 'jest'.
      newActor.getFlag = jest.fn().mockResolvedValue({
        value: "1d12",
      });
      dieDescending = new DieDescending(newActor, "18");
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it("should change to D10", async () => {
      const result = await dieDescending.Check();
      // @ts-expect-error TS(2304): Cannot find name 'expect'.
      expect(result).toBeFalsy();
      // @ts-expect-error TS(2304): Cannot find name 'expect'.
      expect(newActor.setFlag).toBeCalledWith(
        MODULE_FLAG_NAME,
        DIE_DESCENDING_FLAG_OPTION,
        { value: "1d10" }
      );
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe("If a roll of 18 flag set as 1d10", () => {
    let dieDescending: any;
    let newActor = actor;
    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(() => {
      // @ts-expect-error TS(2304): Cannot find name 'jest'.
      newActor.getFlag = jest.fn().mockResolvedValue({
        value: "1d10",
      });
      dieDescending = new DieDescending(newActor, "18");
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it("should change to D8", async () => {
      const result = await dieDescending.Check();
      // @ts-expect-error TS(2304): Cannot find name 'expect'.
      expect(result).toBeFalsy();
      // @ts-expect-error TS(2304): Cannot find name 'expect'.
      expect(newActor.setFlag).toBeCalledWith(
        MODULE_FLAG_NAME,
        DIE_DESCENDING_FLAG_OPTION,
        { value: "1d8" }
      );
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe("If a roll of 18 flag set as 1d8", () => {
    let dieDescending: any;
    let newActor = actor;
    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(() => {
      // @ts-expect-error TS(2304): Cannot find name 'jest'.
      newActor.getFlag = jest.fn().mockResolvedValue({
        value: "1d8",
      });
      dieDescending = new DieDescending(newActor, "18");
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it("should change to D6", async () => {
      const result = await dieDescending.Check();
      // @ts-expect-error TS(2304): Cannot find name 'expect'.
      expect(result).toBeFalsy();
      // @ts-expect-error TS(2304): Cannot find name 'expect'.
      expect(newActor.setFlag).toBeCalledWith(
        MODULE_FLAG_NAME,
        DIE_DESCENDING_FLAG_OPTION,
        { value: "1d6" }
      );
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe("If a roll of 18 flag set as 1d6", () => {
    let dieDescending: any;
    let newActor = actor;
    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(() => {
      // @ts-expect-error TS(2304): Cannot find name 'jest'.
      newActor.getFlag = jest.fn().mockResolvedValue({
        value: "1d6",
      });
      dieDescending = new DieDescending(newActor, "18");
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it("should change to D4", async () => {
      const result = await dieDescending.Check();
      // @ts-expect-error TS(2304): Cannot find name 'expect'.
      expect(result).toBeFalsy();
      // @ts-expect-error TS(2304): Cannot find name 'expect'.
      expect(newActor.setFlag).toBeCalledWith(
        MODULE_FLAG_NAME,
        DIE_DESCENDING_FLAG_OPTION,
        { value: "1d4" }
      );
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe("If a roll of 18 flag set as 1d4", () => {
    let dieDescending: any;
    let newActor = actor;
    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(() => {
      // @ts-expect-error TS(2304): Cannot find name 'jest'.
      newActor.getFlag = jest.fn().mockResolvedValue({
        value: "1d4",
      });
      dieDescending = new DieDescending(newActor, "18");
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it("should stay as D4", async () => {
      const result = await dieDescending.Check();
      // @ts-expect-error TS(2304): Cannot find name 'expect'.
      expect(result).toBeFalsy();
      // @ts-expect-error TS(2304): Cannot find name 'expect'.
      expect(newActor.setFlag).toBeCalledWith(
        MODULE_FLAG_NAME,
        DIE_DESCENDING_FLAG_OPTION,
        { value: "1d4" }
      );
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe("If a DIE_DESCENDING_FLAG_OPTION is not set", () => {
    let dieDescending: any;
    let newActor = actor;
    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(() => {
      // @ts-expect-error TS(2304): Cannot find name 'jest'.
      newActor.getFlag = jest.fn().mockResolvedValue(undefined);
      dieDescending = new DieDescending(newActor, "18");
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it("should set the flag as default values", async () => {
      const result = await dieDescending.Check();
      // @ts-expect-error TS(2304): Cannot find name 'expect'.
      expect(result).toBeFalsy();
      // @ts-expect-error TS(2304): Cannot find name 'expect'.
      expect(newActor.setFlag).toBeCalledWith(
        MODULE_FLAG_NAME,
        DIE_DESCENDING_FLAG_OPTION,
        { value: "1d20" }
      );
    });
  });
});
