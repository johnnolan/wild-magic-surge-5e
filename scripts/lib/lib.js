export function hasWildMagicFeat(data) {
  return data._actor.data.items.find(
    (a) => a.name === "Wild Magic Surge" && a.type === "feat"
  ) !== undefined;
}

export function is1stLevelOrHigher(data) {
  return data._item.labels.level.indexOf(" Level") > -1;
}

export function wildMagicCheck(data) {
try {
    //const arg = arguments[0].args[3][0];
    const arg = data[0].args[3][0];
  
    const hasWildMagicFeat = hasWildMagicFeat(arg);
    const is1stLevelOrHigher = is1stLevelOrHigher(arg);

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
}
