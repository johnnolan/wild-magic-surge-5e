import IncrementalCheck from "./IncrementalCheck.js";
// @ts-expect-error TS(7016): Could not find a declaration file for module '../.... Remove this comment to see the full error message
import { actor } from "../../MockData/actor.js";
import "../../__mocks__/index.js";

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe("IncrementalCheck", () => {
  // @ts-expect-error TS(2304): Cannot find name 'global'.
  global.Hooks = {
    // @ts-expect-error TS(2304): Cannot find name 'jest'.
    callAll: jest.fn().mockReturnValue(true),
  };

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe("If a roll of 1 with no actor", () => {
    let incrementalCheck: any;
    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(() => {
      incrementalCheck = new IncrementalCheck(undefined, 1);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it("should return false", async () => {
      const result = await incrementalCheck.Check();
      // @ts-expect-error TS(2304): Cannot find name 'expect'.
      expect(result).toBeFalsy();
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe("If a roll of 1 with no flag set", () => {
    let incrementalCheck: any;
    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(() => {
      let newActor = {
        // @ts-expect-error TS(2304): Cannot find name 'jest'.
        setFlag: jest.fn().mockResolvedValue(true),
        flags: [],
      };
      incrementalCheck = new IncrementalCheck(newActor, 1);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it("should return true", async () => {
      const result = await incrementalCheck.Check();
      // @ts-expect-error TS(2304): Cannot find name 'expect'.
      expect(result).toBeTruthy();
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe("If a roll of 10 with no flag set", () => {
    let incrementalCheck: any;
    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(() => {
      let newActor = {
        // @ts-expect-error TS(2304): Cannot find name 'jest'.
        setFlag: jest.fn().mockResolvedValue(true),
        flags: [],
      };
      incrementalCheck = new IncrementalCheck(newActor, 10);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it("should return false", async () => {
      const result = await incrementalCheck.Check();
      // @ts-expect-error TS(2304): Cannot find name 'expect'.
      expect(result).toBeFalsy();
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe("If a roll of 1 with no flag value set", () => {
    let incrementalCheck: any;
    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(() => {
      let newActor = actor;
      newActor.flags["wild-magic-surge-5e"] = {};
      incrementalCheck = new IncrementalCheck(newActor, 1);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it("should return true", async () => {
      const result = await incrementalCheck.Check();
      // @ts-expect-error TS(2304): Cannot find name 'expect'.
      expect(result).toBeTruthy();
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe("If a roll of 4 with no flag set", () => {
    let incrementalCheck: any;
    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(() => {
      let newActor = actor;
      newActor.flags["wild-magic-surge-5e"] = {};
      incrementalCheck = new IncrementalCheck(actor, 4);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it("should return false", async () => {
      const result = await incrementalCheck.Check();
      // @ts-expect-error TS(2304): Cannot find name 'expect'.
      expect(result).toBeFalsy();
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe("If a roll of 1 flag set as 1", () => {
    let incrementalCheck: any;
    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(() => {
      incrementalCheck = new IncrementalCheck(actor, 1);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it("should return true", async () => {
      const result = await incrementalCheck.Check();
      // @ts-expect-error TS(2304): Cannot find name 'expect'.
      expect(result).toBeTruthy();
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe("If a roll of 4 flag set as 2", () => {
    let incrementalCheck: any;
    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(() => {
      let newActor = actor;
      // @ts-expect-error TS(2304): Cannot find name 'jest'.
      newActor.getFlag = jest.fn().mockResolvedValue({
        max: 20,
        min: 1,
        value: 2,
      });
      incrementalCheck = new IncrementalCheck(actor, 4);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it("should return false", async () => {
      const result = await incrementalCheck.Check();
      // @ts-expect-error TS(2304): Cannot find name 'expect'.
      expect(result).toBeFalsy();
    });
  });
});
