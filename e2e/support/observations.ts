import type { Page } from "@playwright/test";

export interface ChatObservation {
  id: string;
  content: string;
  flavor: string;
  speakerActorId: string | null;
  rollTotal: number | null;
  rollFormula: string | null;
}

export async function readLevelOneSlots(
  page: Page,
  actorId: string,
): Promise<number> {
  return readSpellSlots(page, actorId, 1);
}

export async function readSpellSlots(
  page: Page,
  actorId: string,
  level: number,
): Promise<number> {
  return page.evaluate(
    ({ actorId: id, level }) => {
      const { game } = globalThis as unknown as {
        game: {
          actors: {
            get(
              id: string,
            ):
              | { system: { spells: Record<string, { value: number }> } }
              | undefined;
          };
        };
      };
      const actor = game.actors.get(id);
      if (!actor) throw new Error(`Test actor ${id} is missing.`);
      return actor.system.spells[`spell${level}`]?.value ?? 0;
    },
    { actorId, level },
  );
}

export async function readSurgedFlag(
  page: Page,
  actorId: string,
): Promise<boolean | undefined> {
  return page.evaluate((id) => {
    const { game } = globalThis as unknown as {
      game: {
        actors: {
          get(
            id: string,
          ):
            | { getFlag(namespace: string, key: string): boolean | undefined }
            | undefined;
        };
      };
    };
    const actor = game.actors.get(id);
    if (!actor) throw new Error(`Test actor ${id} is missing.`);
    return actor.getFlag("wild-magic-surge-5e", "hassurged");
  }, actorId);
}

export async function readSurgeResource(
  page: Page,
  actorId: string,
  key: "resource" | "surge_increment_resource" = "surge_increment_resource",
): Promise<{ value: number; max: number } | undefined> {
  return page.evaluate(
    ({ actorId, key }) => {
      const { game } = globalThis as unknown as {
        game: {
          actors: {
            get(id: string):
              | {
                  getFlag(
                    namespace: string,
                    key: string,
                  ): { value: number; max: number } | undefined;
                }
              | undefined;
          };
        };
      };
      const actor = game.actors.get(actorId);
      if (!actor) throw new Error(`Test actor ${actorId} is missing.`);
      return actor.getFlag("wild-magic-surge-5e", key);
    },
    { actorId, key },
  );
}

export async function readSheetResource(
  page: Page,
  actorId: string,
  slot: "primary" | "secondary" | "tertiary",
): Promise<{ value: number; max: number; label: string }> {
  return page.evaluate(
    ({ actorId, slot }) => {
      const { game } = globalThis as unknown as {
        game: {
          actors: {
            get(id: string):
              | {
                  system: {
                    resources: Record<
                      string,
                      { value: number; max: number; label: string }
                    >;
                  };
                }
              | undefined;
          };
        };
      };
      const resource = game.actors.get(actorId)?.system.resources[slot];
      if (!resource) throw new Error(`The ${slot} resource is missing.`);
      return {
        value: resource.value,
        max: resource.max,
        label: resource.label,
      };
    },
    { actorId, slot },
  );
}

export async function readChatMessages(page: Page): Promise<ChatObservation[]> {
  return page.evaluate(() => {
    const { game } = globalThis as unknown as {
      game: {
        messages: {
          contents: Array<{
            id: string;
            content: string;
            flavor?: string;
            visible: boolean;
            isContentVisible: boolean;
            speaker?: { actor?: string };
            rolls?: Array<{ total?: number | null; formula?: string }>;
          }>;
        };
      };
    };
    return game.messages.contents
      .filter((message) => message.visible && message.isContentVisible)
      .map((message) => ({
        id: message.id,
        content: message.content,
        flavor: message.flavor ?? "",
        speakerActorId: message.speaker?.actor ?? null,
        rollTotal: message.rolls?.[0]?.total ?? null,
        rollFormula: message.rolls?.[0]?.formula ?? null,
      }));
  });
}

export function messagesAfter(
  before: ChatObservation[],
  after: ChatObservation[],
): ChatObservation[] {
  const oldIds = new Set(before.map((message) => message.id));
  return after.filter((message) => !oldIds.has(message.id));
}
