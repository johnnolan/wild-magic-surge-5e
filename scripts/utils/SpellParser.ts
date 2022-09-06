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
   * Gets the Foundry Spell Level Name from the Item
   * @private
   * @param item - Item5e object
   * @return {Promise<string>}
   */
  private static SpellDetails(item: Item): string | undefined {
    if (item?.system?.level === undefined) return;
    switch (item.system.level) {
      case 0: {
        if (
          !game.settings.get(
            `${WMSCONST.MODULE_ID}`,
            `${WMSCONST.OPT_CANTRIP_SURGE_ENABLED}`
          )
        ) {
          return undefined;
        } else {
          return `Cantrip`;
        }
      }
      case 1:
        return `${item.system.level}st Level`;
      case 2:
        return `${item.system.level}nd Level`;
      case 3:
        return `${item.system.level}rd Level`;
      case 4:
      case 5:
      case 6:
      case 7:
      case 8:
      case 9:
        return `${item.system.level}th Level`;
      default:
        return undefined;
    }
  }

  /**
   * Gets the Foundry Spell Level from the Item
   * @param item - Item5e object
   * @return {string}
   */
  static SpellLevel(item: Item): string {
    const result = SpellParser.SpellDetails(item);
    if (result === undefined) return "";
    return result;
  }

  /**
   * Checks the Item for whether it is a Spell being cast
   * @param item - Item5e object
   * @return {boolean}
   */
  static IsSpell(item: Item): boolean {
    const result = SpellParser.SpellDetails(item);
    return result !== undefined && item.type === "spell";
  }

  /**
   * Custom regex check for multiclass PCs. Returns if the spell cast was a Sorcerer spell.
   * @param item - Item5e object
   * @return {Promise<boolean>}
   */
  static IsSorcererSpell(item: Item): boolean {
    const spellName = item.name;

    const spellRegex = game.settings.get(
      `${WMSCONST.MODULE_ID}`,
      `${WMSCONST.OPT_SPELL_REGEX}`
    );

    return !!spellName?.match(spellRegex);
  }

  /**
   * Checks whether the Rage spell has been cast
   * @param item - Item5e object
   * @return {boolean}
   */
  static IsRage(item: Item): boolean {
    const spellName = item.name;

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
