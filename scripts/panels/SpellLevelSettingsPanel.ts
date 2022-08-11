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
} from "../Settings";
import { SettingsList, UpdateObject } from "./Helpers";

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

  settingsList(settings: any) {
    return SettingsList(settings);
  }

  // @ts-expect-error TS(2416): Property 'getData' in type 'SpellLevelSettingsPane... Remove this comment to see the full error message
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

    return {
      modules: this.settingsList(settings),
    };
  }

  // @ts-expect-error TS(2416): Property '_updateObject' in type 'SpellLevelSettin... Remove this comment to see the full error message
  _updateObject(_event: any, formData: any) {
    UpdateObject(formData);
  }
}
