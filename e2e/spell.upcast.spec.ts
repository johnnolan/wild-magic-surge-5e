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
  for (const mode of ["BASE", "UPCAST"] as const) {
    const triggeringLevel = mode === "BASE" ? 1 : 3;
    const excludedLevel = mode === "BASE" ? 3 : 1;
    test(`${route} ${mode} WMS checks exclude the other cast type`, async ({
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
      await world.setSetting("wmsCastWhen", mode);
      const page = route === "GM" ? gmPage : player.page;
      if (route === "player") {
        await grantActorToPlayer(gmPage, caster.actorId, player.userId);
        await refreshPlayerWorld(page);
      }
      for (const level of [excludedLevel, triggeringLevel]) {
        const before = await readSpellSlots(gmPage, caster.actorId, level);
        await castSpellFromSheet(page, caster, level);
        await expect
          .poll(() => readSpellSlots(gmPage, caster.actorId, level))
          .toBe(before - 1);
        if (level === excludedLevel)
          expect(await readSurgedFlag(gmPage, caster.actorId)).toBeUndefined();
        else
          await expect
            .poll(() => readSurgedFlag(gmPage, caster.actorId))
            .toBe(true);
      }
    });

    test(`${route} ${mode} ToC surges allow the other cast type to fall back to WMS`, async ({
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
      await world.setSetting("tocCastWhen", mode);
      await world.setSetting("surgeTocEnabled", true);
      await world.setSetting("enableTidesOfChaosRecharge", true);
      await useFeatureFromSheet(gmPage, caster.actorId, featId);
      await expect
        .poll(
          async () =>
            (await readTidesUses(gmPage, caster.actorId, featId)).value,
        )
        .toBe(0);
      const page = route === "GM" ? gmPage : player.page;
      if (route === "player") {
        await grantActorToPlayer(gmPage, caster.actorId, player.userId);
        await refreshPlayerWorld(page);
      }
      for (const level of [excludedLevel, triggeringLevel]) {
        const before = await readSpellSlots(gmPage, caster.actorId, level);
        await castSpellFromSheet(page, caster, level);
        await expect
          .poll(() => readSpellSlots(gmPage, caster.actorId, level))
          .toBe(before - 1);
        await expect
          .poll(() => readSurgedFlag(gmPage, caster.actorId))
          .toBe(level === triggeringLevel);
        await expect
          .poll(
            async () =>
              (await readTidesUses(gmPage, caster.actorId, featId)).value,
          )
          .toBe(level === triggeringLevel ? 1 : 0);
      }
    });
  }
}
