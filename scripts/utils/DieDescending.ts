import { WMSCONST } from "../WMSCONST";
import CallHooks from "./CallHooks";

export default class DieDescending {
  static defaultValue: FlagValue = {
    value: 1,
    min: 1,
    max: 6,
    dieValue: WMSCONST.DIE_VALUE.D20,
  };

  private static async CallChanged(value: FlagValue): Promise<void> {
    CallHooks.Call("DieDescendingChanged", value);
  }

  static async SetFlagResource(actor: Actor, value: FlagValue) {
    await actor.setFlag(
      WMSCONST.MODULE_FLAG_NAME,
      WMSCONST.DIE_DESCENDING_FLAG_OPTION,
      value
    );
    await actor.update({
      "data.resources.wmsurgedescending": value,
    });
  }

  static async GetFlagResource(actor: Actor): Promise<FlagValue | undefined> {
    return <FlagValue>(
      await actor.getFlag(
        WMSCONST.MODULE_FLAG_NAME,
        WMSCONST.DIE_DESCENDING_FLAG_OPTION
      )
    );
  }

  private static async SetupDefault(
    actor: Actor,
    rollValue: string
  ): Promise<boolean> {
    this.SetFlagResource(actor, this.defaultValue);
    this.CallChanged(this.defaultValue);
    return rollValue === "1";
  }

  static async Check(actor: Actor, rollValue: string): Promise<boolean> {
    if (!actor) {
      return false;
    }

    if (!hasProperty(actor, `flags.${WMSCONST.MODULE_FLAG_NAME}`)) {
      return this.SetupDefault(actor, rollValue);
    }

    const flagValue = await this.GetFlagResource(actor);

    if (!flagValue || !flagValue.dieValue) {
      return this.SetupDefault(actor, rollValue);
    }

    if (rollValue === "1") {
      return this.SetupDefault(actor, rollValue);
    } else {
      switch (flagValue.dieValue) {
        case WMSCONST.DIE_VALUE.D20:
          flagValue.value = 2;
          flagValue.dieValue = WMSCONST.DIE_VALUE.D12;
          break;
        case WMSCONST.DIE_VALUE.D12:
          flagValue.value = 3;
          flagValue.dieValue = WMSCONST.DIE_VALUE.D10;
          break;
        case WMSCONST.DIE_VALUE.D10:
          flagValue.value = 4;
          flagValue.dieValue = WMSCONST.DIE_VALUE.D8;
          break;
        case WMSCONST.DIE_VALUE.D8:
          flagValue.value = 5;
          flagValue.dieValue = WMSCONST.DIE_VALUE.D6;
          break;
        case WMSCONST.DIE_VALUE.D6:
        case WMSCONST.DIE_VALUE.D4:
          flagValue.value = 6;
          flagValue.dieValue = WMSCONST.DIE_VALUE.D4;
          break;
      }

      await this.SetFlagResource(actor, flagValue);
      await this.CallChanged(flagValue);
    }

    return false;
  }
}
