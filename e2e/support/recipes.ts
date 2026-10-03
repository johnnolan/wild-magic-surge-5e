import type { TestWorld } from "./cleanup";

const everyD20Result = Array.from({ length: 20 }, (_, index) => index + 1).join(
  ",",
);

/** Let Foundry roll normally while making the Standard outcome certain. */
export async function configureStandardOutcome(
  world: TestWorld,
  outcome: "surge" | "no surge",
): Promise<void> {
  await world.setSetting("autoRollD20", true);
  await world.setSetting("OPT_SURGE_TYPE", "DEFAULT");
  await world.setSetting("customRollDiceFormula", "1d20");
  await world.setSetting("customRollResultCheck", "EQ");
  await world.setSetting(
    "customRollResult",
    outcome === "surge" ? everyD20Result : "0",
  );
}

/** A d20 roll above 20 cannot hit an incremental threshold of 1. */
export async function configureIncrementalIncrease(
  world: TestWorld,
): Promise<void> {
  await world.setSetting("autoRollD20", true);
  await world.setSetting("OPT_SURGE_TYPE", "INCREMENTAL_CHECK");
  await world.setSetting("OPT_RESOURCE_TYPE", "NONE");
  await world.setSetting("customRollDiceFormula", "1d20+20");
}

/** A level-one spell follows a comparison that always has one result. */
export async function configureSpellLevelOutcome(
  world: TestWorld,
  outcome: "surge" | "no surge",
): Promise<void> {
  await world.setSetting("autoRollD20", true);
  await world.setSetting("OPT_SURGE_TYPE", "SPELL_LEVEL_DEPENDENT_ROLL");
  await world.setSetting("OPT_TSL_DIE", "1d20");
  await world.setSetting("OPT_TSL_LVL1", outcome === "surge" ? "< 21" : "> 20");
}
