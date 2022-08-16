import { WMSCONST } from "./WMSCONST";
import Chat from "./Chat";
import TidesOfChaos from "./TidesOfChaos";
import RollTableMagicSurge from "./RollTableMagicSurge";
import IncrementalCheck from "./utils/IncrementalCheck";
import SpellLevelTrigger from "./utils/SpellLevelTrigger";
import DieDescending from "./utils/DieDescending";
import AutoEffects from "./AutoEffects";
import CallHooks from "./utils/CallHooks";
import SurgeChatMessageDetails from "./utils/SurgeChatMessageDetails";

/**
 * Main entry point for Wild Magic Surge Checks
 * @class MagicSurgeCheck
 * @param actor - Foundry Actor
 * @example
 * let magicSurgeCheck = new MagicSurgeCheck(actor);
 */
class MagicSurgeCheck {
  _actor: Actor;
  _tokenId: string;
  constructor(actor: Actor, tokenId: string) {
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

    const surgeChatMessageDetails = new SurgeChatMessageDetails(
      chatMessage,
      this._actor,
      game.user?.id,
      game.user?.isGM
    );

    if (!surgeChatMessageDetails.valid) return;

    if (surgeChatMessageDetails.hasPathOfWildMagicFeat) {
      RollTableMagicSurge.Check("POWM");
    } else {
      if (
        game.settings.get(`${WMSCONST.MODULE_ID}`, `${WMSCONST.OPT_AUTO_D20}`)
      ) {
        await this.AutoSurgeCheck(
          surgeChatMessageDetails.spellLevel,
          game.settings.get(
            `${WMSCONST.MODULE_ID}`,
            `${WMSCONST.OPT_SURGE_TYPE}`
          )
        );
      } else {
        Chat.RunMessageCheck();
      }
    }
  }

  /**
   * @private
   * @returns RollResult
   */
  async WildMagicSurgeRollCheck(): Promise<Roll> {
    let diceFormula;

    switch (
      game.settings.get(`${WMSCONST.MODULE_ID}`, `${WMSCONST.OPT_SURGE_TYPE}`)
    ) {
      case "DIE_DESCENDING":
        diceFormula = await this._actor.getFlag(
          WMSCONST.MODULE_FLAG_NAME,
          WMSCONST.DIE_DESCENDING_FLAG_OPTION
        );

        if (!diceFormula) {
          diceFormula = "1d20";
          await this._actor.setFlag(
            WMSCONST.MODULE_FLAG_NAME,
            WMSCONST.DIE_DESCENDING_FLAG_OPTION,
            {
              value: "1d20",
            }
          );
        } else {
          diceFormula = diceFormula.value;
        }
        break;
      case "SPELL_LEVEL_DEPENDENT_ROLL":
        diceFormula = game.settings.get(
          `${WMSCONST.MODULE_ID}`,
          `${WMSCONST.OPT_TSL_DIE}`
        );
        break;
      default:
        diceFormula = game.settings.get(
          `${WMSCONST.MODULE_ID}`,
          `${WMSCONST.OPT_CUSTOM_ROLL_DICE_FORMULA}`
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
      game.settings.get(
        `${WMSCONST.MODULE_ID}`,
        `${WMSCONST.OPT_CUSTOM_ROLL_RESULT}`
      )
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
    if (
      game.settings.get(
        `${WMSCONST.MODULE_ID}`,
        `${WMSCONST.OPT_SURGE_TOC_ENABLED}`
      )
    ) {
      if (await TidesOfChaos.IsTidesOfChaosUsed(this._actor)) {
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
            game.settings.get(
              `${WMSCONST.MODULE_ID}`,
              `${WMSCONST.OPT_CUSTOM_ROLL_RESULT_CHECK}`
            )
          );
          break;
        case "INCREMENTAL_CHECK":
        case "INCREMENTAL_CHECK_CHAOTIC": {
          const maxValue = gameType === `INCREMENTAL_CHECK_CHAOTIC` ? 10 : 20;
          isSurge = await IncrementalCheck.Check(
            this._actor,
            parseInt(roll.result),
            maxValue
          );
          break;
        }
        case "SPELL_LEVEL_DEPENDENT_ROLL": {
          isSurge = SpellLevelTrigger.Check(parseInt(roll.result), spellLevel);
          break;
        }
        case "DIE_DESCENDING": {
          isSurge = await DieDescending.Check(this._actor, roll.result);
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
      Chat.Send(
        WMSCONST.CHAT_TYPE.ROLL,
        game.settings.get(
          `${WMSCONST.MODULE_ID}`,
          `${WMSCONST.OPT_AUTO_D20_MSG}`
        ),
        roll
      );
      TidesOfChaos.Check(this._actor);
      RollTableMagicSurge.Check();
      this._callIsSurgeHook(true, roll);
      AutoEffects.Run(this._tokenId);
    } else {
      Chat.Send(
        WMSCONST.CHAT_TYPE.ROLL,
        game.settings.get(
          `${WMSCONST.MODULE_ID}`,
          `${WMSCONST.OPT_AUTO_D20_MSG_NO_SURGE}`
        ),
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
    RollTableMagicSurge.Check("TOCSURGE");
    Chat.Send(
      WMSCONST.CHAT_TYPE.DEFAULT,
      game.settings.get(`${WMSCONST.MODULE_ID}`, `${WMSCONST.OPT_AUTO_D20_MSG}`)
    );
    TidesOfChaos.Check(this._actor);
    this._callIsSurgeHook(true);
    AutoEffects.Run(this._tokenId);
  }
}

export default MagicSurgeCheck;
