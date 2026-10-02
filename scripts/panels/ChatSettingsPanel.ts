import { WMSCONST } from "../WMSCONST";
import type { PanelSettingKey } from "./Helpers";
import { SettingsPanelBase } from "./SettingsPanelBase";

export class ChatSettingsPanel extends SettingsPanelBase {
  protected static readonly panelTitleKey =
    "WildMagicSurge5E.settings_panel_chat_message";
  protected readonly settingKeys = [
    WMSCONST.OPT_CHAT_MSG,
    WMSCONST.OPT_CHAT_MSG_ENABLED,
    WMSCONST.OPT_AUTO_D20_MSG,
    WMSCONST.OPT_AUTO_D20_MSG_ENABLED,
    WMSCONST.OPT_AUTO_D20_MSG_NO_SURGE,
    WMSCONST.OPT_AUTO_D20_MSG_NO_SURGE_ENABLED,
  ] as const satisfies readonly PanelSettingKey[];
}
