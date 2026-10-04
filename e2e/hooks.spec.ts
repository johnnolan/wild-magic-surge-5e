import { test, expect } from "./fixtures";
import { createCaster, setSurgeStage } from "./support/actors";
import { castSpellFromSheet } from "./support/actions";
import { startModuleHookRecorder } from "./support/hook-events";
import { readSurgedFlag, readSurgeResource } from "./support/observations";
import {
  configureIncrementalIncrease,
  configureStandardOutcome,
} from "./support/recipes";
import { withFoundryRandomValue } from "./support/rolls";

test("prompt and surge hooks report the real spell outcome even when chat is hidden", async ({
  gmPage,
  world,
}) => {
  const caster = await createCaster(gmPage, {
    name: `E2E Notification Caster ${Date.now()}`,
  });
  world.trackActor(caster.actorId);
  const recorder = await startModuleHookRecorder(gmPage, [
    "CheckForSurge",
    "IsWildMagicSurge",
  ]);
  try {
    await world.setSetting("autoRollD20", false);
    await world.setSetting("magicSurgeChatMessageEnabled", false);
    await castSpellFromSheet(gmPage, caster);
    await expect
      .poll(async () => (await recorder.read()).CheckForSurge?.length)
      .toBe(1);
    expect((await recorder.read()).CheckForSurge).toEqual([{ value: true }]);

    await configureStandardOutcome(world, "surge");
    await castSpellFromSheet(gmPage, caster);
    await expect
      .poll(async () => (await recorder.read()).IsWildMagicSurge?.length)
      .toBe(1);
    expect((await recorder.read()).IsWildMagicSurge[0]).toMatchObject({
      surge: true,
      actorId: caster.actorId,
    });
  } finally {
    await recorder.stop();
  }
});

test("incremental and descending notifications follow real spell casts", async ({
  gmPage,
  world,
}) => {
  const caster = await createCaster(gmPage, {
    name: `E2E Resource Hook Caster ${Date.now()}`,
  });
  world.trackActor(caster.actorId);
  const recorder = await startModuleHookRecorder(gmPage, [
    "IncrementalCheckChanged",
    "DieDescendingChanged",
  ]);
  try {
    await configureIncrementalIncrease(world);
    await castSpellFromSheet(gmPage, caster);
    await expect
      .poll(async () => (await recorder.read()).IncrementalCheckChanged?.length)
      .toBe(1);
    expect((await recorder.read()).IncrementalCheckChanged).toEqual([
      { value: 2 },
    ]);

    await world.setSetting("OPT_SURGE_TYPE", "DIE_DESCENDING");
    await setSurgeStage(gmPage, caster.actorId, 1, 6, "resource");
    await withFoundryRandomValue(gmPage, 0.5, async () => {
      await castSpellFromSheet(gmPage, caster);
      await expect
        .poll(async () => (await recorder.read()).DieDescendingChanged?.length)
        .toBe(1);
    });
    expect((await recorder.read()).DieDescendingChanged[0]).toMatchObject({
      max: 6,
      value: 2,
    });
  } finally {
    await recorder.stop();
  }
});

test("documented manual hooks set and reset the caster's stored state", async ({
  gmPage,
  world,
}) => {
  const caster = await createCaster(gmPage, {
    name: `E2E Manual Hook Caster ${Date.now()}`,
  });
  world.trackActor(caster.actorId);
  await world.setSetting("OPT_RESOURCE_TYPE", "NONE");
  await world.setSetting("enableRollTable", "DEFAULT");

  async function callManualHook(name: string, value?: number) {
    await gmPage.evaluate(
      ({ name, actorId, value }) => {
        const { Hooks } = globalThis as unknown as {
          Hooks: { callAll(name: string, ...args: unknown[]): void };
        };
        Hooks.callAll(`wild-magic-surge-5e.${name}`, actorId, value);
      },
      { name, actorId: caster.actorId, value },
    );
  }

  await callManualHook("SetIncrementalCheck", 9);
  await expect
    .poll(async () => (await readSurgeResource(gmPage, caster.actorId))?.value)
    .toBe(9);
  await callManualHook("SetDieDescending", 4);
  await expect
    .poll(
      async () =>
        (await readSurgeResource(gmPage, caster.actorId, "resource"))?.value,
    )
    .toBe(4);

  await callManualHook("ResetIncrementalCheck");
  await expect
    .poll(async () => (await readSurgeResource(gmPage, caster.actorId))?.value)
    .toBe(1);
  expect(
    (await readSurgeResource(gmPage, caster.actorId, "resource"))?.value,
  ).toBe(4);
  await callManualHook("SetIncrementalCheck", 7);
  await expect
    .poll(async () => (await readSurgeResource(gmPage, caster.actorId))?.value)
    .toBe(7);
  await callManualHook("ResetDieDescending");
  await expect
    .poll(
      async () =>
        (await readSurgeResource(gmPage, caster.actorId, "resource"))?.value,
    )
    .toBe(1);
  expect((await readSurgeResource(gmPage, caster.actorId))?.value).toBe(7);

  await callManualHook("Reset");
  await expect
    .poll(async () => (await readSurgeResource(gmPage, caster.actorId))?.value)
    .toBe(1);

  await gmPage.evaluate(async (actorId) => {
    const { game, Hooks, Roll } = globalThis as unknown as {
      game: {
        actors: {
          get(id: string): unknown;
        };
      };
      Hooks: { callAll(name: string, ...args: unknown[]): void };
      Roll: new (formula: string) => {
        evaluate(): Promise<unknown>;
      };
    };
    const actor = game.actors.get(actorId);
    const roll = new Roll("1d1");
    await roll.evaluate();
    Hooks.callAll("wild-magic-surge-5e.manualTriggerWMS", actor, roll);
  }, caster.actorId);
  await expect.poll(() => readSurgedFlag(gmPage, caster.actorId)).toBe(true);
});
