import type { Page } from "@playwright/test";

export interface TestTable {
  id: string;
  name: string;
  resultText: string[];
}

/** A public two-row table whose output is recognizable in chat. */
export async function createTestTable(
  page: Page,
  name: string,
): Promise<TestTable> {
  return page.evaluate(async (tableName) => {
    const resultText = [`${tableName} result one`, `${tableName} result two`];
    const { RollTable } = globalThis as unknown as {
      RollTable: {
        create(data: Record<string, unknown>): Promise<{ id: string } | null>;
      };
    };
    const table = await RollTable.create({
      name: tableName,
      formula: "1d2",
      ownership: { default: 2 },
      results: resultText.map((text, index) => ({
        type: "text",
        text,
        range: [index + 1, index + 1],
        weight: 1,
        drawn: false,
      })),
    });
    if (!table) throw new Error("Foundry did not create the test table.");
    return { id: table.id, name: tableName, resultText };
  }, name);
}
