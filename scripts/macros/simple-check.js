console.log(this);
console.log(actor);
console.log(token);
var hasSurged = actor.getFlag("wild-magic-surge-5e", "hassurged");

if (hasSurged) {
  console.log("Surged");
} else {
  console.log("Not Surged");
}
