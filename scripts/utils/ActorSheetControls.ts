export function CreateWMSActorSheetControl(
  actor: Actor,
  openActorHelper: (actor: Actor) => void,
): ApplicationV2.HeaderControlsEntry {
  return {
    action: "openWMSActorHelper",
    label: "WMS",
    icon: "fas fa-wrench",
    onClick: () => openActorHelper(actor),
  };
}
