import { WMSCONST } from "../WMSCONST";
import Chat from "../Chat";
import CallHooks from "./CallHooks";

type FlagValue = {
  max: number;
  min: number;
  value: number;
};

export default class IncrementalCheck {
  static FLAG_NAME = "wild-magic-surge-5e";
  static FLAG_OPTION = "surge_increment_resource";
  static defaultValue: FlagValue = {
    max: 20,
    min: 1,
    value: 1,
  };

  static async Reset(actor: Actor) {
    this.SetupDefault(actor);
  }

  static async CallChanged(value: number) {
    CallHooks.Call("IncrementalCheckChanged", { value: value });

    if (
      game.settings.get(
        `${WMSCONST.MODULE_ID}`,
        `${WMSCONST.OPT_INCREMENTAL_CHECK_TO_CHAT}`
      )
    ) {
      Chat.Send(
        WMSCONST.CHAT_TYPE.DEFAULT,
        `${game.i18n.format(
          "WildMagicSurge5E.opt_incremental_check_to_chat_text_name"
        )} ${value}`
      );
    }
  }

  static async SetupDefault(actor: Actor): Promise<boolean> {
    await actor.setFlag(this.FLAG_NAME, this.FLAG_OPTION, this.defaultValue);
    await actor.update({
      "data.resources.wmsurgeincrement": this.defaultValue,
    });
    this.CallChanged(1);
    return true;
  }

  static async Check(
    actor: Actor,
    rollValue?: number,
    maxValue = 20
  ): Promise<boolean> {
    if (!hasProperty(actor, `flags.${this.FLAG_NAME}`)) {
      this.SetupDefault(actor);
      return rollValue === 1;
    }

    const incrementLevel: FlagValue = await actor.getFlag(
      this.FLAG_NAME,
      this.FLAG_OPTION
    );

    if (!incrementLevel) {
      return this.SetupDefault(actor);
    }

    if (rollValue !== undefined && rollValue <= incrementLevel.value) {
      return this.SetupDefault(actor);
    } else {
      if (incrementLevel.value !== maxValue) {
        incrementLevel.value = incrementLevel.value + 1;
        await actor.setFlag(this.FLAG_NAME, this.FLAG_OPTION, incrementLevel);
        await actor.update({
          "data.resources.wmsurgeincrement": incrementLevel,
        });
        this.CallChanged(incrementLevel.value);
      }
    }

    return false;
  }
}
