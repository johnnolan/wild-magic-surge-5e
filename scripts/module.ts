import { WMSCONST } from "./WMSCONST";
import MagicSurgeCheck from "./MagicSurgeCheck";
import IncrementalCheck from "./utils/IncrementalCheck";
import RoundCheck from "./RoundCheck";
import ModuleSettings from "./ModuleSettings";
import { ActorHelperPanel } from "./panels/ActorHelperPanel";
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
    async function (app: FormApplication, html: HTMLElement) {
      // Modernize: Use vanilla JS instead of jQuery
      const rollTableButtons = html.querySelectorAll('.roll-table-wms');
      rollTableButtons.forEach((button) => {
        // Remove previous event listeners by cloning
        const newButton = button.cloneNode(true) as HTMLElement;
        button.replaceWith(newButton);
        newButton.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          RollTableMagicSurge.RollOnTable();
        });
      });
    },
  );
});

function getTokenIdByActorId(actorId: string): string | undefined {
  // Modernize: Add null checks for canvas and tokens, and specify type for 'f'
  if (!canvas || !canvas.tokens) return undefined;
  return canvas.tokens.placeables.find((f: Token) => f.actor?.id === actorId)?.id;
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
      async function (payload: any) {
        // Modernize: Ensure payload is serializable and type safe
        if (payload?.event === "SurgeCheck") {
          const surgeCheckData = payload.data;
          const actor = game.actors.get(surgeCheckData.actorId);
          if (!actor) return;
          const magicSurgeCheck = new MagicSurgeCheck(
            actor,
            surgeCheckData.tokenId,
          );
          magicSurgeCheck.CheckItem(surgeCheckData.item);
        }
      },
    );
  }

  Hooks.on("dnd5e.postUseActivity", (activity: any) => {
    const item = activity.item;
    if (item?.actor) {
      const tokenId = getTokenIdByActorId(item.actor.id);
      if (game.user?.isGM) {
        const magicSurgeCheck = new MagicSurgeCheck(item.actor, tokenId);
        magicSurgeCheck.CheckItem(item);
      } else {
        // Modernize: Only send serializable data over the socket
        game.socket?.emit("module.wild-magic-surge-5e", {
          event: "SurgeCheck",
          data: {
            actorId: item.actor.id,
            tokenId: tokenId,
            item: item,
          },
        });
      }
    }
  });

  if (game.user?.isGM) {
    Hooks.on("updateCombat", async function (combat: Combat) {
      if (
        game.settings.get(
          `${WMSCONST.MODULE_ID}`,
          `${WMSCONST.OPT_SURGE_TYPE}`,
        ) === `INCREMENTAL_CHECK_CHAOTIC`
      ) {
        if (!combat.combatant?.actor) {
          return false;
        }
        RoundCheck.Check(combat.combatant.actor);
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
      async function (app: FormApplication, html: HTMLElement, data: any) {
        // Modernize: Use vanilla JS instead of jQuery
        const openButton = document.createElement("a");
        openButton.className = "open-actor-wms";
        openButton.title = "Wild Magic Surge 5e Information";
        openButton.innerHTML = '<i class="fas fa-wrench"></i>WMS';
        openButton.addEventListener("click", () => {
          // Use app.object instead of app.document, and cast options to any to allow custom actor property
          new ActorHelperPanel(app.object, { ...(data as any), actor: data.actor } as any).render(true);
        });
        const appElement = html.closest(".app");
        if (appElement) {
          appElement.querySelectorAll(".open-actor-wms").forEach((el) => el.remove());
          const titleElement = appElement.querySelector(".window-title");
          if (titleElement && !(app as any)._minimized) {
            titleElement.insertAdjacentElement("afterend", openButton);
          }
        }
      },
    );
  }
});
