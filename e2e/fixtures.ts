import { test as base, expect, type Page } from "@playwright/test";
import { TestWorld } from "./support/cleanup";

type PlayerSession = { page: Page; userId: string };
type E2EFixtures = {
  gmPage: Page;
  world: TestWorld;
  player: PlayerSession;
};

type GameState = {
  ready: boolean;
  systemId: string | null;
  moduleActive: boolean;
};

export async function readGameState(page: Page): Promise<GameState> {
  return page.evaluate(() => {
    const { game } = globalThis as unknown as {
      game?: {
        ready?: boolean;
        system?: { id?: string };
        modules?: { get(id: string): { active?: boolean } | undefined };
      };
    };
    return {
      ready: game?.ready === true,
      systemId: game?.system?.id ?? null,
      moduleActive: game?.modules?.get("wild-magic-surge-5e")?.active === true,
    };
  });
}

export const test = base.extend<E2EFixtures>({
  gmPage: async ({ page }, use) => {
    await page.goto("/join");
    const joinForm = page.locator('form[name="join"]');
    await joinForm.waitFor({ state: "visible" });
    await joinForm
      .locator('input[name="username"]')
      .fill(process.env.FOUNDRY_E2E_GM_NAME ?? "Gamemaster");
    await joinForm
      .locator('input[name="password"]')
      .fill(process.env.FOUNDRY_E2E_GM_PASSWORD ?? "");
    await joinForm.locator('button[name="join"]').click();

    await page.waitForFunction(
      () => {
        const { game } = globalThis as unknown as {
          game?: { ready?: boolean };
        };
        return game?.ready === true;
      },
      null,
      { timeout: 60_000 },
    );
    const state = await readGameState(page);
    expect(state.systemId, "The test world must use dnd5e.").toBe("dnd5e");
    expect(
      state.moduleActive,
      "Enable Wild Magic Surge 5e in the test world.",
    ).toBe(true);
    await use(page);
  },
  world: async ({ gmPage }, use) => {
    const world = await TestWorld.create(gmPage);
    try {
      await use(world);
    } finally {
      await world.restore();
    }
  },
  player: async ({ gmPage, browser }, use) => {
    const playerName = `E2E Player ${Date.now()}`;
    const userId = await gmPage.evaluate(async (name) => {
      const { User } = globalThis as unknown as {
        User: {
          create(data: {
            name: string;
            role: number;
          }): Promise<{ id: string } | null>;
        };
      };
      const user = await User.create({ name, role: 1 });
      if (!user) throw new Error("Foundry did not create the test player.");
      return user.id;
    }, playerName);

    const context = await browser.newContext();
    try {
      const page = await context.newPage();
      await page.goto("/join");
      const joinForm = page.locator('form[name="join"]');
      await joinForm.waitFor({ state: "visible" });
      await joinForm.locator('input[name="username"]').fill(playerName);
      await joinForm.locator('button[name="join"]').click();
      await page.waitForFunction(
        () => {
          const { game } = globalThis as unknown as {
            game?: { ready?: boolean; user?: { isGM?: boolean } };
          };
          return game?.ready === true && game.user?.isGM === false;
        },
        null,
        { timeout: 60_000 },
      );
      await use({ page, userId });
    } finally {
      await context.close();
      await gmPage.evaluate(async (id) => {
        const { game } = globalThis as unknown as {
          game: {
            users: {
              get(id: string): { delete(): Promise<unknown> } | undefined;
            };
          };
        };
        await game.users.get(id)?.delete();
      }, userId);
    }
  },
});

export { expect };
