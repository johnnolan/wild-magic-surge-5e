import { MODULE_ID, OPT_AUTO_D20, OPT_ENABLE_NPCS } from "./Settings";
import IncrementalCheck from "./utils/IncrementalCheck";
import SpellParser from "./utils/SpellParser";
import Chat from "./Chat";

/**
 * Checks for Incremental surge on each round
 * @class RoundCheck
 */
class RoundCheck {
  /**
   * Checks for and does an incremental check for a surge on a new combat round
   * @return {Promise<void>}
   */
  static async Check(actor: Actor): Promise<void> {
    if (game.settings.get(`${MODULE_ID}`, `${OPT_AUTO_D20}`)) {
      if (SpellParser.IsWildMagicFeat(actor)) {
        if (game.settings.get(`${MODULE_ID}`, `${OPT_ENABLE_NPCS}`)) {
          await IncrementalCheck.Check(actor, undefined, 10);
        } else {
          if (!SpellParser.IsNPC(actor)) {
            await IncrementalCheck.Check(actor, undefined, 10);
          }
        }
      }
    } else {
      await Chat.RunMessageCheck();
    }
  }
}

export default RoundCheck;
