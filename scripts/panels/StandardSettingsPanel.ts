import { WMSCONST } from "../WMSCONST";
import { SettingsList, UpdateObject } from "./Helpers";

export class StandardSettingsPanel extends FormApplication {
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      title: game.i18n.format("WildMagicSurge5E.settings_panel_standard_phb"),
      template: "modules/wild-magic-surge-5e/templates/settings.html",
      id: `${WMSCONST.MODULE_FLAG_NAME}-chat-settings`,
      width: 520,
      height: "500",
      closeOnSubmit: true,
    });
  }

  settingsList(settings: any) {
    return SettingsList(settings);
  }

  // @ts-expect-error TS(2416): Property 'getData' in type 'StandardSettingsPanel'... Remove this comment to see the full error message
  getData() {
    const settings = [
      WMSCONST.OPT_CUSTOM_ROLL_DICE_FORMULA,
      WMSCONST.OPT_CUSTOM_ROLL_RESULT_CHECK,
      WMSCONST.OPT_CUSTOM_ROLL_RESULT,
    ];

    return {
      modules: this.settingsList(settings),
    };
  }

  // @ts-expect-error TS(2416): Property '_updateObject' in type 'StandardSettings... Remove this comment to see the full error message
  _updateObject(_event: any, formData: any) {
    UpdateObject(formData);
  }
}
