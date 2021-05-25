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

  const resourceName = tidesItem.data.data.consume.target;

  let updates = [];
  updates.push({
    _id: tidesItem._id,
    "data.uses.value": 1,
    "data.recharge.charged": true,
  });

  await actor.update({ data: { [resourceName]: 1 }, items: updates });
  SendChat(game.settings.get(`${MODULE_ID}`, `${OPT_TOC_RECHARGE_MSG}`));
}
