import type { Page } from "@playwright/test";

export interface TestCaster {
  actorId: string;
  actorName: string;
  spellId: string;
  activityId: string;
}

type CasterOptions = {
  name: string;
  featName?: string;
  includeFeat?: boolean;
};

/** Build a real dnd5e 6.0.5 caster from the installed SRD spell pack. */
export async function createCaster(
  page: Page,
  { name, featName = "Wild Magic Surge", includeFeat = true }: CasterOptions,
): Promise<TestCaster> {
  return page.evaluate(
    async ({ name, featName, includeFeat }) => {
      type TestItem = {
        id: string;
        type: string;
        system: {
          level?: number;
          activities?: {
            find(
              match: (activity: {
                id: string;
                consumption?: { spellSlot?: boolean };
              }) => boolean,
            ):
              { id: string; consumption?: { spellSlot?: boolean } } | undefined;
          };
        };
      };
      type TestActor = {
        id: string;
        name: string;
        system: { spells: { spell1: { value: number; max: number } } };
        createEmbeddedDocuments(
          type: "Item",
          data: Record<string, unknown>[],
        ): Promise<TestItem[]>;
        update(data: Record<string, unknown>): Promise<unknown>;
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
                    find(
                      match: (entry: { name: string; _id: string }) => boolean,
                    ): { name: string; _id: string } | undefined;
                  }>;
                  getDocument(id: string): Promise<{
                    toObject(): Record<string, unknown>;
                  } | null>;
                }
              | undefined;
          };
        };
      };

      const actor = await Actor.create({ name, type: "character" });
      if (!actor) throw new Error("Foundry did not create the test caster.");

      try {
        const pack = game.packs.get("dnd5e.spells");
        if (!pack) throw new Error("The dnd5e SRD spell pack is missing.");
        const index = await pack.getIndex();
        const entry = index.find((item) => item.name === "Magic Missile");
        if (!entry)
          throw new Error("Magic Missile is missing from dnd5e.spells.");
        const source = await pack.getDocument(entry._id);
        if (!source)
          throw new Error("Could not read Magic Missile from dnd5e.spells.");

        if (includeFeat) {
          const [feat] = await actor.createEmbeddedDocuments("Item", [
            { name: featName, type: "feat" },
          ]);
          if (feat?.type !== "feat") {
            throw new Error("The Wild Magic Surge test feat was not created.");
          }
        }

        const [spell] = await actor.createEmbeddedDocuments("Item", [
          source.toObject(),
        ]);
        const activity = spell?.system.activities?.find(
          (candidate) => candidate.consumption?.spellSlot === true,
        );
        if (spell?.type !== "spell" || spell.system.level !== 1 || !activity) {
          throw new Error(
            "Magic Missile has no usable level-one spell activity.",
          );
        }

        await actor.update({
          "system.spells.spell1.override": 2,
          "system.spells.spell1.value": 2,
        });
        if (actor.system.spells.spell1.value !== 2) {
          throw new Error("The test caster has no level-one spell slots.");
        }

        return {
          actorId: actor.id,
          actorName: actor.name,
          spellId: spell.id,
          activityId: activity.id,
        };
      } catch (error) {
        await actor.delete();
        throw error;
      }
    },
    { name, featName, includeFeat },
  );
}

export async function grantActorToPlayer(
  page: Page,
  actorId: string,
  userId: string,
): Promise<void> {
  await page.evaluate(
    async ({ actorId, userId }) => {
      const { game } = globalThis as unknown as {
        game: {
          actors: {
            get(
              id: string,
            ):
              | { update(data: Record<string, unknown>): Promise<unknown> }
              | undefined;
          };
        };
      };
      const actor = game.actors.get(actorId);
      if (!actor) throw new Error(`Test actor ${actorId} is missing.`);
      await actor.update({ [`ownership.${userId}`]: 3 });
    },
    { actorId, userId },
  );
}

/** Foundry sends ownership changes, but a new player needs a world refresh. */
export async function refreshPlayerWorld(page: Page): Promise<void> {
  await page.reload();
  await page.waitForFunction(() => {
    const { game } = globalThis as unknown as {
      game?: { ready?: boolean };
    };
    return game?.ready === true;
  });
}

export async function setIncrementalThreshold(
  page: Page,
  actorId: string,
  value: number,
): Promise<void> {
  await page.evaluate(
    async ({ actorId, value }) => {
      const { game } = globalThis as unknown as {
        game: {
          actors: {
            get(id: string):
              | {
                  setFlag(
                    namespace: string,
                    key: string,
                    value: Record<string, unknown>,
                  ): Promise<unknown>;
                }
              | undefined;
          };
        };
      };
      const actor = game.actors.get(actorId);
      if (!actor) throw new Error(`Test actor ${actorId} is missing.`);
      await actor.setFlag("wild-magic-surge-5e", "surge_increment_resource", {
        label: "Surge Chance",
        lr: false,
        sr: false,
        max: 20,
        value,
      });
    },
    { actorId, value },
  );
}
