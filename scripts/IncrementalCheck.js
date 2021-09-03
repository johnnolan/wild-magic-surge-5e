const FLAG_NAME = "wild-magic-surge-5e";
const FLAG_OPTION = "surge_increment";

export async function IncrementalCheck(actor, rollValue) {
  if (!actor) {
    return;
  }
  if (!actor.data.flags.hasOwnProperty(FLAG_NAME)) {
    await actor.setFlag(FLAG_NAME, FLAG_OPTION, 1);
    return rollValue === 1;
  }

  let incrementLevel = await actor.getFlag(FLAG_NAME, FLAG_OPTION);

  if (rollValue <= incrementLevel) {
    await actor.setFlag(FLAG_NAME, FLAG_OPTION, 1);
    return true;
  } else {
    incrementLevel = incrementLevel + 1;
    await actor.setFlag(FLAG_NAME, FLAG_OPTION, incrementLevel);
  }

  return false;
}
