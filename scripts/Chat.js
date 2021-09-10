import { MODULE_ID, OPT_WHISPER_GM } from "./Settings.js";

export default class IncrementalCheck {
  constructor() {}

  async WhisperCheck(chatData, gmsToWhisper) {
    const whisperToGM = game.settings.get(`${MODULE_ID}`, `${OPT_WHISPER_GM}`);
    if (whisperToGM) {
      chatData.whisper = gmsToWhisper;
      chatData.type = CONST.CHAT_MESSAGE_TYPES.WHISPER;
      chatData.blind = true;
    }

    return chatData;
  }

  async SendChat(message, result = "") {
    const gmsToWhisper = ChatMessage.getWhisperRecipients("GM").map(
      (u) => u._id
    );

    let chatData = {
      speaker: gmsToWhisper,
      content: `<div>${message} ${result}</div>`,
    };

    chatData = await WhisperCheck(chatData, gmsToWhisper);

    return ChatMessage.create(chatData, {});
  }

  async SendRollTable(message, surgeRollTable) {
    const gmsToWhisper = ChatMessage.getWhisperRecipients("GM").map(
      (u) => u._id
    );
    const results = message.results;
    const roll = message.roll;

    const nr = results.length > 1 ? `${results.length} results` : "a result";

    let chatData = {
      flavor: `Draws ${nr} from the <WILD MAGIC SURGE> table.`,
      user: game.user.id,
      speaker: gmsToWhisper,
      roll: roll,
      sound: null,
    };

    chatData = await WhisperCheck(chatData, gmsToWhisper);

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
}
