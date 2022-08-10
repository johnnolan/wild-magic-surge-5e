import {
  MODULE_FLAG_NAME,
  OPT_INCREMENTAL_CHECK_TO_CHAT,
} from "../Settings";
import { SettingsList, UpdateObject } from "./Helpers";

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

  settingsList(settings: any) {
    return SettingsList(settings);
  }

  // @ts-expect-error TS(2416): Property 'getData' in type 'IncrementalSettingsPan... Remove this comment to see the full error message
  getData() {
    const settings = [OPT_INCREMENTAL_CHECK_TO_CHAT];

    return {
      modules: this.settingsList(settings),
    };
  }

  // @ts-expect-error TS(2416): Property '_updateObject' in type 'IncrementalSetti... Remove this comment to see the full error message
  _updateObject(_event: any, formData: any) {
    UpdateObject(formData);
  }
}
