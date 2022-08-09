import { MODULE_ID, OPT_ENABLE_TOC, OPT_TOC_NAME } from "./Settings.js";

/**
 * Controls the Tides of Chaos feat
 * @class TidesOfChaos
 * @example
 * let tidesOfChaos = new TidesOfChaos();
 */
class TidesOfChaos {
  constructor() {
    // This is intentional
  }

  /**
   * Checks to see if Tides of Chaos has been used and if so recharge it
   * @public
   * @return {Promise<void>}
   * @param {Actor} actor The Foundry Actor.
   */
  async Check(actor: any) {
    if (!game.settings.get(`${MODULE_ID}`, `${OPT_ENABLE_TOC}`)) {
      return;
    }
    const tidesItemData = await this.getTidesOfChaosResource(actor);

    if (tidesItemData === undefined) return false;

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
   * @param {Actor} actor The Foundry Actor.
   */
  async IsTidesOfChaosUsed(actor: any) {
    const tidesItemData = await this.getTidesOfChaosResource(actor);

    if (tidesItemData === undefined) return false;

    return tidesItemData.usesLeft === 0;
  }

  /**
   * Returns whether Tides of Chaos is setup correctly.
   * @return {Promise<TidesItemData>}
   * @param {Actor} actor The Foundry Actor.
   */
  async IsTidesOfChaosSetup(actor: any) {
    let tidesItem = false;
    const featName = game.settings.get(`${MODULE_ID}`, `${OPT_TOC_NAME}`);
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

    return {
      hasTidesOfChaosResource: tidesItem,
      hasTidesOfChaosFeat: hasTidesOfChaosResource,
      isValid: hasTidesOfChaosResource && tidesItem,
    };
  }

  /**
   * Fetches the actors Tides of Chaos data. If not available, returns undefined.
   * @return {Promise<TidesItemData>}
   * @param {Actor} actor The Foundry Actor.
   */
  async getTidesOfChaosResource(actor: any) {
    const featName = game.settings.get(`${MODULE_ID}`, `${OPT_TOC_NAME}`);
    const tidesItem = actor.items.find(
      (a: any) => a.name === featName && a.type === "feat"
    );

    if (tidesItem === undefined) {
      // If not enabled or exists then return false indicating not used.
      return undefined;
    }

    if (!tidesItem?.system?.consume?.target) {
      // If not enabled or exists then return false indicating not used.
      return undefined;
    }

    return {
      usesLeft: tidesItem.system.uses.value,
      id: tidesItem.id,
      resourceName: tidesItem?.system?.consume?.target,
    };
  }
}

export default TidesOfChaos;
