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
    // @ts-expect-error TS(2304): Cannot find name 'game'.
    if (!game.settings.get(`${MODULE_ID}`, `${OPT_ROLLTABLE_ENABLE}`)) {
      return;
    }
    let rollTableName: any;
    if (type === "POWM") {
      // @ts-expect-error TS(2304): Cannot find name 'game'.
      rollTableName = game.settings.get(
        `${MODULE_ID}`,
        `${OPT_POWM_ROLLTABLE_NAME}`
      );
    } else {
      // @ts-expect-error TS(2304): Cannot find name 'game'.
      rollTableName = game.settings.get(
        `${MODULE_ID}`,
        `${OPT_ROLLTABLE_NAME}`
      );
    }
    if (rollTableName === undefined) {
      return;
    }

    // @ts-expect-error TS(2304): Cannot find name 'game'.
    const surgeRollTable = game.tables.find((t: any) => t.name === rollTableName);

    await surgeRollTable.roll().then((result: any) => {
      let chat = new Chat();
      chat.Send(CHAT_TYPE.TABLE, result, surgeRollTable);
    });
  }
}

export default RollTableMagicSurge;
