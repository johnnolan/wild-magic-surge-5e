import {
  MODULE_ID,
  OPT_SPELL_REGEX,
  SPELL_LIST_KEY_WORDS,
  OPT_WMS_NAME,
  OPT_POWM_NAME,
} from "../Settings";

export default class SpellParser {
  _actor: Actor;
  constructor(actor: Actor) {
    this._actor = actor;
  }

  IsWildMagicFeat(): boolean {
    const surgeName = game.settings.get(`${MODULE_ID}`, `${OPT_WMS_NAME}`);
    return (
      this._actor.items.find(
        (a: Item) => a.name === surgeName && a.type === "feat"
      ) !== undefined
    );
  }

  IsPathOfWildMagicFeat(): boolean {
    return (
      this._actor.items.find(
        (a: Item) =>
          a.name === game.settings.get(`${MODULE_ID}`, `${OPT_POWM_NAME}`) &&
          a.type === "subclass"
      ) !== undefined
    );
  }

  async RollContent(content: string): Promise<Item | undefined> {
    const rollContent = $(content);
    const itemId = rollContent.data("item-id");
    if (!this._actor || !itemId) return undefined;
    return this._actor.items.find((i: Item) => i.id === itemId);
  }

  async SpellDetails(content: string): Promise<string> {
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

  async SpellLevel(content: string): Promise<string> {
    return this.SpellDetails(content);
  }

  async IsSpell(content: string): Promise<boolean> {
    const result = await this.SpellDetails(content);
    return result !== undefined;
  }

  async IsSorcererSpell(content: string): Promise<boolean | null> {
    const getItem = await this.RollContent(content);

    if (!getItem) return false;

    const spellName = getItem.name;

    const spellRegex = game.settings.get(`${MODULE_ID}`, `${OPT_SPELL_REGEX}`);

    return !!spellName?.match(spellRegex);
  }

  async IsRage(content: string): Promise<boolean> {
    const getItem = await this.RollContent(content);

    if (!getItem) return false;

    const spellName = getItem.name;

    return spellName === "Rage";
  }

  IsNPC(): boolean {
    return this._actor ? this._actor.type === "npc" : false;
  }
}
