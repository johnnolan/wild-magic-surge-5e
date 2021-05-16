import { MODULE_ID, OPT_WHISPER_GM } from "./Settings.js";

export async function SendChat(message, result = "") {
  const whisperToGM = game.settings.get(`${MODULE_ID}`, `${OPT_WHISPER_GM}`);

  let chatData = {
    whisper: whisperToGM ? ChatMessage.getWhisperRecipients("GM") : false,
    speaker: game.user,
    content: `<div>${message} ${result}</div>`,
  };
  return ChatMessage.create(chatData, {});
}
