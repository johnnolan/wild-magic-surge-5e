export const WMSCONST = {
  MODULE_NAME: "Wild Magic Surge 5e",
  MODULE_ID: "wild-magic-surge-5e",
  OPT_WMS_NAME: "wmsName",
  OPT_TOC_NAME: "tocName",
  OPT_POWM_NAME: "powmName",

  OPT_WHISPER_GM: "whisperToGM",

  OPT_ROLLTABLE_ENABLE: "enableRollTable",
  OPT_ROLLTABLE_NAME: "rollTableName",
  OPT_POWM_ROLLTABLE_NAME: "powmRollTableName",

  OPT_ENABLE_TOC: "enableTidesOfChaosRecharge",

  OPT_CHAT_MSG: "magicSurgeChatMessage",
  OPT_AUTO_D20: "autoRollD20",
  OPT_AUTO_D20_MSG: "autoRollD20Message",
  OPT_AUTO_D20_MSG_NO_SURGE: "autoRollD20MessageNoSurge",

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

  ROLL_COMPARISON: {
    EQ: "=",
    GT: ">",
    LT: "<",
  },

  SPELL_LIST_KEY_WORDS: [
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
  OPT_SPELL_REGEX_ENABLED: "spellRegexEnabled",

  OPT_SURGE_TOC_ENABLED: "surgeTocEnabled",
  OPT_EFFECTS_ENABLED: "wildMagicSurgeEffectsEnabled",
} as const;
