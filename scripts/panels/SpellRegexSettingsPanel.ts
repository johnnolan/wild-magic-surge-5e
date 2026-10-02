import { WMSCONST } from "../WMSCONST";
import { SettingsList, UpdateObject } from "./Helpers";
import type { WMSModuleSettingKey } from "../utils/TypedSettings";

export class SpellRegexSettingsPanel extends FormApplication {
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      title: game.i18n.format("WildMagicSurge5E.settings_panel_spell_regex"),
      template: "modules/wild-magic-surge-5e/templates/settings.html",
      id: `${WMSCONST.MODULE_FLAG_NAME}-chat-settings`,
      width: 520,
      height: "500",
      closeOnSubmit: true,
    });
  }

  settingsList(settings: readonly WMSModuleSettingKey[]) {
    return SettingsList(settings);
  }

  getData() {
    const settings = [WMSCONST.OPT_SPELL_REGEX_ENABLED, WMSCONST.OPT_SPELL_REGEX, WMSCONST.OPT_SPELL_REGEX_INVERSE];

    return {
      modules: this.settingsList(settings),
    };
  }

  _updateObject(_event: any, formData: any) {
    return UpdateObject(formData);
  }
}
