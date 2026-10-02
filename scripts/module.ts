import { WMSCONST } from "./WMSCONST";
import MagicSurgeCheck from "./MagicSurgeCheck";
import IncrementalCheck from "./utils/IncrementalCheck";
import RoundCheck from "./RoundCheck";
import ModuleSettings from "./ModuleSettings";
import { ActorHelperPanel } from "./panels/ActorHelperPanel";
import Logger from "./Logger";
import RollTableMagicSurge from "./RollTableMagicSurge";
import DieDescending from "./utils/DieDescending";
import { HandlePostUseActivity } from "./utils/Dnd5eActivity";

Hooks.on("init", function () {
  Logger.log(`Registering ${WMSCONST.MODULE_NAME} Settings.`, "module.init");

  ModuleSettings.Register();

  Logger.log(
    `Settings for ${WMSCONST.MODULE_NAME} registered successfully.`,
    "module.init",
  );

  Hooks.on(
    "wild-magic-surge-5e.manualTriggerWMS",
    async function (actor, roll) {
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
    "wild-magic-surge-5e.reset",
    async function (actor) {
      if (actor) {
        const wildMagicSurgeCheck = new MagicSurgeCheck(
          actor,
          getTokenIdByActorId(actor.id),
        );
        wildMagicSurgeCheck.SurgeWildMagic(true, roll);
      }
    },
  );

  Hooks.on("renderChatMessageHTML", (_message, html) => {
    const rollTableButton = html.querySelector<HTMLButtonElement>(".roll-table-wms");
    if (!rollTableButton || rollTableButton.dataset.wmsBound === "true") return;

    rollTableButton.dataset.wmsBound = "true";
    rollTableButton.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      RollTableMagicSurge.RollOnTable();
    });
  });
});

function getTokenIdByActorId(actorId: string | null | undefined): string | undefined {
  if (!actorId) {
    return undefined;
  }
  return canvas?.tokens?.placeables?.find((f) => f.actor?.id === actorId)?.id ?? undefined;
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

async function _resetChecks(actorId: string) {
  const actor = game.actors.get(actorId);
  if (!actor) {
    return false;
  }
  await IncrementalCheck.Reset(actor);
  await DieDescending.Reset(actor);
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

  Hooks.on("dnd5e.postUseActivity", (activity) => {
    HandlePostUseActivity(activity, {
      getTokenIdByActorId,
      isGM: game.user?.isGM ?? false,
      onGMCheck: (actor, item, tokenId) => {
        const magicSurgeCheck = new MagicSurgeCheck(actor, tokenId);
        magicSurgeCheck.CheckItem(item);
      },
      onPlayerCheck: (payload) => {
        game.socket?.emit("module.wild-magic-surge-5e", payload);
      },
    });
  });

  if (
    game.settings.get(
      `${WMSCONST.MODULE_ID}`,
      `${WMSCONST.OPT_SHOW_WMS_DEBUG_OPTION}`,
    )
  ) {
    Hooks.on("getHeaderControlsActorSheetV2", (app: CharacterActorSheet, controls: Array<any>) => {
      controls.push({
        label: "WMS",
        icon: "fas fa-wrench",
        onClick: () => new ActorHelperPanel({ document: app.document }).render({ force: true }),
        button: true,
      });
    });
  }

  if (game.user?.isGM) {
    Hooks.on("updateCombat", RoundCheck.OnCombatUpdate);
  }

  Hooks.on(
    "wild-magic-surge-5e.Reset",
    async function (actorId) {
      _resetChecks(actorId);
    },
  );

  Hooks.on(
    "wild-magic-surge-5e.ResetDieDescending",
    async function (actorId) {
      _resetChecks(actorId);
    },
  );

  Hooks.on(
    "wild-magic-surge-5e.ResetIncrementalCheck",
    async function (actorId) {
      _resetChecks(actorId);
    },
  );

  Hooks.on(
    "wild-magic-surge-5e.SetDieDescending",
    async function (actorId, resourceNumber) {
      const actor = game.actors.get(actorId);
      if (!actor) {
        return false;
      }
      DieDescending.OverrideResource(actor, resourceNumber);
    },
  );

  Hooks.on(
    "wild-magic-surge-5e.SetIncrementalCheck",
    async function (actorId, resourceNumber) {
      const actor = game.actors.get(actorId);
      if (!actor) {
        return false;
      }
      IncrementalCheck.OverrideResource(actor, resourceNumber);
    },
  );
});
