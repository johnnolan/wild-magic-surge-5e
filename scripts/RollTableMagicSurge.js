import {
  OPT_ROLLTABLE_ENABLE,
  OPT_ROLLTABLE_NAME,
  MODULE_ID,
} from "./Settings.js";

export async function RollTableMagicSurge() {
  if (
    !game.settings.get(`${MODULE_ID}`, `${OPT_ROLLTABLE_ENABLE}`) ||
    game.settings.get(`${MODULE_ID}`, `${OPT_ROLLTABLE_NAME}`) === undefined
  ) {
    return;
  }

  const surgeRollTable = game.tables.entities.find(
    (t) => t.name === game.settings.get(`${MODULE_ID}`, `${OPT_ROLLTABLE_NAME}`)
  );
  surgeRollTable.draw();
}
