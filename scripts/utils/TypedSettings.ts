import { WMSCONST } from "../WMSCONST";
import { ParseDnd5eResource } from "./Dnd5eSystem";
import type { DieValue, ResourceValue } from "../types/domain";

export interface WMSModuleSettingValues {
  autoRollD20: boolean;
  wmsName: string;
  spellRegexEnabled: boolean;
  spellRegexInverse: boolean;
  spellRegex: string;
  whisperToGM: boolean;
  whisperToGMRollChat: boolean;
  OPT_SURGE_TYPE: string;
  OPT_RESOURCE_TYPE: string;
  incrementalCheckToChat: boolean;
  magicSurgeChatMessage: string;
  magicSurgeChatMessageEnabled: boolean;
  autoRollD20Message: string;
  autoRollD20MessageEnabled: boolean;
  autoRollD20MessageNoSurge: string;
  autoRollD20MessageNoSurgeEnabled: boolean;
  enableRollTable: string;
  rollTableName: string;
  powmName: string;
  powmRollTableName: string;
  customRollDiceFormula: string;
  customRollResultCheck: string;
  customRollResult: string;
  OPT_TSL_DIE: string;
  OPT_TSL_CANTRIP: string;
  OPT_TSL_LVL1: string;
  OPT_TSL_LVL2: string;
  OPT_TSL_LVL3: string;
  OPT_TSL_LVL4: string;
  OPT_TSL_LVL5: string;
  OPT_TSL_LVL6: string;
  OPT_TSL_LVL7: string;
  OPT_TSL_LVL8: string;
  OPT_TSL_LVL9: string;
  OPT_TSL_LVL10: string;
  tocName: string;
  surgeTocEnabled: boolean;
  enableTidesOfChaosRecharge: boolean;
  minimumSpellLevelTrigger: string;
  cantripTriggerSurgeCheckEnabled: boolean;
  wildMagicSurgeEffectsEnabled: boolean;
  enableNpcTracking: boolean;
  enableTriggerMacro: boolean;
  triggerMacroName: string;
  showWMSDebugOption: boolean;
}

export type WMSModuleSettingKey = keyof WMSModuleSettingValues;
export type WMSModuleActorFlagValues = {
  hassurged: boolean;
  resource: ResourceValue;
  surge_increment_resource: ResourceValue;
  die_type: { dieValue: DieValue };
};
export type WMSModuleActorFlagKey = keyof WMSModuleActorFlagValues;
export type WMSModuleResourceFlagKey = "resource" | "surge_increment_resource";

type SettingConfigEntries = {
  [
    Key in WMSModuleSettingKey as `wild-magic-surge-5e.${Key}`
  ]: WMSModuleSettingValues[Key];
};

interface ModuleFlagConfig {
  Actor: {
    "wild-magic-surge-5e": WMSModuleActorFlagValues;
  };
}

const moduleSettingValueTypes: Record<
  WMSModuleSettingKey,
  "boolean" | "string"
> = {
  autoRollD20: "boolean",
  wmsName: "string",
  spellRegexEnabled: "boolean",
  spellRegexInverse: "boolean",
  spellRegex: "string",
  whisperToGM: "boolean",
  whisperToGMRollChat: "boolean",
  OPT_SURGE_TYPE: "string",
  OPT_RESOURCE_TYPE: "string",
  incrementalCheckToChat: "boolean",
  magicSurgeChatMessage: "string",
  magicSurgeChatMessageEnabled: "boolean",
  autoRollD20Message: "string",
  autoRollD20MessageEnabled: "boolean",
  autoRollD20MessageNoSurge: "string",
  autoRollD20MessageNoSurgeEnabled: "boolean",
  enableRollTable: "string",
  rollTableName: "string",
  powmName: "string",
  powmRollTableName: "string",
  customRollDiceFormula: "string",
  customRollResultCheck: "string",
  customRollResult: "string",
  OPT_TSL_DIE: "string",
  OPT_TSL_CANTRIP: "string",
  OPT_TSL_LVL1: "string",
  OPT_TSL_LVL2: "string",
  OPT_TSL_LVL3: "string",
  OPT_TSL_LVL4: "string",
  OPT_TSL_LVL5: "string",
  OPT_TSL_LVL6: "string",
  OPT_TSL_LVL7: "string",
  OPT_TSL_LVL8: "string",
  OPT_TSL_LVL9: "string",
  OPT_TSL_LVL10: "string",
  tocName: "string",
  surgeTocEnabled: "boolean",
  enableTidesOfChaosRecharge: "boolean",
  minimumSpellLevelTrigger: "string",
  cantripTriggerSurgeCheckEnabled: "boolean",
  wildMagicSurgeEffectsEnabled: "boolean",
  enableNpcTracking: "boolean",
  enableTriggerMacro: "boolean",
  triggerMacroName: "string",
  showWMSDebugOption: "boolean",
};

