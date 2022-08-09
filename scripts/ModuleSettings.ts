import {
  MODULE_ID,
  OPT_CHAT_MSG,
  OPT_AUTO_D20,
  OPT_SPELL_REGEX,
  OPT_SPELL_REGEX_ENABLED,
  OPT_AUTO_D20_MSG,
  OPT_AUTO_D20_MSG_NO_SURGE,
  OPT_ENABLE_TOC,
  OPT_ROLLTABLE_ENABLE,
  OPT_ROLLTABLE_NAME,
  OPT_WHISPER_GM,
  OPT_CUSTOM_ROLL_DICE_FORMULA,
  OPT_CUSTOM_ROLL_RESULT,
  OPT_CUSTOM_ROLL_RESULT_CHECK,
  ROLL_COMPARISON,
  OPT_TSL_DIE,
  OPT_TSL_LVL1,
  OPT_TSL_LVL2,
  OPT_TSL_LVL3,
  OPT_TSL_LVL4,
  OPT_TSL_LVL5,
  OPT_TSL_LVL6,
  OPT_TSL_LVL7,
  OPT_TSL_LVL8,
  OPT_TSL_LVL9,
  OPT_TSL_LVL10,
  SURGE_TYPE,
  OPT_SURGE_TYPE,
  OPT_INCREMENTAL_CHECK_TO_CHAT,
  OPT_ENABLE_NPCS,
  OPT_WMS_NAME,
  OPT_TOC_NAME,
  OPT_POWM_NAME,
  OPT_POWM_ROLLTABLE_NAME,
  OPT_SURGE_TOC_ENABLED,
  OPT_EFFECTS_ENABLED,
} from "./Settings.js";
import {
  ChatSettingsPanel,
  IncrementalSettingsPanel,
  SpellLevelSettingsPanel,
  StandardSettingsPanel,
  SpellRegexSettingsPanel,
} from "./panels/index.js";

class ModuleSettings {
  constructor() {
    // This is intentional
  }

