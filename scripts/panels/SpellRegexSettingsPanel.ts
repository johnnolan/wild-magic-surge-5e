import { WMSCONST } from "../WMSCONST";
import type { PanelSettingKey } from "./Helpers";
import { SettingsPanelBase } from "./SettingsPanelBase";

export class SpellRegexSettingsPanel extends SettingsPanelBase {
  protected static readonly panelTitleKey =
    "WildMagicSurge5E.settings_panel_spell_regex";
  protected readonly settingKeys = [
    WMSCONST.OPT_SPELL_REGEX_ENABLED,
    WMSCONST.OPT_SPELL_REGEX,
    WMSCONST.OPT_SPELL_REGEX_INVERSE,
  ] as const satisfies readonly PanelSettingKey[];
}
