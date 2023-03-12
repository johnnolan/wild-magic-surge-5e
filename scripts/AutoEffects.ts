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
  static _isModuleActive(moduleName: string): boolean {
    return game.modules.get(moduleName)?.active;
  }

  static _getJB2AFilePath(): string {
    if (this._isModuleActive("jb2a_patreon")) {
      return "modules/jb2a_patreon/Library/Generic";
    }

    if (this._isModuleActive("JB2A_DnD5e")) {
      return "modules/JB2A_DnD5e/Library/Generic";
    }

    return "";
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
    if (!this._isModuleActive("sequencer")) {
      ui.notifications?.info(
        `Wild Magic Surge 5e: Play animation on surge is enabled in settings but the sequencer module is not active/installed. Disable the play animation in settings or install and enable sequencer.`
      );
      return;
    }
    if (
      !this._isModuleActive("JB2A_DnD5e") &&
      !this._isModuleActive("jb2a_patreon")
    ) {
      ui.notifications?.info(
        `Wild Magic Surge 5e: Play animation on surge is enabled in settings but the JB2A module is not active/installed. Disable the play animation in settings or install and enable JB2A.`
      );
      return;
    }

    const animationPath = this._getJB2AFilePath();

    // @ts-expect-error TS(2304): Cannot find name 'Sequence'.
    const wildMagicSurgeEffect = new Sequence(WMSCONST.MODULE_ID)
      .effect()
      .file(
        `${animationPath}/Energy/SwirlingSparkles_01_Regular_OrangePurple_400x400.webm`
      )
      .duration(10000)
      .fadeIn(500)
      .fadeOut(1000)
      .atLocation(tokenId)
      .effect()
      .file(
        `${animationPath}/Token_Border/TokenBorderCircleSpin_04_Regular_Blue_400x400.webm`
      )
      .duration(10000)
      .fadeIn(500)
      .fadeOut(1000)
      .atLocation(tokenId)
      .effect()
      .file(`${animationPath}/Marker/EnergyStrands_01_Dark_Green_600x600.webm`)
      .duration(10000)
      .fadeIn(500)
      .fadeOut(1000)
      .atLocation(tokenId);

    wildMagicSurgeEffect.play();
  }
}

export default AutoEffects;
