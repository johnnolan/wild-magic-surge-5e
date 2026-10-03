import { test, expect, readGameState } from "./fixtures";

test("loads Wild Magic Surge in a dnd5e world", async ({ gmPage }) => {
  await expect
    .poll(() => readGameState(gmPage))
    .toEqual({
      ready: true,
      systemId: "dnd5e",
      moduleActive: true,
    });
});
