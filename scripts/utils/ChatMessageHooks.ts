import Logger from "../Logger";

export function AttachRollTableButton(
  html: HTMLElement,
  onRoll: () => void | Promise<unknown>,
): void {
  const button = html.querySelector<HTMLButtonElement>(".roll-table-wms");
  if (!button || button.dataset.wmsBound === "true") return;

  button.dataset.wmsBound = "true";
  button.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    // DOM events have no completion contract; report an async roll failure here.
    try {
      void Promise.resolve(onRoll()).catch((error: unknown) => {
        Logger.error("Roll-table button failed", "ChatMessageHooks", error);
      });
    } catch (error) {
      Logger.error("Roll-table button failed", "ChatMessageHooks", error);
    }
  });
}
