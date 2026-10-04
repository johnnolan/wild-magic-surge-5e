import { AttachRollTableButton } from "./ChatMessageHooks";
import Logger from "../Logger";

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
    expect(onRoll).toHaveBeenCalledWith("WMS");
    expect(onContainerClick).not.toHaveBeenCalled();
  });

  it("uses the Path of Wild Magic table for a Barbarian button", () => {
    const container = document.createElement("div");
    container.innerHTML =
      '<button class="roll-table-wms" data-wms-surge-type="POWM">Roll</button>';
    const onRoll = jest.fn();

    AttachRollTableButton(container, onRoll);
    container.querySelector<HTMLButtonElement>("button")?.click();

    expect(onRoll).toHaveBeenCalledWith("POWM");
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

  it("reports a rejected roll started by a DOM click", async () => {
    const container = document.createElement("div");
    const button = document.createElement("button");
    button.classList.add("roll-table-wms");
    container.append(button);
    const failure = new Error("table roll failed");
    const report = jest
      .spyOn(Logger, "error")
      .mockImplementation(() => undefined);
    try {
      AttachRollTableButton(container, () => Promise.reject(failure));
      button.click();
      await Promise.resolve();
      expect(report).toHaveBeenCalledWith(
        "Roll-table button failed",
        "ChatMessageHooks",
        failure,
      );
    } finally {
      report.mockRestore();
    }
  });

  it("does nothing when the chat message has no roll-table button", () => {
    const onRoll = jest.fn();

    expect(() =>
      AttachRollTableButton(document.createElement("div"), onRoll),
    ).not.toThrow();
    expect(onRoll).not.toHaveBeenCalled();
  });
});
