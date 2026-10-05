import { WMSCONST } from "../WMSCONST";
import type { PanelSettingKey } from "./Helpers";
import { SettingsPanelBase } from "./SettingsPanelBase";

export class StandardSettingsPanel extends SettingsPanelBase {
  protected static readonly panelTitleKey =
    "WildMagicSurge5E.settings_panel_standard_phb";
  protected readonly settingKeys = [
    WMSCONST.OPT_CUSTOM_ROLL_DICE_FORMULA,
    WMSCONST.OPT_CUSTOM_ROLL_RESULT_CHECK,
    WMSCONST.OPT_CUSTOM_ROLL_RESULT,
  ] as const satisfies readonly PanelSettingKey[];
}
