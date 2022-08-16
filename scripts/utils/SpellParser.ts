import { WMSCONST } from "../WMSCONST";

export default class SpellParser {
  /**
   * Returns whether the actor has the Wild Magic Feat in their items
   * @param actor - Foundry Actor
   * @return {boolean}
   */
  static IsWildMagicFeat(actor: Actor): boolean {
    const surgeName = game.settings.get(
      `${WMSCONST.MODULE_ID}`,
      `${WMSCONST.OPT_WMS_NAME}`
    );
    return (
      actor.items.find(
        (a: Item) => a.name === surgeName && a.type === "feat"
      ) !== undefined
    );
  }

  /**
   * Returns whether the actor has the Path of Wild Magic Subclass in their items
   * @param actor - Foundry Actor
   * @return {boolean}
   */
  static IsPathOfWildMagicFeat(actor: Actor): boolean {
    return (
      actor.items.find(
        (a: Item) =>
          a.name ===
            game.settings.get(
              `${WMSCONST.MODULE_ID}`,
              `${WMSCONST.OPT_POWM_NAME}`
            ) && a.type === "subclass"
      ) !== undefined
    );
  }

  /**
   * Gets the Foundry item id from the ChatMessage HTML Data Attribute
   * @param content - Chat Message HTML
   * @param actor - Foundry Actor
   * @return {Promise<Item | undefined>}
   */
  private static RollContent(content: string, actor: Actor): Item | undefined {
    const rollContent = $(content);
    const itemId = rollContent.data("item-id");
    if (!actor || !itemId) return undefined;
    return actor.items.find((i: Item) => i.id === itemId);
  }

  /**
   * Gets the Foundry Spell Level from the ChatMessage HTML Description
   * @private
   * @param content - Chat Message HTML
   * @param actor - Foundry Actor
   * @return {Promise<string>}
   */
  private static SpellDetails(content: string, actor: Actor): string {
    let spellString;

    spellString = WMSCONST.SPELL_LIST_KEY_WORDS.filter((f) =>
      content.includes(f)
    )[0];

    if (!spellString) {
      const getItem = SpellParser.RollContent(content, actor);
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

  /**
   * Gets the Foundry Spell Level from the ChatMessage HTML Description
   * @param content - Chat Message HTML
   * @param actor - Foundry Actor
   * @return {string}
   */
  static SpellLevel(content: string, actor: Actor): string {
    return SpellParser.SpellDetails(content, actor);
  }

  /**
   * Checks the Chat Message HTML for whether it is a Spell being cast
   * @param content - Chat Message HTML
   * @param actor - Foundry Actor
   * @return {boolean}
   */
  static IsSpell(content: string, actor: Actor): boolean {
    const result = SpellParser.SpellDetails(content, actor);
    return result !== undefined;
  }

  /**
   * Custom regex check for multiclass PCs. Returns if the spell cast was a Sorcerer spell.
   * @param content - Chat Message HTML
   * @param actor - Foundry Actor
   * @return {Promise<boolean>}
   */
  static IsSorcererSpell(content: string, actor: Actor): boolean {
    const getItem = SpellParser.RollContent(content, actor);

    if (!getItem) return false;

    const spellName = getItem.name;

    const spellRegex = game.settings.get(
      `${WMSCONST.MODULE_ID}`,
      `${WMSCONST.OPT_SPELL_REGEX}`
    );

    return !!spellName?.match(spellRegex);
  }

  /**
   * Checks whether the Rage spell has been cast
   * @param content - Chat Message HTML
   * @param actor - Foundry Actor
   * @return {boolean}
   */
  static IsRage(content: string, actor: Actor): boolean {
    const getItem = SpellParser.RollContent(content, actor);

    if (!getItem) return false;

    const spellName = getItem.name;

    return spellName === "Rage";
  }

  /**
   * Checks whether the current actor is an NPC
   * @param actor - Foundry Actor
   * @return {Promise<boolean>}
   */
  static IsNPC(actor: Actor): boolean {
    return actor ? actor.type === "npc" : false;
  }
}
