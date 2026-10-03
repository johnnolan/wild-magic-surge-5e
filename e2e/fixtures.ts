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
    const userSelect = page.locator('select[name="userid"]');

    if (await userSelect.isVisible()) {
      const gmName = process.env.FOUNDRY_E2E_GM_NAME ?? "Gamemaster";
      const gmOption = userSelect.locator("option", { hasText: gmName });
      if ((await gmOption.count()) !== 1 || (await gmOption.isDisabled())) {
        throw new Error(`GM user "${gmName}" is missing or already logged in.`);
      }
      await userSelect.selectOption({ label: gmName });
      await page.locator('button[name="join"]').click();
    }

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
