import {
  OPT_ROLLTABLE_ENABLE,
  OPT_ROLLTABLE_NAME,
  OPT_POWM_ROLLTABLE_NAME,
  MODULE_ID,
  CHAT_TYPE,
} from "./Settings.js";
import Chat from "./Chat.js";

export default class RollTableMagicSurge {
  constructor() {}

  async Check(type = "WMS") {
    let rollTableName;
    if (type === "POWM") {
      rollTableName = game.settings.get(
        `${MODULE_ID}`,
        `${OPT_POWM_ROLLTABLE_NAME}`
      );
    } else {
      rollTableName = game.settings.get(
        `${MODULE_ID}`,
        `${OPT_ROLLTABLE_NAME}`
      );
    }
    if (
      !game.settings.get(`${MODULE_ID}`, `${OPT_ROLLTABLE_ENABLE}`) ||
      rollTableName === undefined
    ) {
      return;
    }

    const surgeRollTable = game.tables.find((t) => t.name === rollTableName);

    await surgeRollTable.roll().then((result) => {
      let chat = new Chat();
      chat.Send(CHAT_TYPE.TABLE, result, surgeRollTable);
    });
  }
}
