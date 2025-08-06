import { WMSCONST } from "./WMSCONST";
import CallHooks from "./utils/CallHooks";

/**
 * Chat class for handling common chat methods
 * @class Chat
 */
export default class Chat {
  /**
   * Sends the correct ChatMessage to the Chat window
   * @public
   * @return {Promise<void>}
   * @param type - The type of roll to be sent.
   * @param message - The chat message to send.
   * @param rollObject - Roll to send.
   * @param rollTable - Optional RollTable to send.
   */
  static async Send(
    type: string,
    message: string,
    rollObject?: Roll,
    rollTable?: RollTable,
    results?: TableResult[],
  ): Promise<void> {
    const isWhisperRollResultGM = await game.settings.get(
      `${WMSCONST.MODULE_ID}`,
      `${WMSCONST.OPT_WHISPER_GM}`,
    );
    const isWhisperAutoRollTableGM = await game.settings.get(
      `${WMSCONST.MODULE_ID}`,
      `${WMSCONST.OPT_WHISPER_GM_ROLL_CHAT}`,
    );

    const gmsToWhisper = ChatMessage.getWhisperRecipients("GM").map(
      (u: User) => u.id,
    );

    let chatData: ChatMessage;

    switch (type) {
      case WMSCONST.CHAT_TYPE.ROLL:
        if (!rollObject) return;
        chatData = await this.createRollChat(
          message,
          rollObject,
          isWhisperRollResultGM,
          game.settings.get(
            `${WMSCONST.MODULE_ID}`,
            `${WMSCONST.OPT_ROLLTABLE_ENABLE}`,
          ) === "PLAYER_TRIGGER",
        );
        break;
      case WMSCONST.CHAT_TYPE.TABLE:
        if (!rollObject || !rollTable || !results) return;
        // v13: The caller must provide the results array from the table draw, not from the Roll object.
        // chatData = await this.createRollTable(rollObject, rollTable, rollObject.results);
        throw new Error("createRollTable now requires the results array from the table draw as the third argument.");
        break;
      default:
        chatData = await this.createDefaultChat(message);
        break;
    }

    if (
      (isWhisperRollResultGM && type === WMSCONST.CHAT_TYPE.ROLL) ||
      (isWhisperRollResultGM && type === WMSCONST.CHAT_TYPE.DEFAULT) ||
      (isWhisperAutoRollTableGM && type === WMSCONST.CHAT_TYPE.TABLE)
    ) {
      chatData = this.setChatToWhisper(chatData, gmsToWhisper);
    }
    chatData.speaker = gmsToWhisper;

    ChatMessage.create(chatData);
  }

  static setChatToWhisper(
    chatData: ChatMessage,
    gmsToWhisper: Array<string | null>,
  ) {
    chatData.whisper = gmsToWhisper;
    chatData.blind = true;

    return chatData;
  }

  /**
   * Creates a basic HTML string message
   * @return {Promise<ChatMessage>} The chatData object
   * @param message - The chat message to send.
   */
  static async createDefaultChat(message: string): Promise<ChatMessage> {
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
  static async createRollChat(
    message: string,
    roll: Roll,
    isWhisperGM: boolean,
    isRollOnTableButton = false,
  ): Promise<ChatMessage> {
    if (isWhisperGM) {
      return <ChatMessage>{
        content: `<div>${message} (${roll.total ?? 0})</div>`,
      };
    } else {
      const wildMagicSurgeName = await game.settings.get(
        `${WMSCONST.MODULE_ID}`,
        `${WMSCONST.OPT_WMS_NAME}`,
      );
      return <ChatMessage>{
        flavor: `${wildMagicSurgeName} Check - ${message}`,
        roll: roll,
        rollMode: isRollOnTableButton
          ? "publicroll"
          : await game.settings.get("core", "rollMode"),
      };
    }
  }

  /**
   * Creates a HTML string message based on a RollTable
   * @return {Promise<ChatMessage>} The chatData object
   * @param {Roll} roll The evaluated Roll.
   * @param {RollTable} surgeRollTable The Roll Table to use.
   * @param {TableResult[]} results The results from the table draw.
   */
  static async createRollTable(
    roll: Roll,
    surgeRollTable: RollTable,
    results: TableResult[], // v13: pass results explicitly
  ): Promise<ChatMessage> {
    // v13: results are passed in, not on the Roll object
    const nr = results.length > 1 ? `${results.length} results` : "a result";

    const chatData = <ChatMessage>{
      flavor: `Draws ${nr} from the <WILD MAGIC SURGE> table.`,
      user: game.user.id,
      rolls: [roll],
      sound: null,
    };

    chatData.content = await this.createTemplate(
      CONFIG.RollTable.resultTemplate,
      surgeRollTable,
      roll,
      results,
    );
    return chatData;
  }

  /**
   * Based on the RollTable template, generates the appropriate HTML to display in chat
   * @return {Promise<string>} A rendered HTML string.
   * @param {string} template The foundry template to use for the message.
   * @param {RollTable} surgeRollTable The Roll Table to use.
   * @param {Roll} roll The result of a Roll.
   * @param {TableResult[]} results An Array of results from the roll.
   */
  static async createTemplate(
    template: string,
    surgeRollTable: RollTable,
    roll: Roll,
    results: TableResult[], // v13: TableResult[]
  ): Promise<string> {
    return foundry.utils.renderTemplate(template, {
      description: await foundry.utils.TextEditor.enrichHTML(surgeRollTable.description),
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
  static async RunMessageCheck(): Promise<void> {
    CallHooks.Call("CheckForSurge", { value: true });
    if (
      game.settings.get(
        `${WMSCONST.MODULE_ID}`,
        `${WMSCONST.OPT_CHAT_MSG_ENABLED}`,
      )
    ) {
      await this.Send(
        WMSCONST.CHAT_TYPE.DEFAULT,
        game.settings.get(`${WMSCONST.MODULE_ID}`, `${WMSCONST.OPT_CHAT_MSG}`),
      );
    }
  }
}
