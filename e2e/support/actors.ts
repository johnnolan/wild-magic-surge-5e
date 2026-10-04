import type { Page } from "@playwright/test";

export interface TestCaster {
  actorId: string;
  actorName: string;
  spellId: string;
  activityId: string;
  spellLevel: number;
}

type CasterOptions = {
  name: string;
  featName?: string;
  includeFeat?: boolean;
  spellSlots?: number;
  spellName?: string;
  displaySpellName?: string;
  actorType?: "character" | "npc";
  allowCantrip?: boolean;
};

/** Build a real dnd5e 6.0.5 caster from the installed SRD spell pack. */
export async function createCaster(
  page: Page,
  {
    name,
    featName = "Wild Magic Surge",
    includeFeat = true,
    spellSlots = 2,
    spellName = "Magic Missile",
    displaySpellName,
    actorType = "character",
    allowCantrip = false,
  }: CasterOptions,
): Promise<TestCaster> {
  return page.evaluate(
    async ({
      name,
      featName,
      includeFeat,
      spellSlots,
      spellName,
      displaySpellName,
      actorType,
      allowCantrip,
    }) => {
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
        system: { spells: Record<string, { value: number; max: number }> };
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

      const actor = await Actor.create({ name, type: actorType });
      if (!actor) throw new Error("Foundry did not create the test caster.");

      try {
        const pack = game.packs.get("dnd5e.spells");
        if (!pack) throw new Error("The dnd5e SRD spell pack is missing.");
        const index = await pack.getIndex();
        const entry = index.find((item) => item.name === spellName);
        if (!entry)
          throw new Error(`${spellName} is missing from dnd5e.spells.`);
        const source = await pack.getDocument(entry._id);
        if (!source)
          throw new Error(`Could not read ${spellName} from dnd5e.spells.`);

        if (includeFeat) {
          const [feat] = await actor.createEmbeddedDocuments("Item", [
            { name: featName, type: "feat" },
          ]);
          if (feat?.type !== "feat") {
            throw new Error("The Wild Magic Surge test feat was not created.");
          }
        }

        const spellData = source.toObject();
        if (displaySpellName) spellData.name = displaySpellName;
        const [spell] = await actor.createEmbeddedDocuments("Item", [
          spellData,
        ]);
        const spellLevel = spell?.system.level;
        const activity = spell?.system.activities?.find((candidate) =>
          spellLevel === 0 ? true : candidate.consumption?.spellSlot === true,
        );
        if (
          spell?.type !== "spell" ||
          spellLevel === undefined ||
          (spellLevel === 0 && !allowCantrip) ||
          !activity
        ) {
          throw new Error(`${spellName} has no usable spell activity.`);
        }

        if (spellLevel > 0) {
          const slotKey = `spell${spellLevel}`;
          await actor.update({
            [`system.spells.${slotKey}.override`]: spellSlots,
            [`system.spells.${slotKey}.value`]: spellSlots,
          });
          if (actor.system.spells[slotKey]?.value !== spellSlots) {
            throw new Error(
              `The test caster has no level-${spellLevel} spell slots.`,
            );
          }
        }

        return {
          actorId: actor.id,
          actorName: actor.name,
          spellId: spell.id,
          activityId: activity.id,
          spellLevel,
        };
      } catch (error) {
        await actor.delete();
        throw error;
      }
    },
    {
      name,
      featName,
      includeFeat,
      spellSlots,
      spellName,
      displaySpellName,
      actorType,
      allowCantrip,
    },
  );
}

export async function createCantripCaster(
  page: Page,
  name: string,
): Promise<TestCaster> {
  return createCaster(page, { name, spellName: "Light", allowCantrip: true });
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
  return setSurgeStage(page, actorId, value, 20);
}

/** Seed the module-owned flag before a real cast exercises a specific stage. */
export async function setSurgeStage(
  page: Page,
  actorId: string,
  value: number,
  max: number,
  key: "surge_increment_resource" | "resource" = "surge_increment_resource",
): Promise<void> {
  await page.evaluate(
    async ({ actorId, value, max, key }) => {
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
      await actor.setFlag("wild-magic-surge-5e", key, {
        label: "Surge Chance",
        lr: false,
        sr: false,
        max,
        value,
      });
    },
    { actorId, value, max, key },
  );
}

export async function setSheetResource(
  page: Page,
  actorId: string,
  slot: "primary" | "secondary" | "tertiary",
  resource: { label: string; value: number; max: number },
): Promise<void> {
  await page.evaluate(
    async ({ actorId, slot, resource }) => {
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
      await actor.update({
        [`system.resources.${slot}`]: { ...resource, lr: false, sr: false },
      });
    },
    { actorId, slot, resource },
  );
}

export async function addClassLevels(
  page: Page,
  actorId: string,
  levels: number,
): Promise<number> {
  return page.evaluate(
    async ({ actorId, levels }) => {
      const { game } = globalThis as unknown as {
        game: {
          actors: {
            get(id: string):
              | {
                  createEmbeddedDocuments(
                    type: "Item",
                    data: Record<string, unknown>[],
                  ): Promise<unknown>;
                  system: { details: { level: number } };
                }
              | undefined;
          };
        };
      };
      const actor = game.actors.get(actorId);
      if (!actor) throw new Error(`Test actor ${actorId} is missing.`);
      await actor.createEmbeddedDocuments("Item", [
        { name: "E2E Sorcerer", type: "class", system: { levels } },
      ]);
      return actor.system.details.level;
    },
    { actorId, levels },
  );
}
