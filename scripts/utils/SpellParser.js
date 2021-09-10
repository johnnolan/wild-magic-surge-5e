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

  SpellLevel(content) {
    return SPELL_LIST_KEY_WORDS.filter((f) => content.includes(f))[0];
  }

  IsSpell(content) {
    return SPELL_LIST_KEY_WORDS.some((v) => content.includes(v));
  }

  IsNPC(actor) {
    return actor ? actor.data.type === "npc" : false;
  }
}
