import { WMSCONST } from "../WMSCONST";
import {
  getModuleSetting,
  setModuleSettingFromForm,
} from "../utils/TypedSettings";
import type {
  WMSModuleSettingKey,
  WMSModuleSettingValues,
} from "../utils/TypedSettings";

const PANEL_SETTING_KEYS = [
  WMSCONST.OPT_CHAT_MSG,
  WMSCONST.OPT_CHAT_MSG_ENABLED,
  WMSCONST.OPT_AUTO_D20_MSG,
  WMSCONST.OPT_AUTO_D20_MSG_ENABLED,
  WMSCONST.OPT_AUTO_D20_MSG_NO_SURGE,
  WMSCONST.OPT_AUTO_D20_MSG_NO_SURGE_ENABLED,
  WMSCONST.OPT_INCREMENTAL_CHECK_TO_CHAT,
  WMSCONST.OPT_TSL_DIE,
  WMSCONST.OPT_TSL_CANTRIP,
  WMSCONST.OPT_TSL_LVL1,
  WMSCONST.OPT_TSL_LVL2,
  WMSCONST.OPT_TSL_LVL3,
  WMSCONST.OPT_TSL_LVL4,
  WMSCONST.OPT_TSL_LVL5,
  WMSCONST.OPT_TSL_LVL6,
  WMSCONST.OPT_TSL_LVL7,
  WMSCONST.OPT_TSL_LVL8,
  WMSCONST.OPT_TSL_LVL9,
  WMSCONST.OPT_TSL_LVL10,
  WMSCONST.OPT_SPELL_REGEX_ENABLED,
  WMSCONST.OPT_SPELL_REGEX,
  WMSCONST.OPT_SPELL_REGEX_INVERSE,
  WMSCONST.OPT_CUSTOM_ROLL_DICE_FORMULA,
  WMSCONST.OPT_CUSTOM_ROLL_RESULT_CHECK,
  WMSCONST.OPT_CUSTOM_ROLL_RESULT,
] as const satisfies readonly WMSModuleSettingKey[];

export type PanelSettingKey = (typeof PANEL_SETTING_KEYS)[number];
export type PanelSettingValue = WMSModuleSettingValues[PanelSettingKey];
// Trusted shape for panel fields. Foundry hands _updateObject a loose runtime
// object, so UpdateObject validates it before passing values to the typed setter.
export type SettingsFormData = Partial<{
  [
    Key in PanelSettingKey as `${typeof WMSCONST.MODULE_ID}.${Key}`
  ]: WMSModuleSettingValues[Key];
}>;

type SettingType = "Boolean" | "String";

type SettingMetadata = {
  module: typeof WMSCONST.MODULE_ID;
  key: PanelSettingKey;
  type: SettingType;
  displayname: string;
  hint: string;
  choices: Record<string, string>;
  hasChoices: boolean;
};

export type SettingsListEntry = Omit<SettingMetadata, "hasChoices"> & {
  isBoolean: boolean;
  isString: boolean;
  isArray: boolean;
  value: PanelSettingValue;
  choicesSelect: { key: string; value: string; selected: boolean }[];
};

export interface SettingsPanelData {
  modules: SettingsListEntry[];
}

const panelSettingKeySet: ReadonlySet<string> = new Set(PANEL_SETTING_KEYS);

function isPanelSettingKey(key: string): key is PanelSettingKey {
  return panelSettingKeySet.has(key);
}

function stringChoices(rawChoices: unknown): Record<string, string> {
  const choices: Record<string, string> = {};
  if (
    !rawChoices ||
    typeof rawChoices !== "object" ||
    Array.isArray(rawChoices)
  ) {
    return choices;
  }
  for (const [key, value] of Object.entries(rawChoices)) {
    if (typeof value === "string") choices[key] = value;
  }
  return choices;
}

function settingMetadata(key: PanelSettingKey): SettingMetadata | undefined {
  const registration: unknown = game.settings?.settings.get(
    `${WMSCONST.MODULE_ID}.${key}`,
  );
  if (!registration || typeof registration !== "object") return undefined;

  // Foundry's registry holds settings for every module and value type. Validate
  // its loose metadata here before producing the narrower settings-template data.
  const raw = registration as Record<string, unknown>;
  const type: SettingType | undefined =
    raw.type === Boolean
      ? "Boolean"
      : raw.type === String
        ? "String"
        : undefined;
  if (!type) return undefined;

  const name = typeof raw.name === "string" ? raw.name : key;
  const hint = typeof raw.hint === "string" ? raw.hint : "";
  return {
    module: WMSCONST.MODULE_ID,
    key,
    type,
    displayname: game.i18n?.format(name) ?? name,
    hint: hint ? (game.i18n?.format(hint) ?? hint) : "",
    choices: stringChoices(raw.choices),
    hasChoices:
      type === "String" && raw.choices !== undefined && raw.choices !== null,
  };
}

export function SettingsList(
  settings: readonly PanelSettingKey[],
): SettingsListEntry[] {
  const list: SettingsListEntry[] = [];

  for (const setting of settings) {
    const metadata = settingMetadata(setting);
    if (!metadata) continue;

    const value = getModuleSetting(setting);
    if (
      (metadata.type === "Boolean" && typeof value !== "boolean") ||
      (metadata.type === "String" && typeof value !== "string")
    )
      continue;

    const { hasChoices, ...fields } = metadata;
    list.push({
      ...fields,
      isBoolean: metadata.type === "Boolean",
      isString: metadata.type === "String" && !hasChoices,
      isArray: hasChoices,
      value,
      choicesSelect: Object.entries(metadata.choices).map(([key, label]) => ({
        key,
        value: label,
        selected: key === value,
      })),
    });
  }

  return list;
}

export async function UpdateObject(formData: unknown): Promise<void> {
  if (!formData || typeof formData !== "object" || Array.isArray(formData)) {
    throw new TypeError("Invalid settings form data");
  }

  for (const [qualifiedKey, value] of Object.entries(formData)) {
    const [namespace, key, ...extraSegments] = qualifiedKey.split(".");
    if (
      namespace !== WMSCONST.MODULE_ID ||
      extraSegments.length > 0 ||
      !isPanelSettingKey(key)
    ) {
      throw new TypeError(`Invalid module setting field: ${qualifiedKey}`);
    }
    const metadata = settingMetadata(key);
    if (
      metadata?.hasChoices &&
      (typeof value !== "string" ||
        !Object.prototype.hasOwnProperty.call(metadata.choices, value))
    ) {
      throw new TypeError(`Invalid choice for module setting: ${qualifiedKey}`);
    }
    await setModuleSettingFromForm(key, value);
  }
}
