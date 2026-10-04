import type { Page } from "@playwright/test";

/** Clone an installed dnd5e feat with a real Use activity and one charge. */
export async function addTidesOfChaos(
  page: Page,
  actorId: string,
): Promise<string> {
  return page.evaluate(async (id) => {
    type Item = {
      id: string;
      type: string;
      system: {
        uses?: { value?: number; max?: number; spent?: number };
        activities?: { size: number };
      };
      update(data: Record<string, unknown>): Promise<unknown>;
    };
    const { game } = globalThis as unknown as {
      game: {
        actors: {
          get(actorId: string):
            | {
                createEmbeddedDocuments(
                  type: "Item",
                  data: Record<string, unknown>[],
                ): Promise<Item[]>;
              }
            | undefined;
        };
        packs: {
          get(packId: string):
            | {
                getIndex(): Promise<{
                  find(
                    match: (entry: { name: string; _id: string }) => boolean,
                  ): { _id: string } | undefined;
                }>;
                getDocument(itemId: string): Promise<{
                  toObject(): Record<string, unknown>;
                } | null>;
              }
            | undefined;
        };
      };
    };
    const actor = game.actors.get(id);
    const pack = game.packs.get("dnd5e.classfeatures");
    if (!actor || !pack)
      throw new Error("The caster or dnd5e feat pack is missing.");
    const entry = (await pack.getIndex()).find(
      (item) => item.name === "Second Wind",
    );
    if (!entry)
      throw new Error("Second Wind is missing from dnd5e.classfeatures.");
    const source = await pack.getDocument(entry._id);
    if (!source)
      throw new Error("Could not read Second Wind from dnd5e.classfeatures.");
    const data = source.toObject();
    data.name = "Tides of Chaos";
    const [feat] = await actor.createEmbeddedDocuments("Item", [data]);
    if (!feat || feat.type !== "feat" || !feat.system.activities?.size) {
      throw new Error("The Tides test feat has no usable activity.");
    }
    await feat.update({
      "system.uses.max": 1,
      "system.uses.spent": 0,
      "system.uses.value": 1,
    });
    if (feat.system.uses?.value !== 1) {
      throw new Error("The Tides test feat did not start with one use.");
    }
    return feat.id;
  }, actorId);
}

export async function readTidesUses(
  page: Page,
  actorId: string,
  featId: string,
): Promise<{ value: number; spent: number | null }> {
  return page.evaluate(
    ({ actorId, featId }) => {
      const { game } = globalThis as unknown as {
        game: {
          actors: {
            get(id: string):
              | {
                  items: {
                    get(id: string):
                      | {
                          system: { uses?: { value?: number; spent?: number } };
                        }
                      | undefined;
                  };
                }
              | undefined;
          };
        };
      };
      const uses = game.actors.get(actorId)?.items.get(featId)?.system.uses;
      if (!uses) throw new Error("The Tides feat or its uses are missing.");
      return { value: uses.value ?? -1, spent: uses.spent ?? null };
    },
    { actorId, featId },
  );
}
