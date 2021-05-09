const MODULE_NAME = "Wild Magic Surge 5e";
const MODULE_ID = "wild-magic-surge-5e";

const OPT_ENABLE_CHECK = "enableMagicSurgeCheck";
const OPT_CHAT_MSG = "magicSurgeChatMessage";
const OPT_AUTO_D20 = "autoRollD20";
const OPT_AUTO_D20_MSG = "autoRollD20Message";

function hasWildMagicFeat(actor) {
  return (
    actor.data.items.find(
      (a) => a.name === `Wild Magic Surge` && a.type === "feat"
    ) !== undefined
  );
}

function sendChat(chatMessage) {
  let chatData = {
    user: game.user.id,
    speaker: game.user,
    content: `<div>${chatMessage.toString()}</div>`,
  };
  ChatMessage.create(chatData, {});
}

function wildMagicSurgeRollCheck() {
  let r = new Roll("1d20");
  r.evaluate();
  return r.total;
}

Hooks.on("init", function () {
  console.log(`Loading ${MODULE_NAME}`);

  game.settings.register(`${MODULE_ID}`, `${OPT_ENABLE_CHECK}`, {
    name: "Enable Wild Magic Surge Check",
    hint:
      "Enables sending a message to the chat window upon a 1st level or higher spell being cast",
    scope: "world",
    config: true,
    default: true,
    type: Boolean,
  });

  game.settings.register(`${MODULE_ID}`, `${OPT_CHAT_MSG}`, {
    name: "Text to show in chat",
    hint: "Enter custom message in chat box",
    scope: "world",
    config: true,
    default: "Wild Magic Check - Roll a D20",
    type: String,
  });

  game.settings.register(`${MODULE_ID}`, `${OPT_AUTO_D20}`, {
    name: "Auto Roll d20 instead of just the prompt",
    hint: "Auto roll a d20 and show the result.",
    scope: "world",
    config: true,
    default: false,
    type: Boolean,
  });

  game.settings.register(`${MODULE_ID}`, `${OPT_AUTO_D20_MSG}`, {
    name: "Text to show in chat with Auto d20 roll.",
    hint: "On a roll of 1 using the auto roll d20 feature, show this message.",
    scope: "world",
    config: true,
    default: "Wild Magic Surge! Roll a D100!",
    type: String,
  });
});

Hooks.on("ready", function () {
  console.log(`Successfully loaded ${MODULE_NAME}`);
});

Hooks.on("createChatMessage", (chatMessage) => {
  const spellList = [
    "1st Level",
    "2nd Level",
    "3rd Level",
    "4th Level",
    "5th Level",
    "6th Level",
    "7th Level",
    "8th Level",
    "9th Level",
    "10th Level",
  ];

  if (game.settings.get(`${MODULE_ID}`, `${OPT_ENABLE_CHECK}`)) {
    let isASpell = spellList.some((v) => chatMessage.data.content.includes(v));
    let actor = game.actors.get(chatMessage.data.speaker.actor);
    const isNpc = actor ? actor.data.type === "npc" : false;

    if (isASpell && !isNpc && hasWildMagicFeat(actor)) {
      if (game.settings.get(`${MODULE_ID}`, `${OPT_AUTO_D20}`)) {
        const result = wildMagicSurgeRollCheck();
        if (result === 1) {
          sendChat(game.settings.get(`${MODULE_ID}`, `${OPT_AUTO_D20_MSG}`));
        }
      } else {
        sendChat(game.settings.get(`${MODULE_ID}`, `${OPT_CHAT_MSG}`));
      }
    }
  }
});
