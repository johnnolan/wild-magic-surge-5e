import type { Page } from "@playwright/test";

const moduleId = "wild-magic-surge-5e";

export async function openSettingsPanel(
  page: Page,
  panel: string,
  firstSetting: string,
): Promise<void> {
  await page.evaluate((panelName) => {
    const { game } = globalThis as unknown as {
      game: {
        settings: {
          menus: Map<
            string,
            { type: new () => { render(options: { force: boolean }): void } }
          >;
        };
      };
    };
    const menu = game.settings.menus.get(`wild-magic-surge-5e.${panelName}`);
    if (!menu) throw new Error(`The ${panelName} menu is not registered.`);
    new menu.type().render({ force: true });
  }, panel);
  await page.locator(`[name="${moduleId}.${firstSetting}"]`).waitFor();
}

export async function readSetting<T extends string | boolean>(
  page: Page,
  key: string,
): Promise<T> {
  return page.evaluate(
    ({ namespace, key }) => {
      const { game } = globalThis as unknown as {
        game: {
          settings: {
            get(namespace: string, key: string): string | boolean;
          };
        };
      };
      return game.settings.get(namespace, key) as T;
    },
    { namespace: moduleId, key },
  );
}

export async function openChatSettingsPanel(page: Page): Promise<void> {
  await openSettingsPanel(page, "ChatSettingsPanel", "magicSurgeChatMessage");
}

export async function getReminderMessage(page: Page): Promise<string> {
  return readSetting<string>(page, "magicSurgeChatMessage");
}
