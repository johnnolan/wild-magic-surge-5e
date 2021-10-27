import { SPELL_LIST_KEY_WORDS } from "../Settings.js";

export default class SpellParser {
  constructor() {}

  IsWildMagicFeat(actor) {
    return (
      actor.data.items.find(
        (a) => a.name === "Wild Magic Surge" && a.type === "feat"
      ) !== undefined
    );
  }

  async SpellDetails(content) {
    let spellString;

    spellString = SPELL_LIST_KEY_WORDS.filter((f) => content.includes(f))[0];

    if (!spellString) {
      const rollContent = $(content);
      const actorId = rollContent.data("actor-id");
      const itemId = rollContent.data("item-id");
      if (actorId && itemId) {
        const actor = await game.actors.get(actorId);
        if (actor) {
          const getItem = await actor.items.find((i) => i.id === itemId);
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

  IsNPC(actor) {
    return actor ? actor.data.type === "npc" : false;
  }
}
