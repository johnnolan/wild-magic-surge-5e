import {
  MODULE_ID,
  OPT_SPELL_REGEX_ENABLED,
  OPT_AUTO_D20,
  OPT_AUTO_D20_MSG,
  OPT_AUTO_D20_MSG_NO_SURGE,
  OPT_WHISPER_GM,
  OPT_CUSTOM_ROLL_DICE_FORMULA,
  OPT_CUSTOM_ROLL_RESULT,
  OPT_CUSTOM_ROLL_RESULT_CHECK,
  OPT_TSL_DIE,
  OPT_SURGE_TYPE,
  MODULE_FLAG_NAME,
  DIE_DESCENDING_FLAG_OPTION,
  OPT_ENABLE_NPCS,
  OPT_SURGE_TOC_ENABLED,
  CHAT_TYPE,
} from "./Settings.js";
import Chat from "./Chat.js";
import TidesOfChaos from "./TidesOfChaos.js";
import RollTableMagicSurge from "./RollTableMagicSurge.js";
import IncrementalCheck from "./utils/IncrementalCheck.js";
import SpellParser from "./utils/SpellParser.js";
import SpellLevelTrigger from "./utils/SpellLevelTrigger.js";
import DieDescending from "./utils/DieDescending.js";
import AutoEffects from "./AutoEffects.js";

/**
 * Main entry point for Wild Magic Surge Checks
 * @class MagicSurgeCheck
 * @param {Actor} actor
 * @example
 * let magicSurgeCheck = new MagicSurgeCheck(actor);
 */
class MagicSurgeCheck {
  constructor(actor, tokenId) {
    this.chat = new Chat();
    this.rollTableMagicSurge = new RollTableMagicSurge();
    this.tidesOfChaos = new TidesOfChaos();
    this._spellParser = new SpellParser(actor);
    this._actor = actor;
    this._tokenId = tokenId;
  }

  /**
   * Entry point for Chat Message Hook. Check the message is valid and if so do Surge checks.
   * @param {ChatMessage} chatMessage
   * @returns Promise<void>
   */
  async CheckChatMessage(chatMessage) {
    if (!this._actor) {
      return false;
    }

    if (await this.isValidChatMessage(chatMessage)) {
      const hasPathOfWildMagicFeat = this._spellParser.IsPathOfWildMagicFeat();
      if (hasPathOfWildMagicFeat) {
        this.rollTableMagicSurge.Check("POWM");
      } else {
        if (game.settings.get(`${MODULE_ID}`, `${OPT_AUTO_D20}`)) {
          const spellLevel = await this._spellParser.SpellLevel(
            chatMessage.content
          );
          const gameType = game.settings.get(
            `${MODULE_ID}`,
            `${OPT_SURGE_TYPE}`
          );
          await this.AutoSurgeCheck(spellLevel, gameType);
        } else {
          this.chat.RunMessageCheck();
        }
      }
    }
  }

  /**
   * @private
   * @param {ChatMessage} messageData
   * @returns boolean
   */
  async isValidChatMessage(messageData) {
    if (!messageData.speaker || !messageData.speaker.actor) {
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
      if (messageData.user.id !== game.user.id) return false;
    }

    const hasPathOfWildMagicFeat = this._spellParser.IsPathOfWildMagicFeat();
    if (hasPathOfWildMagicFeat) {
      return !!(await this._spellParser.IsRage(messageData.content));
    }

    const isASpell = await this._spellParser.IsSpell(messageData.content);

    if (game.settings.get(`${MODULE_ID}`, `${OPT_SPELL_REGEX_ENABLED}`)) {
      const isASorcererSpell = await this._spellParser.IsSorcererSpell(
        messageData.content
      );
      if (!isASorcererSpell) return false;
    }

    const hasWildMagicFeat = this._spellParser.IsWildMagicFeat();

    if (game.settings.get(`${MODULE_ID}`, `${OPT_ENABLE_NPCS}`)) {
      return isASpell && hasWildMagicFeat;
    }

    const isNpc = this._spellParser.IsNPC();
    return isASpell && !isNpc && hasWildMagicFeat;
  }

  /**
   * @private
   * @returns RollResult
   */
  async WildMagicSurgeRollCheck() {
    let diceFormula;

    switch (game.settings.get(`${MODULE_ID}`, `${OPT_SURGE_TYPE}`)) {
      case "DIE_DESCENDING":
        diceFormula = await this._actor.getFlag(
          MODULE_FLAG_NAME,
          DIE_DESCENDING_FLAG_OPTION
        );

        if (!diceFormula) {
          diceFormula = "1d20";
          await this._actor.setFlag(
            MODULE_FLAG_NAME,
            DIE_DESCENDING_FLAG_OPTION,
            {
              value: "1d20",
            }
          );
        } else {
          diceFormula = diceFormula.value;
        }
        break;
      case "SPELL_LEVEL_DEPENDENT_ROLL":
        diceFormula = game.settings.get(`${MODULE_ID}`, `${OPT_TSL_DIE}`);
        break;
      default:
        diceFormula = game.settings.get(
          `${MODULE_ID}`,
          `${OPT_CUSTOM_ROLL_DICE_FORMULA}`
        );
        break;
    }

    return new Roll(diceFormula).roll({ async: true });
  }

