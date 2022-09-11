// Actor data you can parse and use
console.log(actor);

// Token data you can parse and use
console.log(token);

// Current Die Descending value (d20, d12, d10, etc)
var descendingDieType = actor.getFlag("wild-magic-surge-5e", "die_type").dieValue;

// Current Incremental Check value (1-10)
var incrementalCheckValue = actor.getFlag("wild-magic-surge-5e", "surge_increment_resource").value;

// Gets whether the last check was a surge or not.
var hasSurged = actor.getFlag("wild-magic-surge-5e", "hassurged");

if (hasSurged) {
  console.log("Surged");
} else {
  console.log("Not Surged");
}
