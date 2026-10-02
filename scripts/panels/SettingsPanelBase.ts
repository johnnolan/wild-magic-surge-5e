import { WMSCONST } from "../WMSCONST";
import { SettingsList, UpdateObject } from "./Helpers";
import type { PanelSettingKey, SettingsPanelData } from "./Helpers";

const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api;

/** Shared rendering and submission for the settings menus. */
export abstract class SettingsPanelBase extends HandlebarsApplicationMixin(
  ApplicationV2,
) {
  protected static readonly panelTitleKey: string;
  protected abstract readonly settingKeys: readonly PanelSettingKey[];

  static DEFAULT_OPTIONS = {
    id: `${WMSCONST.MODULE_FLAG_NAME}-chat-settings`,
    tag: "form",
    position: { width: 520, height: 500 },
    form: {
      handler: this.submitSettings,
      submitOnChange: false,
      closeOnSubmit: true,
    },
  };

  static PARTS = {
    settings: {
      template: "modules/wild-magic-surge-5e/templates/settings.html",
    },
  };

  constructor() {
    const titleKey = (new.target as typeof SettingsPanelBase).panelTitleKey;
    super({ window: { title: game.i18n?.format(titleKey) ?? titleKey } });
  }

  getData(): SettingsPanelData {
    return { modules: SettingsList(this.settingKeys) };
  }

  protected async _prepareContext(): Promise<
    SettingsPanelData & { tabs: Record<string, never> }
  > {
    return { ...this.getData(), tabs: {} };
  }

  private static async submitSettings(
    _event: Event,
    _form: HTMLFormElement,
    formData: foundry.applications.ux.FormDataExtended,
  ): Promise<void> {
    await UpdateObject(formData.object);
  }
}
