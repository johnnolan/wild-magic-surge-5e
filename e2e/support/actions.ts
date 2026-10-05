import { expect, type Locator, type Page } from "@playwright/test";
import type { TestCaster } from "./actors";
import { readSpellSlots } from "./observations";

export async function openActorSheet(
  page: Page,
  actorId: string,
): Promise<Locator> {
  const sheetId = await page.evaluate(async (id) => {
    const { game } = globalThis as unknown as {
      game: {
        actors: {
          get(id: string):
            | {
                sheet: {
                  render(options: { force: boolean }): Promise<unknown>;
                  element: HTMLElement;
                };
              }
            | undefined;
        };
      };
    };
    const actor = game.actors.get(id);
    if (!actor) throw new Error(`Test actor ${id} is missing.`);
    await actor.sheet.render({ force: true });
    return actor.sheet.element?.id ?? `CharacterActorSheet-Actor-${id}`;
  }, actorId);

  const sheet = page.locator(`#${sheetId}`);
  await expect(sheet).toBeVisible();
  const browserWarning = page
    .locator("#notifications .notification.permanent")
    .filter({ hasText: /hardware acceleration|screen resolution/i })
    .first();
  if (await browserWarning.isVisible()) await browserWarning.click();
  return sheet;
}

/** Use the installed dnd5e 6.0.5 sheet, then confirm its activity dialog. */
export async function castSpellFromSheet(
  page: Page,
  caster: TestCaster,
): Promise<void> {
  const sheet = await openActorSheet(page, caster.actorId);
  await sheet.locator('a[data-tab="spells"]').click();

  const spell = sheet.locator(`[data-item-id="${caster.spellId}"]`);
  await expect(spell).toBeVisible();
  const slotsBefore = await readSpellSlots(
    page,
    caster.actorId,
    caster.spellLevel,
  );
  await spell.locator('[data-action="use"]').click();

  const usageDialog = page.locator("dialog.activity-usage");
  const chooser = page.locator(
    `button[data-action="choose"][data-activity-id="${caster.activityId}"]`,
  );
  for (let step = 0; step < 3; step++) {
    const state = await page
      .waitForFunction(
        ({ actorId, spellLevel, activityId, slotsBefore }) => {
          const visible = (element: Element | null) =>
            element !== null && element.getClientRects().length > 0;
          if (
            visible(
              document.querySelector(
                `button[data-action="choose"][data-activity-id="${activityId}"]`,
              ),
            )
          )
            return "choose";
          if (visible(document.querySelector("dialog.activity-usage")))
            return "confirm";
          const { game } = globalThis as unknown as {
            game: {
              actors: {
                get(
                  id: string,
                ):
                  | { system: { spells: Record<string, { value: number }> } }
                  | undefined;
              };
            };
          };
          const slots =
            game.actors.get(actorId)?.system.spells[`spell${spellLevel}`]
              ?.value;
          return slots !== undefined && slots < slotsBefore ? "used" : false;
        },
        {
          actorId: caster.actorId,
          spellLevel: caster.spellLevel,
          activityId: caster.activityId,
          slotsBefore,
        },
        { timeout: 15_000 },
      )
      .then((handle) => handle.jsonValue());
    if (state === "choose") {
      await chooser.click();
      await expect(chooser).toBeHidden();
      continue;
    }
    if (state === "confirm") {
      await usageDialog.getByRole("button", { name: "Cast Spell" }).click();
      return;
    }
    if (state === "used") return;
  }
  throw new Error(
    "The spell activity did not reach its use or confirmation step.",
  );
}

export const castLevelOneSpellFromSheet = castSpellFromSheet;

/** Use a cantrip from the installed dnd5e sheet without expecting a slot. */
export async function castCantripFromSheet(
  page: Page,
  caster: TestCaster,
): Promise<void> {
  if (caster.spellLevel !== 0) throw new Error("This spell is not a cantrip.");
  const sheet = await openActorSheet(page, caster.actorId);
  await sheet.locator('a[data-tab="spells"]').click();
  const spell = sheet.locator(`[data-item-id="${caster.spellId}"]`);
  await expect(spell).toBeVisible();
  await spell.locator('[data-action="use"]').click();

  const chooser = page.locator(
    `button[data-action="choose"][data-activity-id="${caster.activityId}"]`,
  );
  const usageDialog = page.locator("dialog.activity-usage");
  for (let step = 0; step < 3; step++) {
    const state = await page
      .waitForFunction(
        (activityId) => {
          const visible = (element: Element | null) =>
            element !== null && element.getClientRects().length > 0;
          if (
            visible(
              document.querySelector(
                `button[data-action="choose"][data-activity-id="${activityId}"]`,
              ),
            )
          )
            return "choose";
          if (visible(document.querySelector("dialog.activity-usage")))
            return "confirm";
          const scope = globalThis as unknown as {
            __wmsE2EActivityRecorder?: { events: unknown[] };
          };
          return (scope.__wmsE2EActivityRecorder?.events.length ?? 0) > 0
            ? "used"
            : false;
        },
        caster.activityId,
        { timeout: 15_000 },
      )
      .then((handle) => handle.jsonValue());
    if (state === "choose") {
      await chooser.click();
      await expect(chooser).toBeHidden();
      continue;
    }
    if (state === "confirm") {
      await usageDialog.getByRole("button", { name: "Cast Spell" }).click();
      return;
    }
    if (state === "used") return;
  }
  throw new Error("The cantrip activity did not reach its use step.");
}

export async function openChatSidebar(page: Page): Promise<void> {
  await page.locator('button[data-action="tab"][data-tab="chat"]').click();
  const content = page.locator("#sidebar-content");
  const expanded = await content.evaluate((element) =>
    element.classList.contains("expanded"),
  );
  if (!expanded) {
    await page.locator('#sidebar .tabs [data-action="toggleState"]').click();
  }
  await expect(content).toHaveClass(/expanded/);
}

export async function useFeatureFromSheet(
  page: Page,
  actorId: string,
  itemId: string,
): Promise<void> {
  const sheet = await openActorSheet(page, actorId);
  await sheet.locator('a[data-tab="features"]').click();
  const feature = sheet.locator(`[data-item-id="${itemId}"]`);
  await expect(feature).toBeVisible();
  await feature.locator('[data-action="use"]').click();
  const usageDialog = page.locator("dialog.activity-usage");
  await expect(usageDialog).toBeVisible();
  const useButton = usageDialog.getByRole("button", { name: "Use Ability" });
  await expect(useButton).toBeVisible();
  await useButton.click();
}
