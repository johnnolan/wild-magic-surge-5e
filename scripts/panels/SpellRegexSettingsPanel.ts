import { WMSCONST } from "../WMSCONST";
import { SettingsList, UpdateObject } from "./Helpers";

export class SpellRegexSettingsPanel extends FormApplication {
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      title: "Spell Regex for Multiclass",
      template: "modules/wild-magic-surge-5e/templates/settings.html",
      id: `${WMSCONST.MODULE_FLAG_NAME}-chat-settings`,
      width: 520,
      height: "500",
      closeOnSubmit: true,
    });
  }

  settingsList(settings: any) {
    return SettingsList(settings);
  }

  // @ts-expect-error TS(2416): Property 'getData' in type 'SpellRegexSettingsPane... Remove this comment to see the full error message
  getData() {
    const settings = [WMSCONST.OPT_SPELL_REGEX_ENABLED, OPT_SPELL_REGEX];

    return {
      modules: this.settingsList(settings),
    };
  }

  // @ts-expect-error TS(2416): Property '_updateObject' in type 'SpellRegexSettin... Remove this comment to see the full error message
  _updateObject(_event: any, formData: any) {
    UpdateObject(formData);
  }
}
