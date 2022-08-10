import { MODULE_FLAG_NAME } from "../Settings";
import TidesOfChaos from "../TidesOfChaos";
import SpellParser from "../utils/SpellParser";

// @ts-expect-error TS(2515): Non-abstract class 'ActorHelperPanel' does not imp... Remove this comment to see the full error message
export class ActorHelperPanel extends FormApplication {
  object: any;
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

  // @ts-expect-error TS(2416): Property 'getData' in type 'ActorHelperPanel' is n... Remove this comment to see the full error message
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
