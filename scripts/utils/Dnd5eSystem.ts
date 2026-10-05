export type Dnd5eItemSubtype = "spell" | "feat" | "subclass";
export type Dnd5eActorSubtype = "character" | "npc";
export type Dnd5eResourceSlot = "primary" | "secondary" | "tertiary";

export interface Dnd5eResourceData {
  label: string;
  lr: boolean;
  sr: boolean;
  max: number;
  value: number;
}

export interface Dnd5eUsesData {
  value: number;
  max?: number;
  spent?: number;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

export function GetDnd5eSpellLevel(system: unknown): number | undefined {
  if (!isRecord(system)) return undefined;
  const level = system.level;
  return Number.isInteger(level) &&
    typeof level === "number" &&
    level >= 0 &&
    level <= 9
    ? level
    : undefined;
}

export function GetDnd5eActorLevel(system: unknown): number | undefined {
  if (!isRecord(system) || !isRecord(system.details)) return undefined;
  const level = system.details.level;
  return isFiniteNumber(level) && Number.isInteger(level) && level >= 0
    ? level
    : undefined;
}

export function GetDnd5eResource(
  system: unknown,
  slot: Dnd5eResourceSlot,
): Dnd5eResourceData | undefined {
  if (!isRecord(system) || !isRecord(system.resources)) return undefined;
  const resource = system.resources[slot];
  if (
    !isRecord(resource) ||
    !isFiniteNumber(resource.max) ||
    !isFiniteNumber(resource.value)
  ) {
    return undefined;
  }

  return {
    label: typeof resource.label === "string" ? resource.label : "Surge Chance",
    lr: typeof resource.lr === "boolean" ? resource.lr : false,
    sr: typeof resource.sr === "boolean" ? resource.sr : false,
    max: resource.max,
    value: resource.value,
  };
}

export function ParseDnd5eResource(
  value: unknown,
): Dnd5eResourceData | undefined {
  if (
    !isRecord(value) ||
    !isFiniteNumber(value.max) ||
    !isFiniteNumber(value.value)
  ) {
    return undefined;
  }

  return {
    label: typeof value.label === "string" ? value.label : "Surge Chance",
    lr: typeof value.lr === "boolean" ? value.lr : false,
    sr: typeof value.sr === "boolean" ? value.sr : false,
    max: value.max,
    value: value.value,
  };
}

export function GetDnd5eUses(system: unknown): Dnd5eUsesData | undefined {
  if (
    !isRecord(system) ||
    !isRecord(system.uses) ||
    !isFiniteNumber(system.uses.value)
  ) {
    return undefined;
  }

  const uses: Dnd5eUsesData = { value: system.uses.value };
  if (isFiniteNumber(system.uses.max)) uses.max = system.uses.max;
  if (isFiniteNumber(system.uses.spent)) uses.spent = system.uses.spent;
  return uses;
}

export function IsDnd5eItemSubtype(
  item: { type?: unknown } | null | undefined,
  subtype: Dnd5eItemSubtype,
): boolean {
  return item?.type === subtype;
}

export function IsDnd5eActorSubtype(
  actor: { type?: unknown } | null | undefined,
  subtype: Dnd5eActorSubtype,
): boolean {
  return actor?.type === subtype;
}
