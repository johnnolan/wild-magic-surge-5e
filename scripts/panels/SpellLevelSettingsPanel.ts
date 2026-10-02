import { WMSCONST } from "../WMSCONST";
import { SettingsList, UpdateObject } from "./Helpers";
import type {
  PanelSettingKey,
  SettingsListEntry,
  SettingsPanelData,
} from "./Helpers";

export class SpellLevelSettingsPanel extends FormApplication {
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      title: game.i18n.format(
        "WildMagicSurge5E.settings_panel_spell_level_dep",
      ),
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
      WMSCONST.OPT_TSL_DIE,
      WMSCONST.OPT_TSL_CANTRIP,
      WMSCONST.OPT_TSL_LVL1,
      WMSCONST.OPT_TSL_LVL2,
      WMSCONST.OPT_TSL_LVL3,
      WMSCONST.OPT_TSL_LVL4,
      WMSCONST.OPT_TSL_LVL5,
      WMSCONST.OPT_TSL_LVL6,
      WMSCONST.OPT_TSL_LVL7,
      WMSCONST.OPT_TSL_LVL8,
      WMSCONST.OPT_TSL_LVL9,
      WMSCONST.OPT_TSL_LVL10,
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
