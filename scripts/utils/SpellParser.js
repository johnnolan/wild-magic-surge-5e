import {
  MODULE_ID,
  OPT_SPELL_REGEX,
  SPELL_LIST_KEY_WORDS,
  OPT_WMS_NAME,
  OPT_POWM_NAME,
} from "../Settings.js";

export default class SpellParser {
  constructor() {}

  IsWildMagicFeat(actor) {
    return (
      actor.data.items.find(
        (a) =>
          a.name === game.settings.get(`${MODULE_ID}`, `${OPT_WMS_NAME}`) &&
          a.type === "feat"
      ) !== undefined
    );
  }

  IsPathOfWildMagicFeat(actor) {
    return (
      actor.data.items.find(
        (a) =>
          a.name === game.settings.get(`${MODULE_ID}`, `${OPT_POWM_NAME}`) &&
          a.type === "subclass"
      ) !== undefined
    );
  }

  RollContent(content) {
    const rollContent = $(content);
    const actorId = rollContent.data("actor-id");
    const itemId = rollContent.data("item-id");
    return {
      actorId: actorId,
      itemId: itemId,
    };
  }

  async SpellDetails(content) {
    let spellString;

    spellString = SPELL_LIST_KEY_WORDS.filter((f) => content.includes(f))[0];

    if (!spellString) {
      const rollDetails = this.RollContent(content);

      if (rollDetails.actorId && rollDetails.itemId) {
        const actor = await game.actors.get(rollDetails.actorId);
        if (actor) {
          const getItem = await actor.items.find(
            (i) => i.id === rollDetails.itemId
          );
          if (getItem) {
            let spellLevel = getItem.data.data.level;
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
              }
            }
          }
        }
      }
    }

    return spellString;
  }

  async SpellLevel(content) {
    return await this.SpellDetails(content);
  }

  async IsSpell(content) {
    const result = await this.SpellDetails(content);
    return result !== undefined;
  }

  async IsSorcererSpell(content, actor) {
    if (!actor) return false;

    const rollDetails = this.RollContent(content);

    if (!rollDetails.actorId || !rollDetails.itemId) return false;

    const getItem = await actor.items.find((i) => i.id === rollDetails.itemId);
    if (!getItem) return false;

    let spellName = getItem.data.name;

    const spellRegex = game.settings.get(`${MODULE_ID}`, `${OPT_SPELL_REGEX}`);

    const isSpellRegexMatch = !!spellName.match(spellRegex);
    console.debug(
      `Matching spell name '${spellName}' with regex '${spellRegex}': ${isSpellRegexMatch}`
    );

    return isSpellRegexMatch;
  }

  async IsRage(content, actor) {
    if (!actor) return false;

    const rollDetails = this.RollContent(content);

    if (!rollDetails.actorId || !rollDetails.itemId) return false;

    const getItem = await actor.items.find((i) => i.id === rollDetails.itemId);
    if (!getItem) return false;

    let spellName = getItem.data.name;

    return spellName === "Rage";
  }

  IsNPC(actor) {
    return actor ? actor.data.type === "npc" : false;
  }
}
