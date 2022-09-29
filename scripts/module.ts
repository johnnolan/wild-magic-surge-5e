import { WMSCONST } from "./WMSCONST";
import MagicSurgeCheck from "./MagicSurgeCheck";
import IncrementalCheck from "./utils/IncrementalCheck";
import RoundCheck from "./RoundCheck";
import ModuleSettings from "./ModuleSettings";
import { ActorHelperPanel } from "./panels/ActorHelperPanel";
import { RoundData } from "@league-of-foundry-developers/foundry-vtt-types/src/foundry/client/data/documents/combat";
import Logger from "./Logger";
import TriggerMacro from "./TriggerMacro";

Hooks.on("init", function () {
  Logger.log(`Registering ${WMSCONST.MODULE_NAME} Settings.`, "module.init");

  ModuleSettings.Register();

  Logger.log(
    `Settings for ${WMSCONST.MODULE_NAME} registered successfully.`,
    "module.init"
  );
});

function getTokenIdByActorId(actorId: string) {
  return canvas.tokens.placeables.find((f) => f.actor.id === actorId)?.id;
}

Hooks.once("ready", async function () {
  if (game.user?.isGM) {
    game.socket?.on(
      "module.wild-magic-surge-5e",
      async function (payload: unknown) {
        if (payload.event === "IsWildMagicSurge") {
          TriggerMacro.Run(payload.data.actorId, payload.data.tokenId);
        }
      }
    );
  }

  Hooks.on("dnd5e.useItem", (item: Item) => {
    if (item.actor) {
      const tokenId = getTokenIdByActorId(item?.actor.id);
      if (tokenId) {
        const magicSurgeCheck = new MagicSurgeCheck(item.actor, tokenId);
        magicSurgeCheck.CheckItem(item);
      }
    }
  });

  Hooks.on("updateCombat", async function (roundData: RoundData) {
    if (
      game.settings.get(
        `${WMSCONST.MODULE_ID}`,
        `${WMSCONST.OPT_SURGE_TYPE}`
      ) === `INCREMENTAL_CHECK_CHAOTIC`
    ) {
      const actor = game.actors.get(roundData.combatant.actor.id);
      if (!actor) {
        return false;
      }
      RoundCheck.Check(actor);
    }
  });

  Hooks.on(
    "wild-magic-surge-5e.ResetIncrementalCheck",
    async function (actorId: string) {
      const actor = game.actors.get(actorId);
      if (!actor) {
        return false;
      }
      await IncrementalCheck.Reset(actor);
    }
  );

  if (
    game.settings.get(
      `${WMSCONST.MODULE_ID}`,
      `${WMSCONST.OPT_SHOW_WMS_DEBUG_OPTION}`
    )
  ) {
    Hooks.on(
      "renderActorSheet",
      async function (app: FormApplication, html: object, data: object) {
        const openButton = $(
          `<a class="open-actor-wms" title="Wild Magic Surge 5e Information"><i class="fas fa-wrench"></i>WMS</a>`
        );
        openButton.on("click", () => {
          new ActorHelperPanel(app.document, { actor: data.actor }).render(
            true
          );
        });
        html.closest(".app").find(".open-actor-wms").remove();
        const titleElement = html.closest(".app").find(".window-title");
        if (!app._minimized) openButton.insertAfter(titleElement);
      }
    );
  }
});
