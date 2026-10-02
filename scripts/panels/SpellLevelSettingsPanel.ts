import { WMSCONST } from "../WMSCONST";
import type { PanelSettingKey } from "./Helpers";
import { SettingsPanelBase } from "./SettingsPanelBase";

export class SpellLevelSettingsPanel extends SettingsPanelBase {
  protected static readonly panelTitleKey =
    "WildMagicSurge5E.settings_panel_spell_level_dep";
  protected readonly settingKeys = [
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
  ] as const satisfies readonly PanelSettingKey[];
}
