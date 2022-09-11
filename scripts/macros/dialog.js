var hasSurged = actor.getFlag("wild-magic-surge-5e", "hassurged");

if (hasSurged) {
  new Dialog({
    title: "Wild Magic Surge!",
    content: `A surge just happened on ${actor.name}!`,
    buttons: { close: { label: "Close" } },
  }).render(true);
}
