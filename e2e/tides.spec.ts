import { test, expect } from "./fixtures";
import { createCaster } from "./support/actors";
import { castSpellFromSheet, useFeatureFromSheet } from "./support/actions";
import { addTidesOfChaos, readTidesUses } from "./support/feats";
import { readSurgedFlag } from "./support/observations";
import { configureStandardOutcome } from "./support/recipes";

test("using Tides forces a surge and restores its spent use when enabled", async ({
  gmPage,
  world,
}) => {
  test.setTimeout(180_000);
  const caster = await createCaster(gmPage, {
    name: `E2E Tides Caster ${Date.now()}`,
  });
  world.trackActor(caster.actorId);
  const featId = await addTidesOfChaos(gmPage, caster.actorId);
  await world.setSetting("surgeTocEnabled", true);
  await world.setSetting("enableTidesOfChaosRecharge", true);
  await configureStandardOutcome(world, "no surge");

  await useFeatureFromSheet(gmPage, caster.actorId, featId);
  await expect
    .poll(
      async () => (await readTidesUses(gmPage, caster.actorId, featId)).value,
    )
    .toBe(0);
  expect((await readTidesUses(gmPage, caster.actorId, featId)).spent).toBe(1);
  await castSpellFromSheet(gmPage, caster);

  await expect.poll(() => readSurgedFlag(gmPage, caster.actorId)).toBe(true);
  await expect
    .poll(
      async () => (await readTidesUses(gmPage, caster.actorId, featId)).value,
    )
    .toBe(1);
  expect((await readTidesUses(gmPage, caster.actorId, featId)).spent).toBe(0);
});

test("a spent Tides use waits for an ordinary surge when auto surge is off", async ({
  gmPage,
  world,
}) => {
  test.setTimeout(180_000);
  const caster = await createCaster(gmPage, {
    name: `E2E Tides Control ${Date.now()}`,
  });
  world.trackActor(caster.actorId);
  const featId = await addTidesOfChaos(gmPage, caster.actorId);
  await world.setSetting("surgeTocEnabled", false);
  await world.setSetting("enableTidesOfChaosRecharge", true);
  await useFeatureFromSheet(gmPage, caster.actorId, featId);
  await expect
    .poll(
      async () => (await readTidesUses(gmPage, caster.actorId, featId)).value,
    )
    .toBe(0);
  expect((await readTidesUses(gmPage, caster.actorId, featId)).spent).toBe(1);

  await configureStandardOutcome(world, "no surge");
  await castSpellFromSheet(gmPage, caster);
  await expect.poll(() => readSurgedFlag(gmPage, caster.actorId)).toBe(false);
  expect((await readTidesUses(gmPage, caster.actorId, featId)).value).toBe(0);
  expect((await readTidesUses(gmPage, caster.actorId, featId)).spent).toBe(1);

  await configureStandardOutcome(world, "surge");
  await castSpellFromSheet(gmPage, caster);
  await expect.poll(() => readSurgedFlag(gmPage, caster.actorId)).toBe(true);
  await expect
    .poll(
      async () => (await readTidesUses(gmPage, caster.actorId, featId)).value,
    )
    .toBe(1);
  expect((await readTidesUses(gmPage, caster.actorId, featId)).spent).toBe(0);
});
