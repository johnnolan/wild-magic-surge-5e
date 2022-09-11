import Logger from "./Logger";
import { WMSCONST } from "./WMSCONST";

/**
 * Runs a macro
 * @class TriggerMacro
 */
class TriggerMacro {
  static async Run(actorId: string, tokenId: string): Promise<void> {
    const macroName = game.settings.get(
      `${WMSCONST.MODULE_ID}`,
      `${WMSCONST.OPT_TRIGGERMACRO_NAME}`
    );
    if (
      !game.settings.get(
        `${WMSCONST.MODULE_ID}`,
        `${WMSCONST.OPT_TRIGGERMACRO_ENABLE}`
      ) ||
      !macroName
    ) {
      return;
    }

    const macro: Macro = game.macros.find(
      (f) => f.name === macroName && f.isOwner
    );
    if (!macro) {
      Logger.error(
        `Trigger Macro ${macroName} does not exist.`,
        "TriggerMacro.Run",
        macroName
      );
      return;
    }

    const actor: Actor = game.actors?.get(actorId);
    const token: Token = canvas.tokens?.get(tokenId);

    macro.execute({ actor: actor, token: token });
  }
}

export default TriggerMacro;
