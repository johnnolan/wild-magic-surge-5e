import { readFileSync } from "node:fs";

const source = readFileSync("scripts/macros/custom-message.js", "utf8");
const runMacro = new Function("actor", "game", "ChatMessage", source);

describe("custom-message macro", () => {
  it.each([
    [true, "Wild magic has been triggered."],
    [false, "Wild magic has not been triggered."],
  ])("sends the %s surge state as a blind GM message", (hasSurged, text) => {
    const create = jest.fn();
    runMacro(
      { getFlag: jest.fn().mockReturnValue(hasSurged) },
      { user: { id: "player-id" } },
      { create },
    );

    expect(create).toHaveBeenCalledWith(
      { user: "player-id", content: expect.stringContaining(text) },
      { messageMode: "blind" },
    );
  });
});
