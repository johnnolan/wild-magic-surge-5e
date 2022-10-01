import { WMSCONST } from "../WMSCONST";
import DieDescending from "./DieDescending";
import IncrementalCheck from "./IncrementalCheck";

export default class Flags {
  static FLAG_NAME = "wild-magic-surge-5e";
  static INCREMENT_CHECK_FLAG_OPTION = "surge_increment_resource";
  static DIE_DESCENDING_FLAG_OPTION = WMSCONST.DIE_DESCENDING_FLAG_OPTION;
  static readonly IncrementalCheckDefaultValue: FlagValue = {
    max: 20,
    min: 1,
    value: 1,
  };
  static readonly dieDescendingDefaultValue: FlagValue = {
    value: 1,
    min: 1,
    max: 6,
    dieValue: WMSCONST.DIE_VALUE.D20,
  };

  static async Setup(actor: Actor) {
    const dieDescendingCheckFlag = await actor.getFlag(
      WMSCONST.MODULE_FLAG_NAME,
      WMSCONST.DIE_DESCENDING_FLAG_OPTION
    );
    if (
      !dieDescendingCheckFlag ||
      !actor.system?.resources?.wmsurgedescending
    ) {
      await DieDescending.SetFlagResource(
        actor,
        Flags.dieDescendingDefaultValue
      );
    }

    const incrementalCheckFlag = await actor.getFlag(
      WMSCONST.MODULE_FLAG_NAME,
      this.INCREMENT_CHECK_FLAG_OPTION
    );
    if (!incrementalCheckFlag || !actor.system?.resources?.wmsurgeincrement) {
      await IncrementalCheck.SetFlagResource(
        actor,
        Flags.IncrementalCheckDefaultValue
      );
    }
  }
}
