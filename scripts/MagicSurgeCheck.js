import {
  MODULE_ID,
  OPT_SPELL_REGEX_ENABLED,
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
  MODULE_FLAG_NAME,
  DIE_DESCENDING_FLAG_OPTION,
  OPT_ENABLE_NPCS,
  OPT_SURGE_TOC_ENABLED,
} from "./Settings.js";
import Chat from "./Chat.js";
import TidesOfChaos from "./TidesOfChaos.js";
import RollTableMagicSurge from "./RollTableMagicSurge.js";
import IncrementalCheck from "./utils/IncrementalCheck.js";
import IncrementalCheckChaotic from "./utils/IncrementalCheckChaotic.js";
import SpellParser from "./utils/SpellParser.js";
import SpellLevelTrigger from "./utils/SpellLevelTrigger.js";
import DieDescending from "./utils/DieDescending.js";

export default class MagicSurgeCheck {
  constructor() {
    this.chat = new Chat();
    this.rollTableMagicSurge = new RollTableMagicSurge();
    this.tidesOfChaos = new TidesOfChaos();
  }

  async Check(chatMessage) {
    // Ignore Damage Log modules chat messages
    if (chatMessage.data?.flags?.hasOwnProperty("damage-log")) return;
    const actor = game.actors.get(chatMessage.data.speaker.actor);
    if (!actor) {
      return false;
    }

    if (await this.isValid(chatMessage, actor)) {
      const spellParser = new SpellParser();
      const hasPathOfWildMagicFeat = spellParser.IsPathOfWildMagicFeat(actor);
      if (hasPathOfWildMagicFeat) {
        this.Surge(true, actor, null, "POWM");
      } else {
        if (game.settings.get(`${MODULE_ID}`, `${OPT_AUTO_D20}`)) {
          const spellLevel = await spellParser.SpellLevel(
            chatMessage.data.content
          );
          const gameType = game.settings.get(
            `${MODULE_ID}`,
            `${OPT_SURGE_TYPE}`
          );
          await this.RunAutoCheck(actor, spellLevel, gameType);
        } else {
          this.RunMessageCheck();
        }
      }
    }
  }

  async RoundCheck(roundData) {
    const actor = game.actors.get(roundData.combatant.actor.id);
    if (!actor) {
      return false;
    }

    if (game.settings.get(`${MODULE_ID}`, `${OPT_AUTO_D20}`)) {
      const spellParser = new SpellParser();
      const IsWildMagicFeat = spellParser.IsWildMagicFeat(actor);
      if (IsWildMagicFeat) {
        const incrementalCheckChaotic = new IncrementalCheckChaotic(actor);
        if (game.settings.get(`${MODULE_ID}`, `${OPT_ENABLE_NPCS}`)) {
          await incrementalCheckChaotic.Check();
        } else {
          if (!spellParser.IsNPC(actor)) {
            await incrementalCheckChaotic.Check();
          }
        }
      }
    } else {
      this.RunMessageCheck();
    }
  }

  async ResetIncrementalCheck(actorId) {
    const actor = game.actors.get(actorId);
    if (!actor) {
      return false;
    }

    const incrementalCheck = new IncrementalCheck(actor);
    await incrementalCheck.Reset();
  }

  async isValid(chatMessage, actor) {
    let messageData = chatMessage.data;

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
      if (messageData.user !== game.user.id) return false;
    }

    const spellParser = new SpellParser();
    const hasPathOfWildMagicFeat = spellParser.IsPathOfWildMagicFeat(actor);
    if (hasPathOfWildMagicFeat) {
      if (await spellParser.IsRage(messageData.content, actor)) {
        return true;
      } else {
        return false;
      }
    }

    const isASpell = await spellParser.IsSpell(messageData.content);

    if (game.settings.get(`${MODULE_ID}`, `${OPT_SPELL_REGEX_ENABLED}`)) {
      const isASorcererSpell = await spellParser.IsSorcererSpell(
        messageData.content,
        actor
      );
      if (!isASorcererSpell) return false;
    }

    const hasWildMagicFeat = spellParser.IsWildMagicFeat(actor);

    if (game.settings.get(`${MODULE_ID}`, `${OPT_ENABLE_NPCS}`)) {
      return isASpell && hasWildMagicFeat;
    }

