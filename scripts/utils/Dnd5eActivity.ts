import { IsDnd5eItemSubtype } from "./Dnd5eSystem";

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
    isUpcast: boolean,
  ) => Promise<void> | void;
  onPlayerCheck: (data: {
    event: "SurgeCheck";
    data: {
      actorId: string;
      tokenId: string | undefined;
      item: Item;
      isUpcast: boolean;
    };
  }) => void;
}

export async function HandlePostUseActivity(
  activity: Dnd5ePostUseActivity,
  handlers: PostUseActivityHandlers,
  usageConfig?: unknown,
): Promise<void> {
  if (!activity.consumption?.spellSlot) return;

  const item = activity.item;
  const scaling =
    usageConfig && typeof usageConfig === "object" && "scaling" in usageConfig
      ? usageConfig.scaling
      : undefined;
  const isUpcast =
    IsDnd5eItemSubtype(item, "spell") &&
    typeof scaling === "number" &&
    Number.isFinite(scaling) &&
    scaling > 0;
  const actor = item.actor;
  if (!actor) return;

  const actorId = actor.id;
  const tokenId = actorId ? handlers.getTokenIdByActorId(actorId) : undefined;
  if (handlers.isGM) {
    await handlers.onGMCheck(actor, item, tokenId, isUpcast);
    return;
  }

  if (!actorId) return;

  handlers.onPlayerCheck({
    event: "SurgeCheck",
    data: {
      actorId,
      tokenId,
      item,
      isUpcast,
    },
  });
}
