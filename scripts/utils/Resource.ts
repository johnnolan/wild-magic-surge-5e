import { WMSCONST } from "../WMSCONST";

export default class Resource {
  static FLAG_NAME = "wild-magic-surge-5e";
  static FLAG_OPTION = "resource";
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
    const resourceType = game.settings.get(
      `${WMSCONST.MODULE_ID}`,
      `${WMSCONST.OPT_RESOURCE_TYPE}`,
    );

    switch (resourceType) {
      case "NONE":
        return <ResourceValue>actor.getFlag(this.FLAG_NAME, this.FLAG_OPTION);
      case "PRIMARY":
        return actor.system.resources.primary;
      case "SECONDARY":
        return actor.system.resources.secondary;
      case "TERTIARY":
        return actor.system.resources.tertiary;
      default:
        return this.defaultValue;
    }
  }

  static async SetResource(actor: Actor, resourceValues: ResourceValues) {
    const resourceType = game.settings.get(
      `${WMSCONST.MODULE_ID}`,
      `${WMSCONST.OPT_RESOURCE_TYPE}`,
    );
    const resourceValue = this.defaultValue;
    resourceValue.max = resourceValues.max;
    resourceValue.value = resourceValues.value;

    switch (resourceType) {
      case "NONE":
        actor.setFlag(this.FLAG_NAME, this.FLAG_OPTION, resourceValue);
        break;
      case "PRIMARY":
        actor.update({
          "system.resources.primary": resourceValue,
        });
        break;
      case "SECONDARY":
        actor.update({
          "system.resources.secondary": resourceValue,
        });
        break;
      case "TERTIARY":
        actor.update({
          "system.resources.tertiary": resourceValue,
        });
        break;
    }
  }

  static async _setupDefault(actor: Actor): Promise<void> {
    let maxValue = 20;
    switch (
      game.settings.get(`${WMSCONST.MODULE_ID}`, `${WMSCONST.OPT_SURGE_TYPE}`)
    ) {
      case `INCREMENTAL_CHECK_CHAOTIC`:
        maxValue = 10;
        break;
      case `DIE_DESCENDING`:
        maxValue = 6;
        break;
    }
    await this.SetResource(actor, {
      max: maxValue,
      value: 1,
    });
  }
}
