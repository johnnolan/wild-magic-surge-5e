var hasSurged = actor.getFlag("wild-magic-surge-5e", "hassurged");

if (hasSurged) {
  await new foundry.applications.api.DialogV2({
    window: { title: "Wild Magic Surge!" },
    content: `A surge just happened on ${actor.name}!`,
    buttons: [{ action: "close", label: "Close" }],
  }).render({ force: true });
}
