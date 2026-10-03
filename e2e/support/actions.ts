import { expect, type Page } from "@playwright/test";
import type { TestCaster } from "./actors";

/** Use the installed dnd5e 6.0.5 sheet, then confirm its activity dialog. */
export async function castLevelOneSpellFromSheet(
  page: Page,
  caster: TestCaster,
): Promise<void> {
  const sheetId = await page.evaluate(async (actorId) => {
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
    const actor = game.actors.get(actorId);
    if (!actor) throw new Error(`Test actor ${actorId} is missing.`);
    await actor.sheet.render({ force: true });
    return actor.sheet.element?.id ?? `CharacterActorSheet-Actor-${actorId}`;
  }, caster.actorId);

  const sheet = page.locator(`#${sheetId}`);
  await expect(sheet).toBeVisible();
  await sheet.locator('a[data-tab="spells"]').click();

  const spell = sheet.locator(`[data-item-id="${caster.spellId}"]`);
  await expect(spell).toBeVisible();
  await spell.locator('[data-action="use"]').click();

  const usageDialog = page.locator("dialog.activity-usage");
  await expect(usageDialog).toBeVisible();
  await usageDialog.getByRole("button", { name: "Cast Spell" }).click();
}
