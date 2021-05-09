import {
  MODULE_ID,
  OPT_CHAT_MSG,
  OPT_AUTO_D20,
  OPT_AUTO_D20_MSG,
  SPELL_LIST_KEY_WORDS,
} from "./Settings.js";
import { SendChat } from "./Chat.js";

export function WildMagicCheck(chatMessage) {
  if (isValid(chatMessage)) {
    if (game.settings.get(`${MODULE_ID}`, `${OPT_AUTO_D20}`)) {
      runAutoCheck();
    } else {
      runMessageCheck();
    }
  }
}

function parseWildMagicFeat(actor) {
  return (
    actor.data.items.find(
      (a) => a.name === `Wild Magic Surge` && a.type === "feat"
    ) !== undefined
  );
}

function parseSpell(content) {
  return SPELL_LIST_KEY_WORDS.some((v) => content.includes(v));
}

function parseNpc(actor) {
  return actor ? actor.data.type === "npc" : false;
}

function isValid(chatMessage) {
  const isASpell = parseSpell(chatMessage.data.content);
  const actor = game.actors.get(chatMessage.data.speaker.actor);
  const hasWildMagicFeat = parseWildMagicFeat(actor);
  const isNpc = parseNpc(actor);

  return isASpell && !isNpc && hasWildMagicFeat;
}

function wildMagicSurgeRollCheck() {
  let r = new Roll("1d20");
  r.evaluate();
  return r.total;
}

function runAutoCheck() {
  const result = wildMagicSurgeRollCheck();
  if (result === 1) {
    SendChat(game.settings.get(`${MODULE_ID}`, `${OPT_AUTO_D20_MSG}`));
  }
}

function runMessageCheck() {
  SendChat(game.settings.get(`${MODULE_ID}`, `${OPT_CHAT_MSG}`));
}
