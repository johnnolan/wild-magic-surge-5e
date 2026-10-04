import type { Page } from "@playwright/test";

export interface UsedActivity {
  itemName: string;
  itemType: string;
  spellLevel: number | null;
  spellSlotFlag: boolean;
}

/** Observe dnd5e's public post-use hook without replacing its real handlers. */
export async function recordUsedActivities(
  page: Page,
  action: () => Promise<void>,
): Promise<UsedActivity[]> {
  await page.evaluate(() => {
    type Activity = {
      item?: {
        name?: string;
        type?: string;
        system?: { level?: number };
      };
      consumption?: { spellSlot?: boolean };
    };
    type Recorder = {
      events: UsedActivity[];
      handler: (activity: Activity) => void;
    };
    const scope = globalThis as unknown as {
      Hooks: { on(name: string, fn: (activity: Activity) => void): void };
      __wmsE2EActivityRecorder?: Recorder;
    };
    const events: UsedActivity[] = [];
    const handler = (activity: Activity) => {
      events.push({
        itemName: activity.item?.name ?? "",
        itemType: activity.item?.type ?? "",
        spellLevel: activity.item?.system?.level ?? null,
        spellSlotFlag: activity.consumption?.spellSlot === true,
      });
    };
    scope.Hooks.on("dnd5e.postUseActivity", handler);
    scope.__wmsE2EActivityRecorder = { events, handler };
  });

  try {
    await action();
    await page.waitForFunction(
      () => {
        const scope = globalThis as unknown as {
          __wmsE2EActivityRecorder?: { events: UsedActivity[] };
        };
        return (scope.__wmsE2EActivityRecorder?.events.length ?? 0) > 0;
      },
      null,
      { timeout: 15_000 },
    );
    return await page.evaluate(() => {
      const scope = globalThis as unknown as {
        __wmsE2EActivityRecorder?: { events: UsedActivity[] };
      };
      return scope.__wmsE2EActivityRecorder?.events ?? [];
    });
  } finally {
    await page.evaluate(() => {
      type Activity = { item?: { name?: string } };
      const scope = globalThis as unknown as {
        Hooks: { off(name: string, fn: (activity: Activity) => void): void };
        __wmsE2EActivityRecorder?: {
          handler: (activity: Activity) => void;
        };
      };
      if (scope.__wmsE2EActivityRecorder) {
        scope.Hooks.off(
          "dnd5e.postUseActivity",
          scope.__wmsE2EActivityRecorder.handler,
        );
        delete scope.__wmsE2EActivityRecorder;
      }
    });
  }
}
