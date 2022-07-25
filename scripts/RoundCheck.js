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
   * @param {Actor} actor - The Actor to check against.
   * @constructs RoundCheck
   */
  constructor(actor) {
    this.spellParser = new SpellParser(actor);
    this.chat = new Chat();
    this._actor = actor;
  }

  /**
   * Checks for and does an incremental check for a surge on a new combat round
   * @public
   * @return {Promise<void>}
   */
  async Check() {
    if (game.settings.get(`${MODULE_ID}`, `${OPT_AUTO_D20}`)) {
      if (this.spellParser.IsWildMagicFeat()) {
        const incrementalCheckChaotic = new IncrementalCheckChaotic(
          this._actor
        );
        if (game.settings.get(`${MODULE_ID}`, `${OPT_ENABLE_NPCS}`)) {
          await incrementalCheckChaotic.Check();
        } else {
          if (!this.spellParser.IsNPC()) {
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
