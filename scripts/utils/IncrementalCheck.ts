import {
  MODULE_ID,
  OPT_INCREMENTAL_CHECK_TO_CHAT,
  CHAT_TYPE,
} from "../Settings";
import Chat from "../Chat";

export default class IncrementalCheck {
  FLAG_NAME: any;
  FLAG_OPTION: any;
  actor: any;
  chat: any;
  defaultValue: any;
  maxValue: any;
  rollValue: any;
  constructor(actor: any, rollValue: any, maxValue = 20) {
    this.chat = new Chat();
    this.actor = actor;
    this.rollValue = rollValue;
    this.maxValue = maxValue;
    this.defaultValue = {
      max: 20,
      min: 1,
      value: 1,
    };
    this.FLAG_NAME = "wild-magic-surge-5e";
    this.FLAG_OPTION = "surge_increment_resource";
  }

  async Reset() {
    this.SetupDefault();
  }

  async CallChanged(value: any) {
    Hooks.callAll("wild-magic-surge-5e.IncrementalCheckChanged", value);

    if (game.settings.get(`${MODULE_ID}`, `${OPT_INCREMENTAL_CHECK_TO_CHAT}`)) {
      this.chat.Send(
        CHAT_TYPE.DEFAULT,
        `${(game as any).i18n.format(
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

  async Check(): Promise<boolean> {
    if (!this.actor) {
      return false;
    }

    if (!this.actor.flags.hasOwnProperty(this.FLAG_NAME)) {
      return this.SetupDefault();
    }

    const incrementLevel = await this.actor.getFlag(
      this.FLAG_NAME,
      this.FLAG_OPTION
    );

    if (!incrementLevel) {
      return this.SetupDefault();
    }

    if (this.rollValue !== null && this.rollValue <= incrementLevel.value) {
      await this.actor.setFlag(
        this.FLAG_NAME,
        this.FLAG_OPTION,
        this.defaultValue
      );
      this.CallChanged(1);
      return true;
    } else {
      if (incrementLevel.value !== this.maxValue) {
        incrementLevel.value = incrementLevel.value + 1;
        await this.actor.setFlag(
          this.FLAG_NAME,
          this.FLAG_OPTION,
          incrementLevel
        );
        this.CallChanged(incrementLevel.value);
      }
    }

    return false;
  }
}