    const isNpc = spellParser.IsNPC(actor);
    return isASpell && !isNpc && hasWildMagicFeat;
  }

  async WildMagicSurgeRollCheck(actor) {
    let diceFormula;

    switch (game.settings.get(`${MODULE_ID}`, `${OPT_SURGE_TYPE}`)) {
      case "DIE_DESCENDING":
        diceFormula = await actor.getFlag(
          MODULE_FLAG_NAME,
          DIE_DESCENDING_FLAG_OPTION
        );

        if (!diceFormula) {
          diceFormula = "1d20";
          await actor.setFlag(MODULE_FLAG_NAME, DIE_DESCENDING_FLAG_OPTION, {
            value: "1d20",
          });
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

    let r = await new Roll(diceFormula).roll({ async: true });
    return r;
  }

  SplitRollResult(resultValues) {
    if (resultValues) {
      return resultValues.toString().replace(/\s/g, "").split(",");
    } else {
      return [];
    }
  }

  ResultCheck(result, comparison) {
    const rollResult = parseInt(result);
    const rollResultTargets = this.SplitRollResult(
      game.settings.get(`${MODULE_ID}`, `${OPT_CUSTOM_ROLL_RESULT}`)
    );

    for (let i = 0; i < rollResultTargets.length; i++) {
      const rollResultTarget = parseInt(rollResultTargets[i]);

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

  async RunAutoCheck(actor, spellLevel, gameType) {
    let isSurge = false;
    let roll;

    let isAutoSurge;
    if (game.settings.get(`${MODULE_ID}`, `${OPT_SURGE_TOC_ENABLED}`)) {
      if (await this.tidesOfChaos.IsTidesOfChaosUsed(actor)) {
        isAutoSurge = true;
        this.Surge(isAutoSurge, actor, null, "TOCSURGE");
      }
    }

    if (!isAutoSurge) {
      switch (gameType) {
        case "DEFAULT":
          roll = await this.WildMagicSurgeRollCheck();
          isSurge = this.ResultCheck(
            roll.result,
            game.settings.get(`${MODULE_ID}`, `${OPT_CUSTOM_ROLL_RESULT_CHECK}`)
          );
          break;
        case "INCREMENTAL_CHECK":
        case "INCREMENTAL_CHECK_CHAOTIC":
          roll = await this.WildMagicSurgeRollCheck();
          let maxValue =
            game.settings.get(`${MODULE_ID}`, `${OPT_SURGE_TYPE}`) ===
            `INCREMENTAL_CHECK_CHAOTIC`
              ? 10
              : 20;
          const incrementalCheck = new IncrementalCheck(
            actor,
            roll.result,
            maxValue
          );
          isSurge = await incrementalCheck.Check();
          break;
        case "SPELL_LEVEL_DEPENDENT_ROLL":
          roll = await this.WildMagicSurgeRollCheck();
          const spellLevelTrigger = new SpellLevelTrigger();
          isSurge = spellLevelTrigger.Check(roll.result, spellLevel);
          break;
        case "DIE_DESCENDING":
          roll = await this.WildMagicSurgeRollCheck(actor);
          const dieDescending = new DieDescending(actor, roll.result);
          isSurge = await dieDescending.Check();
          break;
        default:
          return;
      }
      this.Surge(isSurge, actor, roll, "WMS");
    }
  }

  async Surge(isSurge, actor, roll, surgeType) {
    switch (surgeType) {
      case "POWM":
        this.rollTableMagicSurge.Check(surgeType);
        break;
      case "TOCSURGE":
        this.rollTableMagicSurge.Check(surgeType);
        this.tidesOfChaos.Check(actor);
        Hooks.callAll("wild-magic-surge-5e.IsWildMagicSurge", {
          surge: true,
        });
        break;
      case "WMS":
        if (isSurge) {
          this.chat.SendChat(
            game.settings.get(`${MODULE_ID}`, `${OPT_AUTO_D20_MSG}`),
            roll
          );
          this.tidesOfChaos.Check(actor);
          this.rollTableMagicSurge.Check();
          Hooks.callAll("wild-magic-surge-5e.IsWildMagicSurge", {
            surge: true,
            result: roll.result,
          });
        } else {
          this.chat.SendChat(
            game.settings.get(`${MODULE_ID}`, `${OPT_AUTO_D20_MSG_NO_SURGE}`),
            roll
          );
          Hooks.callAll("wild-magic-surge-5e.IsWildMagicSurge", {
            surge: false,
            result: roll.result,
          });
        }
        break;
    }
  }

  RunMessageCheck() {
    Hooks.callAll("wild-magic-surge-5e.CheckForSurge", true);
    this.chat.SendChat(game.settings.get(`${MODULE_ID}`, `${OPT_CHAT_MSG}`));
  }
}
