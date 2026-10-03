import type { Page } from "@playwright/test";

export interface ChatObservation {
  id: string;
  content: string;
  flavor: string;
  speakerActorId: string | null;
  rollTotal: number | null;
}

export async function readLevelOneSlots(
  page: Page,
  actorId: string,
): Promise<number> {
  return page.evaluate((id) => {
    const { game } = globalThis as unknown as {
      game: {
        actors: {
          get(
            id: string,
          ): { system: { spells: { spell1: { value: number } } } } | undefined;
        };
      };
    };
    const actor = game.actors.get(id);
    if (!actor) throw new Error(`Test actor ${id} is missing.`);
    return actor.system.spells.spell1.value;
  }, actorId);
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

export async function readChatMessages(page: Page): Promise<ChatObservation[]> {
  return page.evaluate(() => {
    const { game } = globalThis as unknown as {
      game: {
        messages: {
          contents: Array<{
            id: string;
            content: string;
            flavor?: string;
            speaker?: { actor?: string };
            rolls?: Array<{ total?: number | null }>;
          }>;
        };
      };
    };
    return game.messages.contents.map((message) => ({
      id: message.id,
      content: message.content,
      flavor: message.flavor ?? "",
      speakerActorId: message.speaker?.actor ?? null,
      rollTotal: message.rolls?.[0]?.total ?? null,
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
