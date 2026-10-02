import { readFileSync } from "node:fs";
import { deferred } from "./test/FoundryFixtures";

const entries = readFileSync("packs/wild-magic-surge-5e.db", "utf8")
  .trim()
  .split("\n")
  .map((line) => JSON.parse(line) as { name: string; command: string });
const dialogSource = readFileSync("scripts/macros/dialog.js", "utf8").trimEnd();
const customMessageSource = readFileSync(
  "scripts/macros/custom-message.js",
  "utf8",
).trimEnd();
const packedDialog = entries.find((entry) => entry.name === "WMS Dialog");
const runPackedDialog = new Function(
  "actor",
  "foundry",
  `return (async () => { ${packedDialog?.command ?? ""} })();`,
);

describe("shipped macro compendium", () => {
  it("contains the current dialog and custom-message macros without V1 Dialog usage", () => {
    expect(entries).toHaveLength(4);
    expect(packedDialog?.command).toBe(dialogSource);
    expect(
      entries.find((entry) => entry.name === "WMS Custom Message")?.command,
    ).toBe(customMessageSource);
    for (const entry of entries) {
      expect(entry.command).not.toMatch(/\bnew\s+Dialog\s*\(/);
    }
  });

  it("opens the V2 dialog with the actor's name after a surge", async () => {
    const render = jest.fn().mockResolvedValue(undefined);
    const DialogV2 = jest.fn().mockImplementation(() => ({ render }));
    const getFlag = jest.fn().mockReturnValue(true);

    await runPackedDialog(
      { name: "Mira", getFlag },
      { applications: { api: { DialogV2 } } },
    );

    expect(getFlag).toHaveBeenCalledWith("wild-magic-surge-5e", "hassurged");
    expect(DialogV2).toHaveBeenCalledWith({
      window: { title: "Wild Magic Surge!" },
      content: "A surge just happened on Mira!",
      buttons: [{ action: "close", label: "Close" }],
    });
    expect(render).toHaveBeenCalledWith({ force: true });
  });

  it("does not open a dialog when no surge occurred", async () => {
    const DialogV2 = jest.fn();

    await runPackedDialog(
      { name: "Mira", getFlag: jest.fn().mockReturnValue(false) },
      { applications: { api: { DialogV2 } } },
    );

    expect(DialogV2).not.toHaveBeenCalled();
  });

  it("waits for the V2 dialog to render", async () => {
    const rendered = deferred<void>();
    const render = jest.fn(() => rendered.promise);
    const DialogV2 = jest.fn().mockImplementation(() => ({ render }));
    const opened = runPackedDialog(
      { name: "Mira", getFlag: jest.fn().mockReturnValue(true) },
      { applications: { api: { DialogV2 } } },
    );
    let completed = false;
    void opened.then(() => {
      completed = true;
    });

    await Promise.resolve();
    expect(completed).toBe(false);
    rendered.resolve();
    await opened;
    expect(completed).toBe(true);
  });
});
