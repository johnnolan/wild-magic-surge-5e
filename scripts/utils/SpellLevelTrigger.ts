import { WMSCONST } from "../WMSCONST";

export default class SpellLevelTrigger {
  constructor() {
    // This is intentional
  }

  static Check(result: number, spellLevel: string): boolean {
    let spellString = "";
    switch (spellLevel) {
      case "1st Level":
        spellString = <string>(
          game.settings.get(`${WMSCONST.MODULE_ID}`, `${WMSCONST.OPT_TSL_LVL1}`)
        );
        break;
      case "2nd Level":
        spellString = <string>(
          game.settings.get(`${WMSCONST.MODULE_ID}`, `${WMSCONST.OPT_TSL_LVL2}`)
        );
        break;
      case "3rd Level":
        spellString = <string>(
          game.settings.get(`${WMSCONST.MODULE_ID}`, `${WMSCONST.OPT_TSL_LVL3}`)
        );
        break;
      case "4th Level":
        spellString = <string>(
          game.settings.get(`${WMSCONST.MODULE_ID}`, `${WMSCONST.OPT_TSL_LVL4}`)
        );
        break;
      case "5th Level":
        spellString = <string>(
          game.settings.get(`${WMSCONST.MODULE_ID}`, `${WMSCONST.OPT_TSL_LVL5}`)
        );
        break;
      case "6th Level":
        spellString = <string>(
          game.settings.get(`${WMSCONST.MODULE_ID}`, `${WMSCONST.OPT_TSL_LVL6}`)
        );
        break;
      case "7th Level":
        spellString = <string>(
          game.settings.get(`${WMSCONST.MODULE_ID}`, `${WMSCONST.OPT_TSL_LVL7}`)
        );
        break;
      case "8th Level":
        spellString = <string>(
          game.settings.get(`${WMSCONST.MODULE_ID}`, `${WMSCONST.OPT_TSL_LVL8}`)
        );
        break;
      case "9th Level":
        spellString = <string>(
          game.settings.get(`${WMSCONST.MODULE_ID}`, `${WMSCONST.OPT_TSL_LVL9}`)
        );
        break;
      case "10th Level":
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
