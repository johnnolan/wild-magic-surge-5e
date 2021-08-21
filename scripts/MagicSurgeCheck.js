import {
  MODULE_ID,
  OPT_CHAT_MSG,
  OPT_AUTO_D20,
  OPT_AUTO_D20_MSG,
  OPT_AUTO_D20_MSG_NO_SURGE,
  SPELL_LIST_KEY_WORDS,
  OPT_WHISPER_GM,
  OPT_CUSTOM_ROLL_DICE_FORMULA,
  OPT_CUSTOM_ROLL_RESULT,
  OPT_CUSTOM_ROLL_RESULT_CHECK,
  OPT_ENABLE_TSL,
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
} from "./Settings.js";
import { SendChat } from "./Chat.js";
import { TidesOfChaos } from "./TidesOfChaos.js";
import { RollTableMagicSurge } from "./RollTableMagicSurge.js";

export function WildMagicCheck(chatMessage) {
  if (isValid(chatMessage)) {
    if (game.settings.get(`${MODULE_ID}`, `${OPT_AUTO_D20}`)) {
      const spellLevel = parseSpell(chatMessage.data.content);
      runAutoCheck(game.actors.get(chatMessage.data.speaker.actor), spellLevel);
    } else {
      runMessageCheck();
    }
  }
}

function parseWildMagicFeat(actor) {
  return (
    actor.data.items.find(
      (a) => a.name === "Wild Magic Surge" && a.type === "feat"
    ) !== undefined
  );
}

function parseSpell(content) {
  return SPELL_LIST_KEY_WORDS.filter((f) => content.includes(f))[0];
}

function isSpellCheck(content) {
  return SPELL_LIST_KEY_WORDS.some((v) => content.includes(v));
}

function parseNpc(actor) {
  return actor ? actor.data.type === "npc" : false;
}

function isValid(chatMessage) {
  if (!chatMessage.data.speaker || !chatMessage.data.speaker.actor) {
    return false;
  }

  const whisperToGM = game.settings.get(`${MODULE_ID}`, `${OPT_WHISPER_GM}`);
  // If whisper is set
  if (whisperToGM) {
    // Make sure it is the GM who sends the message
    if (!game.user.isGM) return false;
  }
  // If its just a public message
  else {
    // Make sure the player who rolled sends the message
    if (chatMessage.data.user !== game.user.id) return false;
  }

  const isASpell = isSpellCheck(chatMessage.data.content);
  const actor = game.actors.get(chatMessage.data.speaker.actor);
  if (actor === null) {
    return false;
  }
  const hasWildMagicFeat = parseWildMagicFeat(actor);
  const isNpc = parseNpc(actor);

  return isASpell && !isNpc && hasWildMagicFeat;
}

function wildMagicSurgeRollCheck() {
  let diceFormula = game.settings.get(
    `${MODULE_ID}`,
    `${OPT_CUSTOM_ROLL_DICE_FORMULA}`
  );
  if (game.settings.get(`${MODULE_ID}`, `${OPT_ENABLE_TSL}`)) {
    diceFormula = game.settings.get(`${MODULE_ID}`, `${OPT_TSL_DIE}`);
  }

  let r = new Roll(diceFormula);
  r.evaluate();
  return r.total;
}

function resultCheck(result, comparison) {
  const rollResultTarget = parseInt(
    game.settings.get(`${MODULE_ID}`, `${OPT_CUSTOM_ROLL_RESULT}`)
  );
  switch (comparison) {
    case "EQ":
      return result === rollResultTarget;
    case "GT":
      return result > rollResultTarget;
    case "LT":
      return result < rollResultTarget;
    default:
      return false;
  }
}

function parseTSLOption(level) {
  const levelSplit = level.split(" ");
  return levelSplit;
}

function triggerSpellLevelCheck(result, spellLevel) {
  let spellString;
  switch (spellLevel) {
    case "1st Level":
      spellString = game.settings.get(`${MODULE_ID}`, `${OPT_TSL_LVL1}`);
      break;
    case "2nd Level":
      spellString = game.settings.get(`${MODULE_ID}`, `${OPT_TSL_LVL2}`);
      break;
    case "3rd Level":
      spellString = game.settings.get(`${MODULE_ID}`, `${OPT_TSL_LVL3}`);
      break;
    case "4th Level":
      spellString = game.settings.get(`${MODULE_ID}`, `${OPT_TSL_LVL4}`);
      break;
    case "5th Level":
      spellString = game.settings.get(`${MODULE_ID}`, `${OPT_TSL_LVL5}`);
      break;
    case "6th Level":
      spellString = game.settings.get(`${MODULE_ID}`, `${OPT_TSL_LVL6}`);
      break;
    case "7th Level":
      spellString = game.settings.get(`${MODULE_ID}`, `${OPT_TSL_LVL7}`);
      break;
    case "8th Level":
      spellString = game.settings.get(`${MODULE_ID}`, `${OPT_TSL_LVL8}`);
      break;
    case "9th Level":
      spellString = game.settings.get(`${MODULE_ID}`, `${OPT_TSL_LVL9}`);
      break;
    case "10th Level":
      spellString = game.settings.get(`${MODULE_ID}`, `${OPT_TSL_LVL10}`);
      break;
  }

  const splitLevel = parseTSLOption(spellString);

  const rollResultTarget = splitLevel[1];
  switch (splitLevel[0]) {
    case "=":
      return result === rollResultTarget;
    case ">":
      return result > rollResultTarget;
    case "<":
      return result < rollResultTarget;
    default:
      return false;
  }
}

function runAutoCheck(actor, spellLevel) {
  const result = wildMagicSurgeRollCheck();
  let isSurge = false;
  if (game.settings.get(`${MODULE_ID}`, `${OPT_ENABLE_TSL}`)) {
    isSurge = triggerSpellLevelCheck(result, spellLevel);
  } else {
    isSurge = resultCheck(
      result,
      game.settings.get(`${MODULE_ID}`, `${OPT_CUSTOM_ROLL_RESULT_CHECK}`)
    );
  }
  if (isSurge) {
    SendChat(
      game.settings.get(`${MODULE_ID}`, `${OPT_AUTO_D20_MSG}`),
      `[[/r ${result} #${game.settings.get(
        `${MODULE_ID}`,
        `${OPT_CUSTOM_ROLL_DICE_FORMULA}`
      )} result]]`
    );
    TidesOfChaos(actor);
    RollTableMagicSurge();
  } else {
    SendChat(
      game.settings.get(`${MODULE_ID}`, `${OPT_AUTO_D20_MSG_NO_SURGE}`),
      `[[/r ${result} #${game.settings.get(
        `${MODULE_ID}`,
        `${OPT_CUSTOM_ROLL_DICE_FORMULA}`
      )} result]]`
    );
  }
}

function runMessageCheck() {
  SendChat(game.settings.get(`${MODULE_ID}`, `${OPT_CHAT_MSG}`));
}
