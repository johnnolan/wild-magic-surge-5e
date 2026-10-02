export function AttachRollTableButton(
  html: HTMLElement,
  onRoll: () => unknown,
): void {
  const button = html.querySelector<HTMLButtonElement>(".roll-table-wms");
  if (!button || button.dataset.wmsBound === "true") return;

  button.dataset.wmsBound = "true";
  button.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    onRoll();
  });
}
