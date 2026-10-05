import { test, expect } from "./fixtures";

test("the browser suite leaves no E2E documents or chat behind", async ({
  gmPage,
}) => {
  const leftovers = await gmPage.evaluate(() => {
    type NamedDocument = { name: string };
    const { game } = globalThis as unknown as {
      game: {
        actors: { contents: NamedDocument[] };
        users: { contents: NamedDocument[] };
        tables: { contents: NamedDocument[] };
        macros: { contents: NamedDocument[] };
        scenes: { contents: NamedDocument[] };
        combats: { contents: NamedDocument[] };
        messages: {
          contents: Array<{ content: string; flavor?: string }>;
        };
      };
    };
    const names = (documents: NamedDocument[]) =>
      documents
        .filter((document) => document.name.startsWith("E2E "))
        .map((document) => document.name);
    return {
      actors: names(game.actors.contents),
      players: names(game.users.contents),
      tables: names(game.tables.contents),
      macros: names(game.macros.contents),
      scenes: names(game.scenes.contents),
      combats: names(game.combats.contents),
      messages: game.messages.contents
        .filter((message) =>
          `${message.content} ${message.flavor ?? ""}`.includes("E2E "),
        )
        .map((message) => message.content),
    };
  });

  expect(leftovers).toEqual({
    actors: [],
    players: [],
    tables: [],
    macros: [],
    scenes: [],
    combats: [],
    messages: [],
  });
});
