import { WMSCONST } from "../WMSCONST";
import SpellParser from "./SpellParser";

export default class SurgeChatMessageDetails {
  _actor: Actor;
  _userId?: string;
  _isWhisperToGM = false;
  _whisperToGM: boolean;
  _isMessageFromGameMaster: boolean;
  _isMessageFromPlayerWhoRolled: boolean;
  _hasPathOfWildMagicFeat: boolean;
  _raging: boolean;
  _isASpell: boolean;
  _spellLevel: string;
  _isSorcererSpell: boolean;
  _hasWildMagicFeat: boolean;
  _isNpc: boolean;
  _valid: boolean;
  _chatMessage: ChatMessage;

  constructor(
    chatMessage: ChatMessage,
    actor: Actor,
    userId: string,
    userIsGm: boolean
  ) {
    this._chatMessage = chatMessage;
    this._actor = actor;
    this._isMessageFromGameMaster = userIsGm;
    this._userId = userId;

    this._valid = false;

    this._whisperToGM = game.settings.get(
      `${WMSCONST.MODULE_ID}`,
      `${WMSCONST.OPT_WHISPER_GM}`
    );
    this._isMessageFromPlayerWhoRolled =
      this._chatMessage.user?.id === this._userId;

    this._hasPathOfWildMagicFeat = SpellParser.IsPathOfWildMagicFeat(
      this._actor
    );
    this._raging = SpellParser.IsRage(chatMessage.content, this._actor);
    this._isASpell = SpellParser.IsSpell(chatMessage.content, this._actor);
    this._spellLevel = SpellParser.SpellLevel(chatMessage.content, this._actor);
    this._isSorcererSpell = SpellParser.IsSorcererSpell(
      chatMessage.content,
      this._actor
    );
    this._hasWildMagicFeat = SpellParser.IsWildMagicFeat(this._actor);
    this._isNpc = SpellParser.IsNPC(this._actor);
  }

  get spellLevel(): string {
    return this._spellLevel;
  }

  get hasPathOfWildMagicFeat(): boolean {
    return this._hasPathOfWildMagicFeat;
  }

  get isSorcererSpellRegexMatch(): boolean | undefined {
    if (
      game.settings.get(
        `${WMSCONST.MODULE_ID}`,
        `${WMSCONST.OPT_SPELL_REGEX_ENABLED}`
      )
    ) {
      return this._isSorcererSpell;
    }
    return undefined;
  }

  get isUserOnMessageValid(): boolean {
    if (this._whisperToGM && this._isMessageFromGameMaster) return true;
    if (!this._whisperToGM && this._isMessageFromPlayerWhoRolled) return true;
    return false;
  }

  get valid(): boolean {
    if (!this.isUserOnMessageValid) return false;

    if (this._hasPathOfWildMagicFeat) {
      return this._raging;
    }

    if (this.isSorcererSpellRegexMatch !== undefined) {
      return this.isSorcererSpellRegexMatch;
    }

    let isValid = this._isASpell && this._hasWildMagicFeat;

    if (
      !game.settings.get(`${WMSCONST.MODULE_ID}`, `${WMSCONST.OPT_ENABLE_NPCS}`)
    ) {
      isValid = isValid && !this._isNpc;
    }

    return isValid;
  }
}
