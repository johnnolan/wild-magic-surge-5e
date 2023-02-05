import Logger from "../Logger";
import { WMSCONST } from "../WMSCONST";
import CallHooks from "./CallHooks";
import Resource from "./Resource";

export default class DieDescending extends Resource {
  static defaultValue: ResourceValue = {
    label: "Surge Chance",
    lr: false,
    sr: false,
    max: 6,
    value: 1,
  };

  private static async _callChanged(value: ResourceValue): Promise<void> {
    CallHooks.Call("DieDescendingChanged", value);
  }

  static async DieFormula(actor: Actor): Promise<DieValue> {
    const resourceValue = await this.GetResource(actor);

    switch (resourceValue.value) {
      case 1:
        return WMSCONST.DIE_VALUE.D20;
      case 2:
        return WMSCONST.DIE_VALUE.D12;
      case 3:
        return WMSCONST.DIE_VALUE.D10;
      case 4:
        return WMSCONST.DIE_VALUE.D8;
      case 5:
        return WMSCONST.DIE_VALUE.D6;
      case 6:
      case 7:
        return WMSCONST.DIE_VALUE.D4;
      default:
        return WMSCONST.DIE_VALUE.D20;
    }
  }

  static async Check(actor: Actor, rollValue: number): Promise<boolean> {
    if (!actor) {
      Logger.warn(
        `Missing actor for Die Descending Check`,
        "diedescending.SetupDefault"
      );
      return false;
    }

    const resourceValue = await this.GetResource(actor);

    if (rollValue === 1) {
      await this._setupDefault(actor);
      return true;
    } else {
      switch (resourceValue.value) {
        case 1:
          resourceValue.value = 2;
          break;
        case 2:
          resourceValue.value = 3;
          break;
        case 3:
          resourceValue.value = 4;
          break;
        case 4:
          resourceValue.value = 5;
          break;
        case 5:
          resourceValue.value = 6;
          break;
        case 6:
        case 7:
          resourceValue.value = 6;
          break;
      }

      await this.SetResource(actor, {
        max: 6,
        value: resourceValue.value,
      });
      await this._callChanged(resourceValue);
    }

    return false;
  }
}
