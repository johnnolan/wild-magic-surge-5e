var hasSurged = actor.getFlag("wild-magic-surge-5e", "hassurged");

if (hasSurged) {
  new Sequence("WMSTRUE")
    .effect()
    .file(
      "modules/JB2A_DnD5e/Library/Generic/Nature/SwirlingLeavesComplete01_02_Regular_Green_400x400.webm"
    )
    .duration(10000)
    .fadeIn(500)
    .fadeOut(1000)
    .atLocation(token.id)
    .play();
} else {
  new Sequence("WMSFALSE")
    .effect()
    .file(
      "modules/JB2A_DnD5e/Library/Generic/Particles/ParticlesOutward02_03_Regular_GreenYellow_400x400.webm"
    )
    .duration(10000)
    .fadeIn(500)
    .fadeOut(1000)
    .atLocation(token.id)
    .play();
}
