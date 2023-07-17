import { WMSCONST } from "../WMSCONST";
import SpellParser from "./SpellParser";

export default class SurgeDetails {
  _actor: Actor;
  _item: Item;
  _userId?: string;
  _hasPathOfWildMagicFeat: boolean;
  _raging: boolean;
  _isASpell: boolean;
  _spellLevel: string;
  _isSorcererSpell: boolean;
  _hasWildMagicFeat: boolean;
  _isNpc: boolean;
  _valid: boolean;

  constructor(actor: Actor, item: Item) {
    this._actor = actor;
    this._item = item;

    this._valid = false;

    this._hasPathOfWildMagicFeat = SpellParser.IsPathOfWildMagicFeat(
      this._actor,
    );
    this._raging = SpellParser.IsRage(this._item);
    this._isASpell = SpellParser.IsSpell(this._item);
    this._spellLevel = SpellParser.SpellLevel(this._item);
    this._isSorcererSpell = SpellParser.IsSorcererSpell(this._item);
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
        `${WMSCONST.OPT_SPELL_REGEX_ENABLED}`,
      )
    ) {
      return this._isSorcererSpell;
    }
    return undefined;
  }

  get valid(): boolean {
    if (this._hasPathOfWildMagicFeat) {
      return this._raging;
    }

    if (!this._hasWildMagicFeat) {
      return false;
    }

    if (this.isSorcererSpellRegexMatch !== undefined) {
      return this._isASpell && this.isSorcererSpellRegexMatch;
    }

    let isValid = this._isASpell;

    if (
      !game.settings.get(`${WMSCONST.MODULE_ID}`, `${WMSCONST.OPT_ENABLE_NPCS}`)
    ) {
      isValid = isValid && !this._isNpc;
    }

    return isValid;
  }
}
