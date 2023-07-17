import { WMSCONST } from "./WMSCONST";
import MagicSurgeCheck from "./MagicSurgeCheck";
import IncrementalCheck from "./utils/IncrementalCheck";
import RoundCheck from "./RoundCheck";
import ModuleSettings from "./ModuleSettings";
import { ActorHelperPanel } from "./panels/ActorHelperPanel";
import { RoundData } from "@league-of-foundry-developers/foundry-vtt-types/src/foundry/client/data/documents/combat";
import Logger from "./Logger";
import RollTableMagicSurge from "./RollTableMagicSurge";

Hooks.on("init", function () {
  Logger.log(`Registering ${WMSCONST.MODULE_NAME} Settings.`, "module.init");

  ModuleSettings.Register();

  Logger.log(
    `Settings for ${WMSCONST.MODULE_NAME} registered successfully.`,
    "module.init",
  );

  Hooks.on(
    "wild-magic-surge-5e.manualTriggerWMS",
    async function (actor: Actor, roll: Roll) {
      if (roll && actor) {
        const wildMagicSurgeCheck = new MagicSurgeCheck(
          actor,
          getTokenIdByActorId(actor.id),
        );
        wildMagicSurgeCheck.SurgeWildMagic(true, roll);
      }
    },
  );

  Hooks.on(
    "renderChatMessage",
    async function (app: FormApplication, html: object) {
      const rollTableButton = html.find(".roll-table-wms");
      if (rollTableButton && rollTableButton.length > 0) {
        rollTableButton.unbind();
        rollTableButton.on("click", (e) => {
          e.preventDefault();
          e.stopPropagation();
          RollTableMagicSurge.RollOnTable();
        });
      }
    },
  );
});

function getTokenIdByActorId(actorId: string): string | undefined {
  return canvas.tokens?.placeables?.find((f) => f.actor?.id === actorId)?.id;
}

function Migrate() {
  const rollTableType = game.settings.get(
    `${WMSCONST.MODULE_ID}`,
    `${WMSCONST.OPT_ROLLTABLE_ENABLE}`,
  );
  if (rollTableType === "true") {
    game.settings.set(
      `${WMSCONST.MODULE_ID}`,
      `${WMSCONST.OPT_ROLLTABLE_ENABLE}`,
      WMSCONST.ROLLTABLE_TYPE.AUTO,
    );
  }
  if (rollTableType === "false") {
    game.settings.set(
      `${WMSCONST.MODULE_ID}`,
      `${WMSCONST.OPT_ROLLTABLE_ENABLE}`,
      WMSCONST.ROLLTABLE_TYPE.DEFAULT,
    );
  }
}

Hooks.once("ready", async function () {
  Migrate();

  if (game.user?.isGM) {
    game.socket?.on(
      "module.wild-magic-surge-5e",
      async function (payload: unknown) {
        if (payload.event === "SurgeCheck") {
          const surgeCheckData = payload.data;
          const actor = game.actors.get(surgeCheckData.actorId);
          const magicSurgeCheck = new MagicSurgeCheck(
            actor,
            surgeCheckData.tokenId,
          );
          magicSurgeCheck.CheckItem(surgeCheckData.item);
        }
      },
    );
  }

  Hooks.on("dnd5e.useItem", (item: Item) => {
    if (item.actor) {
      const tokenId = getTokenIdByActorId(item?.actor.id);
      if (game.user?.isGM) {
        const magicSurgeCheck = new MagicSurgeCheck(item.actor, tokenId);
        magicSurgeCheck.CheckItem(item);
      } else {
        game.socket?.emit("module.wild-magic-surge-5e", {
          event: "SurgeCheck",
          data: {
            actorId: item?.actor.id,
            tokenId: tokenId,
            item: item,
          },
        });
      }
    }
  });

  if (game.user?.isGM) {
    Hooks.on("updateCombat", async function (roundData: RoundData) {
      if (
        game.settings.get(
          `${WMSCONST.MODULE_ID}`,
          `${WMSCONST.OPT_SURGE_TYPE}`,
        ) === `INCREMENTAL_CHECK_CHAOTIC`
      ) {
        if (!roundData.combatant?.actor) {
          return false;
        }
        RoundCheck.Check(roundData.combatant?.actor);
      }
    });
  }

  Hooks.on(
    "wild-magic-surge-5e.ResetIncrementalCheck",
    async function (actorId: string) {
      const actor = game.actors.get(actorId);
      if (!actor) {
        return false;
      }
      await IncrementalCheck.Reset(actor);
    },
  );

  if (
    game.settings.get(
      `${WMSCONST.MODULE_ID}`,
      `${WMSCONST.OPT_SHOW_WMS_DEBUG_OPTION}`,
    )
  ) {
    Hooks.on(
      "renderActorSheet",
      async function (app: FormApplication, html: object, data: object) {
        const openButton = $(
          `<a class="open-actor-wms" title="Wild Magic Surge 5e Information"><i class="fas fa-wrench"></i>WMS</a>`,
        );
        openButton.on("click", () => {
          new ActorHelperPanel(app.document, { actor: data.actor }).render(
            true,
          );
        });
        html.closest(".app").find(".open-actor-wms").remove();
        const titleElement = html.closest(".app").find(".window-title");
        if (!app._minimized) openButton.insertAfter(titleElement);
      },
    );
  }
});
