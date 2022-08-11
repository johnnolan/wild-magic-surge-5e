import {
  MODULE_ID,
  OPT_SPELL_REGEX,
  SPELL_LIST_KEY_WORDS,
  OPT_WMS_NAME,
  OPT_POWM_NAME,
} from "../Settings";

export default class SpellParser {
  _actor: any;
  constructor(actor: any) {
    this._actor = actor;
  }

  IsWildMagicFeat() {
    const surgeName = game.settings.get(`${MODULE_ID}`, `${OPT_WMS_NAME}`);
    return (
      this._actor.items.find(
        (a: any) => a.name === surgeName && a.type === "feat"
      ) !== undefined
    );
  }

  IsPathOfWildMagicFeat() {
    return (
      this._actor.items.find(
        (a: any) =>
          a.name === game.settings.get(`${MODULE_ID}`, `${OPT_POWM_NAME}`) &&
          a.type === "subclass"
      ) !== undefined
    );
  }

  async RollContent(content: any) {
    const rollContent = $(content);
    const itemId = rollContent.data("item-id");
    if (!this._actor || !itemId) return undefined;
    return this._actor.items.find((i: any) => i.id === itemId);
  }

  async SpellDetails(content: any): Promise<string> {
    let spellString;

    spellString = SPELL_LIST_KEY_WORDS.filter((f) => content.includes(f))[0];

    if (!spellString) {
      const getItem = await this.RollContent(content);
      if (getItem) {
        const spellLevel = getItem.level;
        if (spellLevel > 0) {
          switch (spellLevel) {
            case 1:
              spellString = "1st Level";
              break;
            case 2:
              spellString = "2nd Level";
              break;
            case 3:
              spellString = "3rd Level";
              break;
            case 4:
            case 5:
            case 6:
            case 7:
            case 8:
            case 9:
              spellString = `${spellLevel}th Level`;
              break;
            default:
              break;
          }
        }
      }
    }

    return spellString;
  }

  async SpellLevel(content: any): Promise<string> {
    return this.SpellDetails(content);
  }

  async IsSpell(content: any) {
    const result = await this.SpellDetails(content);
    return result !== undefined;
  }

  async IsSorcererSpell(content: any) {
    const getItem = await this.RollContent(content);

    if (!getItem) return false;

    const spellName = getItem.name;

    const spellRegex = game.settings.get(`${MODULE_ID}`, `${OPT_SPELL_REGEX}`);

    return !!spellName.match(spellRegex);
  }

  async IsRage(content: any) {
    const getItem = await this.RollContent(content);

    if (!getItem) return false;

    const spellName = getItem.name;

    return spellName === "Rage";
  }

  IsNPC() {
    return this._actor ? this._actor.type === "npc" : false;
  }
}
