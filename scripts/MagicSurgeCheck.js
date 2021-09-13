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
import Chat from "./Chat.js";
import TidesOfChaos from "./TidesOfChaos.js";
import RollTableMagicSurge from "./RollTableMagicSurge.js";
import IncrementalCheck from "./utils/IncrementalCheck.js";
import SpellParser from "./utils/SpellParser.js";
import SpellLevelTrigger from "./utils/SpellLevelTrigger.js";

export default class MagicSurgeCheck {
  constructor() {
    this.chat = new Chat();
    this.rollTableMagicSurge = new RollTableMagicSurge();
    this.tidesOfChaos = new TidesOfChaos();
  }

  async Check(chatMessage) {
    const actor = game.actors.get(chatMessage.data.speaker.actor);
    if (!actor) {
      return false;
    }
    if (this.isValid(chatMessage, actor)) {
      if (game.settings.get(`${MODULE_ID}`, `${OPT_AUTO_D20}`)) {
        const spellParser = new SpellParser();
        const spellLevel = spellParser.SpellLevel(chatMessage.data.content);
        const gameType = game.settings.get(`${MODULE_ID}`, `${OPT_SURGE_TYPE}`);
        const result = this.WildMagicSurgeRollCheck();
        await this.RunAutoCheck(actor, spellLevel, result, gameType);
      } else {
        this.RunMessageCheck();
      }
    }
  }

  isValid(chatMessage, actor) {
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

    const spellParser = new SpellParser();
    const isASpell = spellParser.IsSpell(chatMessage.data.content);
    const hasWildMagicFeat = spellParser.IsWildMagicFeat(actor);
    const isNpc = spellParser.IsNPC(actor);

    return isASpell && !isNpc && hasWildMagicFeat;
  }

  WildMagicSurgeRollCheck() {
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

  ResultCheck(result, comparison) {
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

  async RunAutoCheck(actor, spellLevel, result, gameType) {
    let isSurge = false;

    switch (gameType) {
      case "DEFAULT":
        isSurge = this.ResultCheck(
          result,
          game.settings.get(`${MODULE_ID}`, `${OPT_CUSTOM_ROLL_RESULT_CHECK}`)
        );
        break;
      case "INCREMENTAL_CHECK":
        const incrementalCheck = new IncrementalCheck(actor, result);
        isSurge = await incrementalCheck.Check();
        break;
      case "SPELL_LEVEL_DEPENDENT_ROLL":
        const spellLevelTrigger = new SpellLevelTrigger();
        isSurge = spellLevelTrigger.Check(result, spellLevel);
        break;
      default:
        break;
    }

    if (isSurge) {
      this.chat.SendChat(
        game.settings.get(`${MODULE_ID}`, `${OPT_AUTO_D20_MSG}`),
        `[[/r ${result} #${game.settings.get(
          `${MODULE_ID}`,
          `${OPT_CUSTOM_ROLL_DICE_FORMULA}`
        )} result]]`
      );
      this.tidesOfChaos.Check(actor);
      this.rollTableMagicSurge.Check();
      Hooks.callAll("wild-magic-surge-5e.IsWildMagicSurge", true);
    } else {
      this.chat.SendChat(
        game.settings.get(`${MODULE_ID}`, `${OPT_AUTO_D20_MSG_NO_SURGE}`),
        `[[/r ${result} #${game.settings.get(
          `${MODULE_ID}`,
          `${OPT_CUSTOM_ROLL_DICE_FORMULA}`
        )} result]]`
      );
      Hooks.callAll("wild-magic-surge-5e.IsWildMagicSurge", false);
    }
  }

  RunMessageCheck() {
    Hooks.callAll("wild-magic-surge-5e.CheckForSurge", true);
    this.chat.SendChat(game.settings.get(`${MODULE_ID}`, `${OPT_CHAT_MSG}`));
  }
}
