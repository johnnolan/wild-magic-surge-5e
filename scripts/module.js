const MODULE_NAME = "Wild Magic Surge 5e";

Hooks.on("init", function () {
  console.log(`Loading ${MODULE_NAME}`);
});

Hooks.on("ready", function () {
  console.log(`Successfully loaded ${MODULE_NAME}`);
});

Hooks.on("preRollItemBetterRolls", function (arg1, arg2, arg3) {
  try {
    const data = arg1;

    const hasWildMagicFeat =
      data._actor.data.items.find(
        (a) => a.name === `Wild Magic Surge` && a.type === "feat"
      ) !== undefined;
    const is1stLevelOrHigher = data._item.labels.level.indexOf(" Level") > -1;

    if (hasWildMagicFeat && is1stLevelOrHigher) {
      let text = `Wild Magic Check - Roll a D20`;

      let chatData = {
        user: game.user.id,
        speaker: game.user,
        content: text,
      };
      ChatMessage.create(chatData, {});
    }
  } catch (e) {
    console.error(`${MODULE_NAME}`, e);
  }
});
