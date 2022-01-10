import {
  MODULE_FLAG_NAME,
  OPT_SPELL_REGEX,
  OPT_SPELL_REGEX_ENABLED,
} from "../Settings.js";
import { SettingsList, UpdateObject } from "./Helpers.js";

export class SpellRegexSettingsPanel extends FormApplication {
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      title: "Spell Regex for Multiclass",
      template: "modules/wild-magic-surge-5e/templates/settings.html",
      id: `${MODULE_FLAG_NAME}-chat-settings`,
      width: 520,
      height: "500",
      closeOnSubmit: true,
    });
  }

  settingsList(settings) {
    return SettingsList(settings);
  }

  getData() {
    const settings = [OPT_SPELL_REGEX_ENABLED, OPT_SPELL_REGEX];

    let data = {
      modules: this.settingsList(settings),
    };
    return data;
  }

  _updateObject(event, formData) {
    UpdateObject(formData);
  }
}
