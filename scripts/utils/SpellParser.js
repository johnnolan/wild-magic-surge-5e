import { SPELL_LIST_KEY_WORDS } from "../Settings.js";

export function IsWildMagicFeat(actor) {
  return (
    actor.data.items.find(
      (a) => a.name === "Wild Magic Surge" && a.type === "feat"
    ) !== undefined
  );
}

export function SpellLevel(content) {
  return SPELL_LIST_KEY_WORDS.filter((f) => content.includes(f))[0];
}

export function IsSpell(content) {
  return SPELL_LIST_KEY_WORDS.some((v) => content.includes(v));
}

export function IsNPC(actor) {
  return actor ? actor.data.type === "npc" : false;
}
