import { WMSCONST } from "../WMSCONST";

export default class Resource {
  static FLAG_NAME = "wild-magic-surge-5e";
  static FLAG_OPTION = "surge_increment_resource";
  static defaultValue: ResourceValue = {
    label: "Surge Chance",
    lr: false,
    sr: false,
    max: 6,
    value: 1,
  };

  static async Reset(actor: Actor) {
    await this._setupDefault(actor);
  }

  static async GetResource(actor: Actor): Promise<ResourceValue> {
    const resourceType = game.settings.get(
      `${WMSCONST.MODULE_ID}`,
      `${WMSCONST.OPT_RESOURCE_TYPE}`
    );

    switch (resourceType) {
      case WMSCONST.RESOURCE_TYPE.PRIMARY:
        return actor.system.resources.primary;
      case WMSCONST.RESOURCE_TYPE.SECONDARY:
        return actor.system.resources.secondary;
      case WMSCONST.RESOURCE_TYPE.TERTIARY:
        return actor.system.resources.tertiary;
      default:
        return this.defaultValue;
    }
  }

  static async SetResource(actor: Actor, value: ResourceValue) {
    const resourceType = game.settings.get(
      `${WMSCONST.MODULE_ID}`,
      `${WMSCONST.OPT_RESOURCE_TYPE}`
    );

    switch (resourceType) {
      case WMSCONST.RESOURCE_TYPE.NONE:
        return;
      case WMSCONST.RESOURCE_TYPE.PRIMARY:
        actor.update({
          "system.resources.primary": value,
        });
        break;
      case WMSCONST.RESOURCE_TYPE.SECONDARY:
        actor.update({
          "system.resources.secondary": value,
        });
        break;
      case WMSCONST.RESOURCE_TYPE.TERTIARY:
        actor.update({
          "system.resources.tertiary": value,
        });
        break;
    }
  }

  static async _setupDefault(actor: Actor): Promise<void> {
    await this.SetResource(actor, this.defaultValue);
  }
}
