import { getModuleSetting } from "./utils/TypedSettings";
import { WMSCONST } from "./WMSCONST";
import CallHooks from "./utils/CallHooks";

function isTableDraw(value: Roll | RollTable.Draw): value is RollTable.Draw {
  return "results" in value && "roll" in value;
}

/**
 * Chat class for handling common chat methods
 * @class Chat
 */
export default class Chat {
  /**
   * Sends the correct ChatMessage to the Chat window
   * @public
   * @return The created chat message, or undefined when no message is created.
   * @param type - The type of roll to be sent.
   * @param message - The chat message to send.
   * @param rollObject - Roll or RollTable draw to send.
   * @param rollTable - Optional RollTable to send.
   */
  static async Send(
    type: string,
    message: string,
    rollObject?: Roll | RollTable.Draw,
    rollTable?: RollTable,
  ): Promise<ChatMessage.Stored | undefined> {
    const isWhisperRollResultGM = await getModuleSetting(
      WMSCONST.OPT_WHISPER_GM,
    );
    const isWhisperAutoRollTableGM = await getModuleSetting(
      WMSCONST.OPT_WHISPER_GM_ROLL_CHAT,
    );

    const gmsToWhisper = ChatMessage.getWhisperRecipients("GM")
      .map((u) => u.id)
      .filter((id): id is string => !!id);

    let chatData: ChatMessage.CreateData;
    let rollMode: ChatMessage.PassableRollMode | undefined;

    switch (type) {
      case WMSCONST.CHAT_TYPE.ROLL:
        if (!rollObject || isTableDraw(rollObject)) return;
        chatData = await this.createRollChat(
          message,
          rollObject,
          isWhisperRollResultGM,
        );
        if (!isWhisperRollResultGM) {
          rollMode =
            getModuleSetting(WMSCONST.OPT_ROLLTABLE_ENABLE) === "PLAYER_TRIGGER"
              ? "publicroll"
              : game.settings?.get("core", "rollMode");
        }
        break;
      case WMSCONST.CHAT_TYPE.TABLE:
        if (!rollObject || !rollTable || !isTableDraw(rollObject)) return;
        chatData = await this.createRollTable(rollObject);
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
    chatData.speaker = ChatMessage.getSpeaker();

    if (rollMode) {
      return await ChatMessage.create(chatData, { rollMode });
    }
    return await ChatMessage.create(chatData);
  }

  static setChatToWhisper(
    chatData: ChatMessage.CreateData,
    gmsToWhisper: string[],
  ): ChatMessage.CreateData {
    chatData.whisper = gmsToWhisper;
    chatData.blind = true;

    return chatData;
  }

  /**
   * Creates a basic HTML string message
   * @return The chat message create data.
   * @param message - The chat message to send.
   */
  static async createDefaultChat(
    message: string,
  ): Promise<ChatMessage.CreateData> {
    return {
      content: `<div>${message}</div>`,
    };
  }

  /**
   * Creates a HTML string message with a Roll result and whether to whisper to the GM or not
   * @return The chat message create data.
   * @param message - The chat message to send.
   * @param roll - The Roll to parse for the message.
   * @param isWhisperGM - Should the roll only whisper the GM.
   */
  static async createRollChat(
    message: string,
    roll: Roll,
    isWhisperGM: boolean,
  ): Promise<ChatMessage.CreateData> {
    if (isWhisperGM) {
      return {
        content: `<div>${message} (${roll.total ?? 0})</div>`,
      };
    } else {
      const wildMagicSurgeName = await getModuleSetting(WMSCONST.OPT_WMS_NAME);
      return {
        flavor: `${wildMagicSurgeName} Check - ${message}`,
        rolls: [roll],
      };
    }
  }

  /**
   * Creates a HTML string message based on a RollTable
   * @return The chat message create data.
   * @param rollResult The result of a RollTable draw.
   */
  static async createRollTable(
    rollResult: RollTable.Draw,
  ): Promise<ChatMessage.CreateData> {
    const results = rollResult.results;
    const roll = rollResult.roll;

    const chatData: ChatMessage.CreateData = {
      rolls: [roll],
      sound: null,
    };

    const rollText = results.map((r: TableResult) => {
      return r.text;
    });
    const surgeName =
      game.i18n?.format("WildMagicSurge5E.es_wild_magic_surge") ??
      "Wild Magic Surge";

    chatData.content = `
        <div class="my-roll-result">
          <div class="dnd5e2 chat-card">
            <section class="card-header description ">
              <header class="summary"><img class="gold-icon" src="icons/magic/lightning/bolts-forked-large-magenta.webp" alt="Wild Magic Surge">
                <div class="name-stacked"><span class="title">${surgeName}</span>
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
   * @return Resolves after the optional chat message is created.
   */
  static async RunMessageCheck(): Promise<void> {
    CallHooks.Call("CheckForSurge", { value: true });
    if (getModuleSetting(WMSCONST.OPT_CHAT_MSG_ENABLED)) {
      await this.Send(
        WMSCONST.CHAT_TYPE.DEFAULT,
        getModuleSetting(WMSCONST.OPT_CHAT_MSG),
      );
    }
  }
}
