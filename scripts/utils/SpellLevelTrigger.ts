import { WMSCONST } from "../WMSCONST";

export default class SpellLevelTrigger {
  static Check(result: number, spellLevel: string): boolean {
    let spellString = "";
    switch (spellLevel) {
      case WMSCONST.SPELL_LEVELS.LEVEL_1:
        spellString = <string>(
          game.settings.get(`${WMSCONST.MODULE_ID}`, `${WMSCONST.OPT_TSL_LVL1}`)
        );
        break;
      case WMSCONST.SPELL_LEVELS.LEVEL_2:
        spellString = <string>(
          game.settings.get(`${WMSCONST.MODULE_ID}`, `${WMSCONST.OPT_TSL_LVL2}`)
        );
        break;
      case WMSCONST.SPELL_LEVELS.LEVEL_3:
        spellString = <string>(
          game.settings.get(`${WMSCONST.MODULE_ID}`, `${WMSCONST.OPT_TSL_LVL3}`)
        );
        break;
      case WMSCONST.SPELL_LEVELS.LEVEL_4:
        spellString = <string>(
          game.settings.get(`${WMSCONST.MODULE_ID}`, `${WMSCONST.OPT_TSL_LVL4}`)
        );
        break;
      case WMSCONST.SPELL_LEVELS.LEVEL_5:
        spellString = <string>(
          game.settings.get(`${WMSCONST.MODULE_ID}`, `${WMSCONST.OPT_TSL_LVL5}`)
        );
        break;
      case WMSCONST.SPELL_LEVELS.LEVEL_6:
        spellString = <string>(
          game.settings.get(`${WMSCONST.MODULE_ID}`, `${WMSCONST.OPT_TSL_LVL6}`)
        );
        break;
      case WMSCONST.SPELL_LEVELS.LEVEL_7:
        spellString = <string>(
          game.settings.get(`${WMSCONST.MODULE_ID}`, `${WMSCONST.OPT_TSL_LVL7}`)
        );
        break;
      case WMSCONST.SPELL_LEVELS.LEVEL_8:
        spellString = <string>(
          game.settings.get(`${WMSCONST.MODULE_ID}`, `${WMSCONST.OPT_TSL_LVL8}`)
        );
        break;
      case WMSCONST.SPELL_LEVELS.LEVEL_9:
        spellString = <string>(
          game.settings.get(`${WMSCONST.MODULE_ID}`, `${WMSCONST.OPT_TSL_LVL9}`)
        );
        break;
      case WMSCONST.SPELL_LEVELS.LEVEL_10:
        spellString = <string>(
          game.settings.get(
            `${WMSCONST.MODULE_ID}`,
            `${WMSCONST.OPT_TSL_LVL10}`
          )
        );
        break;
    }

    if (spellString === "") return false;

    const splitLevel: Array<string> = spellString.split(" ");

    const rollResultTarget: number = parseInt(splitLevel[1]);
    switch (splitLevel[0]) {
      case "=":
        return result === rollResultTarget;
      case ">":
        return result > rollResultTarget;
      case "<":
        return result < rollResultTarget;
      default:
        return false;
    }
  }
}
