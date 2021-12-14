import { MODULE_FLAG_NAME, DIE_DESCENDING_FLAG_OPTION } from "../Settings.js";

export default class DieDescending {
  constructor(actor, rollValue) {
    this.actor = actor;
    this.rollValue = rollValue;
    this.defaultValue = {
      value: "1d20",
    };
  }

  async CallChanged(value) {
    Hooks.callAll("wild-magic-surge-5e.DieDescendingChanged", value);
  }

  async SetupDefault() {
    await this.actor.setFlag(
      MODULE_FLAG_NAME,
      DIE_DESCENDING_FLAG_OPTION,
      this.defaultValue
    );
    this.CallChanged(this.defaultValue);
    return this.rollValue === "1";
  }

  async Check() {
    if (!this.actor) {
      return;
    }

    if (!this.actor.data.flags.hasOwnProperty(MODULE_FLAG_NAME)) {
      return await this.SetupDefault();
    }

    let flagValue = await this.actor.getFlag(
      MODULE_FLAG_NAME,
      DIE_DESCENDING_FLAG_OPTION
    );

    if (!flagValue) {
      return await this.SetupDefault();
    }

    if (this.rollValue === "1") {
      return await this.SetupDefault();
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

      await this.actor.setFlag(
        MODULE_FLAG_NAME,
        DIE_DESCENDING_FLAG_OPTION,
        flagValue
      );
      this.CallChanged(flagValue.value);
    }

    return false;
  }
}
