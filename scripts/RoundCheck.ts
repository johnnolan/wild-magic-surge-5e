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
        const incrementalCheck = new IncrementalCheck(actor, null, 10);
        if (game.settings.get(`${MODULE_ID}`, `${OPT_ENABLE_NPCS}`)) {
          await incrementalCheck.Check();
        } else {
          if (!SpellParser.IsNPC(actor)) {
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
