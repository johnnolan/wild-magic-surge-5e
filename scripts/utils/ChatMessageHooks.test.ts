import { AttachRollTableButton } from "./ChatMessageHooks";

describe("AttachRollTableButton", () => {
  it("handles button clicks and prevents propagation", () => {
    const container = document.createElement("div");
    const button = document.createElement("button");
    button.classList.add("roll-table-wms");
    container.append(button);

    const onRoll = jest.fn();
    const onContainerClick = jest.fn();
    container.addEventListener("click", onContainerClick);

    AttachRollTableButton(container, onRoll);
    button.dispatchEvent(
      new MouseEvent("click", { bubbles: true, cancelable: true }),
    );

    expect(onRoll).toHaveBeenCalledTimes(1);
    expect(onContainerClick).not.toHaveBeenCalled();
  });

  it("does not bind the same rendered button more than once", () => {
    const container = document.createElement("div");
    const button = document.createElement("button");
    button.classList.add("roll-table-wms");
    container.append(button);
    const onRoll = jest.fn();

    AttachRollTableButton(container, onRoll);
    AttachRollTableButton(container, onRoll);
    button.click();

    expect(onRoll).toHaveBeenCalledTimes(1);
  });

  it("does nothing when the chat message has no roll-table button", () => {
    const onRoll = jest.fn();

    expect(() =>
      AttachRollTableButton(document.createElement("div"), onRoll),
    ).not.toThrow();
    expect(onRoll).not.toHaveBeenCalled();
  });
});
