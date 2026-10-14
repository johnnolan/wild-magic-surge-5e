import { WMSCONST } from "../WMSCONST";
import DieDescending from "./DieDescending";
import IncrementalCheck from "./IncrementalCheck";
import { getModuleSetting } from "./TypedSettings";

/** Reset both counters, leaving the selected mode in a shared sheet resource. */
export async function ResetSurgeChecks(actor: Actor): Promise<void> {
  if (getModuleSetting(WMSCONST.OPT_SURGE_TYPE) === "DIE_DESCENDING") {
    await IncrementalCheck.Reset(actor);
    await DieDescending.Reset(actor);
  } else {
    await DieDescending.Reset(actor);
    await IncrementalCheck.Reset(actor);
  }
}
