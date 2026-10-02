import { WMSCONST } from "../WMSCONST";
import { SettingsList, UpdateObject } from "./Helpers";
import type {
  PanelSettingKey,
  SettingsListEntry,
  SettingsPanelData,
} from "./Helpers";

export class ChatSettingsPanel extends FormApplication {
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      title: game.i18n.format("WildMagicSurge5E.settings_panel_chat_message"),
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
      WMSCONST.OPT_CHAT_MSG,
      WMSCONST.OPT_CHAT_MSG_ENABLED,
      WMSCONST.OPT_AUTO_D20_MSG,
      WMSCONST.OPT_AUTO_D20_MSG_ENABLED,
      WMSCONST.OPT_AUTO_D20_MSG_NO_SURGE,
      WMSCONST.OPT_AUTO_D20_MSG_NO_SURGE_ENABLED,
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
