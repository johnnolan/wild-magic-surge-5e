import {
  MODULE_ID,
  OPT_CHAT_MSG,
  OPT_AUTO_D20,
  OPT_AUTO_D20_MSG,
  OPT_AUTO_D20_MSG_NO_SURGE,
  SPELL_LIST_KEY_WORDS,
} from "./Settings.js";
import { SendChat } from "./Chat.js";
import { TidesOfChaos } from "./TidesOfChaos.js";
import { RollTableMagicSurge } from "./RollTableMagicSurge.js";

export function WildMagicCheck(chatMessage) {
  if (isValid(chatMessage)) {
    if (game.settings.get(`${MODULE_ID}`, `${OPT_AUTO_D20}`)) {
      runAutoCheck(game.actors.get(chatMessage.data.speaker.actor));
    } else {
      runMessageCheck();
    }
  }
}

function parseWildMagicFeat(actor) {
  return (
    actor.data.items.find(
      (a) => a.name === "Wild Magic Surge" && a.type === "feat"
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
  if (
    chatMessage.data.speaker === undefined ||
    chatMessage.data.speaker.actor === undefined
  ) {
    return false;
  }

  const isASpell = parseSpell(chatMessage.data.content);
  const actor = game.actors.get(chatMessage.data.speaker.actor);
  if (actor === null) {
    return false;
  }
  const hasWildMagicFeat = parseWildMagicFeat(actor);
  const isNpc = parseNpc(actor);

  return isASpell && !isNpc && hasWildMagicFeat;
}

function wildMagicSurgeRollCheck() {
  let r = new Roll("1d20");
  r.evaluate();
  return r.total;
}

function runAutoCheck(actor) {
  const result = wildMagicSurgeRollCheck();
  if (result === 1) {
    SendChat(
      game.settings.get(`${MODULE_ID}`, `${OPT_AUTO_D20_MSG}`),
      `[[/r ${result} #1d20 result]]`
    );
    TidesOfChaos(actor);
    RollTableMagicSurge();
  } else {
    SendChat(
      game.settings.get(`${MODULE_ID}`, `${OPT_AUTO_D20_MSG_NO_SURGE}`),
      `[[/r ${result} #1d20 result]]`
    );
  }
}

function runMessageCheck() {
  SendChat(game.settings.get(`${MODULE_ID}`, `${OPT_CHAT_MSG}`));
}
