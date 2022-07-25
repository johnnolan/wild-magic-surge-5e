import {
  OPT_ROLLTABLE_ENABLE,
  OPT_ROLLTABLE_NAME,
  OPT_POWM_ROLLTABLE_NAME,
  MODULE_ID,
  CHAT_TYPE,
} from "./Settings.js";
import Chat from "./Chat.js";

/**
 * Finds, rolls and sends to chat the correct RollTable based on Surge Type and custom table name settings
 * @class RollTableMagicSurge
 * @example
 * let rollTableMagicSurge = new RollTableMagicSurge();
 */
class RollTableMagicSurge {
  constructor() {
    // This is intentional
  }

  /**
   * Checks and rolls on the correct table
   * @public
   * @return {Promise<void>}
   * @param {string} type The type of RollTable to use (WMS or POWM).
   */
  async Check(type = "WMS") {
    if (!game.settings.get(`${MODULE_ID}`, `${OPT_ROLLTABLE_ENABLE}`)) {
      return;
    }
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
    if (rollTableName === undefined) {
      return;
    }

    const surgeRollTable = game.tables.find((t) => t.name === rollTableName);

    await surgeRollTable.roll().then((result) => {
      let chat = new Chat();
      chat.Send(CHAT_TYPE.TABLE, result, surgeRollTable);
    });
  }
}

export default RollTableMagicSurge;
