import {
  MODULE_FLAG_NAME,
  OPT_CUSTOM_ROLL_DICE_FORMULA,
  OPT_CUSTOM_ROLL_RESULT_CHECK,
  OPT_CUSTOM_ROLL_RESULT,
} from "../Settings.js";
import { SettingsList, UpdateObject } from "./Helpers.js";

export class StandardSettingsPanel extends FormApplication {
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      title: "Standard Settings",
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
      OPT_CUSTOM_ROLL_DICE_FORMULA,
      OPT_CUSTOM_ROLL_RESULT_CHECK,
      OPT_CUSTOM_ROLL_RESULT,
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
