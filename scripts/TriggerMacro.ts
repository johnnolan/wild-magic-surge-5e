import Logger from "./Logger";
import { WMSCONST } from "./WMSCONST";

/**
 * Runs a macro
 * @class TriggerMacro
 */
class TriggerMacro {
  static async Run(): Promise<void> {
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

    const macro = game.macros.find((f) => f.name === macroName && f.isOwner);
    if (!macro) {
      Logger.error(
        `Trigger Macro ${macroName} does not exist.`,
        "TriggerMacro.Run",
        macroName
      );
      return;
    }

    macro.execute();
  }
}

export default TriggerMacro;
