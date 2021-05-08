
import { wildMagicCheck } from './lib/lib.js';

console.log(
    "Wild Magic Surge 5e"
  );

Hooks.on("init", function () {
  console.log(
    "Loading Wild Magic Surge 5e"
  );
});

Hooks.on("ready", function () {
  console.log(
    "Successfully loaded Wild Magic Surge 5e"
  );
});

Hooks.on("preRollItemBetterRolls", function (arg1, arg2, arg3) {
  console.log(
    "Wild Magic Surge 5e Check"
  );

  wildMagicCheck(arg1);
});
