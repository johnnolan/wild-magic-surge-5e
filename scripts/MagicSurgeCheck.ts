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
} from "./Settings";
import Chat from "./Chat";
import TidesOfChaos from "./TidesOfChaos";
import RollTableMagicSurge from "./RollTableMagicSurge";
import IncrementalCheck from "./utils/IncrementalCheck";
import SpellParser from "./utils/SpellParser";
import SpellLevelTrigger from "./utils/SpellLevelTrigger";
import DieDescending from "./utils/DieDescending";
import AutoEffects from "./AutoEffects";
import CallHooks from "./utils/CallHooks";

/**
 * Main entry point for Wild Magic Surge Checks
 * @class MagicSurgeCheck
 * @param {Actor} actor
 * @example
 * let magicSurgeCheck = new MagicSurgeCheck(actor);
 */
class MagicSurgeCheck {
  _actor: Actor;
  _tokenId: string;
  chat: Chat;
  rollTableMagicSurge: RollTableMagicSurge;
  tidesOfChaos: TidesOfChaos;
  constructor(actor: Actor, tokenId: string) {
    this.chat = new Chat();
    this.rollTableMagicSurge = new RollTableMagicSurge();
    this.tidesOfChaos = new TidesOfChaos();
    this._actor = actor;
    this._tokenId = tokenId;
  }

  /**
   * Entry point for Chat Message Hook. Check the message is valid and if so do Surge checks.
   * @param chatMessage -
   * @returns Promise<void>
   */
  async CheckChatMessage(chatMessage: ChatMessage): Promise<void> {
    if (!this._actor) {
      return;
    }

    if (await this.isValidChatMessage(chatMessage)) {
      const hasPathOfWildMagicFeat = SpellParser.IsPathOfWildMagicFeat(
        this._actor
      );
      if (hasPathOfWildMagicFeat) {
        this.rollTableMagicSurge.Check("POWM");
      } else {
        if (game.settings.get(`${MODULE_ID}`, `${OPT_AUTO_D20}`)) {
          const spellLevel: string = await SpellParser.SpellLevel(
            chatMessage.content,
            this._actor
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
   * @param chatMessage -
   * @returns boolean
   */
  async isValidChatMessage(chatMessage: ChatMessage): Promise<boolean> {
    if (!chatMessage.speaker || !chatMessage.speaker.actor) {
      return false;
    }

    const whisperToGM = game.settings.get(`${MODULE_ID}`, `${OPT_WHISPER_GM}`);
    // If whisper is set
    if (whisperToGM) {
      // Make sure it is the GM who sends the message
      if (!game.user?.isGM) return false;
    }
    // If its just a public message
    else {
      // Make sure the player who rolled sends the message
      if (chatMessage.user?.id !== game.user?.id) return false;
    }

    const hasPathOfWildMagicFeat = SpellParser.IsPathOfWildMagicFeat(
      this._actor
    );
    if (hasPathOfWildMagicFeat) {
      return !!(await SpellParser.IsRage(chatMessage.content, this._actor));
    }

    const isASpell = await SpellParser.IsSpell(
      chatMessage.content,
      this._actor
    );

    if (game.settings.get(`${MODULE_ID}`, `${OPT_SPELL_REGEX_ENABLED}`)) {
      const isASorcererSpell = await SpellParser.IsSorcererSpell(
        chatMessage.content,
        this._actor
      );
      if (!isASorcererSpell) return false;
    }

    const hasWildMagicFeat = SpellParser.IsWildMagicFeat(this._actor);

    if (game.settings.get(`${MODULE_ID}`, `${OPT_ENABLE_NPCS}`)) {
      return isASpell && hasWildMagicFeat;
    }

    const isNpc = SpellParser.IsNPC(this._actor);
    return isASpell && !isNpc && hasWildMagicFeat;
  }

  /**
   * @private
   * @returns RollResult
   */
  async WildMagicSurgeRollCheck(): Promise<Roll> {
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
   * @returns Array<string>
   */
  SplitRollResult(resultValues: string): Array<string> {
    return resultValues.toString().replace(/\s/g, "").split(",");
  }

  /**
   * On a Default Wild Magic Surge, check the result of the roll against the specified roll targe.
   * @private
   * @param {string} result
   * @param {string} comparison
   * @returns boolean
   */
  DefaultMagicSurgeRollResult(result: string, comparison: string): boolean {
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
   * @param {string} spellLevel
   * @param {string} gameType
   * @returns Promise<void>
   */
  async AutoSurgeCheck(spellLevel: string, gameType: string): Promise<void> {
    let isSurge = false;
    let roll: Roll;

    let isAutoSurge = false;
    if (game.settings.get(`${MODULE_ID}`, `${OPT_SURGE_TOC_ENABLED}`)) {
      if (await this.tidesOfChaos.IsTidesOfChaosUsed(this._actor)) {
        isAutoSurge = true;
        this.SurgeTidesOfChaos();
      }
    }

    if (!isAutoSurge) {
      roll = await this.WildMagicSurgeRollCheck();
      switch (gameType) {
        case "DEFAULT":
          isSurge = this.DefaultMagicSurgeRollResult(
            roll.result,
            game.settings.get(`${MODULE_ID}`, `${OPT_CUSTOM_ROLL_RESULT_CHECK}`)
          );
          break;
        case "INCREMENTAL_CHECK":
        case "INCREMENTAL_CHECK_CHAOTIC": {
          const maxValue = gameType === `INCREMENTAL_CHECK_CHAOTIC` ? 10 : 20;
          const incrementalCheck = new IncrementalCheck(
            this._actor,
            parseInt(roll.result),
            maxValue
          );
          isSurge = await incrementalCheck.Check();
          break;
        }
        case "SPELL_LEVEL_DEPENDENT_ROLL": {
          const spellLevelTrigger = new SpellLevelTrigger();
          isSurge = spellLevelTrigger.Check(parseInt(roll.result), spellLevel);
          break;
        }
        case "DIE_DESCENDING": {
          const dieDescending = new DieDescending(this._actor, roll.result);
          isSurge = await dieDescending.Check();
          break;
        }
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
  async _callIsSurgeHook(isSurge: boolean, rollResult?: Roll): Promise<void> {
    CallHooks.Call("IsWildMagicSurge", {
      surge: isSurge,
      result: rollResult?.result,
      tokenId: this._tokenId,
    });
  }

  /**
   * Calls a standard Wild Magic Surge.
   * @private
   * @param isSurge -
   * @param roll -
   */
  async SurgeWildMagic(isSurge: boolean, roll: Roll): Promise<void> {
    if (isSurge) {
      this.chat.Send(
        CHAT_TYPE.ROLL,
        game.settings.get(`${MODULE_ID}`, `${OPT_AUTO_D20_MSG}`),
        roll
      );
      this.tidesOfChaos.Check(this._actor);
      this.rollTableMagicSurge.Check();
      this._callIsSurgeHook(true, roll);
      AutoEffects.Run(this._tokenId);
    } else {
      this.chat.Send(
        CHAT_TYPE.ROLL,
        game.settings.get(`${MODULE_ID}`, `${OPT_AUTO_D20_MSG_NO_SURGE}`),
        roll
      );
      this._callIsSurgeHook(false, roll);
    }
  }

  /**
   * Calls the Surge for the Tides of Chaos auto surge.
   * @private
   */
  async SurgeTidesOfChaos(): Promise<void> {
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
