import {
  MODULE_FLAG_NAME,
  OPT_CUSTOM_ROLL_DICE_FORMULA,
  OPT_CUSTOM_ROLL_RESULT_CHECK,
  OPT_CUSTOM_ROLL_RESULT,
} from "../Settings.js";
import { SettingsList, UpdateObject } from "./Helpers.js";

// @ts-expect-error TS(2304): Cannot find name 'FormApplication'.
export class StandardSettingsPanel extends FormApplication {
  static get defaultOptions() {
    // @ts-expect-error TS(2304): Cannot find name 'mergeObject'.
    return mergeObject(super.defaultOptions, {
      title: "Standard Settings",
      template: "modules/wild-magic-surge-5e/templates/settings.html",
      id: `${MODULE_FLAG_NAME}-chat-settings`,
      width: 520,
      height: "500",
      closeOnSubmit: true,
    });
  }

  settingsList(settings: any) {
    return SettingsList(settings);
  }

  getData() {
    const settings = [
      OPT_CUSTOM_ROLL_DICE_FORMULA,
      OPT_CUSTOM_ROLL_RESULT_CHECK,
      OPT_CUSTOM_ROLL_RESULT,
    ];

    return {
      modules: this.settingsList(settings),
    };
  }

  _updateObject(_event: any, formData: any) {
    UpdateObject(formData);
  }
}
