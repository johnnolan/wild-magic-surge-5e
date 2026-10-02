import { WMSCONST } from "../WMSCONST";
import { SettingsList, UpdateObject } from "./Helpers";
import type { WMSModuleSettingKey } from "../utils/TypedSettings";

export class IncrementalSettingsPanel extends FormApplication {
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      title: game.i18n.format("WildMagicSurge5E.settings_panel_incremental"),
      template: "modules/wild-magic-surge-5e/templates/settings.html",
      id: `${WMSCONST.MODULE_FLAG_NAME}-chat-settings`,
      width: 520,
      height: "500",
      closeOnSubmit: true,
    });
  }

  settingsList(settings: readonly WMSModuleSettingKey[]) {
    return SettingsList(settings);
  }

  getData() {
    const settings = [WMSCONST.OPT_INCREMENTAL_CHECK_TO_CHAT];

    return {
      modules: this.settingsList(settings),
    };
  }

  _updateObject(_event: any, formData: any) {
    return UpdateObject(formData);
  }
}
