import {
  OPT_ROLLTABLE_ENABLE,
  OPT_ROLLTABLE_NAME,
  OPT_POWM_ROLLTABLE_NAME,
  MODULE_ID,
  CHAT_TYPE,
} from "./Settings";
import Chat from "./Chat";

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
   * @param type - The type of RollTable to use (WMS or POWM).
   */
  async Check(type = "WMS"): Promise<void> {
    if (!game.settings.get(`${MODULE_ID}`, `${OPT_ROLLTABLE_ENABLE}`)) {
      return;
    }
    let rollTableName: string;
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

    const surgeRollTable = game.tables.find(
      (t: any) => t.name === rollTableName
    );

    await surgeRollTable?.roll().then((result: Roll) => {
      const chat = new Chat();
      // @ts-expect-error TS(2345): Argument of type '{ name: string; roll: Mock<any, ... Remove this comment to see the full error message
      chat.Send(CHAT_TYPE.TABLE, result, surgeRollTable);
    });
  }
}

export default RollTableMagicSurge;