  /**
   * Register all module settings
   * @public
   * @return {Promise<void>}
   */
  Register() {
    // @ts-expect-error TS(2304): Cannot find name 'game'.
    game.settings.register(`${MODULE_ID}`, `${OPT_WMS_NAME}`, {
      // @ts-expect-error TS(2304): Cannot find name 'game'.
      name: game.i18n.format("WildMagicSurge5E.opt_wms_feat_name_name"),
      // @ts-expect-error TS(2304): Cannot find name 'game'.
      hint: game.i18n.format("WildMagicSurge5E.opt_wms_feat_name_hint"),
      scope: "world",
      config: true,
      default: "Wild Magic Surge",
      type: String,
    });

    // @ts-expect-error TS(2304): Cannot find name 'game'.
    game.settings.register(`${MODULE_ID}`, `${OPT_TOC_NAME}`, {
      // @ts-expect-error TS(2304): Cannot find name 'game'.
      name: game.i18n.format("WildMagicSurge5E.opt_toc_feat_name_name"),
      // @ts-expect-error TS(2304): Cannot find name 'game'.
      hint: game.i18n.format("WildMagicSurge5E.opt_toc_feat_name_hint"),
      scope: "world",
      config: true,
      default: "Tides of Chaos",
      type: String,
    });

    // @ts-expect-error TS(2304): Cannot find name 'game'.
    game.settings.register(`${MODULE_ID}`, `${OPT_POWM_NAME}`, {
      // @ts-expect-error TS(2304): Cannot find name 'game'.
      name: game.i18n.format("WildMagicSurge5E.opt_powm_feat_name_name"),
      // @ts-expect-error TS(2304): Cannot find name 'game'.
      hint: game.i18n.format("WildMagicSurge5E.opt_powm_feat_name_hint"),
      scope: "world",
      config: true,
      default: "Path of Wild Magic",
      type: String,
    });

    // @ts-expect-error TS(2304): Cannot find name 'game'.
    game.settings.register(`${MODULE_ID}`, `${OPT_AUTO_D20}`, {
      // @ts-expect-error TS(2304): Cannot find name 'game'.
      name: game.i18n.format("WildMagicSurge5E.opt_auto_d20_name"),
      // @ts-expect-error TS(2304): Cannot find name 'game'.
      hint: game.i18n.format("WildMagicSurge5E.opt_auto_d20_hint"),
      scope: "world",
      config: true,
      default: true,
      type: Boolean,
    });

    // @ts-expect-error TS(2304): Cannot find name 'game'.
    game.settings.register(`${MODULE_ID}`, `${OPT_SPELL_REGEX_ENABLED}`, {
      // @ts-expect-error TS(2304): Cannot find name 'game'.
      name: game.i18n.format("WildMagicSurge5E.opt_enable_spell_regex_name"),
      // @ts-expect-error TS(2304): Cannot find name 'game'.
      hint: game.i18n.format("WildMagicSurge5E.opt_enable_spell_regex_hint"),
      scope: "world",
      config: false,
      default: false,
      type: Boolean,
    });

    // @ts-expect-error TS(2304): Cannot find name 'game'.
    game.settings.register(`${MODULE_ID}`, `${OPT_SPELL_REGEX}`, {
      // @ts-expect-error TS(2304): Cannot find name 'game'.
      name: game.i18n.format("WildMagicSurge5E.opt_spell_regex_name"),
      // @ts-expect-error TS(2304): Cannot find name 'game'.
      hint: game.i18n.format("WildMagicSurge5E.opt_spell_regex_hint"),
      scope: "world",
      config: false,
      default: "\\(S\\)",
      type: String,
    });

    // @ts-expect-error TS(2304): Cannot find name 'game'.
    game.settings.register(`${MODULE_ID}`, `${OPT_WHISPER_GM}`, {
      // @ts-expect-error TS(2304): Cannot find name 'game'.
      name: game.i18n.format("WildMagicSurge5E.opt_whisper_gm_name"),
      // @ts-expect-error TS(2304): Cannot find name 'game'.
      hint: game.i18n.format("WildMagicSurge5E.opt_whisper_gm_hint"),
      scope: "world",
      config: true,
      default: false,
      type: Boolean,
    });

    // @ts-expect-error TS(2304): Cannot find name 'game'.
    game.settings.register(`${MODULE_ID}`, `${OPT_SURGE_TYPE}`, {
      // @ts-expect-error TS(2304): Cannot find name 'game'.
      name: game.i18n.format("WildMagicSurge5E.opt_surge_type_name"),
      // @ts-expect-error TS(2304): Cannot find name 'game'.
      hint: game.i18n.format("WildMagicSurge5E.opt_surge_type_hint"),
      scope: "world",
      config: true,
      choices: SURGE_TYPE,
      default: "Default",
      type: String,
    });

    // @ts-expect-error TS(2304): Cannot find name 'game'.
    game.settings.registerMenu(`${MODULE_ID}`, `SpellRegexSettingsPanel`, {
      name: "Spell Regex for Multiclass",
      label: "Configure",
      icon: "fas fa-cog",
      scope: "world",
      type: SpellRegexSettingsPanel,
      restricted: true,
    });

    // @ts-expect-error TS(2304): Cannot find name 'game'.
    game.settings.registerMenu(`${MODULE_ID}`, `StandardSettingsPanel`, {
      name: "Standard PHB Variant",
      label: "Configure",
      icon: "fas fa-cog",
      scope: "world",
      type: StandardSettingsPanel,
      restricted: true,
    });

    // @ts-expect-error TS(2304): Cannot find name 'game'.
    game.settings.registerMenu(`${MODULE_ID}`, `SpellLevelSettingsPanel`, {
      name: "Spell Level Dependent Rolls Variant",
      label: "Configure",
      icon: "fas fa-cog",
      scope: "world",
      type: SpellLevelSettingsPanel,
      restricted: true,
    });

    // @ts-expect-error TS(2304): Cannot find name 'game'.
    game.settings.registerMenu(`${MODULE_ID}`, `IncrementalSettingsPanel`, {
      name: "Incremental Check Variant",
      label: "Configure",
      icon: "fas fa-cog",
      scope: "world",
      type: IncrementalSettingsPanel,
      restricted: true,
    });

    // @ts-expect-error TS(2304): Cannot find name 'game'.
    game.settings.registerMenu(`${MODULE_ID}`, `ChatSettingsPanel`, {
      name: "Chat Message Options",
      label: "Configure",
      icon: "fas fa-cog",
      scope: "world",
      type: ChatSettingsPanel,
      restricted: true,
    });

    // @ts-expect-error TS(2304): Cannot find name 'game'.
    game.settings.register(`${MODULE_ID}`, `${OPT_INCREMENTAL_CHECK_TO_CHAT}`, {
      // @ts-expect-error TS(2304): Cannot find name 'game'.
      name: game.i18n.format(
        "WildMagicSurge5E.opt_incremental_check_to_chat_name"
      ),
      // @ts-expect-error TS(2304): Cannot find name 'game'.
      hint: game.i18n.format(
        "WildMagicSurge5E.opt_incremental_check_to_chat_hint"
      ),
      scope: "world",
      config: false,
      default: false,
      type: Boolean,
    });

    // @ts-expect-error TS(2304): Cannot find name 'game'.
    game.settings.register(`${MODULE_ID}`, `${OPT_CHAT_MSG}`, {
      // @ts-expect-error TS(2304): Cannot find name 'game'.
      name: game.i18n.format("WildMagicSurge5E.opt_chat_msg_name"),
      // @ts-expect-error TS(2304): Cannot find name 'game'.
      hint: game.i18n.format("WildMagicSurge5E.opt_chat_msg_hint"),
      scope: "world",
      config: false,
      default: "Wild Magic Check - Roll a D20",
      type: String,
    });

    // @ts-expect-error TS(2304): Cannot find name 'game'.
    game.settings.register(`${MODULE_ID}`, `${OPT_AUTO_D20_MSG}`, {
      // @ts-expect-error TS(2304): Cannot find name 'game'.
      name: game.i18n.format("WildMagicSurge5E.opt_auto_d20_msg_name"),
      // @ts-expect-error TS(2304): Cannot find name 'game'.
      hint: game.i18n.format("WildMagicSurge5E.opt_auto_d20_msg_hint"),
      scope: "world",
      config: false,
      default: "Wild Magic Surge! Roll a D100!",
      type: String,
    });

    // @ts-expect-error TS(2304): Cannot find name 'game'.
    game.settings.register(`${MODULE_ID}`, `${OPT_AUTO_D20_MSG_NO_SURGE}`, {
      // @ts-expect-error TS(2304): Cannot find name 'game'.
      name: game.i18n.format("WildMagicSurge5E.opt_auto_d20_msg_no_surge_name"),
      // @ts-expect-error TS(2304): Cannot find name 'game'.
      hint: game.i18n.format("WildMagicSurge5E.opt_auto_d20_msg_no_surge_hint"),
      scope: "world",
      config: false,
      default: "No wild magic surge",
      type: String,
    });

    // @ts-expect-error TS(2304): Cannot find name 'game'.
    game.settings.register(`${MODULE_ID}`, `${OPT_ENABLE_TOC}`, {
      // @ts-expect-error TS(2304): Cannot find name 'game'.
      name: game.i18n.format("WildMagicSurge5E.opt_enable_toc_name"),
      // @ts-expect-error TS(2304): Cannot find name 'game'.
      hint: game.i18n.format("WildMagicSurge5E.opt_enable_toc_hint"),
      scope: "world",
      config: true,
      default: false,
      type: Boolean,
    });

    // @ts-expect-error TS(2304): Cannot find name 'game'.
    game.settings.register(`${MODULE_ID}`, `${OPT_ROLLTABLE_ENABLE}`, {
      // @ts-expect-error TS(2304): Cannot find name 'game'.
      name: game.i18n.format("WildMagicSurge5E.opt_rolltable_enabled_name"),
      // @ts-expect-error TS(2304): Cannot find name 'game'.
      hint: game.i18n.format("WildMagicSurge5E.opt_rolltable_enabled_hint"),
      scope: "world",
      config: true,
      default: false,
      type: Boolean,
    });

    // @ts-expect-error TS(2304): Cannot find name 'game'.
    game.settings.register(`${MODULE_ID}`, `${OPT_ROLLTABLE_NAME}`, {
      // @ts-expect-error TS(2304): Cannot find name 'game'.
      name: game.i18n.format("WildMagicSurge5E.opt_rolltable_name_name"),
      // @ts-expect-error TS(2304): Cannot find name 'game'.
      hint: game.i18n.format("WildMagicSurge5E.opt_rolltable_name_hint"),
      scope: "world",
      config: true,
      default: "Wild Magic Surge 5e (PHB)",
      type: String,
    });

    // @ts-expect-error TS(2304): Cannot find name 'game'.
    game.settings.register(`${MODULE_ID}`, `${OPT_ROLLTABLE_NAME}`, {
      // @ts-expect-error TS(2304): Cannot find name 'game'.
      name: game.i18n.format("WildMagicSurge5E.opt_rolltable_name_name"),
      // @ts-expect-error TS(2304): Cannot find name 'game'.
      hint: game.i18n.format("WildMagicSurge5E.opt_rolltable_name_hint"),
      scope: "world",
      config: true,
      default: "Wild Magic Surge 5e (PHB)",
      type: String,
    });

    // @ts-expect-error TS(2304): Cannot find name 'game'.
    game.settings.register(`${MODULE_ID}`, `${OPT_POWM_ROLLTABLE_NAME}`, {
      // @ts-expect-error TS(2304): Cannot find name 'game'.
      name: game.i18n.format("WildMagicSurge5E.opt_rolltable_powm_name_name"),
      // @ts-expect-error TS(2304): Cannot find name 'game'.
      hint: game.i18n.format("WildMagicSurge5E.opt_rolltable_powm_name_hint"),
      scope: "world",
      config: true,
      default: "Path of Wild Magic Table",
      type: String,
    });

    // @ts-expect-error TS(2304): Cannot find name 'game'.
    game.settings.register(`${MODULE_ID}`, `${OPT_CUSTOM_ROLL_DICE_FORMULA}`, {
      // @ts-expect-error TS(2304): Cannot find name 'game'.
      name: game.i18n.format(
        "WildMagicSurge5E.opt_custom_roll_dice_formula_name"
      ),
      // @ts-expect-error TS(2304): Cannot find name 'game'.
      hint: game.i18n.format(
        "WildMagicSurge5E.opt_custom_roll_dice_formula_hint"
      ),
      scope: "world",
      config: false,
      default: "1d20",
      type: String,
    });

    // @ts-expect-error TS(2304): Cannot find name 'game'.
    game.settings.register(`${MODULE_ID}`, `${OPT_CUSTOM_ROLL_RESULT_CHECK}`, {
      // @ts-expect-error TS(2304): Cannot find name 'game'.
      name: game.i18n.format(
        "WildMagicSurge5E.opt_custom_roll_result_check_name"
      ),
      // @ts-expect-error TS(2304): Cannot find name 'game'.
      hint: game.i18n.format(
        "WildMagicSurge5E.opt_custom_roll_result_check_hint"
      ),
      scope: "world",
      config: false,
      choices: ROLL_COMPARISON,
      default: "EQ",
      type: String,
    });

    // @ts-expect-error TS(2304): Cannot find name 'game'.
    game.settings.register(`${MODULE_ID}`, `${OPT_CUSTOM_ROLL_RESULT}`, {
      // @ts-expect-error TS(2304): Cannot find name 'game'.
      name: game.i18n.format("WildMagicSurge5E.opt_custom_roll_result_name"),
      // @ts-expect-error TS(2304): Cannot find name 'game'.
      hint: game.i18n.format("WildMagicSurge5E.opt_custom_roll_result_hint"),
      scope: "world",
      config: false,
      default: "1",
      type: String,
    });

    // @ts-expect-error TS(2304): Cannot find name 'game'.
    game.settings.register(`${MODULE_ID}`, `${OPT_TSL_DIE}`, {
      // @ts-expect-error TS(2304): Cannot find name 'game'.
      name: game.i18n.format("WildMagicSurge5E.opt_tsl_die_name"),
      // @ts-expect-error TS(2304): Cannot find name 'game'.
      hint: game.i18n.format("WildMagicSurge5E.opt_tsl_die_hint"),
      scope: "world",
      config: false,
      default: "1d20",
      type: String,
    });

    // @ts-expect-error TS(2304): Cannot find name 'game'.
    game.settings.register(`${MODULE_ID}`, `${OPT_TSL_LVL1}`, {
      // @ts-expect-error TS(2304): Cannot find name 'game'.
      name: game.i18n.format("WildMagicSurge5E.opt_tsl_lvl1_name"),
      // @ts-expect-error TS(2304): Cannot find name 'game'.
      hint: game.i18n.format("WildMagicSurge5E.opt_tsl_lvl1_hint"),
      scope: "world",
      config: false,
      default: "= 1",
      type: String,
    });

    // @ts-expect-error TS(2304): Cannot find name 'game'.
    game.settings.register(`${MODULE_ID}`, `${OPT_TSL_LVL2}`, {
      // @ts-expect-error TS(2304): Cannot find name 'game'.
      name: game.i18n.format("WildMagicSurge5E.opt_tsl_lvl2_name"),
      scope: "world",
      config: false,
      default: "= 1",
      type: String,
    });

    // @ts-expect-error TS(2304): Cannot find name 'game'.
    game.settings.register(`${MODULE_ID}`, `${OPT_TSL_LVL3}`, {
      // @ts-expect-error TS(2304): Cannot find name 'game'.
      name: game.i18n.format("WildMagicSurge5E.opt_tsl_lvl3_name"),
      scope: "world",
      config: false,
      default: "= 1",
      type: String,
    });

    // @ts-expect-error TS(2304): Cannot find name 'game'.
    game.settings.register(`${MODULE_ID}`, `${OPT_TSL_LVL4}`, {
      // @ts-expect-error TS(2304): Cannot find name 'game'.
      name: game.i18n.format("WildMagicSurge5E.opt_tsl_lvl4_name"),
      scope: "world",
      config: false,
      default: "= 1",
      type: String,
    });

    // @ts-expect-error TS(2304): Cannot find name 'game'.
    game.settings.register(`${MODULE_ID}`, `${OPT_TSL_LVL5}`, {
      // @ts-expect-error TS(2304): Cannot find name 'game'.
      name: game.i18n.format("WildMagicSurge5E.opt_tsl_lvl5_name"),
      scope: "world",
      config: false,
      default: "= 1",
      type: String,
    });

    // @ts-expect-error TS(2304): Cannot find name 'game'.
    game.settings.register(`${MODULE_ID}`, `${OPT_TSL_LVL6}`, {
      // @ts-expect-error TS(2304): Cannot find name 'game'.
      name: game.i18n.format("WildMagicSurge5E.opt_tsl_lvl6_name"),
      scope: "world",
      config: false,
      default: "= 1",
      type: String,
    });

    // @ts-expect-error TS(2304): Cannot find name 'game'.
    game.settings.register(`${MODULE_ID}`, `${OPT_TSL_LVL7}`, {
      // @ts-expect-error TS(2304): Cannot find name 'game'.
      name: game.i18n.format("WildMagicSurge5E.opt_tsl_lvl7_name"),
      scope: "world",
      config: false,
      default: "= 1",
      type: String,
    });

    // @ts-expect-error TS(2304): Cannot find name 'game'.
    game.settings.register(`${MODULE_ID}`, `${OPT_TSL_LVL8}`, {
      // @ts-expect-error TS(2304): Cannot find name 'game'.
      name: game.i18n.format("WildMagicSurge5E.opt_tsl_lvl8_name"),
      scope: "world",
      config: false,
      default: "= 1",
      type: String,
    });

    // @ts-expect-error TS(2304): Cannot find name 'game'.
    game.settings.register(`${MODULE_ID}`, `${OPT_TSL_LVL9}`, {
      // @ts-expect-error TS(2304): Cannot find name 'game'.
      name: game.i18n.format("WildMagicSurge5E.opt_tsl_lvl9_name"),
      scope: "world",
      config: false,
      default: "= 1",
      type: String,
    });

    // @ts-expect-error TS(2304): Cannot find name 'game'.
    game.settings.register(`${MODULE_ID}`, `${OPT_TSL_LVL10}`, {
      // @ts-expect-error TS(2304): Cannot find name 'game'.
      name: game.i18n.format("WildMagicSurge5E.opt_tsl_lvl10_name"),
      scope: "world",
      config: false,
      default: "= 1",
      type: String,
    });

    // @ts-expect-error TS(2304): Cannot find name 'game'.
    game.settings.register(`${MODULE_ID}`, `${OPT_ENABLE_NPCS}`, {
      // @ts-expect-error TS(2304): Cannot find name 'game'.
      name: game.i18n.format("WildMagicSurge5E.opt_enable_npcs_name"),
      // @ts-expect-error TS(2304): Cannot find name 'game'.
      hint: game.i18n.format("WildMagicSurge5E.opt_enable_npcs_hint"),
      scope: "world",
      config: true,
      default: false,
      type: Boolean,
    });

    // @ts-expect-error TS(2304): Cannot find name 'game'.
    game.settings.register(`${MODULE_ID}`, `${OPT_SURGE_TOC_ENABLED}`, {
      // @ts-expect-error TS(2304): Cannot find name 'game'.
      name: game.i18n.format("WildMagicSurge5E.opt_enable_surge_toc_name"),
      // @ts-expect-error TS(2304): Cannot find name 'game'.
      hint: game.i18n.format("WildMagicSurge5E.opt_enable_surge_toc_hint"),
      scope: "world",
      config: true,
      default: false,
      type: Boolean,
    });

    // @ts-expect-error TS(2304): Cannot find name 'game'.
    game.settings.register(`${MODULE_ID}`, `${OPT_EFFECTS_ENABLED}`, {
      // @ts-expect-error TS(2304): Cannot find name 'game'.
      name: game.i18n.format("WildMagicSurge5E.opt_enable_effects_name"),
      // @ts-expect-error TS(2304): Cannot find name 'game'.
      hint: game.i18n.format("WildMagicSurge5E.opt_enable_effects_hint"),
      scope: "world",
      config: true,
      default: true,
      type: Boolean,
    });
  }
}

export default ModuleSettings;
