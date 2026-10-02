import { WMSCONST } from "../WMSCONST";
import {
  getModuleSetting,
  isWMSModuleSettingKey,
  setModuleSettingFromForm,
} from "../utils/TypedSettings";
import type { WMSModuleSettingKey } from "../utils/TypedSettings";

export function SettingsList(settings: readonly WMSModuleSettingKey[]) {
  const chatSettingsList: {
    module: string;
    key: string;
    type: string;
    isBoolean: boolean;
    isString: boolean;
    isArray: boolean;
    displayname: string;
    hint: string;
    choices: Record<string, string>;
    value: boolean | string;
    choicesSelect: { key: string; value: string; selected: boolean }[];
  }[] = [];

  for (const setting of settings) {
    const registration = game.settings.settings.get(
      `${WMSCONST.MODULE_ID}.${setting}`,
    );
    if (!registration) continue;

    const settingValue = getModuleSetting(setting);
    const choices = registration.choices ?? {};
    const choicesSelect = Object.entries(choices).map(([key, value]) => ({
      key,
      value,
      selected: key === settingValue,
    }));

    chatSettingsList.push({
      module: registration.namespace ?? registration.module,
      key: registration.key,
      type: registration.type.name,
      isBoolean: registration.type.name === "Boolean",
      isString: registration.type.name === "String" && !registration.choices,
      isArray: Boolean(registration.choices),
      displayname: game.i18n.format(registration.name),
      hint: registration.hint ? game.i18n.format(registration.hint) : "",
      choices,
      value: settingValue,
      choicesSelect,
    });
  }

  return chatSettingsList;
}

export async function UpdateObject(
  formData: Record<string, unknown>,
): Promise<void> {
  for (const [qualifiedKey, value] of Object.entries(formData)) {
    const [namespace, key, ...extraSegments] = qualifiedKey.split(".");
    if (
      namespace !== WMSCONST.MODULE_ID ||
      extraSegments.length > 0 ||
      !isWMSModuleSettingKey(key)
    ) {
      throw new TypeError(`Invalid module setting field: ${qualifiedKey}`);
    }
    await setModuleSettingFromForm(key, value);
  }
}
