import { WMSCONST } from "../WMSCONST";
import { SettingsList, UpdateObject } from "./Helpers";
import type {
  PanelSettingKey,
  SettingsListEntry,
  SettingsPanelData,
} from "./Helpers";

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

  settingsList(settings: readonly PanelSettingKey[]): SettingsListEntry[] {
    return SettingsList(settings);
  }

  getData(): SettingsPanelData {
    const settings = [
      WMSCONST.OPT_CUSTOM_ROLL_DICE_FORMULA,
      WMSCONST.OPT_CUSTOM_ROLL_RESULT_CHECK,
      WMSCONST.OPT_CUSTOM_ROLL_RESULT,
    ];

    return {
      modules: this.settingsList(settings),
    };
  }

  _updateObject(
    _event: Event,
    formData?: Record<string, unknown>,
  ): Promise<void> {
    return UpdateObject(formData);
  }
}
