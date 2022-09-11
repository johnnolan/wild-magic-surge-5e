import { WMSCONST } from "./WMSCONST";
import Chat from "./Chat";
import TidesOfChaos from "./TidesOfChaos";
import RollTableMagicSurge from "./RollTableMagicSurge";
import IncrementalCheck from "./utils/IncrementalCheck";
import SpellLevelTrigger from "./utils/SpellLevelTrigger";
import DieDescending from "./utils/DieDescending";
import AutoEffects from "./AutoEffects";
import CallHooks from "./utils/CallHooks";
import SurgeDetails from "./utils/SurgeDetails";
import Logger from "./Logger";

/**
 * Main entry point for Wild Magic Surge Checks
 * @class MagicSurgeCheck
 * @param actor - Foundry Actor
 * @example
 * let magicSurgeCheck = new MagicSurgeCheck(actor);
 */
class MagicSurgeCheck {
  _actor: Actor;
  _tokenId: string | undefined;
  constructor(actor: Actor, tokenId: string | undefined) {
    this._actor = actor;
    this._tokenId = tokenId;
  }

  /**
   * Entry point for Chat Message Hook. Check the message is valid and if so do Surge checks.
   * @param item - Item5e object
   * @returns Promise<void>
   */
  async CheckItem(item: Item): Promise<void> {
    const itemSurgeDetails = new SurgeDetails(this._actor, item);

    if (!itemSurgeDetails.valid) return;

    if (itemSurgeDetails.hasPathOfWildMagicFeat) {
      RollTableMagicSurge.Check(WMSCONST.SURGE_FEAT_TYPE.PathOfWildMagic);
    } else {
      if (
        game.settings.get(`${WMSCONST.MODULE_ID}`, `${WMSCONST.OPT_AUTO_D20}`)
      ) {
        await this.AutoSurgeCheck(
          itemSurgeDetails.spellLevel,
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
  async WildMagicSurgeRollCheck(): Promise<Roll | undefined> {
    let diceFormula: DieValue = undefined;

    switch (
      game.settings.get(`${WMSCONST.MODULE_ID}`, `${WMSCONST.OPT_SURGE_TYPE}`)
    ) {
      case WMSCONST.ROLL_CHECK_TYPE.DIE_DESCENDING:
        {
          const flagResource = await DieDescending.GetFlagResource(this._actor);

          if (!flagResource) {
            diceFormula = WMSCONST.DIE_VALUE.D20;
          } else {
            diceFormula = flagResource.dieValue;
          }
        }
        break;
      case WMSCONST.ROLL_CHECK_TYPE.SPELL_LEVEL_DEPENDENT_ROLL:
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

    if (!diceFormula) {
      Logger.error(
        `Cannot find dice formula`,
        "magicsurgecheck.WildMagicSurgeRollCheck"
      );
      return;
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
   * @param {Comparison} comparison
   * @returns boolean
   */
  DefaultMagicSurgeRollResult(result: string, comparison: Comparison): boolean {
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
        case WMSCONST.COMPARISON.EQ:
          if (rollResult === rollResultTarget) {
            return true;
          }
          break;
        case WMSCONST.COMPARISON.GT:
          if (rollResult > rollResultTarget) {
            return true;
          }
          break;
        case WMSCONST.COMPARISON.LT:
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
    let roll: Roll | undefined;

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
      if (!roll) return;
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
          Logger.error(
            `Cannot find gameType ${gameType}`,
            "magicsurgecheck.AutoSurgeCheck",
            gameType
          );
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
      actorId: this._actor.id,
    });

    game.socket?.emit("module.wild-magic-surge-5e", {
      event: "IsWildMagicSurge",
      data: {
        surge: isSurge,
        result: rollResult?.result,
        tokenId: this._tokenId,
        actorId: this._actor.id,
      },
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
      await this._actor.setFlag(
        WMSCONST.MODULE_FLAG_NAME,
        WMSCONST.HAS_SURGED_FLAG_OPTION,
        true
      );
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
      await this._actor.setFlag(
        WMSCONST.MODULE_FLAG_NAME,
        WMSCONST.HAS_SURGED_FLAG_OPTION,
        false
      );
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
    await this._actor.setFlag(
      WMSCONST.MODULE_FLAG_NAME,
      WMSCONST.HAS_SURGED_FLAG_OPTION,
      true
    );
    RollTableMagicSurge.Check(WMSCONST.SURGE_FEAT_TYPE.TidesOfChaosSurge);
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
