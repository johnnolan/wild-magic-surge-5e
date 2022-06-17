import { MODULE_ID, OPT_ENABLE_TOC, OPT_TOC_NAME } from "./Settings.js";

export default class TidesOfChaos {
  constructor() {}

  async Check(actor) {
    if (!game.settings.get(`${MODULE_ID}`, `${OPT_ENABLE_TOC}`)) {
      return;
    }

    const tidesItem = actor.data.items.find(
      (a) =>
        a.name === game.settings.get(`${MODULE_ID}`, `${OPT_TOC_NAME}`) &&
        a.type === "feat"
    );

    if (tidesItem === undefined) {
      return;
    }

    let isLolDataData = false;

    let resourceName = tidesItem?.data?.data?.consume?.target;

    if (!resourceName) return false;

    let updates = [];
    updates.push({
      _id: tidesItem.id,
      "data.uses.value": 1,
      "data.recharge.charged": true,
    });

    if (isLolDataData) {
      await actor.updateEmbeddedEntity("OwnedItem", updates);
    } else {
      await actor.update({ items: updates });
    }
    await actor.update({ data: { [`${resourceName}`]: 1 } });
  }

  async IsTidesOfChaosUsed(actor) {
    const tidesItem = actor.data.items.find(
      (a) =>
        a.name === game.settings.get(`${MODULE_ID}`, `${OPT_TOC_NAME}`) &&
        a.type === "feat"
    );

    if (tidesItem === undefined) {
      // If not enabled or exists then return false indicating not used.
      return false;
    }

    if (!tidesItem?.data?.data?.consume?.target) {
      // If not enabled or exists then return false indicating not used.
      return false;
    }

    if (tidesItem.data.data.uses.value === 0) {
      return true;
    }

    return false;
  }
}
