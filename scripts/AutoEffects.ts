import { WMSCONST } from "./WMSCONST";

/**
 * AutoEffects class for handling sequencer animations
 * @class AutoEffects
 */
class AutoEffects {
  /**
   * Checks to see if module is active
   * @public
   * @return {boolean}
   */
  static ModuleActive(moduleName: string): boolean {
    return game.modules.get(moduleName)?.active;
  }

  /**
   * Runs the Wild Magic Surge animation
   * @public
   * @return {Promise<void>}
   */
  static async Run(tokenId: string | undefined): Promise<void> {
    if (!tokenId) return;
    if (
      !game.settings.get(
        `${WMSCONST.MODULE_ID}`,
        `${WMSCONST.OPT_EFFECTS_ENABLED}`
      )
    )
      return;
    if (!this.ModuleActive("sequencer")) {
      ui.notifications?.info(
        `Wild Magic Surge 5e: Play animation on surge is enabled in settings but the sequencer module is not active/installed. Disable the play animation in settings or install and enable sequencer.`
      );
      return;
    }
    if (!this.ModuleActive("JB2A_DnD5e")) {
      ui.notifications?.info(
        `Wild Magic Surge 5e: Play animation on surge is enabled in settings but the JB2A module is not active/installed. Disable the play animation in settings or install and enable JB2A.`
      );
      return;
    }

    // @ts-expect-error TS(2304): Cannot find name 'Sequence'.
    const wildMagicSurgeEffect = new Sequence(WMSCONST.MODULE_ID)
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
