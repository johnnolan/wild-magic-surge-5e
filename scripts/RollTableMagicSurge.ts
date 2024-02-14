import { WMSCONST } from "./WMSCONST";
import Chat from "./Chat";
import Logger from "./Logger";
import SpellParser from "./utils/SpellParser";

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
    type: SurgeType = WMSCONST.SURGE_FEAT_TYPE.WildMagicSurge,
    actor: Actor | undefined
  ): Promise<string | undefined> {
    if (
      game.settings.get(
        `${WMSCONST.MODULE_ID}`,
        `${WMSCONST.OPT_ROLLTABLE_ENABLE}`,
      ) !== "AUTO"
    ) {
      return;
    }
    if (SpellParser.IsControlledChaosFeat(actor)) {
      let rollTableResults: string;
      rollTableResults = await this.RollOnTable(type) ?? "";
      rollTableResults = rollTableResults + await this.RollOnTable(type);
      return rollTableResults;
    } else {
      return await this.RollOnTable(type);
    }
  }

  static async RollOnTable(
    type: SurgeType = WMSCONST.SURGE_FEAT_TYPE.WildMagicSurge,
  ): Promise<string | undefined> {
    let rollTableName: string;
    if (type === WMSCONST.SURGE_FEAT_TYPE.PathOfWildMagic) {
      rollTableName = game.settings.get(
        `${WMSCONST.MODULE_ID}`,
        `${WMSCONST.OPT_POWM_ROLLTABLE_NAME}`,
      );
    } else {
      rollTableName = game.settings.get(
        `${WMSCONST.MODULE_ID}`,
        `${WMSCONST.OPT_ROLLTABLE_NAME}`,
      );
    }
    if (rollTableName === undefined) {
      Logger.error(
        `No roll table name set in settings`,
        "rolltablemagicsurge.Check",
      );
      return;
    }

    const surgeRollTable = game.tables.find(
      (t: RollTable) => t.name === rollTableName,
    );

    if (!surgeRollTable) {
      Logger.error(
        `No roll table called ${rollTableName} found`,
        "rolltablemagicsurge.Check",
        game.tables,
      );
      return;
    }

    const result = await surgeRollTable?.roll().then((result: Roll) => {
      Chat.Send(WMSCONST.CHAT_TYPE.TABLE, "", result, surgeRollTable);
      return result;
    });

    if (result.results.length > 0) {
      return result.results[0].text;
    } else {
      return;
    }
  }
}

export default RollTableMagicSurge;
