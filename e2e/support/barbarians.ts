import type { Page } from "@playwright/test";

export interface TestBarbarian {
  actorId: string;
  rageId: string;
  rageActivityId: string;
}

/** Give a disposable actor the installed dnd5e Rage feature and its subclass. */
export async function createWildMagicBarbarian(
  page: Page,
  name: string,
): Promise<TestBarbarian> {
  return page.evaluate(async (actorName) => {
    type TestItem = {
      id: string;
      type: string;
      system: { activities?: { contents?: Array<{ id: string }> } };
      update(data: Record<string, unknown>): Promise<unknown>;
    };
    type TestActor = {
      id: string;
      items: { find(match: (item: TestItem) => boolean): TestItem | undefined };
      createEmbeddedDocuments(
        type: "Item",
        data: Record<string, unknown>[],
      ): Promise<TestItem[]>;
      delete(): Promise<unknown>;
    };
    const { Actor, game } = globalThis as unknown as {
      Actor: {
        create(data: Record<string, unknown>): Promise<TestActor | null>;
      };
      game: {
        packs: {
          get(id: string):
            | {
                getIndex(): Promise<{
                  filter(
                    match: (entry: { name: string; _id: string }) => boolean,
                  ): Array<{ _id: string }>;
                }>;
                getDocument(id: string): Promise<{
                  toObject(): Record<string, unknown>;
                } | null>;
              }
            | undefined;
        };
      };
    };
    const actor = await Actor.create({ name: actorName, type: "character" });
    if (!actor) throw new Error("Foundry did not create the test Barbarian.");

    try {
      await actor.createEmbeddedDocuments("Item", [
        { name: "Barbarian", type: "class", system: { levels: 3 } },
        {
          name: "Path of Wild Magic",
          type: "subclass",
          system: { classIdentifier: "barbarian" },
        },
      ]);
      if (!actor.items.find((item) => item.type === "subclass")) {
        throw new Error("The Path of Wild Magic subclass was not created.");
      }

      const pack = game.packs.get("dnd5e.classfeatures");
      if (!pack) throw new Error("The dnd5e class feature pack is missing.");
      const rageEntries = (await pack.getIndex()).filter(
        (entry) => entry.name === "Rage",
      );
      for (const entry of rageEntries) {
        const source = await pack.getDocument(entry._id);
        if (!source) continue;
        const [rage] = await actor.createEmbeddedDocuments("Item", [
          source.toObject(),
        ]);
        const activity = rage?.system.activities?.contents?.[0];
        if (rage?.type === "feat" && activity) {
          await rage.update({
            "system.uses.max": 2,
            "system.uses.spent": 0,
          });
          return {
            actorId: actor.id,
            rageId: rage.id,
            rageActivityId: activity.id,
          };
        }
      }
      throw new Error(
        "No usable Rage feature was found in dnd5e.classfeatures.",
      );
    } catch (error) {
      await actor.delete();
      throw error;
    }
  }, name);
}