function isModuleResourceValue(value: unknown): value is ResourceValue {
  if (typeof value !== "object" || value === null) return false;
  const resource = value as Record<string, unknown>;
  return (
    typeof resource.label === "string" &&
    typeof resource.lr === "boolean" &&
    typeof resource.sr === "boolean" &&
    typeof resource.max === "number" &&
    Number.isFinite(resource.max) &&
    typeof resource.value === "number" &&
    Number.isFinite(resource.value)
  );
}

export function getModuleSetting<Key extends WMSModuleSettingKey>(
  key: Key,
): WMSModuleSettingValues[Key] {
  return game.settings.get(WMSCONST.MODULE_ID, key);
}

export function setModuleSetting<Key extends WMSModuleSettingKey>(
  key: Key,
  value: WMSModuleSettingValues[Key],
): Promise<WMSModuleSettingValues[Key]> {
  return game.settings.set(WMSCONST.MODULE_ID, key, value);
}

export function setModuleSettingFromForm(
  key: string,
  value: unknown,
): Promise<unknown> {
  if (!isWMSModuleSettingKey(key)) {
    throw new TypeError(`Unknown ${WMSCONST.MODULE_ID} setting: ${key}`);
  }
  if (typeof value !== moduleSettingValueTypes[key]) {
    throw new TypeError(`Invalid value type for ${WMSCONST.MODULE_ID}.${key}`);
  }

  return game.settings.set(
    WMSCONST.MODULE_ID,
    key,
    value as WMSModuleSettingValues[typeof key],
  );
}

export function isWMSModuleSettingKey(key: string): key is WMSModuleSettingKey {
  return Object.prototype.hasOwnProperty.call(moduleSettingValueTypes, key);
}

export function getModuleActorFlag(
  actor: Actor,
  key: "hassurged",
): boolean | undefined;
export function getModuleActorFlag(
  actor: Actor,
  key: WMSModuleResourceFlagKey,
): ResourceValue | undefined;
export function getModuleActorFlag(
  actor: Actor,
  key: "die_type",
): WMSModuleActorFlagValues["die_type"] | undefined;
export function getModuleActorFlag(
  actor: Actor,
  key: WMSModuleActorFlagKey,
): boolean | ResourceValue | WMSModuleActorFlagValues["die_type"] | undefined {
  const value = actor.getFlag(WMSCONST.MODULE_ID, key);
  if (key === "hassurged") {
    return typeof value === "boolean" ? value : undefined;
  }
  if (key === "die_type") {
    if (typeof value !== "object" || value === null || !("dieValue" in value)) {
      return undefined;
    }
    const dieValue: unknown = value.dieValue;
    if (
      dieValue !== undefined &&
      (typeof dieValue !== "string" ||
        !["1d20", "1d12", "1d10", "1d8", "1d6", "1d4"].includes(dieValue))
    ) {
      return undefined;
    }
    return { dieValue: dieValue as DieValue };
  }
  return ParseDnd5eResource(value);
}

export function setModuleActorFlag(
  actor: Actor,
  key: "hassurged",
  value: boolean,
): Promise<Actor | undefined>;
export function setModuleActorFlag(
  actor: Actor,
  key: WMSModuleResourceFlagKey,
  value: ResourceValue,
): Promise<Actor | undefined>;
export function setModuleActorFlag(
  actor: Actor,
  key: "die_type",
  value: WMSModuleActorFlagValues["die_type"],
): Promise<Actor | undefined>;
export function setModuleActorFlag(
  actor: Actor,
  key: WMSModuleActorFlagKey,
  value: boolean | ResourceValue | WMSModuleActorFlagValues["die_type"],
): Promise<Actor | undefined> {
  if (key === "hassurged") {
    if (typeof value !== "boolean") {
      throw new TypeError(
        `Invalid value type for ${WMSCONST.MODULE_ID}.${key}`,
      );
    }
    return actor.setFlag(WMSCONST.MODULE_ID, key, value);
  }

  if (key === "die_type") {
    if (typeof value !== "object" || value === null || !("dieValue" in value)) {
      throw new TypeError(
        `Invalid value type for ${WMSCONST.MODULE_ID}.${key}`,
      );
    }
    const dieValue: unknown = value.dieValue;
    if (
      dieValue !== undefined &&
      (typeof dieValue !== "string" ||
        !["1d20", "1d12", "1d10", "1d8", "1d6", "1d4"].includes(dieValue))
    ) {
      throw new TypeError(
        `Invalid value type for ${WMSCONST.MODULE_ID}.${key}`,
      );
    }
    return actor.setFlag(WMSCONST.MODULE_ID, key, {
      dieValue: dieValue as DieValue,
    });
  }

  if (!isModuleResourceValue(value)) {
    throw new TypeError(`Invalid value type for ${WMSCONST.MODULE_ID}.${key}`);
  }
  return actor.setFlag(WMSCONST.MODULE_ID, key, value);
}

declare module "@league-of-foundry-developers/foundry-vtt-types/configuration" {
  // Foundry reads these merged interfaces; they intentionally add no own members.
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface SettingConfig extends SettingConfigEntries {}
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface FlagConfig extends ModuleFlagConfig {}
}
