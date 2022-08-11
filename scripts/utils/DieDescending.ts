import { MODULE_FLAG_NAME, DIE_DESCENDING_FLAG_OPTION } from "../Settings";

type FlagValue = {
  value: string;
};

export default class DieDescending {
  _actor: Actor;
  defaultValue: FlagValue;
  rollValue: string;
  constructor(actor: Actor, rollValue: string) {
    this._actor = actor;
    this.rollValue = rollValue;
    this.defaultValue = {
      value: "1d20",
    };
  }

  async CallChanged(value: FlagValue) {
    Hooks.callAll("wild-magic-surge-5e.DieDescendingChanged", value);
  }

  async SetupDefault() {
    await this._actor.setFlag(
      MODULE_FLAG_NAME,
      DIE_DESCENDING_FLAG_OPTION,
      this.defaultValue
    );
    this.CallChanged(this.defaultValue);
    return this.rollValue === "1";
  }

  async Check() {
    if (!this._actor) {
      return false;
    }

    if (!this._actor.flags.hasOwnProperty(MODULE_FLAG_NAME)) {
      return this.SetupDefault();
    }

    const flagValue = <FlagValue>(
      await this._actor.getFlag(MODULE_FLAG_NAME, DIE_DESCENDING_FLAG_OPTION)
    );

    if (!flagValue) {
      return this.SetupDefault();
    }

    if (this.rollValue === "1") {
      return this.SetupDefault();
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

      await this._actor.setFlag(
        MODULE_FLAG_NAME,
        DIE_DESCENDING_FLAG_OPTION,
        flagValue
      );
      await this.CallChanged(flagValue);
    }

    return false;
  }
}
