import { CreateWMSActorSheetControl } from "./ActorSheetControls";
import { actor } from "../../MockData/actor";

describe("CreateWMSActorSheetControl", () => {
  it("returns a V14 header control with its actor action", () => {
    const openActorHelper = jest.fn();
    const control = CreateWMSActorSheetControl(actor, openActorHelper);

    expect(control).toMatchObject({
      action: "openWMSActorHelper",
      label: "WMS",
      icon: "fas fa-wrench",
    });
    expect(control.onClick).toBeDefined();

    control.onClick?.(new MouseEvent("click") as PointerEvent);
    expect(openActorHelper).toHaveBeenCalledWith(actor);
  });
});
