import type { UsageConfig } from "../types/domain";

export interface Dnd5ePostUseActivity {
  item: Item;
  consumption?: {
    spellSlot?: boolean;
  };
}

interface PostUseActivityHandlers {
  getTokenIdByActorId: (actorId: string) => string | undefined;
  isGM: boolean;
  onGMCheck: (
    actor: Actor,
    item: Item,
    tokenId: string | undefined,
  ) => Promise<void> | void;
  onPlayerCheck: (data: {
    event: "SurgeCheck";
    data: {
      actorId: string;
      tokenId: string | undefined;
      item: Item;
    };
  }) => void;
}

export async function HandlePostUseActivity(
  activity: Dnd5ePostUseActivity,
  handlers: PostUseActivityHandlers,
): Promise<void> {
  if (!activity.consumption?.spellSlot) return;

  const item = activity.item;
  const actor = item.actor;
  if (!actor) return;

  const actorId = actor.id;
  const tokenId = actorId ? handlers.getTokenIdByActorId(actorId) : undefined;
  if (handlers.isGM) {
    await handlers.onGMCheck(actor, item, tokenId);
    return;
  }

  if (!actorId) return;

  handlers.onPlayerCheck({
    event: "SurgeCheck",
    data: {
      actorId,
      tokenId,
      item,
    },
  });
}
/** Normalize hook and socket data; older callers have no scaling information. */
export function ParseUsageConfig(value: unknown): UsageConfig {
  if (
    value &&
    typeof value === "object" &&
    "scaling" in value &&
    typeof value.scaling === "number" &&
    Number.isFinite(value.scaling)
  ) {
    return { scaling: value.scaling };
  }
  return { scaling: 0 };
}
