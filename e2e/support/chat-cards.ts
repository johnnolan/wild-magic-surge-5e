import { expect, type Page } from "@playwright/test";
import { castSpellFromSheet } from "./actions";
import type { TestCaster } from "./actors";
import { startModuleHookRecorder } from "./hook-events";
import { readSpellSlots, type ChatObservation } from "./observations";

export interface ChatCardMarkers {
  actorId: string;
  checkText: string;
  chargeText?: string;
  tableName?: string;
}

export interface ChatCards {
  spell: ChatObservation[];
  bareCheck: ChatObservation[];
  check: ChatObservation[];
  charge: ChatObservation[];
  table: ChatObservation[];
  button: ChatObservation[];
}

/** Classify only cards created by the action under test, using its unique text. */
export function classifyChatCards(
  messages: ChatObservation[],
  markers: ChatCardMarkers,
): ChatCards {
  const has = (message: ChatObservation, text: string) =>
    `${message.content} ${message.flavor}`.includes(text);
  return {
    spell: messages.filter(
      (message) =>
        message.speakerActorId === markers.actorId &&
        message.rollFormula === null &&
        !has(message, markers.checkText),
    ),
    bareCheck: messages.filter(
      (message) =>
        message.rollFormula !== null &&
        message.rollTotal !== null &&
        !message.flavor &&
        message.content.trim() === String(message.rollTotal),
    ),
    check: messages.filter((message) => has(message, markers.checkText)),
    charge: markers.chargeText
      ? messages.filter((message) => has(message, markers.chargeText!))
      : [],
    table: markers.tableName
      ? messages.filter(
          (message) =>
            message.content.includes("my-roll-result") &&
            has(message, markers.tableName!),
        )
      : [],
    button: messages.filter((message) =>
      message.content.includes("roll-table-wms"),
    ),
  };
}

/** A completed check hook follows chat creation, including an automatic draw. */
export async function castAndWaitForCheck(
  gmPage: Page,
  casterPage: Page,
  caster: TestCaster,
): Promise<void> {
  const slotsBefore = await readSpellSlots(
    casterPage,
    caster.actorId,
    caster.spellLevel,
  );
  const recorder = await startModuleHookRecorder(gmPage, ["IsWildMagicSurge"]);
  try {
    await castSpellFromSheet(casterPage, caster);
    await expect
      .poll(() => readSpellSlots(casterPage, caster.actorId, caster.spellLevel))
      .toBe(slotsBefore - 1);
    await expect
      .poll(async () => {
        const events = await recorder.read();
        return (events.IsWildMagicSurge ?? []).filter(
          (event) => (event as { actorId?: string }).actorId === caster.actorId,
        ).length;
      })
      .toBe(1);
  } finally {
    await recorder.stop();
  }
}
