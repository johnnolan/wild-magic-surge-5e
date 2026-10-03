import { test as base, expect, type Page } from "@playwright/test";

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

export const test = base.extend<{ gmPage: Page }>({
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
});

export { expect };
