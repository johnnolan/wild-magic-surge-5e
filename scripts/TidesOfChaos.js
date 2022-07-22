import { MODULE_ID, OPT_ENABLE_TOC, OPT_TOC_NAME } from "./Settings.js";

/**
 * Controls the Tides of Chaos feat
 * @class TidesOfChaos
 * @example
 * let tidesOfChaos = new TidesOfChaos();
 */
class TidesOfChaos {
  constructor() {}

  /**
   * Checks to see if Tides of Chaos has been used and if so recharge it
   * @public
   * @return {Promise<void>}
   * @param {Actor} actor The Foundry Actor.
   */
  async Check(actor) {
    if (!game.settings.get(`${MODULE_ID}`, `${OPT_ENABLE_TOC}`)) {
      return;
    }
    const tidesItemData = this.getTidesOfChaosResource(actor);

    if (tidesItemData === undefined) return false;

    let updates = [];
    updates.push({
      _id: tidesItemData.tidesItem.id,
      "data.uses.value": 1,
      "data.recharge.charged": true,
    });

    await actor.update({ items: updates });
    await actor.update({ data: { [`${tidesItemData.resourceName}`]: 1 } });
  }

  /**
   * Checks to see if Tides of Chaos has been used
   * @public
   * @return {Promise<boolean>}
   * @param {Actor} actor The Foundry Actor.
   */
  async IsTidesOfChaosUsed(actor) {
    const tidesItemData = this.getTidesOfChaosResource(actor);

    if (tidesItemData === undefined) return false;

    if (tidesItemData.usesLeft === 0) {
      return true;
    }

    return false;
  }

  /**
   * Fetches the actors Tides of Chaos data. If not available, returns undefined.
   * @return {Promise<TidesItemData>}
   * @param {Actor} actor The Foundry Actor.
   */
  async getTidesOfChaosResource(actor) {
    const tidesItem = actor.data.items.find(
      (a) =>
        a.name === game.settings.get(`${MODULE_ID}`, `${OPT_TOC_NAME}`) &&
        a.type === "feat"
    );

    if (tidesItem === undefined) {
      // If not enabled or exists then return false indicating not used.
      return undefined;
    }

    if (!tidesItem?.data?.data?.consume?.target) {
      // If not enabled or exists then return false indicating not used.
      return undefined;
    }

    return {
      usesLeft: tidesItem.data.data.uses.value,
      tidesItem: tidesItem,
      resourceName: tidesItem?.data?.data?.consume?.target,
    };
  }
}

export default TidesOfChaos;
