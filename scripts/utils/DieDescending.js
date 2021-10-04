//import { MODULE_ID, OPT_INCREMENTAL_CHECK_TO_CHAT } from "../Settings.js";
//import Chat from "../Chat.js";
import { MODULE_FLAG_NAME, DIE_DESCENDING_FLAG_OPTION } from "../Settings.js";

export default class DieDescending {
  constructor(actor, rollValue) {
    //this.chat = new Chat();
    this.actor = actor;
    this.rollValue = rollValue;
    this.defaultValue = {
      value: "d20",
    };
  }

  async CallChanged(value) {
    Hooks.callAll("wild-magic-surge-5e.DieDescendingChanged", value);

    /*if (game.settings.get(`${MODULE_ID}`, `${OPT_INCREMENTAL_CHECK_TO_CHAT}`)) {
      this.chat.SendChat(
        `${game.i18n.format(
          "WildMagicSurge5E.opt_incremental_check_to_chat_text_name"
        )} ${value}`
      );
    }*/
  }

  async SetupDefault() {
    await this.actor.setFlag(
      MODULE_FLAG_NAME,
      DIE_DESCENDING_FLAG_OPTION,
      this.defaultValue
    );
    this.CallChanged(this.defaultValue);
    return this.rollValue === 1;
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

    if (this.rollValue === 1) {
      return await this.SetupDefault();
    } else {
      switch (flagValue.value) {
        case "d20":
          flagValue.value = "d12";
          break;
        case "d12":
          flagValue.value = "d10";
          break;
        case "d10":
          flagValue.value = "d8";
          break;
        case "d8":
          flagValue.value = "d6";
          break;
        case "d6":
          flagValue.value = "d4";
          break;
        case "d4":
          flagValue.value = "d4";
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
