import { MODULE_FLAG_NAME } from "../Settings.js";
import TidesOfChaos from "../TidesOfChaos.js";
import SpellParser from "../utils/SpellParser.js";

export class ActorHelperPanel extends FormApplication {
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      title: "Wild Magic Surge 5e Information",
      template: "modules/wild-magic-surge-5e/templates/ActorHelperPanel.html",
      id: `${MODULE_FLAG_NAME}-actor-help`,
      width: 480,
      height: "300",
      closeOnSubmit: true,
    });
  }

  async getData() {
    const actor = this.object;
    const tidesOfChaos = new TidesOfChaos();
    const spellParser = new SpellParser(actor);

    const hasWildMagicFeat = spellParser.IsWildMagicFeat();
    const hasTidesOfChaos = await tidesOfChaos.IsTidesOfChaosSetup(actor);

    return {
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
