import { test, expect } from "./fixtures";
import { createCaster } from "./support/actors";
import { castSpellFromSheet } from "./support/actions";
import { readSurgedFlag } from "./support/observations";
import { configureStandardOutcome } from "./support/recipes";
import { createSceneWithCasterToken } from "./support/scenes";

async function activeEffectDependencies(
  page: Parameters<typeof createCaster>[0],
) {
  return page.evaluate(() => {
    const { game } = globalThis as unknown as {
      game: {
        modules: { get(name: string): { active: boolean } | undefined };
      };
    };
    return {
      sequencer: game.modules.get("sequencer")?.active === true,
      jb2a:
        game.modules.get("JB2A_DnD5e")?.active === true ||
        game.modules.get("jb2a_patreon")?.active === true,
    };
  });
}

test("a surge still completes when optional animation modules are absent", async ({
  gmPage,
  world,
}) => {
  const dependencies = await activeEffectDependencies(gmPage);
  test.skip(
    dependencies.sequencer && dependencies.jb2a,
    "The optional animation case covers worlds with both visual modules.",
  );
  const caster = await createCaster(gmPage, {
    name: `E2E No Visuals Caster ${Date.now()}`,
  });
  world.trackActor(caster.actorId);
  const scene = await createSceneWithCasterToken(
    gmPage,
    caster.actorId,
    `E2E No Visuals Scene ${Date.now()}`,
  );
  world.trackScene(scene.sceneId);
  await configureStandardOutcome(world, "surge");
  await world.setSetting("wildMagicSurgeEffectsEnabled", true);

  await castSpellFromSheet(gmPage, caster);

  await expect.poll(() => readSurgedFlag(gmPage, caster.actorId)).toBe(true);
  await expect(
    gmPage
      .locator("#notifications")
      .getByText(
        dependencies.sequencer
          ? /JB2A module is not active/
          : /sequencer module is not active/,
      ),
  ).toBeVisible();
});

test("a surge requests an animation only while visual effects are enabled", async ({
  gmPage,
  world,
}) => {
  const dependencies = await activeEffectDependencies(gmPage);
  test.skip(
    !dependencies.sequencer || !dependencies.jb2a,
    "Sequencer and JB2A are required in the optional visual test world.",
  );
  test.setTimeout(180_000);
  const caster = await createCaster(gmPage, {
    name: `E2E Visuals Caster ${Date.now()}`,
  });
  world.trackActor(caster.actorId);
  const scene = await createSceneWithCasterToken(
    gmPage,
    caster.actorId,
    `E2E Visuals Scene ${Date.now()}`,
  );
  world.trackScene(scene.sceneId);
  await configureStandardOutcome(world, "surge");
  await gmPage.evaluate(() => {
    const scope = globalThis as unknown as {
      Sequence: { prototype: { play: (...args: unknown[]) => unknown } };
      __wmsE2EOriginalPlay?: (...args: unknown[]) => unknown;
      __wmsE2EPlayCount?: number;
    };
    scope.__wmsE2EOriginalPlay = scope.Sequence.prototype.play;
    scope.__wmsE2EPlayCount = 0;
    scope.Sequence.prototype.play = () => {
      scope.__wmsE2EPlayCount = (scope.__wmsE2EPlayCount ?? 0) + 1;
      return Promise.resolve();
    };
  });
  try {
    await world.setSetting("wildMagicSurgeEffectsEnabled", true);
    await castSpellFromSheet(gmPage, caster);
    await expect
      .poll(() =>
        gmPage.evaluate(() => {
          const scope = globalThis as unknown as {
            __wmsE2EPlayCount?: number;
          };
          return scope.__wmsE2EPlayCount ?? 0;
        }),
      )
      .toBe(1);

    await world.setSetting("wildMagicSurgeEffectsEnabled", false);
    await castSpellFromSheet(gmPage, caster);
    const playCount = await gmPage.evaluate(() => {
      const scope = globalThis as unknown as { __wmsE2EPlayCount?: number };
      return scope.__wmsE2EPlayCount ?? 0;
    });
    expect(playCount).toBe(1);
  } finally {
    await gmPage.evaluate(() => {
      const scope = globalThis as unknown as {
        Sequence: { prototype: { play: (...args: unknown[]) => unknown } };
        __wmsE2EOriginalPlay?: (...args: unknown[]) => unknown;
        __wmsE2EPlayCount?: number;
      };
      if (scope.__wmsE2EOriginalPlay) {
        scope.Sequence.prototype.play = scope.__wmsE2EOriginalPlay;
      }
      delete scope.__wmsE2EOriginalPlay;
      delete scope.__wmsE2EPlayCount;
    });
  }
});
