import type { Page } from "@playwright/test";

/** Observe the module's public notifications, then remove every listener. */
export async function startModuleHookRecorder(page: Page, names: string[]) {
  await page.evaluate((hookNames) => {
    type Listener = { name: string; handler: (payload: unknown) => void };
    const scope = globalThis as unknown as {
      Hooks: { on(name: string, fn: (payload: unknown) => void): void };
      __wmsE2EHooks?: {
        events: Record<string, unknown[]>;
        listeners: Listener[];
      };
    };
    const events: Record<string, unknown[]> = {};
    const listeners: Listener[] = [];
    for (const name of hookNames) {
      events[name] = [];
      const fullName = `wild-magic-surge-5e.${name}`;
      const handler = (payload: unknown) => {
        events[name].push(payload);
      };
      scope.Hooks.on(fullName, handler);
      listeners.push({ name: fullName, handler });
    }
    scope.__wmsE2EHooks = { events, listeners };
  }, names);

  return {
    async read(): Promise<Record<string, unknown[]>> {
      return page.evaluate(() => {
        const scope = globalThis as unknown as {
          __wmsE2EHooks?: { events: Record<string, unknown[]> };
        };
        return scope.__wmsE2EHooks?.events ?? {};
      });
    },
    async stop(): Promise<void> {
      await page.evaluate(() => {
        const scope = globalThis as unknown as {
          Hooks: { off(name: string, fn: (payload: unknown) => void): void };
          __wmsE2EHooks?: {
            listeners: Array<{
              name: string;
              handler: (payload: unknown) => void;
            }>;
          };
        };
        for (const { name, handler } of scope.__wmsE2EHooks?.listeners ?? []) {
          scope.Hooks.off(name, handler);
        }
        delete scope.__wmsE2EHooks;
      });
    },
  };
}
