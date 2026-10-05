import { WMSCONST } from "../WMSCONST";
import type { PanelSettingKey } from "./Helpers";
import { SettingsPanelBase } from "./SettingsPanelBase";

export class IncrementalSettingsPanel extends SettingsPanelBase {
  protected static readonly panelTitleKey =
    "WildMagicSurge5E.settings_panel_incremental";
  protected readonly settingKeys = [
    WMSCONST.OPT_INCREMENTAL_CHECK_TO_CHAT,
  ] as const satisfies readonly PanelSettingKey[];
}
