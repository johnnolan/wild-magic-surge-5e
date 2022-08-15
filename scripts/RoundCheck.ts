import { MODULE_ID, OPT_AUTO_D20, OPT_ENABLE_NPCS } from "./Settings";
import IncrementalCheck from "./utils/IncrementalCheck";
import SpellParser from "./utils/SpellParser";
import Chat from "./Chat";

/**
 * Checks for Incremental surge on each round
 * @class RoundCheck
 * @example
 * let roundCheck = new RoundCheck(actor);
 */
class RoundCheck {
  _actor: Actor;
  /**
   * Check for Incrementmenal Check
   * @param actor - The Actor to check against.
   * @constructs RoundCheck
   */
  constructor(actor: Actor) {
    this._actor = actor;
  }

  /**
   * Checks for and does an incremental check for a surge on a new combat round
   * @return {Promise<void>}
   */
  async Check(): Promise<void> {
    if (game.settings.get(`${MODULE_ID}`, `${OPT_AUTO_D20}`)) {
      if (SpellParser.IsWildMagicFeat(this._actor)) {
        const incrementalCheck = new IncrementalCheck(this._actor, null, 10);
        if (game.settings.get(`${MODULE_ID}`, `${OPT_ENABLE_NPCS}`)) {
          await incrementalCheck.Check();
        } else {
          if (!SpellParser.IsNPC(this._actor)) {
            await incrementalCheck.Check();
          }
        }
      }
    } else {
      await Chat.RunMessageCheck();
    }
  }
}

export default RoundCheck;
