import {
  MODULE_ID,
  OPT_TSL_LVL1,
  OPT_TSL_LVL2,
  OPT_TSL_LVL3,
  OPT_TSL_LVL4,
  OPT_TSL_LVL5,
  OPT_TSL_LVL6,
  OPT_TSL_LVL7,
  OPT_TSL_LVL8,
  OPT_TSL_LVL9,
  OPT_TSL_LVL10,
} from "../Settings.js";

export default class SpellLevelTrigger {
  constructor() {
    // This is intentional
  }

  Check(result: any, spellLevel: any) {
    let spellString;
    switch (spellLevel) {
      case "1st Level":
        // @ts-expect-error TS(2304): Cannot find name 'game'.
        spellString = game.settings.get(`${MODULE_ID}`, `${OPT_TSL_LVL1}`);
        break;
      case "2nd Level":
        // @ts-expect-error TS(2304): Cannot find name 'game'.
        spellString = game.settings.get(`${MODULE_ID}`, `${OPT_TSL_LVL2}`);
        break;
      case "3rd Level":
        // @ts-expect-error TS(2304): Cannot find name 'game'.
        spellString = game.settings.get(`${MODULE_ID}`, `${OPT_TSL_LVL3}`);
        break;
      case "4th Level":
        // @ts-expect-error TS(2304): Cannot find name 'game'.
        spellString = game.settings.get(`${MODULE_ID}`, `${OPT_TSL_LVL4}`);
        break;
      case "5th Level":
        // @ts-expect-error TS(2304): Cannot find name 'game'.
        spellString = game.settings.get(`${MODULE_ID}`, `${OPT_TSL_LVL5}`);
        break;
      case "6th Level":
        // @ts-expect-error TS(2304): Cannot find name 'game'.
        spellString = game.settings.get(`${MODULE_ID}`, `${OPT_TSL_LVL6}`);
        break;
      case "7th Level":
        // @ts-expect-error TS(2304): Cannot find name 'game'.
        spellString = game.settings.get(`${MODULE_ID}`, `${OPT_TSL_LVL7}`);
        break;
      case "8th Level":
        // @ts-expect-error TS(2304): Cannot find name 'game'.
        spellString = game.settings.get(`${MODULE_ID}`, `${OPT_TSL_LVL8}`);
        break;
      case "9th Level":
        // @ts-expect-error TS(2304): Cannot find name 'game'.
        spellString = game.settings.get(`${MODULE_ID}`, `${OPT_TSL_LVL9}`);
        break;
      case "10th Level":
        // @ts-expect-error TS(2304): Cannot find name 'game'.
        spellString = game.settings.get(`${MODULE_ID}`, `${OPT_TSL_LVL10}`);
        break;
    }

    const splitLevel = spellString.split(" ");

    const rollResultTarget = parseInt(splitLevel[1]);
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
