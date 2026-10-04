import type { Page } from "@playwright/test";
import { readChatMessages } from "./observations";

type SettingValue = string | boolean;

/** Tracks only state created or changed by one test in the dedicated world. */
export class TestWorld {
  private readonly actors = new Set<string>();
  private readonly tables = new Set<string>();
  private readonly macros = new Set<string>();
  private readonly scenes = new Set<string>();
  private readonly combats = new Set<string>();
  private readonly originalSettings = new Map<string, SettingValue>();
  private readonly originalCoreSettings = new Map<string, SettingValue>();
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

  trackTable(tableId: string): void {
    this.tables.add(tableId);
  }

  trackMacro(macroId: string): void {
    this.macros.add(macroId);
  }

  trackScene(sceneId: string): void {
    this.scenes.add(sceneId);
  }

  trackCombat(combatId: string): void {
    this.combats.add(combatId);
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

  async setCoreSetting(key: string, value: SettingValue): Promise<void> {
    if (!this.originalCoreSettings.has(key)) {
      const original = await this.page.evaluate((settingKey) => {
        const { game } = globalThis as unknown as {
          game: {
            settings: {
              get(namespace: string, key: string): SettingValue;
            };
          };
        };
        return game.settings.get("core", settingKey);
      }, key);
      this.originalCoreSettings.set(key, original);
    }
    await this.page.evaluate(
      async ({ key, value }) => {
        const { game } = globalThis as unknown as {
          game: {
            settings: {
              set(
                namespace: string,
                key: string,
                value: SettingValue,
              ): Promise<unknown>;
            };
          };
        };
        await game.settings.set("core", key, value);
      },
      { key, value },
    );
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
    for (const [key, value] of this.originalCoreSettings) {
      try {
        await this.page.evaluate(
          async ({ key, value }) => {
            const { game } = globalThis as unknown as {
              game: {
                settings: {
                  set(
                    namespace: string,
                    key: string,
                    value: SettingValue,
                  ): Promise<unknown>;
                };
              };
            };
            await game.settings.set("core", key, value);
          },
          { key, value },
        );
      } catch (error) {
        failures.push(`core setting ${key}: ${String(error)}`);
      }
    }

    try {
      await this.page.evaluate(
        async ({
          actorIds,
          tableIds,
          macroIds,
          sceneIds,
          combatIds,
          originalMessageIds,
        }) => {
          const { game } = globalThis as unknown as {
            game: {
              actors: {
                get(id: string): { delete(): Promise<unknown> } | undefined;
              };
              tables: {
                get(id: string): { delete(): Promise<unknown> } | undefined;
              };
              macros: {
                get(id: string): { delete(): Promise<unknown> } | undefined;
              };
              scenes: {
                get(id: string): { delete(): Promise<unknown> } | undefined;
              };
              combats: {
                get(id: string): { delete(): Promise<unknown> } | undefined;
              };
              messages: {
                contents: Array<{ id: string }>;
                get(id: string): { delete(): Promise<unknown> } | undefined;
              };
            };
          };
          for (const id of combatIds) await game.combats.get(id)?.delete();
          for (const id of sceneIds) await game.scenes.get(id)?.delete();
          for (const id of actorIds) await game.actors.get(id)?.delete();
          for (const id of tableIds) await game.tables.get(id)?.delete();
          for (const id of macroIds) await game.macros.get(id)?.delete();
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
          tableIds: [...this.tables],
          macroIds: [...this.macros],
          sceneIds: [...this.scenes],
          combatIds: [...this.combats],
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
