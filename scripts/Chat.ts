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
   * @param {CHAT_TYPE} type The type of roll to be sent.
   * @param {string} message The chat message to send.
   * @param {object} rollObject Optional RollTable or Roll to send.
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
      (u: any) => u._id
    );

    let chatData = {};

    switch (type) {
      case CHAT_TYPE.DEFAULT:
        chatData = await this.createDefaultChat(message);
        break;
      case CHAT_TYPE.ROLL:
        if (!rollObject) return;
        chatData = await this.createRollChat(message, rollObject, isWhisperGM);
        break;
      case CHAT_TYPE.TABLE:
        if (!rollObject || !rollTable) return;
        chatData = await this.createRollTable(rollObject, rollTable);
        break;
    }

    if (isWhisperGM) {
      (chatData as any).whisper = gmsToWhisper;
      (chatData as any).type = CONST.CHAT_MESSAGE_TYPES.WHISPER;
      (chatData as any).blind = true;
    }
    (chatData as any).speaker = gmsToWhisper;

    ChatMessage.create(chatData);
  }

  /**
   * Creates a basic HTML string message
   * @return {Promise<object>} The chatData object
   * @param message - The chat message to send.
   */
  async createDefaultChat(message: string): Promise<object> {
    return {
      content: `<div>${message}</div>`,
    };
  }

  /**
   * Creates a HTML string message with a Roll result and whether to whisper to the GM or not
   * @return {Promise<object>} The chatData object
   * @param message - The chat message to send.
   * @param roll - The Roll to parse for the message.
   * @param isWhisperGM - Should the roll only whisper the GM.
   */
  async createRollChat(
    message: string,
    roll: Roll,
    isWhisperGM: boolean
  ): Promise<object> {
    if (isWhisperGM) {
      return {
        content: `<div>${message} ${roll.result}</div>`,
      };
    } else {
      const wildMagicSurgeName = await game.settings.get(
        `${MODULE_ID}`,
        `${OPT_WMS_NAME}`
      );
      return {
        flavor: `${wildMagicSurgeName} Check - ${message}`,
        type: CONST.CHAT_MESSAGE_TYPES.ROLL,
        roll: roll,
        rollMode: await game.settings.get("core", "rollMode"),
      };
    }
  }

  /**
   * Creates a HTML string message based on a RollTable
   * @return {Promise<object>} The chatData object
   * @param {RollResult} rollResult The result of a Roll.
   * @param {RollTable} surgeRollTable The Roll Table to use.
   */
  async createRollTable(
    rollResult: Roll,
    surgeRollTable: RollTable
  ): Promise<object> {
    const results = rollResult.results;
    const roll = rollResult.roll;

    const nr = results.length > 1 ? `${results.length} results` : "a result";

    const chatData = {
      flavor: `Draws ${nr} from the <WILD MAGIC SURGE> table.`,
      type: CONST.CHAT_MESSAGE_TYPES.ROLL,
      user: game.user.id,
      rolls: [{ roll: roll }],
      sound: null,
    };

    (chatData as any).content = await this.createTemplate(
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
    results: any
  ): Promise<string> {
    return renderTemplate(template, {
      description: await TextEditor.enrichHTML(surgeRollTable.description, {
        // @ts-expect-error TS(2345): Argument of type '{ entities: boolean; }' is not a... Remove this comment to see the full error message
        entities: true,
      }),
      results: results.map((r: any) => {
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
