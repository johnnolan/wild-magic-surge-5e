const MODULE_NAME = "Wild Magic Surge 5e";
const MODULE_ID = "wild-magic-surge-5e";

const OPT_ENABLE_CHECK = "enableMagicSurgeCheck";
const OPT_CHAT_MSG = "magicSurgeChatMessage";

function hasWildMagicFeat(data) {
    return data._actor.data.items.find(
        (a) => a.name === `Wild Magic Surge` && a.type === "feat"
      ) !== undefined;
}

function is1stLevelOrHigherSpell(data) {
    return data._item.labels.level.indexOf(" Level") > -1;
}

function isValid(data) {
    return (hasWildMagicFeat(data) && is1stLevelOrHigherSpell(data))
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
});

Hooks.on("ready", function () {
  console.log(`Successfully loaded ${MODULE_NAME}`);
});

Hooks.on("preRollItemBetterRolls", function (arg1, arg2, arg3) {
  try {
    if (game.settings.get(`${MODULE_ID}`, `${OPT_ENABLE_CHECK}`)) {
      if (isValid(arg1)) {
        let chatData = {
          user: game.user.id,
          speaker: game.user,
          content: game.settings.get(`${MODULE_ID}`, `${OPT_CHAT_MSG}`),
        };
        ChatMessage.create(chatData, {});
      }
    }
  } catch (e) {
    console.error(`${MODULE_NAME}`, e);
  }
});
