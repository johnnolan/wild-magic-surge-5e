import { MODULE_FLAG_NAME, DIE_DESCENDING_FLAG_OPTION } from "../Settings";
import CallHooks from "./CallHooks";

type FlagValue = {
  max?: number;
  min?: number;
  value: string;
};

export default class DieDescending {
  static defaultValue: FlagValue = {
    value: "1d20",
  };

  private static async CallChanged(value: FlagValue): Promise<void> {
    CallHooks.Call("DieDescendingChanged", value);
  }

  private static async SetupDefault(
    actor: Actor,
    rollValue: string
  ): Promise<boolean> {
    await actor.setFlag(
      MODULE_FLAG_NAME,
      DIE_DESCENDING_FLAG_OPTION,
      this.defaultValue
    );
    this.CallChanged(this.defaultValue);
    return rollValue === "1";
  }

  static async Check(actor: Actor, rollValue: string): Promise<boolean> {
    if (!actor) {
      return false;
    }

    if (!hasProperty(actor, `flags.${MODULE_FLAG_NAME}`)) {
      return this.SetupDefault(actor, rollValue);
    }

    const flagValue = <FlagValue>(
      await actor.getFlag(MODULE_FLAG_NAME, DIE_DESCENDING_FLAG_OPTION)
    );

    if (!flagValue) {
      return this.SetupDefault(actor, rollValue);
    }

    if (rollValue === "1") {
      return this.SetupDefault(actor, rollValue);
    } else {
      switch (flagValue.value) {
        case "1d20":
          flagValue.value = "1d12";
          break;
        case "1d12":
          flagValue.value = "1d10";
          break;
        case "1d10":
          flagValue.value = "1d8";
          break;
        case "1d8":
          flagValue.value = "1d6";
          break;
        case "1d6":
          flagValue.value = "1d4";
          break;
        case "1d4":
          flagValue.value = "1d4";
          break;
      }

      await actor.setFlag(
        MODULE_FLAG_NAME,
        DIE_DESCENDING_FLAG_OPTION,
        flagValue
      );
      await this.CallChanged(flagValue);
    }

    return false;
  }
}
