import {
  MODULE_FLAG_NAME,
  OPT_CHAT_MSG,
  OPT_AUTO_D20_MSG,
  OPT_AUTO_D20_MSG_NO_SURGE,
} from "../Settings.js";
import { SettingsList, UpdateObject } from "./Helpers.js";

export class ChatSettingsPanel extends FormApplication {
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      title: "Chat Settings",
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
      OPT_CHAT_MSG,
      OPT_AUTO_D20_MSG,
      OPT_AUTO_D20_MSG_NO_SURGE,
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
