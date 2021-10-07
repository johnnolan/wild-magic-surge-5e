import {
  MODULE_FLAG_NAME,
  OPT_INCREMENTAL_CHECK_TO_CHAT,
} from "../Settings.js";
import { SettingsList, UpdateObject } from "./Helpers.js";

export class IncrementalSettingsPanel extends FormApplication {
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      title: "Incremental Settings",
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
    const settings = [OPT_INCREMENTAL_CHECK_TO_CHAT];

    let data = {
      modules: this.settingsList(settings),
    };
    return data;
  }

  _updateObject(event, formData) {
    UpdateObject(formData);
  }
}
