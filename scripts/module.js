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
    "Wild Magic Surge 5e Check", arg1
  );

  try {
    //const arg = arguments[0].args[3][0];
    const data = arg1[0].args[3][0];
  
    const hasWildMagicFeat = data._actor.data.items.find(
        (a) => a.name === "Wild Magic Surge" && a.type === "feat"
      ) !== undefined;
    const is1stLevelOrHigher = data._item.labels.level.indexOf(" Level") > -1;

    console.debug("is1stLevelOrHigher", is1stLevelOrHigher);
    console.debug("hasWildMagicFeat", hasWildMagicFeat);
    console.debug("Wild Magic Check?", hasWildMagicFeat && is1stLevelOrHigher);
    console.debug("actor", arg._actor.data.name);
    console.debug("level", arg._item.labels.level);
  
    if (hasWildMagicFeat && is1stLevelOrHigher) {
      let text = `Wild Magic Check - Roll a D20`;
  
      let chatData = {
        user: game.user.id,
        speaker: game.user,
        content: text,
      };
      ChatMessage.create(chatData, {});
    }
  } catch (e) {}
});
