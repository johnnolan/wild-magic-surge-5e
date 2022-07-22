import { MODULE_ID, OPT_AUTO_D20, OPT_ENABLE_NPCS } from "./Settings.js";
import IncrementalCheckChaotic from "./utils/IncrementalCheckChaotic.js";
import SpellParser from "./utils/SpellParser.js";
import Chat from "./Chat.js";

/**
 * Main entry point for Wild Magic Surge Checks
 * @class RoundCheck
 * @example
 * let roundCheck = new RoundCheck(actor);
 */
class RoundCheck {
  /**
   * Check for Incrementmenal Check
   * @param {RoundData} roundData - The current round data sent from the updateCombat Hook.
   * @constructs RoundCheck
   */
  constructor() {
    this.spellParser = new SpellParser();
    this.chat = new Chat();
  }

  /**
   * Checks for and does an incremental check for a surge on a new combat round
   * @public
   * @return {Promise<void>}
   * @param {RoundData} roundData - The current round data sent from the updateCombat Hook.
   */
  async Check(roundData) {
    const actor = game.actors.get(roundData.combatant.actor.id);
    if (!actor) {
      return false;
    }

    if (game.settings.get(`${MODULE_ID}`, `${OPT_AUTO_D20}`)) {
      if (this.spellParser.IsWildMagicFeat(actor)) {
        const incrementalCheckChaotic = new IncrementalCheckChaotic(actor);
        if (game.settings.get(`${MODULE_ID}`, `${OPT_ENABLE_NPCS}`)) {
          await incrementalCheckChaotic.Check();
        } else {
          if (!this.spellParser.IsNPC(actor)) {
            await incrementalCheckChaotic.Check();
          }
        }
      }
    } else {
      await this.chat.RunMessageCheck();
    }
  }
}

export default RoundCheck;
