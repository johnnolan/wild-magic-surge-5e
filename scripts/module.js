import {
  MODULE_NAME,
  MODULE_ID,
  OPT_ENABLE_CHECK,
  OPT_CHAT_MSG,
  OPT_AUTO_D20,
  OPT_AUTO_D20_MSG,
  OPT_AUTO_D20_MSG_NO_SURGE,
  OPT_ENABLE_TOC,
  OPT_TOC_RECHARGE_MSG,
} from "./Settings.js";
import { WildMagicCheck } from "./MagicSurgeCheck.js";

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

  game.settings.register(`${MODULE_ID}`, `${OPT_AUTO_D20_MSG_NO_SURGE}`, {
    name: "Text to show in chat with Auto d20 roll and no surge happens.",
    hint:
      "On a roll of > 1 using the auto roll d20 feature, show this message.",
    scope: "world",
    config: true,
    default: "No wild magic surge",
    type: String,
  });

  game.settings.register(`${MODULE_ID}`, `${OPT_ENABLE_TOC}`, {
    name: "Enable Tides of Chaos auto recharge",
    hint: "Enables Tides of Chaos auto recharge when a Wild Magic Surge occurs",
    scope: "world",
    config: true,
    default: true,
    type: Boolean,
  });

  game.settings.register(`${MODULE_ID}`, `${OPT_TOC_RECHARGE_MSG}`, {
    name: "Tides of Chaos recharge message",
    hint: "Tides of Chaos recharge message",
    scope: "world",
    config: true,
    default: "Tides of Chaos Recharged",
    type: String,
  });
});

Hooks.on("ready", function () {
  console.log(`Successfully loaded ${MODULE_NAME}`);
});

Hooks.on("createChatMessage", (chatMessage) => {
  if (game.settings.get(`${MODULE_ID}`, `${OPT_ENABLE_CHECK}`)) {
    WildMagicCheck(chatMessage);
  }
});
