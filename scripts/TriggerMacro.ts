import { getModuleSetting } from "./utils/TypedSettings";
import Logger from "./Logger";
import { WMSCONST } from "./WMSCONST";

/**
 * Runs a macro
 * @class TriggerMacro
 */
class TriggerMacro {
  static async Run(
    actorId: string | null,
    tokenId: string | undefined,
  ): Promise<void> {
    if (!actorId) return;

    const macroName = getModuleSetting(WMSCONST.OPT_TRIGGERMACRO_NAME);
    if (!getModuleSetting(WMSCONST.OPT_TRIGGERMACRO_ENABLE) || !macroName) {
      return;
    }

    const macro = game.macros?.find((f) => f.name === macroName && f.isOwner);
    if (!macro) {
      Logger.error(
        `Trigger Macro ${macroName} does not exist.`,
        "TriggerMacro.Run",
        macroName,
      );
      return;
    }

    const actor = game.actors?.get(actorId);
    if (!actor) return;
    const token = tokenId ? canvas?.tokens?.get(tokenId) : undefined;

    macro.execute({ actor, token });
  }
}

export default TriggerMacro;
