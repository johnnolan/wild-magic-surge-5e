import { WMSCONST } from "../WMSCONST";
import type { PanelSettingKey } from "./Helpers";
import { SettingsPanelBase } from "./SettingsPanelBase";

export class UpcastSpellSettingsPanel extends SettingsPanelBase {
  protected static readonly panelTitleKey =
    "WildMagicSurge5E.settings_panel_upcast_spell";
  protected readonly settingKeys = [
    WMSCONST.OPT_WMS_CAST_WHEN,
    WMSCONST.OPT_TOC_CAST_WHEN,
  ] as const satisfies readonly PanelSettingKey[];
}
