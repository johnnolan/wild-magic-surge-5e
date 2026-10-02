import { getModuleSetting } from "./TypedSettings";
import { WMSCONST } from "../WMSCONST";
import Chat from "../Chat";
import CallHooks from "./CallHooks";
import Resource from "./Resource";
import type { ResourceValue } from "../types/domain";
import type { WMSModuleResourceFlagKey } from "./TypedSettings";

export default class IncrementalCheck extends Resource {
  static FLAG_NAME = WMSCONST.MODULE_ID;
  static FLAG_OPTION: WMSModuleResourceFlagKey = "surge_increment_resource";
  static defaultValue: Readonly<ResourceValue> = Object.freeze({
    label: "Surge Chance",
    lr: false,
    sr: false,
    max: 20,
    value: 1,
  });

  static async _callChanged(value: number) {
    CallHooks.Call("IncrementalCheckChanged", { value: value });

    if (
      getModuleSetting(WMSCONST.OPT_INCREMENTAL_CHECK_TO_CHAT)
    ) {
      await Chat.Send(
        WMSCONST.CHAT_TYPE.DEFAULT,
        `${game.i18n.format(
          "WildMagicSurge5E.opt_incremental_check_to_chat_text_name",
        )} ${value}`,
      );
    }
  }

  static async Check(
    actor: Actor,
    rollValue?: number,
    maxValue = 20,
  ): Promise<boolean> {
    const resourceValue: ResourceValue = await this.GetResource(actor);

    if (
      !resourceValue ||
      (rollValue !== undefined && rollValue <= resourceValue.value)
    ) {
      this._setupDefault(actor);
      return true;
    } else {
      if (resourceValue.value !== maxValue) {
        resourceValue.value = resourceValue.value + 1;
        await this.SetResource(actor, {
          max: maxValue,
          value: resourceValue.value,
        });
        await this._callChanged(resourceValue.value);
      }
    }

    return false;
  }

  static async OverrideResource(actor: Actor, resourceNumber: number): Promise<void> {
    await this.SetResource(actor, {
        max: 20,
        value: resourceNumber,
      });
      const resourceValue = await this.GetResource(actor);
      await this._callChanged(resourceValue.value);
  }
}
