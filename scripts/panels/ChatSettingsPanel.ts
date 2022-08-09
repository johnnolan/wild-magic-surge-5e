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

  settingsList(settings: any) {
    return SettingsList(settings);
  }

  // @ts-expect-error TS(2416): Property 'getData' in type 'ChatSettingsPanel' is ... Remove this comment to see the full error message
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

  // @ts-expect-error TS(2416): Property '_updateObject' in type 'ChatSettingsPane... Remove this comment to see the full error message
  _updateObject(_event: any, formData: any) {
    UpdateObject(formData);
  }
}
