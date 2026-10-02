import { HandlePostUseActivity } from "./Dnd5eActivity";
import { actor } from "../../MockData/actor";
import "../../__mocks__/index";

describe("HandlePostUseActivity", () => {
  const item = { actor } as Item;
  const getTokenIdByActorId = jest.fn().mockReturnValue("token-id");
  const onGMCheck = jest.fn();
  const onPlayerCheck = jest.fn();
  const handlers = {
    getTokenIdByActorId,
    isGM: true,
    onGMCheck,
    onPlayerCheck,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    getTokenIdByActorId.mockReturnValue("token-id");
  });

  it("ignores an activity without consumption data", () => {
    HandlePostUseActivity({ item }, handlers);

    expect(getTokenIdByActorId).not.toHaveBeenCalled();
    expect(onGMCheck).not.toHaveBeenCalled();
    expect(onPlayerCheck).not.toHaveBeenCalled();
  });

  it("ignores activity that did not consume a spell slot", () => {
    HandlePostUseActivity(
      { item, consumption: { spellSlot: false } },
      handlers,
    );

    expect(onGMCheck).not.toHaveBeenCalled();
    expect(onPlayerCheck).not.toHaveBeenCalled();
  });

  it("checks a consumed spell activity directly for the GM", () => {
    HandlePostUseActivity({ item, consumption: { spellSlot: true } }, handlers);

    expect(getTokenIdByActorId).toHaveBeenCalledWith(actor.id);
    expect(onGMCheck).toHaveBeenCalledWith(actor, item, "token-id");
    expect(onPlayerCheck).not.toHaveBeenCalled();
  });

  it("sends a consumed spell activity to the GM for a player", () => {
    HandlePostUseActivity(
      { item, consumption: { spellSlot: true } },
      { ...handlers, isGM: false },
    );

    expect(onPlayerCheck).toHaveBeenCalledWith({
      event: "SurgeCheck",
      data: { actorId: actor.id, tokenId: "token-id", item },
    });
    expect(onGMCheck).not.toHaveBeenCalled();
  });

  it("ignores an activity item without an actor", () => {
    const orphanItem = { actor: null } as unknown as Item;
    HandlePostUseActivity(
      { item: orphanItem, consumption: { spellSlot: true } },
      handlers,
    );

    expect(getTokenIdByActorId).not.toHaveBeenCalled();
    expect(onGMCheck).not.toHaveBeenCalled();
    expect(onPlayerCheck).not.toHaveBeenCalled();
  });
});
