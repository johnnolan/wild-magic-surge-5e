import { resultCheck } from "./MagicSurgeCheck.js";
import { actor } from "../MockData/actor.js";

describe("resultCheck", () => {
  global.game = {
    actors: actor,
    settings: {
      get: jest.fn().mockReturnValue(2),
    },
  };
  test("roll of 2 EQ 2", async () => {
    const result = await resultCheck(2, "EQ");
    expect(result).toBeTruthy();
  });
  test("roll of 2 Not EQ 2", async () => {
    const result = await resultCheck(1, "EQ");
    expect(result).toBeFalsy();
  });
  test("roll of 2 Not GT 2", async () => {
    const result = await resultCheck(2, "GT");
    expect(result).toBeFalsy();
  });
  test("roll of 3 GT 2", async () => {
    const result = await resultCheck(3, "GT");
    expect(result).toBeTruthy();
  });
  test("roll of 2 Not LT 2", async () => {
    const result = await resultCheck(2, "LT");
    expect(result).toBeFalsy();
  });
  test("roll of 1 LT 2", async () => {
    const result = await resultCheck(1, "LT");
    expect(result).toBeTruthy();
  });
});
