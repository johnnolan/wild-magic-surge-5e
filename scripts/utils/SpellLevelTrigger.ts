import Logger from "../Logger";
import { WMSCONST } from "../WMSCONST";

export default class SpellLevelTrigger {
  static Check(result: number, spellLevel: string): boolean {
    const spellString = this._spellString(spellLevel);

    if (!spellString) return false;

    const spellLevelFormula = this._rollFormula(spellString);
    if (!spellLevelFormula) {
      this._warnSetup({ spellString, spellLevel });
      return false;
    }

    switch (spellLevelFormula?.equation) {
      case "=":
        return result === spellLevelFormula.target;
      case ">":
        return result > spellLevelFormula.target;
      case "<":
        return result < spellLevelFormula.target;
      default:
        this._warnSetup({ spellString, spellLevel });
        return false;
    }
  }

  static ParseRollFormula(spellLevel?: string): string {
    const diceFormula = game.settings.get(
      `${WMSCONST.MODULE_ID}`,
      `${WMSCONST.OPT_TSL_DIE}`
    );

    if (!spellLevel) {
      this._warnSetup({ spellLevel });
      return diceFormula;
    }

    const spellString = this._spellString(spellLevel);

    if (!spellString) {
      this._warnSetup({ spellString, spellLevel });
      return diceFormula;
    }

    const spellLevelFormula = this._rollFormula(spellString);
    if (!spellLevelFormula || !spellLevelFormula.roll) {
      this._warnSetup({ spellString, spellLevel });
      return diceFormula;
    }

    return spellLevelFormula.roll;
  }

  static _rollFormula(spellString: string): SpellLevelFormula | undefined {
    const spellFormula: SpellLevelFormula = {
      equation: "",
      target: 0,
    };
    const comparisonRegex = /^([=><]\s\d+)$/g;

    if (!spellString.match(comparisonRegex)) {
      const regex = /(.*)\s([=><]\s\d+)/;
      const result = spellString.match(regex);
      if (result && result.length > 1) {
        spellFormula.roll = result[1];
        spellString = result[2];
      } else {
        return undefined;
      }
    }

    const splitLevel: Array<string> = spellString.split(" ");

    spellFormula.equation = splitLevel[0];
    spellFormula.target = parseInt(splitLevel[1]);

    return spellFormula;
  }

  static _spellString(spellLevel: string) {
    switch (spellLevel) {
      case WMSCONST.SPELL_LEVELS.Cantrip:
        return <string>(
          game.settings.get(
            `${WMSCONST.MODULE_ID}`,
            `${WMSCONST.OPT_TSL_CANTRIP}`
          )
        );
      case WMSCONST.SPELL_LEVELS.LEVEL_1:
        return <string>(
          game.settings.get(`${WMSCONST.MODULE_ID}`, `${WMSCONST.OPT_TSL_LVL1}`)
        );
      case WMSCONST.SPELL_LEVELS.LEVEL_2:
        return <string>(
          game.settings.get(`${WMSCONST.MODULE_ID}`, `${WMSCONST.OPT_TSL_LVL2}`)
        );
      case WMSCONST.SPELL_LEVELS.LEVEL_3:
        return <string>(
          game.settings.get(`${WMSCONST.MODULE_ID}`, `${WMSCONST.OPT_TSL_LVL3}`)
        );
      case WMSCONST.SPELL_LEVELS.LEVEL_4:
        return <string>(
          game.settings.get(`${WMSCONST.MODULE_ID}`, `${WMSCONST.OPT_TSL_LVL4}`)
        );
      case WMSCONST.SPELL_LEVELS.LEVEL_5:
        return <string>(
          game.settings.get(`${WMSCONST.MODULE_ID}`, `${WMSCONST.OPT_TSL_LVL5}`)
        );
      case WMSCONST.SPELL_LEVELS.LEVEL_6:
        return <string>(
          game.settings.get(`${WMSCONST.MODULE_ID}`, `${WMSCONST.OPT_TSL_LVL6}`)
        );
      case WMSCONST.SPELL_LEVELS.LEVEL_7:
        return <string>(
          game.settings.get(`${WMSCONST.MODULE_ID}`, `${WMSCONST.OPT_TSL_LVL7}`)
        );
      case WMSCONST.SPELL_LEVELS.LEVEL_8:
        return <string>(
          game.settings.get(`${WMSCONST.MODULE_ID}`, `${WMSCONST.OPT_TSL_LVL8}`)
        );
      case WMSCONST.SPELL_LEVELS.LEVEL_9:
        return <string>(
          game.settings.get(`${WMSCONST.MODULE_ID}`, `${WMSCONST.OPT_TSL_LVL9}`)
        );
      case WMSCONST.SPELL_LEVELS.LEVEL_10:
        return <string>(
          game.settings.get(
            `${WMSCONST.MODULE_ID}`,
            `${WMSCONST.OPT_TSL_LVL10}`
          )
        );
    }
  }

  static _warnSetup(data: unknown) {
    Logger.warn(
      `Cannot parse custom Spell Level trigger setting.`,
      "spellleveltrigger.Check",
      data
    );

    ui.notifications?.warn(
      `Wild Magic Surge 5e: Cannot parse custom Spell Level trigger setting. Check console for details.`
    );

  }
}
