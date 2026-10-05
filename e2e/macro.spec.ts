import { test, expect } from "./fixtures";
import { createCaster } from "./support/actors";
import { castSpellFromSheet } from "./support/actions";
import { readSurgedFlag } from "./support/observations";
import { configureStandardOutcome } from "./support/recipes";

test("a real surge runs the named GM macro with the caster context", async ({
  gmPage,
  world,
}) => {
  const caster = await createCaster(gmPage, {
    name: `E2E Macro Caster ${Date.now()}`,
  });
  world.trackActor(caster.actorId);
  const macroName = `E2E Surge Macro ${Date.now()}`;
  const macroId = await gmPage.evaluate(async (name) => {
    const { Macro } = globalThis as unknown as {
      Macro: {
        create(data: Record<string, unknown>): Promise<{ id: string } | null>;
      };
    };
    const macro = await Macro.create({
      name,
      type: "script",
      command:
        'const before = actor.getFlag("wild-magic-surge-5e", "e2e-macro") ?? { count: 0 };' +
        'await actor.setFlag("wild-magic-surge-5e", "e2e-macro", {' +
        "count: before.count + 1, actorId: actor.id, tokenId: token?.id ?? null });",
    });
    if (!macro) throw new Error("Foundry did not create the test macro.");
    return macro.id;
  }, macroName);
  world.trackMacro(macroId);
  await configureStandardOutcome(world, "surge");
  await world.setSetting("enableTriggerMacro", true);
  await world.setSetting("triggerMacroName", macroName);

  await castSpellFromSheet(gmPage, caster);

  await expect.poll(() => readSurgedFlag(gmPage, caster.actorId)).toBe(true);
  await expect
    .poll(() =>
      gmPage.evaluate((actorId) => {
        const { game } = globalThis as unknown as {
          game: {
            actors: {
              get(id: string):
                | {
                    getFlag(
                      namespace: string,
                      key: string,
                    ):
                      | {
                          count: number;
                          actorId: string;
                          tokenId: string | null;
                        }
                      | undefined;
                  }
                | undefined;
            };
          };
        };
        return game.actors
          .get(actorId)
          ?.getFlag("wild-magic-surge-5e", "e2e-macro");
      }, caster.actorId),
    )
    .toEqual({ count: 1, actorId: caster.actorId, tokenId: null });
});

test("a missing GM macro does not stop a real surge", async ({
  gmPage,
  world,
}) => {
  const caster = await createCaster(gmPage, {
    name: `E2E Missing Macro Caster ${Date.now()}`,
  });
  world.trackActor(caster.actorId);
  await configureStandardOutcome(world, "surge");
  await world.setSetting("enableTriggerMacro", true);
  await world.setSetting("triggerMacroName", `E2E Missing Macro ${Date.now()}`);

  await castSpellFromSheet(gmPage, caster);

  await expect.poll(() => readSurgedFlag(gmPage, caster.actorId)).toBe(true);
  const flag = await gmPage.evaluate((actorId) => {
    const { game } = globalThis as unknown as {
      game: {
        actors: {
          get(
            id: string,
          ): { getFlag(namespace: string, key: string): unknown } | undefined;
        };
      };
    };
    return game.actors
      .get(actorId)
      ?.getFlag("wild-magic-surge-5e", "e2e-macro");
  }, caster.actorId);
  expect(flag).toBeUndefined();
});
