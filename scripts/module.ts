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

Hooks.on("createChatMessage", (chatMessage: any) => {
  if (chatMessage.flags?.hasOwnProperty("damage-log")) return;
  const actor = (game as any).actors.get(chatMessage.speaker.actor);
  if (!actor) {
    return false;
  }
  const magicSurgeCheck = new MagicSurgeCheck(actor, chatMessage.speaker.token);
  magicSurgeCheck.CheckChatMessage(chatMessage);
});

Hooks.on("updateCombat", async function (roundData: any) {
  if (
    game.settings.get(`${MODULE_ID}`, `${OPT_SURGE_TYPE}`) ===
    `INCREMENTAL_CHECK_CHAOTIC`
  ) {
    const actor = (game as any).actors.get(roundData.combatant.actor.id);
    if (!actor) {
      return false;
    }
    const roundCheck = new RoundCheck(actor);
    // @ts-expect-error TS(2554): Expected 0 arguments, but got 1.
    roundCheck.Check(roundData);
  }
});

Hooks.on(
  "wild-magic-surge-5e.ResetIncrementalCheck",
  async function (actorId: any) {
    const actor = (game as any).actors.get(actorId);
    if (!actor) {
      return false;
    }

    // @ts-expect-error TS(2554): Expected 2-3 arguments, but got 1.
    const incrementalCheck = new IncrementalCheck(actor);
    await incrementalCheck.Reset();
  }
);

Hooks.on("renderActorSheet", async function (app: any, html: any, data: any) {
  const openButton = $(
    `<a class="open-actor-wms" title="Wild Magic Surge 5e Information"><i class="fas fa-wrench"></i>WMS</a>`
  );
  openButton.on("click", () => {
    // @ts-expect-error TS(2769): No overload matches this call.
    (new ActorHelperPanel(app.document, { actor: data.actor }) as any).render(
      true
    );
  });
  html.closest(".app").find(".open-actor-wms").remove();
  const titleElement = html.closest(".app").find(".window-title");
  if (!app._minimized) openButton.insertAfter(titleElement);
});
