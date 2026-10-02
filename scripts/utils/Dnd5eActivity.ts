export interface Dnd5ePostUseActivity {
  item: Item;
  consumption?: {
    spellSlot?: boolean;
  };
}

interface PostUseActivityHandlers {
  getTokenIdByActorId: (actorId: string) => string | undefined;
  isGM: boolean;
  onGMCheck: (actor: Actor, item: Item, tokenId: string | undefined) => void;
  onPlayerCheck: (data: {
    event: "SurgeCheck";
    data: {
      actorId: string;
      tokenId: string | undefined;
      item: Item;
    };
  }) => void;
}

export function HandlePostUseActivity(
  activity: Dnd5ePostUseActivity,
  handlers: PostUseActivityHandlers,
): void {
  if (!activity.consumption?.spellSlot) return;

  const item = activity.item;
  const actor = item.actor;
  if (!actor) return;

  const actorId = actor.id;
  const tokenId = actorId ? handlers.getTokenIdByActorId(actorId) : undefined;
  if (handlers.isGM) {
    handlers.onGMCheck(actor, item, tokenId);
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
