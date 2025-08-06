import { WMSCONST } from "./WMSCONST";

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
    if (!game.settings.get(`${WMSCONST.MODULE_ID}`, `${WMSCONST.OPT_ENABLE_TOC}`)) {
      return;
    }
    const tidesItem = await this.getTidesOfChaosItem(actor);
    if (!tidesItem) return;

    const updates = [{
      _id: tidesItem.id,
      "system.uses.value": 1,
      "system.recharge.charged": true
    }];

    await actor.items.update(updates);
  }

  /**
   * Checks to see if Tides of Chaos has been used
   * @public
   * @return {Promise<boolean>}
   * @param actor - The Foundry Actor.
   */
  static async IsTidesOfChaosUsed(actor: Actor): Promise<boolean> {
    const tidesItem = await this.getTidesOfChaosItem(actor);
    if (!tidesItem) return false;
    return tidesItem.system.uses.value === 0;
  }

  /**
   * Returns whether Tides of Chaos is setup correctly.
   * @return {Promise<TidesItemData>}
   * @param actor - The Foundry Actor.
   */
  static async IsTidesOfChaosSetup(actor: Actor): Promise<TidesItemData> {
    const featName = game.settings.get(
      `${WMSCONST.MODULE_ID}`,
      `${WMSCONST.OPT_TOC_NAME}`
    );
    const tidesItem = await this.getTidesOfChaosItem(actor);
    const hasUsesSetup = !!tidesItem && tidesItem.system.uses?.max === 1;
    
    return <TidesItemData>{
      hasTidesOfChaosResource: hasUsesSetup,
      hasTidesOfChaosFeat: !!tidesItem,
      isValid: hasUsesSetup
    };
  }

  /**
   * Fetches the actors Tides of Chaos data. If not available, returns undefined.
   * @return {Promise<TidesItemData>}
   * @param actor - The Foundry Actor.
   */
  static async getTidesOfChaosItem(actor: Actor) {
    const featName = game.settings.get(
      `${WMSCONST.MODULE_ID}`,
      `${WMSCONST.OPT_TOC_NAME}`
    );
    return actor.items.find(
      (a: Item) => a.name === featName && a.type === "feat"
    );
  }
}

export default TidesOfChaos;
