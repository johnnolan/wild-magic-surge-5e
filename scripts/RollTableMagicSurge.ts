import { WMSCONST } from "./WMSCONST";
import Chat from "./Chat";

/**
 * Finds, rolls and sends to chat the correct RollTable based on Surge Type and custom table name settings
 * @class RollTableMagicSurge
 */
class RollTableMagicSurge {
  /**
   * Checks and rolls on the correct table
   * @public
   * @return {Promise<void>}
   * @param type - The type of RollTable to use (WMS or POWM).
   */
  static async Check(
    type: SurgeType = WMSCONST.SURGE_FEAT_TYPE.WildMagicSurge
  ): Promise<void> {
    if (
      !game.settings.get(
        `${WMSCONST.MODULE_ID}`,
        `${WMSCONST.OPT_ROLLTABLE_ENABLE}`
      )
    ) {
      return;
    }
    let rollTableName: string;
    if (type === WMSCONST.SURGE_FEAT_TYPE.PathOfWildMagic) {
      rollTableName = game.settings.get(
        `${WMSCONST.MODULE_ID}`,
        `${WMSCONST.OPT_POWM_ROLLTABLE_NAME}`
      );
    } else {
      rollTableName = game.settings.get(
        `${WMSCONST.MODULE_ID}`,
        `${WMSCONST.OPT_ROLLTABLE_NAME}`
      );
    }
    if (rollTableName === undefined) {
      return;
    }

    const surgeRollTable = game.tables.find(
      (t: RollTable) => t.name === rollTableName
    );

    await surgeRollTable?.roll().then((result: Roll) => {
      Chat.Send(WMSCONST.CHAT_TYPE.TABLE, "", result, surgeRollTable);
    });
  }
}

export default RollTableMagicSurge;
