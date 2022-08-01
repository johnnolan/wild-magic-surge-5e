import { MODULE_ID, OPT_EFFECTS_ENABLED } from "./Settings.js";

/**
 * AutoEffects class for handling sequencer animations
 * @class AutoEffects
 * @example
 * let autoEffects = new AutoEffects(tokenId);
 */
class AutoEffects {
  constructor() {
    // This is intentional
  }

  /**
   * Runs the Wild Magic Surge animation
   * @public
   * @return {Promise<void>}
   */
  static async Run(tokenId) {
    if (!game.settings.get(`${MODULE_ID}`, `${OPT_EFFECTS_ENABLED}`)) return;
    if (!game.modules.get("sequencer")?.active) {
      ui.notifications.info(
        `Wild Magic Surge 5e: Play animation on surge is enabled in settings but the sequencer module is not active/installed. Disable the play animation in settings or install and enable sequencer.`
      );
      return;
    }
    if (!game.modules.get("JB2A_DnD5e")?.active) {
      ui.notifications.info(
        `Wild Magic Surge 5e: Play animation on surge is enabled in settings but the JB2A module is not active/installed. Disable the play animation in settings or install and enable JB2A.`
      );
      return;
    }

    const wildMagicSurgeEffect = new Sequence(MODULE_ID)
      .effect()
      .file(
        "modules/JB2A_DnD5e/Library/Generic/Nature/SwirlingLeavesComplete01_02_Regular_Green_400x400.webm"
      )
      .duration(10000)
      .fadeIn(500)
      .fadeOut(1000)
      .atLocation(tokenId)
      .effect()
      .file(
        "modules/JB2A_DnD5e/Library/Generic/Token_Border/TokenBorderCircleSpin_04_Regular_Blue_400x400.webm"
      )
      .duration(10000)
      .fadeIn(500)
      .fadeOut(1000)
      .atLocation(tokenId)
      .effect()
      .file(
        "modules/JB2A_DnD5e/Library/Generic/Particles/ParticlesOutward02_03_Regular_GreenYellow_400x400.webm"
      )
      .duration(10000)
      .fadeIn(500)
      .fadeOut(1000)
      .atLocation(tokenId);

    wildMagicSurgeEffect.play();
  }
}

export default AutoEffects;
