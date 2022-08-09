import { MODULE_NAME, MODULE_ID, OPT_SURGE_TYPE } from "./Settings.js";
import MagicSurgeCheck from "./MagicSurgeCheck.js";
import IncrementalCheck from "./utils/IncrementalCheck.js";
import RoundCheck from "./RoundCheck.js";
import ModuleSettings from "./ModuleSettings.js";
import { ActorHelperPanel } from "./panels/ActorHelperPanel.js";

// @ts-expect-error TS(2304): Cannot find name 'Hooks'.
Hooks.on("init", function () {
  console.info(`Registering ${MODULE_NAME} Settings.`);

  const moduleSettings = new ModuleSettings();
  moduleSettings.Register();

  console.info(`Settings for ${MODULE_NAME} registered successfully.`);
});

// @ts-expect-error TS(2304): Cannot find name 'Hooks'.
Hooks.on("createChatMessage", (chatMessage: any) => {
  if (chatMessage.flags?.hasOwnProperty("damage-log")) return;
  // @ts-expect-error TS(2304): Cannot find name 'game'.
  const actor = game.actors.get(chatMessage.speaker.actor);
  if (!actor) {
    return false;
  }
  const magicSurgeCheck = new MagicSurgeCheck(actor, chatMessage.speaker.token);
  magicSurgeCheck.CheckChatMessage(chatMessage);
});

// @ts-expect-error TS(2304): Cannot find name 'Hooks'.
Hooks.on("updateCombat", async function (roundData: any) {
  if (
    // @ts-expect-error TS(2304): Cannot find name 'game'.
    game.settings.get(`${MODULE_ID}`, `${OPT_SURGE_TYPE}`) ===
    `INCREMENTAL_CHECK_CHAOTIC`
  ) {
    // @ts-expect-error TS(2304): Cannot find name 'game'.
    const actor = game.actors.get(roundData.combatant.actor.id);
    if (!actor) {
      return false;
    }
    let roundCheck = new RoundCheck(actor);
    // @ts-expect-error TS(2554): Expected 0 arguments, but got 1.
    roundCheck.Check(roundData);
  }
});

// @ts-expect-error TS(2304): Cannot find name 'Hooks'.
Hooks.on("wild-magic-surge-5e.ResetIncrementalCheck", async function (actorId: any) {
  // @ts-expect-error TS(2304): Cannot find name 'game'.
  const actor = game.actors.get(actorId);
  if (!actor) {
    return false;
  }

  // @ts-expect-error TS(2554): Expected 2-3 arguments, but got 1.
  const incrementalCheck = new IncrementalCheck(actor);
  await incrementalCheck.Reset();
});

// @ts-expect-error TS(2304): Cannot find name 'Hooks'.
Hooks.on("renderActorSheet", async function (app: any, html: any, data: any) {
  // @ts-expect-error TS(2581): Cannot find name '$'. Do you need to install type ... Remove this comment to see the full error message
  let openButton = $(
    `<a class="open-actor-wms" title="Wild Magic Surge 5e Information"><i class="fas fa-wrench"></i>WMS</a>`
  );
  openButton.on("click", () => {
    // @ts-expect-error TS(2554): Expected 0 arguments, but got 2.
    (new ActorHelperPanel(app.document, { actor: data.actor }) as any).render(true);
  });
  html.closest(".app").find(".open-actor-wms").remove();
  let titleElement = html.closest(".app").find(".window-title");
  if (!app._minimized) openButton.insertAfter(titleElement);
});
