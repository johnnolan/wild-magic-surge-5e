import type { Page } from "@playwright/test";

/** Temporarily select a Foundry dice face while preserving the real Roll path. */
export async function withFoundryRandomValue<T>(
  page: Page,
  uniformValue: number,
  action: () => Promise<T>,
): Promise<T> {
  await page.evaluate((value) => {
    const scope = globalThis as unknown as {
      CONFIG: { Dice: { randomUniform: () => number } };
      __wmsE2ERandomOriginal?: () => number;
    };
    if (scope.__wmsE2ERandomOriginal) {
      throw new Error("A test dice override is already active.");
    }
    scope.__wmsE2ERandomOriginal = scope.CONFIG.Dice.randomUniform;
    scope.CONFIG.Dice.randomUniform = () => value;
  }, uniformValue);
  try {
    return await action();
  } finally {
    await page.evaluate(() => {
      const scope = globalThis as unknown as {
        CONFIG: { Dice: { randomUniform: () => number } };
        __wmsE2ERandomOriginal?: () => number;
      };
      if (scope.__wmsE2ERandomOriginal) {
        scope.CONFIG.Dice.randomUniform = scope.__wmsE2ERandomOriginal;
        delete scope.__wmsE2ERandomOriginal;
      }
    });
  }
}
