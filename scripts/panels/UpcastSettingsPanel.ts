import { WMSCONST } from "../WMSCONST";
import type { PanelSettingKey } from "./Helpers";
import { SettingsPanelBase } from "./SettingsPanelBase";

export class UpcastSettingsPanel extends SettingsPanelBase {
  protected static readonly panelTitleKey =
    "WildMagicSurge5E.settings_panel_upcast";
  protected readonly settingKeys = [
    WMSCONST.OPT_UPCAST_WMS_TRIGGER_BASE,
    WMSCONST.OPT_UPCAST_WMS_TRIGGER_UPCAST,
    WMSCONST.OPT_UPCAST_TOC_TRIGGER_BASE,
    WMSCONST.OPT_UPCAST_TOC_TRIGGER_UPCAST,
  ] as const satisfies readonly PanelSettingKey[];
}
