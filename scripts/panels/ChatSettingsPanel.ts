import {
  MODULE_FLAG_NAME,
  OPT_CHAT_MSG,
  OPT_AUTO_D20_MSG,
  OPT_AUTO_D20_MSG_NO_SURGE,
} from "../Settings.js";
import { SettingsList, UpdateObject } from "./Helpers.js";

// @ts-expect-error TS(2304): Cannot find name 'FormApplication'.
export class ChatSettingsPanel extends FormApplication {
  static get defaultOptions() {
    // @ts-expect-error TS(2304): Cannot find name 'mergeObject'.
    return mergeObject(super.defaultOptions, {
      title: "Chat Settings",
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
      OPT_CHAT_MSG,
      OPT_AUTO_D20_MSG,
      OPT_AUTO_D20_MSG_NO_SURGE,
    ];

    return {
      modules: this.settingsList(settings),
    };
  }

  _updateObject(_event: any, formData: any) {
    UpdateObject(formData);
  }
}
