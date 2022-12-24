import { WMSCONST } from "../WMSCONST";
import TidesOfChaos from "../TidesOfChaos";
import SpellParser from "../utils/SpellParser";

export class ActorHelperPanel extends FormApplication {
  protected _updateObject(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _event: Event,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _formData?: object | undefined
  ): Promise<unknown> {
    throw new Error("Method not implemented.");
  }

  object!: Actor;
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      title: game.i18n.format("WildMagicSurge5E.settings_panel_information"),
      template: "modules/wild-magic-surge-5e/templates/ActorHelperPanel.html",
      id: `${WMSCONST.MODULE_FLAG_NAME}-actor-help`,
      width: 480,
      height: "300",
      closeOnSubmit: true,
    });
  }

  // @ts-expect-error TS(2416): Property 'getData' in type 'ActorHelperPanel' is n... Remove this comment to see the full error message
  async getData() {
    const actor = this.object;

    const hasWildMagicFeat = SpellParser.IsWildMagicFeat(actor);
    const hasTidesOfChaos = await TidesOfChaos.IsTidesOfChaosSetup(actor);

    return <ModuleSetup>{
      actor: {
        name: actor.name,
      },
      settings: {
        isValid: hasWildMagicFeat && hasTidesOfChaos.isValid,
        hasWildMagicFeat: hasWildMagicFeat,
        hasTidesOfChaosResource: hasTidesOfChaos.hasTidesOfChaosResource,
        hasTidesOfChaosFeat: hasTidesOfChaos.hasTidesOfChaosFeat,
      },
    };
  }
}
