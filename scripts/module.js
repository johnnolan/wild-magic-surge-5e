import { MODULE_NAME, MODULE_ID, OPT_SURGE_TYPE } from "./Settings.js";
import MagicSurgeCheck from "./MagicSurgeCheck.js";
import IncrementalCheck from "./utils/IncrementalCheck.js";
import RoundCheck from "./RoundCheck.js";
import ModuleSettings from "./ModuleSettings.js";
import { ActorHelperPanel } from "./panels/ActorHelperPanel.js";

Hooks.on("init", function () {
  console.info(`Registering ${MODULE_NAME} Settings.`);

  const moduleSettings = new ModuleSettings();
  moduleSettings.Register();

  console.info(`Settings for ${MODULE_NAME} registered successfully.`);
});

Hooks.on("createChatMessage", (chatMessage) => {
  if (chatMessage.flags?.hasOwnProperty("damage-log")) return;
  const actor = game.actors.get(chatMessage.speaker.actor);
  if (!actor) {
    return false;
  }
  const magicSurgeCheck = new MagicSurgeCheck(actor, chatMessage.speaker.token);
  magicSurgeCheck.CheckChatMessage(chatMessage);
});

Hooks.on("updateCombat", async function (roundData) {
  if (
    game.settings.get(`${MODULE_ID}`, `${OPT_SURGE_TYPE}`) ===
    `INCREMENTAL_CHECK_CHAOTIC`
  ) {
    const actor = game.actors.get(roundData.combatant.actor.id);
    if (!actor) {
      return false;
    }
    let roundCheck = new RoundCheck(actor);
    roundCheck.Check(roundData);
  }
});

Hooks.on("wild-magic-surge-5e.ResetIncrementalCheck", async function (actorId) {
  const actor = game.actors.get(actorId);
  if (!actor) {
    return false;
  }

  const incrementalCheck = new IncrementalCheck(actor);
  await incrementalCheck.Reset();
});

Hooks.on("renderActorSheet", async function (app, html, data) {
  let openButton = $(
    `<a class="open-actor-wms" title="Wild Magic Surge 5e Information"><i class="fas fa-wrench"></i>WMS</a>`
  );
  openButton.on("click", () => {
    new ActorHelperPanel(app.document, { actor: data.actor }).render(true);
  });
  html.closest(".app").find(".open-actor-wms").remove();
  let titleElement = html.closest(".app").find(".window-title");
  if (!app._minimized) openButton.insertAfter(titleElement);
});
