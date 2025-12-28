import TidesOfChaos from "../TidesOfChaos";
import SpellParser from "../utils/SpellParser";
let { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api;

export class ActorHelperPanel extends HandlebarsApplicationMixin(ApplicationV2) {
  constructor(actor) {
        super({id: 'wild-magic-config'});
        this.actor = actor.document;
    }
  static DEFAULT_OPTIONS = {
    id: "wild-magic-config",
    classes: ["wild-magic", "sheet"],
    title: "Wild Magic Surge - Actor Helper",
    width: 400,
    height: "auto",
    resizable: false,
    minimizable: false
  };

  static PARTS = {
    form: {
      template: "modules/wild-magic-surge-5e/templates/ActorHelperPanel.hbs",
      scrollable: ['']
    }
  };

  async _prepareContext(): Promise<object> {
    const actor = this.actor;

    const hasWildMagicFeat = SpellParser.IsWildMagicFeat(actor);
    const tides = await TidesOfChaos.IsTidesOfChaosSetup(actor);

    return {
      actor: {
        name: actor.name
      },
      settings: {
        isValid: hasWildMagicFeat && tides.isValid,
        hasWildMagicFeat,
        hasTidesOfChaosResource: tides.hasTidesOfChaosResource,
        hasTidesOfChaosFeat: tides.hasTidesOfChaosFeat
      }
    };
  }
}
