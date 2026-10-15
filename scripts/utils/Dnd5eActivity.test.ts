import { actorFixture, deferred, itemFixture } from "../test/FoundryFixtures";
import { HandlePostUseActivity } from "./Dnd5eActivity";
import { actor } from "../../MockData/actor";
import "../../__mocks__/index";

describe("HandlePostUseActivity", () => {
  const item = itemFixture({ actor });
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

  it("ignores an activity without consumption data", async () => {
    await HandlePostUseActivity({ item }, handlers);

    expect(getTokenIdByActorId).not.toHaveBeenCalled();
    expect(onGMCheck).not.toHaveBeenCalled();
    expect(onPlayerCheck).not.toHaveBeenCalled();
  });

  it("ignores activity that did not consume a spell slot", async () => {
    await HandlePostUseActivity(
      { item, consumption: { spellSlot: false } },
      handlers,
    );

    expect(onGMCheck).not.toHaveBeenCalled();
    expect(onPlayerCheck).not.toHaveBeenCalled();
  });

  it("checks a consumed spell activity directly for the GM", async () => {
    await HandlePostUseActivity(
      { item, consumption: { spellSlot: true } },
      handlers,
    );

    expect(getTokenIdByActorId).toHaveBeenCalledWith(actor.id);
    expect(onGMCheck).toHaveBeenCalledWith(actor, item, "token-id", false);
    expect(onPlayerCheck).not.toHaveBeenCalled();
  });

  it("sends a consumed spell activity to the GM for a player", async () => {
    await HandlePostUseActivity(
      { item, consumption: { spellSlot: true } },
      { ...handlers, isGM: false },
    );

    expect(onPlayerCheck).toHaveBeenCalledWith({
      event: "SurgeCheck",
      data: { actorId: actor.id, tokenId: "token-id", item, isUpcast: false },
    });
    expect(onGMCheck).not.toHaveBeenCalled();
  });

  it("ignores an activity item without an actor", async () => {
    const orphanItem = itemFixture({ actor: null });
    await HandlePostUseActivity(
      { item: orphanItem, consumption: { spellSlot: true } },
      handlers,
    );

    expect(getTokenIdByActorId).not.toHaveBeenCalled();
    expect(onGMCheck).not.toHaveBeenCalled();
    expect(onPlayerCheck).not.toHaveBeenCalled();
  });

  it("checks locally for the GM when the actor has no ID or canvas token", async () => {
    const unsavedActor = actorFixture({ ...actor, id: null });
    const unsavedItem = itemFixture({ actor: unsavedActor });

    await HandlePostUseActivity(
      { item: unsavedItem, consumption: { spellSlot: true } },
      handlers,
    );

    expect(getTokenIdByActorId).not.toHaveBeenCalled();
    expect(onGMCheck).toHaveBeenCalledWith(
      unsavedActor,
      unsavedItem,
      undefined,
      false,
    );
  });

  it("does not send a player socket check without an actor ID", async () => {
    const unsavedItem = itemFixture({ actor: { ...actor, id: null } });

    await HandlePostUseActivity(
      { item: unsavedItem, consumption: { spellSlot: true } },
      { ...handlers, isGM: false },
    );

    expect(getTokenIdByActorId).not.toHaveBeenCalled();
    expect(onPlayerCheck).not.toHaveBeenCalled();
  });

  it("passes an absent canvas token explicitly to the GM check", async () => {
    getTokenIdByActorId.mockReturnValue(undefined);

    await HandlePostUseActivity(
      { item, consumption: { spellSlot: true } },
      handlers,
    );

    expect(onGMCheck).toHaveBeenCalledWith(actor, item, undefined, false);
  });

  it("waits for the GM check and propagates its failure", async () => {
    const check = deferred<void>();
    const gmCheck = jest.fn(() => check.promise);
    const pending = HandlePostUseActivity(
      { item, consumption: { spellSlot: true } },
      { ...handlers, onGMCheck: gmCheck },
    );
    expect(gmCheck).toHaveBeenCalledTimes(1);
    const failure = new Error("surge check failed");
    check.reject(failure);
    await expect(pending).rejects.toBe(failure);
  });
});

// Exercise both routes with the same hook classification.
describe.each([true, false])("cast scaling with GM=%s", (isGM) => {
  it.each([undefined, false, 0, -1, "2", NaN, Infinity, 2])(
    "classifies scaling %p and forwards only the cast type",
    async (scaling) => {
      const caster = actorFixture({ id: "caster" });
      const spell = itemFixture({ actor: caster, type: "spell" });
      const onGMCheck = jest.fn();
      const onPlayerCheck = jest.fn();
      await HandlePostUseActivity(
        { item: spell, consumption: { spellSlot: true } },
        {
          isGM,
          getTokenIdByActorId: () => undefined,
          onGMCheck,
          onPlayerCheck,
        },
        { scaling },
      );
      if (isGM)
        expect(onGMCheck).toHaveBeenCalledWith(
          caster,
          spell,
          undefined,
          scaling === 2,
        );
      else
        expect(onPlayerCheck).toHaveBeenCalledWith({
          event: "SurgeCheck",
          data: {
            actorId: "caster",
            tokenId: undefined,
            item: spell,
            isUpcast: scaling === 2,
          },
        });
    },
  );
  it("does not classify a scaled feature as an upcast spell", async () => {
    const onGMCheck = jest.fn();
    const onPlayerCheck = jest.fn();
    const feature = itemFixture({ actor, type: "feat" });
    await HandlePostUseActivity(
      { item: feature, consumption: { spellSlot: true } },
      { isGM, getTokenIdByActorId: () => undefined, onGMCheck, onPlayerCheck },
      { scaling: 2 },
    );
    if (isGM)
      expect(onGMCheck).toHaveBeenCalledWith(actor, feature, undefined, false);
    else expect(onPlayerCheck.mock.calls[0][0].data.isUpcast).toBe(false);
  });
});
