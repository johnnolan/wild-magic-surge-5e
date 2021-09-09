import {
  MODULE_ID,
  OPT_CHAT_MSG,
  OPT_AUTO_D20,
  OPT_AUTO_D20_MSG,
  OPT_AUTO_D20_MSG_NO_SURGE,
  OPT_WHISPER_GM,
  OPT_CUSTOM_ROLL_DICE_FORMULA,
  OPT_CUSTOM_ROLL_RESULT,
  OPT_CUSTOM_ROLL_RESULT_CHECK,
  OPT_TSL_DIE,
  OPT_SURGE_TYPE,
} from "./Settings.js";
import { SendChat } from "./Chat.js";
import { TidesOfChaos } from "./TidesOfChaos.js";
import { RollTableMagicSurge } from "./RollTableMagicSurge.js";
import { IncrementalCheck } from "./IncrementalCheck.js";
import {
  IsWildMagicFeat,
  SpellLevel,
  IsSpell,
  IsNPC,
} from "./utils/SpellParser.js";
import TriggerSpellLevelCheck from "./utils/SpellLevelTrigger.js";

export function WildMagicCheck(chatMessage) {
  if (isValid(chatMessage)) {
    if (game.settings.get(`${MODULE_ID}`, `${OPT_AUTO_D20}`)) {
      const spellLevel = SpellLevel(chatMessage.data.content);
      runAutoCheck(game.actors.get(chatMessage.data.speaker.actor), spellLevel);
    } else {
      runMessageCheck();
    }
  }
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

  const isASpell = IsSpell(chatMessage.data.content);
  const actor = game.actors.get(chatMessage.data.speaker.actor);
  if (actor === null) {
    return false;
  }
  const hasWildMagicFeat = IsWildMagicFeat(actor);
  const isNpc = IsNPC(actor);

  return isASpell && !isNpc && hasWildMagicFeat;
}

function wildMagicSurgeRollCheck() {
  let diceFormula = game.settings.get(
    `${MODULE_ID}`,
    `${OPT_CUSTOM_ROLL_DICE_FORMULA}`
  );
  if (
    game.settings.get(`${MODULE_ID}`, `${OPT_SURGE_TYPE}`) ===
    "SPELL_LEVEL_DEPENDENT_ROLL"
  ) {
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

async function runAutoCheck(actor, spellLevel) {
  const result = wildMagicSurgeRollCheck();
  let isSurge = false;

  const gameType = game.settings.get(`${MODULE_ID}`, `${OPT_SURGE_TYPE}`);
  switch (gameType) {
    case "DEFAULT":
      isSurge = resultCheck(
        result,
        game.settings.get(`${MODULE_ID}`, `${OPT_CUSTOM_ROLL_RESULT_CHECK}`)
      );
      break;
    case "INCREMENTAL_CHECK":
      isSurge = await IncrementalCheck(actor, result);
      break;
    case "SPELL_LEVEL_DEPENDENT_ROLL":
      isSurge = TriggerSpellLevelCheck(result, spellLevel);
      break;
    default:
      break;
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
