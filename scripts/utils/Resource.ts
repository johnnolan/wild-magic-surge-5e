import { getModuleSetting } from "./TypedSettings";
import { WMSCONST } from "../WMSCONST";
import { GetDnd5eResource } from "./Dnd5eSystem";
import {
  getModuleActorFlag,
  setModuleActorFlag,
} from "./TypedSettings";
import type { WMSModuleResourceFlagKey } from "./TypedSettings";
import type { Dnd5eResourceSlot } from "./Dnd5eSystem";

export default class Resource {
  static FLAG_NAME = WMSCONST.MODULE_ID;
  static FLAG_OPTION: WMSModuleResourceFlagKey = "resource";
  static defaultValue: ResourceValue = {
    label: "Surge Chance",
    lr: false,
    sr: false,
    max: 20,
    value: 1,
  };

  static async Reset(actor: Actor) {
    await this._setupDefault(actor);
  }

  static async GetResource(actor: Actor): Promise<ResourceValue> {
    const resourceType = getModuleSetting(WMSCONST.OPT_RESOURCE_TYPE);

    let resource: ResourceValue | undefined;

    switch (resourceType) {
      case "NONE":
        resource = await getModuleActorFlag(actor, this.FLAG_OPTION);
        break;
      case "PRIMARY":
        resource = this.getSystemResource(actor, "primary");
        break;
      case "SECONDARY":
        resource = this.getSystemResource(actor, "secondary");
        break;
      case "TERTIARY":
        resource = this.getSystemResource(actor, "tertiary");
        break;
    }

    if (!resource) {
      resource = { ...this.defaultValue };
      await this._setupDefault(actor);
    }

    return { ...resource };
  }

  static async SetResource(actor: Actor, resourceValues: ResourceValues) {
    const resourceType = getModuleSetting(WMSCONST.OPT_RESOURCE_TYPE);
    const resourceValue: ResourceValue = {
      ...this.defaultValue,
      max: resourceValues.max,
      value: resourceValues.value,
    };

    switch (resourceType) {
      case "NONE":
        await setModuleActorFlag(actor, this.FLAG_OPTION, resourceValue);
        break;
      case "PRIMARY":
        await actor.update({
          "system.resources.primary": resourceValue,
        });
        break;
      case "SECONDARY":
        await actor.update({
          "system.resources.secondary": resourceValue,
        });
        break;
      case "TERTIARY":
        await actor.update({
          "system.resources.tertiary": resourceValue,
        });
        break;
    }
  }

  static async _setupDefault(actor: Actor): Promise<ResourceValue> {
    let maxValue = 20;
    switch (
      getModuleSetting(WMSCONST.OPT_SURGE_TYPE)
    ) {
      case `INCREMENTAL_CHECK_CHAOTIC`:
        maxValue = 10;
        break;
      case `DIE_DESCENDING`:
        maxValue = 6;
        break;
    }
    const resource: ResourceValue = {
      ...this.defaultValue,
      max: maxValue,
      value: 1,
    };
    await this.SetResource(actor, resource);
    return resource;
  }

  private static getSystemResource(
    actor: Actor,
    slot: Dnd5eResourceSlot,
  ): ResourceValue | undefined {
    return GetDnd5eResource(actor.system, slot);
  }
}
