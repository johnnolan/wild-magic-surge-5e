export const WMSCONST = {
  MODULE_NAME: "Wild Magic Surge 5e",
  MODULE_ID: "wild-magic-surge-5e",
  OPT_WMS_NAME: "wmsName",
  OPT_TOC_NAME: "tocName",
  OPT_POWM_NAME: "powmName",

  OPT_WHISPER_GM: "whisperToGM",
  OPT_WHISPER_GM_ROLL_CHAT: "whisperToGMRollChat",

  OPT_TRIGGERMACRO_ENABLE: "enableTriggerMacro",
  OPT_TRIGGERMACRO_NAME: "triggerMacroName",
  OPT_ROLLTABLE_ENABLE: "enableRollTable",
  OPT_ROLLTABLE_NAME: "rollTableName",
  OPT_POWM_ROLLTABLE_NAME: "powmRollTableName",

  ROLLTABLE_TYPE: {
    DEFAULT: "None",
    AUTO: "Auto Roll Table",
    PLAYER_TRIGGER: "Player Trigger Roll",
  },

  OPT_ENABLE_TOC: "enableTidesOfChaosRecharge",

  OPT_AUTO_D20: "autoRollD20",
  OPT_CHAT_MSG: "magicSurgeChatMessage",
  OPT_CHAT_MSG_ENABLED: "magicSurgeChatMessageEnabled",
  OPT_AUTO_D20_MSG: "autoRollD20Message",
  OPT_AUTO_D20_MSG_ENABLED: "autoRollD20MessageEnabled",
  OPT_AUTO_D20_MSG_NO_SURGE: "autoRollD20MessageNoSurge",
  OPT_AUTO_D20_MSG_NO_SURGE_ENABLED: "autoRollD20MessageNoSurgeEnabled",

  OPT_CUSTOM_ROLL_DICE_FORMULA: "customRollDiceFormula",
  OPT_CUSTOM_ROLL_RESULT: "customRollResult",
  OPT_CUSTOM_ROLL_RESULT_CHECK: "customRollResultCheck",

  OPT_INCREMENTAL_CHECK_TO_CHAT: "incrementalCheckToChat",

  OPT_ENABLE_NPCS: "enableNpcTracking",

  OPT_TSL_DIE: "OPT_TSL_DIE",
  OPT_TSL_LVL1: "OPT_TSL_LVL1",
  OPT_TSL_LVL2: "OPT_TSL_LVL2",
  OPT_TSL_LVL3: "OPT_TSL_LVL3",
  OPT_TSL_LVL4: "OPT_TSL_LVL4",
  OPT_TSL_LVL5: "OPT_TSL_LVL5",
  OPT_TSL_LVL6: "OPT_TSL_LVL6",
  OPT_TSL_LVL7: "OPT_TSL_LVL7",
  OPT_TSL_LVL8: "OPT_TSL_LVL8",
  OPT_TSL_LVL9: "OPT_TSL_LVL9",
  OPT_TSL_LVL10: "OPT_TSL_LVL10",

  CHAT_TYPE: {
    DEFAULT: "DEFAULT",
    ROLL: "ROLL",
    TABLE: "TABLE",
  },

  ROLL_CHECK_TYPE: {
    DEFAULT: "DEFAULT",
    SPELL_LEVEL_DEPENDENT_ROLL: "SPELL_LEVEL_DEPENDENT_ROLL",
    INCREMENTAL_CHECK: "INCREMENTAL_CHECK",
    INCREMENTAL_CHECK_CHAOTIC: "INCREMENTAL_CHECK_CHAOTIC",
    DIE_DESCENDING: "DIE_DESCENDING",
  },

  SURGE_FEAT_TYPE: {
    WildMagicSurge: "WMS",
    PathOfWildMagic: "POWM",
    TidesOfChaosSurge: "TOCSURGE",
  },

  SURGE_TYPE: {
    DEFAULT: "Standard",
    SPELL_LEVEL_DEPENDENT_ROLL: "Spell Level Dependent Rolls",
    INCREMENTAL_CHECK: "Incremental Check",
    INCREMENTAL_CHECK_CHAOTIC: "Incremental Check (Chaotic)",
    DIE_DESCENDING: "Descending Dice",
  },
  OPT_SURGE_TYPE: "OPT_SURGE_TYPE",

  MODULE_FLAG_NAME: "wild-magic-surge-5e",
  DIE_DESCENDING_FLAG_OPTION: "die_type",
  HAS_SURGED_FLAG_OPTION: "hassurged",

  ROLL_COMPARISON: {
    EQ: "=",
    GT: ">",
    LT: "<",
  },

  SPELL_LIST_KEY_WORDS: [
    "Cantrip",
    "1st Level",
    "2nd Level",
    "3rd Level",
    "4th Level",
    "5th Level",
    "6th Level",
    "7th Level",
    "8th Level",
    "9th Level",
    "10th Level",
  ],

  OPT_SPELL_REGEX: "spellRegex",
  OPT_SPELL_REGEX_INVERSE: "spellRegexInverse",
  OPT_SPELL_REGEX_ENABLED: "spellRegexEnabled",

  OPT_SURGE_TOC_ENABLED: "surgeTocEnabled",
  OPT_EFFECTS_ENABLED: "wildMagicSurgeEffectsEnabled",
  OPT_CANTRIP_SURGE_ENABLED: "cantripTriggerSurgeCheckEnabled",
  OPT_ENCOUNTER_STATS_ENABLED: "encounterStatsEnabled",
  OPT_SHOW_WMS_DEBUG_OPTION: "showWMSDebugOption",

  COMPARISON: {
    EQ: "EQ",
    GT: "GT",
    LT: "LT",
  },

  DIE_VALUE: {
    D20: "1d20",
    D12: "1d12",
    D10: "1d10",
    D8: "1d8",
    D6: "1d6",
    D4: "1d4",
  },

  SPELL_LEVELS: {
    Cantrip: "Cantrip",
    LEVEL_1: "1st Level",
    LEVEL_2: "2nd Level",
    LEVEL_3: "3rd Level",
    LEVEL_4: "4th Level",
    LEVEL_5: "5th Level",
    LEVEL_6: "6th Level",
    LEVEL_7: "7th Level",
    LEVEL_8: "8th Level",
    LEVEL_9: "9th Level",
    LEVEL_10: "10th Level",
  },
} as const;
