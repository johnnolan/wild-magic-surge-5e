/**
 * Runs a macro
 * @class TriggerMacro
 */
class TriggerMacro {
  static async Run() {
    const macroName = "WMSMacro";

    const macro = game.macros.find((f) => f.name === macroName && f.isOwner);

    macro.execute();
  }
}

export default TriggerMacro;
