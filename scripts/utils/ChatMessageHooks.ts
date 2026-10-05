import Logger from "../Logger";
import { WMSCONST } from "../WMSCONST";
import type { SurgeType } from "../types/domain";

export function AttachRollTableButton(
  html: HTMLElement,
  onRoll: (type: SurgeType) => void | Promise<unknown>,
): void {
  const button = html.querySelector<HTMLButtonElement>(".roll-table-wms");
  if (!button || button.dataset.wmsBound === "true") return;

  button.dataset.wmsBound = "true";
  button.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    const surgeType =
      button.dataset.wmsSurgeType === WMSCONST.SURGE_FEAT_TYPE.PathOfWildMagic
        ? WMSCONST.SURGE_FEAT_TYPE.PathOfWildMagic
        : WMSCONST.SURGE_FEAT_TYPE.WildMagicSurge;
    // DOM events have no completion contract; report an async roll failure here.
    try {
      void Promise.resolve(onRoll(surgeType)).catch((error: unknown) => {
        Logger.error("Roll-table button failed", "ChatMessageHooks", error);
      });
    } catch (error) {
      Logger.error("Roll-table button failed", "ChatMessageHooks", error);
    }
  });
}
