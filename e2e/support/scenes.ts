import type { Page } from "@playwright/test";

export interface TestSceneToken {
  sceneId: string;
  tokenId: string;
}

/** Create and activate a disposable scene with a linked caster token. */
export async function createSceneWithCasterToken(
  page: Page,
  actorId: string,
  name: string,
  barAttribute?: string,
): Promise<TestSceneToken> {
  const created = await page.evaluate(
    async ({ actorId, name, barAttribute }) => {
      type Scene = {
        id: string;
        createEmbeddedDocuments(
          type: "Token",
          data: Record<string, unknown>[],
        ): Promise<Array<{ id: string }>>;
        activate(): Promise<unknown>;
        delete(): Promise<unknown>;
      };
      const { Scene } = globalThis as unknown as {
        Scene: {
          create(data: Record<string, unknown>): Promise<Scene | null>;
        };
      };
      const scene = await Scene.create({
        name,
        width: 1000,
        height: 1000,
        grid: { size: 100 },
      });
      if (!scene) throw new Error("Foundry did not create the test scene.");
      try {
        const [token] = await scene.createEmbeddedDocuments("Token", [
          {
            name,
            actorId,
            actorLink: true,
            x: 100,
            y: 100,
            displayBars: 50,
            bar1: { attribute: barAttribute ?? null },
          },
        ]);
        if (!token) throw new Error("Foundry did not create the test token.");
        await scene.activate();
        return { sceneId: scene.id, tokenId: token.id };
      } catch (error) {
        await scene.delete();
        throw error;
      }
    },
    { actorId, name, barAttribute },
  );
  await page.waitForFunction(
    (sceneId) => {
      const { game, canvas } = globalThis as unknown as {
        game: { scenes: { active?: { id: string } } };
        canvas: { ready?: boolean };
      };
      return game.scenes.active?.id === sceneId && canvas?.ready === true;
    },
    created.sceneId,
    { timeout: 30_000 },
  );
  return created;
}

export async function readTokenBar(
  page: Page,
  sceneId: string,
  tokenId: string,
): Promise<{ attribute: string; value: number; max: number } | null> {
  return page.evaluate(
    ({ sceneId, tokenId }) => {
      const { game } = globalThis as unknown as {
        game: {
          scenes: {
            get(id: string):
              | {
                  tokens: {
                    get(id: string):
                      | {
                          getBarAttribute(name: "bar1"): {
                            attribute: string;
                            value: number;
                            max: number;
                          } | null;
                        }
                      | undefined;
                  };
                }
              | undefined;
          };
        };
      };
      return (
        game.scenes
          .get(sceneId)
          ?.tokens.get(tokenId)
          ?.getBarAttribute("bar1") ?? null
      );
    },
    { sceneId, tokenId },
  );
}

export async function createCombatForToken(
  page: Page,
  sceneId: string,
  tokenId: string,
  actorId: string,
): Promise<string> {
  return page.evaluate(
    async ({ sceneId, tokenId, actorId }) => {
      const { Combat } = globalThis as unknown as {
        Combat: {
          create(data: Record<string, unknown>): Promise<{ id: string } | null>;
        };
      };
      const combat = await Combat.create({
        scene: sceneId,
        combatants: [{ tokenId, actorId, initiative: 10 }],
      });
      if (!combat) throw new Error("Foundry did not create the test combat.");
      return combat.id;
    },
    { sceneId, tokenId, actorId },
  );
}
