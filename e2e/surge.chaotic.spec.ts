import { test, expect } from "./fixtures";
import { createCaster } from "./support/actors";
import { castSpellFromSheet } from "./support/actions";
import { readSurgedFlag, readSurgeResource } from "./support/observations";
import { withFoundryRandomValue } from "./support/rolls";
import {
  createCombatForToken,
  createSceneWithCasterToken,
} from "./support/scenes";

test("combat turns grow a chaotic threshold to ten and a surge resets it", async ({
  gmPage,
  world,
}) => {
  test.setTimeout(240_000);
  const caster = await createCaster(gmPage, {
    name: `E2E Chaotic Combat Caster ${Date.now()}`,
    spellSlots: 1,
  });
  world.trackActor(caster.actorId);
  await world.setSetting("autoRollD20", true);
  await world.setSetting("OPT_SURGE_TYPE", "INCREMENTAL_CHECK_CHAOTIC");
  await world.setSetting("OPT_RESOURCE_TYPE", "NONE");
  await world.setSetting("customRollDiceFormula", "1d20");
  const scene = await createSceneWithCasterToken(
    gmPage,
    caster.actorId,
    `E2E Chaotic Scene ${Date.now()}`,
  );
  world.trackScene(scene.sceneId);
  const combatId = await createCombatForToken(
    gmPage,
    scene.sceneId,
    scene.tokenId,
    caster.actorId,
  );
  world.trackCombat(combatId);

  await gmPage.locator('button[data-action="tab"][data-tab="combat"]').click();
  const controls = gmPage.locator(".combat-controls");
  await controls.locator('[data-action="startCombat"]').click();
  await expect
    .poll(async () => (await readSurgeResource(gmPage, caster.actorId))?.value)
    .toBeGreaterThan(1);
  const firstThreshold = (await readSurgeResource(gmPage, caster.actorId))
    ?.value;
  expect(firstThreshold).toBeLessThanOrEqual(10);

  for (let turn = 0; turn < 12; turn++) {
    const threshold = (await readSurgeResource(gmPage, caster.actorId))?.value;
    if (threshold === 10) break;
    const previousRound = await gmPage.evaluate((id) => {
      const { game } = globalThis as unknown as {
        game: { combats: { get(id: string): { round: number } | undefined } };
      };
      return game.combats.get(id)?.round ?? 0;
    }, combatId);
    await controls.locator('[data-action="nextTurn"]').click();
    await expect
      .poll(() =>
        gmPage.evaluate((id) => {
          const { game } = globalThis as unknown as {
            game: {
              combats: { get(id: string): { round: number } | undefined };
            };
          };
          return game.combats.get(id)?.round ?? 0;
        }, combatId),
      )
      .toBeGreaterThan(previousRound);
    if (turn === 0) {
      await expect
        .poll(
          async () => (await readSurgeResource(gmPage, caster.actorId))?.value,
        )
        .toBeGreaterThan(threshold ?? 1);
      const nextThreshold = (await readSurgeResource(gmPage, caster.actorId))
        ?.value;
      test.info().annotations.push({
        type: "observed first turn increment",
        description: `${threshold} → ${nextThreshold}`,
      });
      expect(nextThreshold).toBeGreaterThanOrEqual(threshold ?? 1);
      expect(nextThreshold).toBeLessThanOrEqual(10);
    }
  }
  await expect
    .poll(async () => (await readSurgeResource(gmPage, caster.actorId))?.value)
    .toBe(10);
  expect((await readSurgeResource(gmPage, caster.actorId))?.max).toBe(10);

  await withFoundryRandomValue(gmPage, 0.999, async () => {
    await castSpellFromSheet(gmPage, caster);
    await expect
      .poll(
        async () => (await readSurgeResource(gmPage, caster.actorId))?.value,
      )
      .toBe(1);
  });
  await expect.poll(() => readSurgedFlag(gmPage, caster.actorId)).toBe(true);

  const outsideCombat = await createCaster(gmPage, {
    name: `E2E Outside Combat ${Date.now()}`,
    spellSlots: 1,
  });
  world.trackActor(outsideCombat.actorId);
  await withFoundryRandomValue(gmPage, 0.5, async () => {
    await castSpellFromSheet(gmPage, outsideCombat);
    await expect
      .poll(
        async () =>
          (await readSurgeResource(gmPage, outsideCombat.actorId))?.value,
      )
      .toBe(2);
  });
  expect((await readSurgeResource(gmPage, outsideCombat.actorId))?.max).toBe(
    10,
  );
  await expect
    .poll(() => readSurgedFlag(gmPage, outsideCombat.actorId))
    .toBe(false);
});
