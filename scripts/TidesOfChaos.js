import { MODULE_ID, OPT_ENABLE_TOC, OPT_TOC_RECHARGE_MSG } from "./Settings.js";
import { SendChat } from "./Chat.js";

export async function TidesOfChaos(actor) {
  if (!game.settings.get(`${MODULE_ID}`, `${OPT_ENABLE_TOC}`)) {
    return;
  }

  const tidesItem = actor.data.items.find(
    (a) => a.name === "Tides of Chaos" && a.type === "feat"
  );

  if (tidesItem === undefined) {
    return;
  }

  let updates = [];

  // If betterRolls5e is enabled, set the following to ensure the spell recharges
  if (tidesItem.flags["betterRolls5e"]) {
    updates.push({
      _id: tidesItem._id,
      "data.uses.value": 1,
      "data.recharge.charged": true,
      "flags.betterRolls5e.quickCharges.value.use": false,
      "flags.betterRolls5e.quickCharges.value.resource": false,
      "flags.betterRolls5e.quickCharges.value.charge": true,
      "flags.betterRolls5e.quickCharges.altValue.use": false,
      "flags.betterRolls5e.quickCharges.altValue.resource": false,
      "flags.betterRolls5e.quickCharges.altValue.charge": true,
    });
  } else {
    updates.push({
      _id: tidesItem._id,
      "data.uses.value": 1,
      "data.recharge.charged": true,
    });
  }

  await actor.updateEmbeddedEntity("OwnedItem", updates);
  SendChat(game.settings.get(`${MODULE_ID}`, `${OPT_TOC_RECHARGE_MSG}`));
}
