import type { Page } from "@playwright/test";

const moduleId = "wild-magic-surge-5e";

export async function openChatSettingsPanel(page: Page): Promise<void> {
  await page.evaluate(() => {
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
    const menu = game.settings.menus.get(
      "wild-magic-surge-5e.ChatSettingsPanel",
    );
    if (!menu)
      throw new Error("The Chat Message Options menu is not registered.");
    new menu.type().render({ force: true });
  });
  await page
    .locator('input[name="wild-magic-surge-5e.magicSurgeChatMessage"]')
    .waitFor();
}

export async function getReminderMessage(page: Page): Promise<string> {
  return page.evaluate((namespace) => {
    const { game } = globalThis as unknown as {
      game: { settings: { get(namespace: string, key: string): string } };
    };
    return game.settings.get(namespace, "magicSurgeChatMessage");
  }, moduleId);
}

export async function setReminderMessage(
  page: Page,
  message: string,
): Promise<void> {
  await page.evaluate(
    async ({ namespace, value }) => {
      const { game } = globalThis as unknown as {
        game: {
          settings: {
            set(
              namespace: string,
              key: string,
              value: string,
            ): Promise<unknown>;
          };
        };
      };
      await game.settings.set(namespace, "magicSurgeChatMessage", value);
    },
    { namespace: moduleId, value: message },
  );
}
