import { WMSCONST } from "../WMSCONST";
import { SettingsList, UpdateObject } from "./Helpers";

export class UpcastSettingsPanel extends FormApplication {
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      title: game.i18n.format("WildMagicSurge5E.settings_panel_upcast"),
      template: "modules/wild-magic-surge-5e/templates/settings.html",
      id: `${WMSCONST.MODULE_FLAG_NAME}-upcast-settings`,
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
      WMSCONST.OPT_UPCAST_WMS_TRIGGER_BASE,
      WMSCONST.OPT_UPCAST_WMS_TRIGGER_UPCAST,
      WMSCONST.OPT_UPCAST_TOC_TRIGGER_BASE,
      WMSCONST.OPT_UPCAST_TOC_TRIGGER_UPCAST,
    ];

    return {
      modules: this.settingsList(settings),
    };
  }

  // @ts-expect-error TS(2416): Property '_updateObject' in type 'UpcastSettingsPanel' is ... Remove this comment to see the full error message
  _updateObject(_event: any, formData: any) {
    UpdateObject(formData);
  }
}
