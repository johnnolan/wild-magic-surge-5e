import type { Page } from "@playwright/test";

export interface ChatObservation {
  id: string;
  authorId: string | null;
  content: string;
  visibleContent: string;
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
            author?: { id?: string };
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
      .map((message) => {
        const content = document.createElement("div");
        content.innerHTML = message.content ?? "";
        return {
          id: message.id,
          authorId: message.author?.id ?? null,
          content: message.content,
          visibleContent: content.textContent?.trim() ?? "",
          flavor: message.flavor ?? "",
          speakerActorId: message.speaker?.actor ?? null,
          rollTotal: message.rolls?.[0]?.total ?? null,
          rollFormula: message.rolls?.[0]?.formula ?? null,
        };
      });
  });
}

export type ChatSessions = { gm: Page; caster: Page; unrelated: Page };
export type ChatViews = Record<keyof ChatSessions, ChatObservation[]>;

/** Compare IDs after one action; each list contains only content the user can see. */
export async function readChatViews(
  sessions: ChatSessions,
): Promise<ChatViews> {
  const [gm, caster, unrelated] = await Promise.all([
    readChatMessages(sessions.gm),
    readChatMessages(sessions.caster),
    readChatMessages(sessions.unrelated),
  ]);
  return { gm, caster, unrelated };
}

export function newChatViews(before: ChatViews, after: ChatViews): ChatViews {
  return {
    gm: messagesAfter(before.gm, after.gm),
    caster: messagesAfter(before.caster, after.caster),
    unrelated: messagesAfter(before.unrelated, after.unrelated),
  };
}

export function sharedMessageIds(views: ChatViews): {
  all: string[];
  gmOnly: string[];
  players: string[];
} {
  const gm = new Set(views.gm.map((message) => message.id));
  const caster = new Set(views.caster.map((message) => message.id));
  const unrelated = new Set(views.unrelated.map((message) => message.id));
  return {
    all: [...gm].filter((id) => caster.has(id) && unrelated.has(id)),
    gmOnly: [...gm].filter((id) => !caster.has(id) && !unrelated.has(id)),
    players: [...new Set([...caster, ...unrelated])],
  };
}

export function messagesAfter(
  before: ChatObservation[],
  after: ChatObservation[],
): ChatObservation[] {
  const oldIds = new Set(before.map((message) => message.id));
  return after.filter((message) => !oldIds.has(message.id));
}
