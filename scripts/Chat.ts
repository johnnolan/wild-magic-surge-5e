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
        if (!rollObject || !rollTable) return;
        chatData = await this.createRollTable(rollObject, rollTable);
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
   * @param {RollResult} rollResult The result of a Roll.
   * @param {RollTable} surgeRollTable The Roll Table to use.
   */
  static async createRollTable(
    rollResult: Roll,
    surgeRollTable: RollTable,
  ): Promise<ChatMessage> {
    const results = rollResult.results;
    const roll = rollResult.roll;

    const chatData = <ChatMessage>{
      user: game.user.id,
      rolls: [roll],
      sound: null,
    };

    const rollText = results.map((r: TableResult) => {
      return r.text;
    });

    chatData.content = `
        <div class="my-roll-result">
          <div class="dnd5e2 chat-card">
            <section class="card-header description ">
              <header class="summary"><img class="gold-icon" src="icons/magic/lightning/bolts-forked-large-magenta.webp" alt="Wild Magic Surge">
                <div class="name-stacked"><span class="title">${game.i18n.format("WildMagicSurge5E.es_wild_magic_surge",)}</span>
                  <span class="subtitle">${rollText}</span>
                </div>
              </header>
            </section>
          </div>
          ${await roll.render()}
        </div>
      `;

    return chatData;
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
