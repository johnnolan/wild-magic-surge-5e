import { MODULE_ID, OPT_WHISPER_GM } from "./Settings.js";

export async function SendChat(message, result = "") {
  const whisperToGM = game.settings.get(`${MODULE_ID}`, `${OPT_WHISPER_GM}`);
  const gmsToWhisper = ChatMessage.getWhisperRecipients("GM").map((u) => u._id);

  let chatData = {
    whisper: whisperToGM ? gmsToWhisper : null,
    speaker: gmsToWhisper,
    content: `<div>${message} ${result}</div>`,
    type: CONST.CHAT_MESSAGE_TYPES.WHISPER,
    blind: true,
  };
  return ChatMessage.create(chatData, {});
}

export async function SendRollTable(message, surgeRollTable) {
  const whisperToGM = game.settings.get(`${MODULE_ID}`, `${OPT_WHISPER_GM}`);
  const gmsToWhisper = ChatMessage.getWhisperRecipients("GM").map((u) => u._id);
  const results = message.results;
  const roll = message.roll;

  const nr = results.length > 1 ? `${results.length} results` : "a result";

  const chatData = {
    flavor: `Draws ${nr} from the <WILD MAGIC SURGE> table.`,
    user: game.user.id,
    whisper: whisperToGM ? gmsToWhisper : null,
    speaker: gmsToWhisper,
    type: CONST.CHAT_MESSAGE_TYPES.WHISPER,
    blind: true,
    roll: roll,
    sound: null,
  };

  chatData.content = await renderTemplate(CONFIG.RollTable.resultTemplate, {
    description: TextEditor.enrichHTML(surgeRollTable.data.description, {
      entities: true,
    }),
    results: results.map((r) => {
      r.text = r.getChatText();
      return r;
    }),
    rollHTML: await roll.render(),
    table: surgeRollTable,
  });

  return ChatMessage.create(chatData, {});
}
