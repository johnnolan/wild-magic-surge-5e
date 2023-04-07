// Create new roll object
let roll = new Roll("1d20");

// Roll the dice
await roll.evaluate({async: false});

// If total is less than 3 (i.e. less than 10%)
if (roll.total < 3) {
  // Trigger a wild magic surge passing the selected actor and roll
  Hooks.callAll(`wild-magic-surge-5e.manualTriggerWMS`, actor, roll);
}