  /**
   * If there are more than 1 Surge numbers to check against, split them into an array.
   * @private
   * @param {string} resultValues
   * @returns Array
   */
  SplitRollResult(resultValues) {
    if (resultValues) {
      return resultValues.toString().replace(/\s/g, "").split(",");
    } else {
      return [];
    }
  }

  /**
   * On a Default Wild Magic Surge, check the result of the roll against the specified roll targe.
   * @private
   * @param {integer} result
   * @param {string} comparison
   * @returns boolean
   */
  DefaultMagicSurgeRollResult(result, comparison) {
    const rollResult = parseInt(result);
    const rollResultTargets = this.SplitRollResult(
      game.settings.get(`${MODULE_ID}`, `${OPT_CUSTOM_ROLL_RESULT}`)
    );

    for (const resultTarget of rollResultTargets) {
      const rollResultTarget = parseInt(resultTarget);

      switch (comparison) {
        case "EQ":
          if (rollResult === rollResultTarget) {
            return true;
          }
          break;
        case "GT":
          if (rollResult > rollResultTarget) {
            return true;
          }
          break;
        case "LT":
          if (rollResult < rollResultTarget) {
            return true;
          }
          break;
      }
    }

    return false;
  }

  /**
   * Automatically checks for a surge against the spell level and game type.
   * @param {integer} spellLevel
   * @param {string} gameType
   * @returns Promise<void>
   */
  async AutoSurgeCheck(spellLevel, gameType) {
    let isSurge = false;
    let roll;

    let isAutoSurge = false;
    if (game.settings.get(`${MODULE_ID}`, `${OPT_SURGE_TOC_ENABLED}`)) {
      if (await this.tidesOfChaos.IsTidesOfChaosUsed(this._actor)) {
        isAutoSurge = true;
        this.SurgeTidesOfChaos();
      }
    }

    if (!isAutoSurge) {
      roll = await this.WildMagicSurgeRollCheck(gameType);
      switch (gameType) {
        case "DEFAULT":
          isSurge = this.DefaultMagicSurgeRollResult(
            roll.result,
            game.settings.get(`${MODULE_ID}`, `${OPT_CUSTOM_ROLL_RESULT_CHECK}`)
          );
          break;
        case "INCREMENTAL_CHECK":
        case "INCREMENTAL_CHECK_CHAOTIC":
          let maxValue = gameType === `INCREMENTAL_CHECK_CHAOTIC` ? 10 : 20;
          const incrementalCheck = new IncrementalCheck(
            this._actor,
            roll.result,
            maxValue
          );
          isSurge = await incrementalCheck.Check();
          break;
        case "SPELL_LEVEL_DEPENDENT_ROLL":
          const spellLevelTrigger = new SpellLevelTrigger();
          isSurge = spellLevelTrigger.Check(roll.result, spellLevel);
          break;
        case "DIE_DESCENDING":
          const dieDescending = new DieDescending(this._actor, roll.result);
          isSurge = await dieDescending.Check();
          break;
        default:
          return;
      }
      this.SurgeWildMagic(isSurge, roll);
    }
  }

  /**
   * Fires a hook for external integrations when a surge happens.
   * @private
   * @param {boolean} isSurge
   * @param {RollResult} rollResult
   */
  async _callIsSurgeHook(isSurge, rollResult = null) {
    Hooks.callAll("wild-magic-surge-5e.IsWildMagicSurge", {
      surge: isSurge,
      result: rollResult,
      tokenId: this._tokenId,
    });

    game.socket?.emit("module.wild-magic-surge-5e", {
      event: "IsWildMagicSurge",
      data: {
        surge: isSurge,
        result: rollResult,
        tokenId: this._tokenId,
      },
    });
  }

  /**
   * Calls a standard Wild Magic Surge.
   * @private
   * @param {boolean} isSurge
   * @param {Roll} roll
   */
  async SurgeWildMagic(isSurge, roll) {
    if (isSurge) {
      await this._actor.setFlag("wild-magic-surge-5e", "hassurged", true);
      this.chat.Send(
        CHAT_TYPE.ROLL,
        game.settings.get(`${MODULE_ID}`, `${OPT_AUTO_D20_MSG}`),
        roll
      );
      this.tidesOfChaos.Check(this._actor);
      this.rollTableMagicSurge.Check();
      this._callIsSurgeHook(true, roll.result);
      AutoEffects.Run(this._tokenId);
    } else {
      await this._actor.setFlag("wild-magic-surge-5e", "hassurged", false);
      this.chat.Send(
        CHAT_TYPE.ROLL,
        game.settings.get(`${MODULE_ID}`, `${OPT_AUTO_D20_MSG_NO_SURGE}`),
        roll
      );
      this._callIsSurgeHook(false, roll.result);
    }
  }

  /**
   * Calls the Surge for the Tides of Chaos auto surge.
   * @private
   */
  async SurgeTidesOfChaos() {
    await this._actor.setFlag("wild-magic-surge-5e", "hassurged", true);
    this.rollTableMagicSurge.Check("TOCSURGE");
    this.chat.Send(
      CHAT_TYPE.DEFAULT,
      game.settings.get(`${MODULE_ID}`, `${OPT_AUTO_D20_MSG}`)
    );
    this.tidesOfChaos.Check(this._actor);
    this._callIsSurgeHook(true);
    AutoEffects.Run(this._tokenId);
  }
}

export default MagicSurgeCheck;
