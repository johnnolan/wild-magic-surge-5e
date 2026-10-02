import { getModuleSetting } from "./utils/TypedSettings";
import { WMSCONST } from "./WMSCONST";
import IncrementalCheck from "./utils/IncrementalCheck";
import SpellParser from "./utils/SpellParser";
import Chat from "./Chat";

/**
 * Checks for Incremental surge on each round
 * @class RoundCheck
 */
class RoundCheck {
  static async OnCombatUpdate(combat: Combat): Promise<false | void> {
    if (
      getModuleSetting(WMSCONST.OPT_SURGE_TYPE) !== "INCREMENTAL_CHECK_CHAOTIC"
    ) {
      return;
    }

    const actor = combat.combatant?.actor;
    if (!actor) {
      return false;
    }

    await RoundCheck.Check(actor);
  }

  /**
   * Checks for and does an incremental check for a surge on a new combat round
   * @return {Promise<void>}
   */
  static async Check(actor: Actor): Promise<void> {
    if (
      getModuleSetting(WMSCONST.OPT_AUTO_D20)
    ) {
      if (SpellParser.IsWildMagicFeat(actor)) {
        if (
          getModuleSetting(WMSCONST.OPT_ENABLE_NPCS)
        ) {
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
