import { WMSCONST } from "./WMSCONST";

type TidesItemData = {
  hasTidesOfChaosResource: boolean;
  hasTidesOfChaosFeat: boolean;
  isValid: boolean;
};

/**
 * Controls the Tides of Chaos feat
 * @class TidesOfChaos
 * @example
 * let tidesOfChaos = new TidesOfChaos();
 */
class TidesOfChaos {
  /**
   * Checks to see if Tides of Chaos has been used and if so recharge it
   * @return {Promise<void>}
   * @param actor - The Foundry Actor.
   */
  static async Check(actor: Actor): Promise<void> {
    if (
      !game.settings.get(`${WMSCONST.MODULE_ID}`, `${WMSCONST.OPT_ENABLE_TOC}`)
    ) {
      return;
    }
    const tidesItemData = await this.getTidesOfChaosResource(actor);

    if (tidesItemData === undefined) return;

    const updates = [];
    updates.push({
      _id: tidesItemData.id,
      "system.uses.value": 1,
      "system.recharge.charged": true,
    });

    await actor.updateEmbeddedDocuments("Item", updates);
    await actor.update({ data: { [`${tidesItemData.resourceName}`]: 1 } });
  }

  /**
   * Checks to see if Tides of Chaos has been used
   * @public
   * @return {Promise<boolean>}
   * @param actor - The Foundry Actor.
   */
  static async IsTidesOfChaosUsed(actor: Actor): Promise<boolean> {
    const tidesItemData = await this.getTidesOfChaosResource(actor);

    if (tidesItemData === undefined) return false;

    return tidesItemData.usesLeft === 0;
  }

  /**
   * Returns whether Tides of Chaos is setup correctly.
   * @return {Promise<TidesItemData>}
   * @param actor - The Foundry Actor.
   */
  static async IsTidesOfChaosSetup(actor: Actor): Promise<TidesItemData> {
    let tidesItem = false;
    const featName = game.settings.get(
      `${WMSCONST.MODULE_ID}`,
      `${WMSCONST.OPT_TOC_NAME}`
    );
    const tidesOfChaosResourceSetup = await this.getTidesOfChaosResource(actor);
    const hasTidesOfChaosResource =
      tidesOfChaosResourceSetup === undefined ? false : true;

    if (hasTidesOfChaosResource) {
      // @ts-expect-error TS(2532): Object is possibly 'undefined'.
      const resourceName = tidesOfChaosResourceSetup.resourceName.split(".");
      if (resourceName.length === 3) {
        tidesItem = actor.system.resources[resourceName[1]].label === featName;
      }
    }

    return <TidesItemData>{
      hasTidesOfChaosResource: tidesItem,
      hasTidesOfChaosFeat: hasTidesOfChaosResource,
      isValid: hasTidesOfChaosResource && tidesItem,
    };
  }

  /**
   * Fetches the actors Tides of Chaos data. If not available, returns undefined.
   * @return {Promise<TidesItemData>}
   * @param actor - The Foundry Actor.
   */
  static async getTidesOfChaosResource(actor: Actor) {
    const featName = game.settings.get(
      `${WMSCONST.MODULE_ID}`,
      `${WMSCONST.OPT_TOC_NAME}`
    );
    const item = actor.items.find(
      (a: Item) => a.name === featName && a.type === "feat"
    );

    if (item === undefined) {
      // If not enabled or exists then return false indicating not used.
      return undefined;
    }

    if (!item?.system?.consume?.target) {
      // If not enabled or exists then return false indicating not used.
      return undefined;
    }

    return {
      usesLeft: item.system.uses.value,
      id: item.id,
      resourceName: item?.system?.consume?.target,
    };
  }
}

export default TidesOfChaos;
