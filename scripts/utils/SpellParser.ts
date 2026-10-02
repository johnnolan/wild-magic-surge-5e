import { getModuleSetting } from "./TypedSettings";
import { WMSCONST } from "../WMSCONST";
import {
  GetDnd5eSpellLevel,
  IsDnd5eActorSubtype,
  IsDnd5eItemSubtype,
} from "./Dnd5eSystem";

export default class SpellParser {
  /**
   * Returns whether the actor has the Wild Magic Feat in their items
   * @param actor - Foundry Actor
   * @return {boolean}
   */
  static IsWildMagicFeat(actor: Actor): boolean {
    const surgeName = getModuleSetting(WMSCONST.OPT_WMS_NAME);
    return (
      actor.items.find(
        (a: Item) => a.name === surgeName && IsDnd5eItemSubtype(a, "feat"),
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
            getModuleSetting(WMSCONST.OPT_POWM_NAME) && IsDnd5eItemSubtype(a, "subclass"),
      ) !== undefined
    );
  }

  /**
   * Gets the Foundry Spell Level Name from the Item
   * @param item - Item5e object
   * @return {Promise<string>}
   */
  static SpellDetails(item: Item): string | undefined {
    const minimumSpellLevelTrigger = parseInt(
      getModuleSetting(WMSCONST.OPT_MINIMUM_SPELL_LEVEL_TRIGGER),
    );

    const spellLevel = GetDnd5eSpellLevel(item?.system);
    if (spellLevel === undefined) return;

    if (
      minimumSpellLevelTrigger > 0 &&
      spellLevel < minimumSpellLevelTrigger
    )
      return undefined;

    switch (spellLevel) {
      case 0: {
        if (
          !getModuleSetting(WMSCONST.OPT_CANTRIP_SURGE_ENABLED)
        ) {
          return undefined;
        } else {
          return `Cantrip`;
        }
      }
      case 1:
        return `${spellLevel}st Level`;
      case 2:
        return `${spellLevel}nd Level`;
      case 3:
        return `${spellLevel}rd Level`;
      case 4:
      case 5:
      case 6:
      case 7:
      case 8:
      case 9:
        return `${spellLevel}th Level`;
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
    return result !== undefined && IsDnd5eItemSubtype(item, "spell");
  }

  /**
   * Custom regex check for multiclass PCs. Returns if the spell cast was a Sorcerer spell.
   * @param item - Item5e object
   * @return {Promise<boolean>}
   */
  static IsSorcererSpell(item: Item): boolean {
    const spellName = item.name;

    const spellRegex = getModuleSetting(WMSCONST.OPT_SPELL_REGEX);

    const isInverse = getModuleSetting(WMSCONST.OPT_SPELL_REGEX_INVERSE);

    if (isInverse) {
      return spellName?.match(spellRegex) ? false : true;
    } else {
      return !!spellName?.match(spellRegex);
    }
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
  static IsNPC(actor: Actor | undefined): boolean {
    return actor ? IsDnd5eActorSubtype(actor, "npc") : false;
  }
}
