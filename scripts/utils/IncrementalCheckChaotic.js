import { MODULE_ID, OPT_INCREMENTAL_CHECK_TO_CHAT } from "../Settings.js";
import Chat from "../Chat.js";

export default class IncrementalCheck {
  constructor(actor) {
    this.chat = new Chat();
    this.actor = actor;
    this.maxValue = 10;
    this.defaultValue = {
      max: 20,
      min: 1,
      value: 1,
    };
    this.FLAG_NAME = "wild-magic-surge-5e";
    this.FLAG_OPTION = "surge_increment_resource";
  }

  async CallChanged(value) {
    Hooks.callAll("wild-magic-surge-5e.IncrementalCheckChanged", value);

    if (game.settings.get(`${MODULE_ID}`, `${OPT_INCREMENTAL_CHECK_TO_CHAT}`)) {
      this.chat.SendChat(
        `${game.i18n.format(
          "WildMagicSurge5E.opt_incremental_check_to_chat_text_name"
        )} ${value}`
      );
    }
  }

  async SetupDefault() {
    await this.actor.setFlag(
      this.FLAG_NAME,
      this.FLAG_OPTION,
      this.defaultValue
    );
    this.CallChanged(1);
    return this.rollValue === 1;
  }

  async Check() {
    if (!this.actor) {
      return;
    }

    if (!this.actor.data.flags.hasOwnProperty(this.FLAG_NAME)) {
      return await this.SetupDefault();
    }

    let incrementLevel = await this.actor.getFlag(
      this.FLAG_NAME,
      this.FLAG_OPTION
    );

    if (!incrementLevel) {
      return await this.SetupDefault();
    }

    if (incrementLevel.value !== this.maxValue) {
      incrementLevel.value = incrementLevel.value + 1;
      await this.actor.setFlag(
        this.FLAG_NAME,
        this.FLAG_OPTION,
        incrementLevel
      );
      this.CallChanged(incrementLevel.value);
    }

    return false;
  }
}
