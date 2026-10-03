import type { Page } from "@playwright/test";
import { readChatMessages } from "./observations";

type SettingValue = string | boolean;

/** Tracks only state created or changed by one test in the dedicated world. */
export class TestWorld {
  private readonly actors = new Set<string>();
  private readonly originalSettings = new Map<string, SettingValue>();
  private readonly initialMessageIds: Set<string>;

  private constructor(
    private readonly page: Page,
    messageIds: string[],
  ) {
    this.initialMessageIds = new Set(messageIds);
  }

  static async create(page: Page): Promise<TestWorld> {
    const messages = await readChatMessages(page);
    return new TestWorld(
      page,
      messages.map((message) => message.id),
    );
  }

  trackActor(actorId: string): void {
    this.actors.add(actorId);
  }

  async rememberSetting(key: string): Promise<void> {
    if (this.originalSettings.has(key)) return;
    const original = await this.page.evaluate((settingKey) => {
      const { game } = globalThis as unknown as {
        game: {
          settings: {
            get(namespace: string, key: string): string | boolean;
          };
        };
      };
      return game.settings.get("wild-magic-surge-5e", settingKey);
    }, key);
    this.originalSettings.set(key, original);
  }

  async setSetting(key: string, value: SettingValue): Promise<void> {
    await this.rememberSetting(key);
    await this.writeSetting(key, value);
  }

  private async writeSetting(key: string, value: SettingValue): Promise<void> {
    await this.page.evaluate(
      async ({ key, value }) => {
        const { game } = globalThis as unknown as {
          game: {
            settings: {
              set(
                namespace: string,
                key: string,
                value: string | boolean,
              ): Promise<unknown>;
            };
          };
        };
        await game.settings.set("wild-magic-surge-5e", key, value);
      },
      { key, value },
    );
  }

  async restore(): Promise<void> {
    const failures: string[] = [];
    for (const [key, value] of this.originalSettings) {
      try {
        await this.writeSetting(key, value);
      } catch (error) {
        failures.push(`setting ${key}: ${String(error)}`);
      }
    }

    try {
      await this.page.evaluate(
        async ({ actorIds, originalMessageIds }) => {
          const { game } = globalThis as unknown as {
            game: {
              actors: {
                get(id: string): { delete(): Promise<unknown> } | undefined;
              };
              messages: {
                contents: Array<{ id: string }>;
                get(id: string): { delete(): Promise<unknown> } | undefined;
              };
            };
          };
          for (const actorId of actorIds) {
            await game.actors.get(actorId)?.delete();
          }
          const previous = new Set(originalMessageIds);
          const createdMessages = game.messages.contents.filter(
            (message) => !previous.has(message.id),
          );
          for (const message of createdMessages) {
            await game.messages.get(message.id)?.delete();
          }
        },
        {
          actorIds: [...this.actors],
          originalMessageIds: [...this.initialMessageIds],
        },
      );
    } catch (error) {
      failures.push(`documents and messages: ${String(error)}`);
    }

    if (failures.length) {
      throw new Error(`Test world cleanup failed: ${failures.join("; ")}`);
    }
  }
}
