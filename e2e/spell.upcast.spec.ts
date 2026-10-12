import { test, expect } from "./fixtures";
import {
  createCaster,
  grantActorToPlayer,
  refreshPlayerWorld,
} from "./support/actors";
import { castSpellFromSheet, useFeatureFromSheet } from "./support/actions";
import { addTidesOfChaos, readTidesUses } from "./support/feats";
import { readSpellSlots, readSurgedFlag } from "./support/observations";
import { configureStandardOutcome } from "./support/recipes";

for (const route of ["GM", "player"] as const) {
  test(`${route} upcasts trigger WMS while base-level casts are excluded`, async ({
    gmPage,
    player,
    world,
  }) => {
    const caster = await createCaster(gmPage, {
      name: `E2E Upcast WMS ${route} ${Date.now()}`,
      additionalSlotLevel: 3,
    });
    world.trackActor(caster.actorId);
    await configureStandardOutcome(world, "surge");
    await world.setSetting("surgeTocEnabled", false);
    await world.setSetting("wmsCastWhen", "UPCAST");
    const page = route === "GM" ? gmPage : player.page;
    if (route === "player") {
      await grantActorToPlayer(gmPage, caster.actorId, player.userId);
      await refreshPlayerWorld(page);
    }
    for (const level of [1, 3]) {
      const before = await readSpellSlots(gmPage, caster.actorId, level);
      await castSpellFromSheet(page, caster, level);
      await expect
        .poll(() => readSpellSlots(gmPage, caster.actorId, level))
        .toBe(before - 1);
      if (level === 1)
        expect(await readSurgedFlag(gmPage, caster.actorId)).toBeUndefined();
      else
        await expect
          .poll(() => readSurgedFlag(gmPage, caster.actorId))
          .toBe(true);
    }
  });

  test(`${route} base-level casts fall back to WMS and upcasts consume spent ToC`, async ({
    gmPage,
    player,
    world,
  }) => {
    const caster = await createCaster(gmPage, {
      name: `E2E Upcast ToC ${route} ${Date.now()}`,
      additionalSlotLevel: 3,
    });
    world.trackActor(caster.actorId);
    const featId = await addTidesOfChaos(gmPage, caster.actorId);
    await configureStandardOutcome(world, "no surge");
    await world.setSetting("wmsCastWhen", "ALL");
    await world.setSetting("tocCastWhen", "UPCAST");
    await world.setSetting("surgeTocEnabled", true);
    await world.setSetting("enableTidesOfChaosRecharge", true);
    await useFeatureFromSheet(gmPage, caster.actorId, featId);
    await expect
      .poll(
        async () => (await readTidesUses(gmPage, caster.actorId, featId)).value,
      )
      .toBe(0);
    const page = route === "GM" ? gmPage : player.page;
    if (route === "player") {
      await grantActorToPlayer(gmPage, caster.actorId, player.userId);
      await refreshPlayerWorld(page);
    }
    for (const level of [1, 3]) {
      const before = await readSpellSlots(gmPage, caster.actorId, level);
      await castSpellFromSheet(page, caster, level);
      await expect
        .poll(() => readSpellSlots(gmPage, caster.actorId, level))
        .toBe(before - 1);
      await expect
        .poll(() => readSurgedFlag(gmPage, caster.actorId))
        .toBe(level === 3);
      await expect
        .poll(
          async () =>
            (await readTidesUses(gmPage, caster.actorId, featId)).value,
        )
        .toBe(level === 3 ? 1 : 0);
    }
  });
}
