import {
  MODULE_FLAG_NAME,
  OPT_TSL_DIE,
  OPT_TSL_LVL1,
  OPT_TSL_LVL2,
  OPT_TSL_LVL3,
  OPT_TSL_LVL4,
  OPT_TSL_LVL5,
  OPT_TSL_LVL6,
  OPT_TSL_LVL7,
  OPT_TSL_LVL8,
  OPT_TSL_LVL9,
  OPT_TSL_LVL10,
} from "../Settings.js";
import { SettingsList, UpdateObject } from "./Helpers.js";

export class SpellLevelSettingsPanel extends FormApplication {
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      title: "Spell Level Settings",
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
    const settings = [
      OPT_TSL_DIE,
      OPT_TSL_LVL1,
      OPT_TSL_LVL2,
      OPT_TSL_LVL3,
      OPT_TSL_LVL4,
      OPT_TSL_LVL5,
      OPT_TSL_LVL6,
      OPT_TSL_LVL7,
      OPT_TSL_LVL8,
      OPT_TSL_LVL9,
      OPT_TSL_LVL10,
    ];

    let data = {
      modules: this.settingsList(settings),
    };
    return data;
  }

  _updateObject(event, formData) {
    UpdateObject(formData);
  }
}
