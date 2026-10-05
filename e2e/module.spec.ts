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

test("the dedicated world has no leftover browser-test actors or players", async ({
  gmPage,
}) => {
  const leftovers = await gmPage.evaluate(() => {
    const { game } = globalThis as unknown as {
      game: {
        actors: { contents: Array<{ name: string }> };
        users: { contents: Array<{ name: string }> };
      };
    };
    return {
      actors: game.actors.contents
        .filter((actor) => actor.name.startsWith("E2E "))
        .map((actor) => actor.name),
      players: game.users.contents
        .filter((user) => user.name.startsWith("E2E Player "))
        .map((user) => user.name),
    };
  });

  expect(leftovers).toEqual({ actors: [], players: [] });
});
