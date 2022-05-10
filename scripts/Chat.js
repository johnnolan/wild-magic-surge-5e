import { MODULE_ID, OPT_WHISPER_GM, OPT_WMS_NAME } from "./Settings.js";

export default class Chat {
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

  async SendChat(message, roll = undefined) {
    const gmsToWhisper = ChatMessage.getWhisperRecipients("GM").map(
      (u) => u._id
    );

    let chatData = {};

    if (roll) {
      chatData = {
        speaker: gmsToWhisper,
      };

      if (game.settings.get(`${MODULE_ID}`, `${OPT_WHISPER_GM}`)) {
        chatData.content = `<div>${message} ${roll.result}</div>`;
      } else {
        chatData.flavor = `${game.settings.get(
          `${MODULE_ID}`,
          `${OPT_WMS_NAME}`
        )} Check - ${message}`;
        chatData.type = CONST.CHAT_MESSAGE_TYPES.ROLL;
        chatData.roll = roll;
        chatData.rollMode = game.settings.get("core", "rollMode");
      }
    } else {
      chatData = {
        speaker: gmsToWhisper,
        content: `<div>${message}</div>`,
      };
    }

    chatData = await this.WhisperCheck(chatData, gmsToWhisper);

    return ChatMessage.create(chatData);
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
      type: CONST.CHAT_MESSAGE_TYPES.ROLL,
      user: game.user.id,
      speaker: gmsToWhisper,
      roll: roll,
      rollMode: game.settings.get("core", "rollMode"),
      sound: null,
    };

    chatData = await this.WhisperCheck(chatData, gmsToWhisper);

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

    return ChatMessage.create(chatData);
  }
}
