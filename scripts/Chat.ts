import {
  MODULE_ID,
  OPT_WHISPER_GM,
  OPT_WMS_NAME,
  OPT_CHAT_MSG,
  CHAT_TYPE,
} from "./Settings";

/**
 * Chat class for handling common chat methods
 * @class Chat
 * @example
 * let chat = new Chat();
 */
class Chat {
  constructor() {
    // This is intentional
  }

  /**
   * Sends the correct ChatMessage to the Chat window
   * @public
   * @return {Promise<void>}
   * @param type - The type of roll to be sent.
   * @param message - The chat message to send.
   * @param rollObject - Roll to send.
   * @param rollTable - Optional RollTable to send.
   */
  async Send(
    type: string,
    message: string,
    rollObject: Roll,
    rollTable?: RollTable
  ): Promise<void> {
    const isWhisperGM = await game.settings.get(
      `${MODULE_ID}`,
      `${OPT_WHISPER_GM}`
    );

    const gmsToWhisper = ChatMessage.getWhisperRecipients("GM").map(
      (u: User) => u.id
    );

    let chatData: ChatMessage;

    switch (type) {
      case CHAT_TYPE.ROLL:
        if (!rollObject) return;
        chatData = await this.createRollChat(message, rollObject, isWhisperGM);
        break;
      case CHAT_TYPE.TABLE:
        if (!rollObject || !rollTable) return;
        chatData = await this.createRollTable(rollObject, rollTable);
        break;
      default:
        chatData = await this.createDefaultChat(message);
        break;
    }

    if (isWhisperGM) {
      chatData.whisper = gmsToWhisper;
      chatData.type = CONST.CHAT_MESSAGE_TYPES.WHISPER;
      chatData.blind = true;
    }
    chatData.speaker = gmsToWhisper;

    ChatMessage.create(chatData);
  }

  /**
   * Creates a basic HTML string message
   * @return {Promise<ChatMessage>} The chatData object
   * @param message - The chat message to send.
   */
  async createDefaultChat(message: string): Promise<ChatMessage> {
    return <ChatMessage>{
      content: `<div>${message}</div>`,
    };
  }

  /**
   * Creates a HTML string message with a Roll result and whether to whisper to the GM or not
   * @return {Promise<ChatMessage>} The chatData object
   * @param message - The chat message to send.
   * @param roll - The Roll to parse for the message.
   * @param isWhisperGM - Should the roll only whisper the GM.
   */
  async createRollChat(
    message: string,
    roll: Roll,
    isWhisperGM: boolean
  ): Promise<ChatMessage> {
    if (isWhisperGM) {
      return <ChatMessage>{
        content: `<div>${message} ${roll.result}</div>`,
      };
    } else {
      const wildMagicSurgeName = await game.settings.get(
        `${MODULE_ID}`,
        `${OPT_WMS_NAME}`
      );
      return <ChatMessage>{
        flavor: `${wildMagicSurgeName} Check - ${message}`,
        type: CONST.CHAT_MESSAGE_TYPES.ROLL,
        roll: roll,
        rollMode: await game.settings.get("core", "rollMode"),
      };
    }
  }

  /**
   * Creates a HTML string message based on a RollTable
   * @return {Promise<ChatMessage>} The chatData object
   * @param {RollResult} rollResult The result of a Roll.
   * @param {RollTable} surgeRollTable The Roll Table to use.
   */
  async createRollTable(
    rollResult: Roll,
    surgeRollTable: RollTable
  ): Promise<ChatMessage> {
    const results = rollResult.results;
    const roll = rollResult.roll;

    const nr = results.length > 1 ? `${results.length} results` : "a result";

    const chatData = <ChatMessage>{
      flavor: `Draws ${nr} from the <WILD MAGIC SURGE> table.`,
      type: CONST.CHAT_MESSAGE_TYPES.ROLL,
      user: game.user.id,
      rolls: [{ roll: roll }],
      sound: null,
    };

    chatData.content = await this.createTemplate(
      CONFIG.RollTable.resultTemplate,
      surgeRollTable,
      roll,
      results
    );
    return chatData;
  }

  /**
   * Based on the RollTable template, generates the appropriate HTML to display in chat
   * @return {Promise<string>} A rendered HTML string.
   * @param {string} template The foundry template to use for the message.
   * @param {RollTable} surgeRollTable The Roll Table to use.
   * @param {Roll} roll The result of a Roll.
   * @param {Array} results An Array of results from the roll.
   */
  async createTemplate(
    template: string,
    surgeRollTable: RollTable,
    roll: Roll,
    results: string[]
  ): Promise<string> {
    return renderTemplate(template, {
      description: await TextEditor.enrichHTML(surgeRollTable.description, {
        entities: true,
      }),
      results: results.map((r: TableResult) => {
        r.text = r.getChatText();
        return r;
      }),
      rollHTML: await roll.render(),
      table: surgeRollTable,
    });
  }

  /**
   * Sends the default Wild Magic Surge Check chat message
   * @return {Promise<void>} The chatData object
   */
  async RunMessageCheck(): Promise<void> {
    Hooks.callAll("wild-magic-surge-5e.CheckForSurge", true);
    await this.Send(
      CHAT_TYPE.DEFAULT,
      game.settings.get(`${MODULE_ID}`, `${OPT_CHAT_MSG}`)
    );
  }
}

export default Chat;
