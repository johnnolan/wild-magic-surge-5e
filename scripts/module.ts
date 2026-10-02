import { getModuleSetting, setModuleSetting } from "./utils/TypedSettings";
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
import { AttachRollTableButton } from "./utils/ChatMessageHooks";
import { CreateWMSActorSheetControl } from "./utils/ActorSheetControls";

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
        await _resetActorChecks(actor);
      }
    },
  );

  Hooks.on("renderChatMessageHTML", (_message, html) =>
    AttachRollTableButton(html, () => RollTableMagicSurge.RollOnTable()),
  );
});

function getTokenIdByActorId(
  actorId: string | null | undefined,
): string | undefined {
  if (!actorId) {
    return undefined;
  }
  return (
    canvas?.tokens?.placeables?.find((f) => f.actor?.id === actorId)?.id ??
    undefined
  );
}

async function Migrate(): Promise<void> {
  const rollTableType = getModuleSetting(WMSCONST.OPT_ROLLTABLE_ENABLE);
  if (rollTableType === "true") {
    await setModuleSetting(
      WMSCONST.OPT_ROLLTABLE_ENABLE,
      WMSCONST.ROLLTABLE_TYPE.AUTO,
    );
  }
  if (rollTableType === "false") {
    await setModuleSetting(
      WMSCONST.OPT_ROLLTABLE_ENABLE,
      WMSCONST.ROLLTABLE_TYPE.DEFAULT,
    );
  }
}

async function _resetActorChecks(actor: Actor): Promise<void> {
  await IncrementalCheck.Reset(actor);
  await DieDescending.Reset(actor);
}

async function _resetChecks(actorId: string) {
  if (!actorId) return false;
  const actor = game.actors?.get(actorId);
  if (!actor) {
    return false;
  }
  await _resetActorChecks(actor);
}

Hooks.once("ready", async function () {
  await Migrate();

  if (game.user?.isGM) {
    game.socket?.on(
      "module.wild-magic-surge-5e",
      async function (payload: unknown) {
        if (
          !payload ||
          typeof payload !== "object" ||
          !("event" in payload) ||
          payload.event !== "SurgeCheck" ||
          !("data" in payload)
        ) {
          return;
        }

        const surgeCheckData = payload.data;
        if (
          !surgeCheckData ||
          typeof surgeCheckData !== "object" ||
          !("actorId" in surgeCheckData) ||
          typeof surgeCheckData.actorId !== "string" ||
          !surgeCheckData.actorId ||
          !("item" in surgeCheckData) ||
          !surgeCheckData.item
        ) {
          return;
        }

        const actor = game.actors?.get(surgeCheckData.actorId);
        if (!actor) return;
        const tokenId =
          "tokenId" in surgeCheckData &&
          typeof surgeCheckData.tokenId === "string"
            ? surgeCheckData.tokenId
            : undefined;
        const magicSurgeCheck = new MagicSurgeCheck(actor, tokenId);
        await magicSurgeCheck.CheckItem(surgeCheckData.item as Item);
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
    getModuleSetting(WMSCONST.OPT_SHOW_WMS_DEBUG_OPTION)
  ) {
    Hooks.on("getHeaderControlsActorSheetV2", (app, controls) => {
      controls.push(
        CreateWMSActorSheetControl(app.document, (actor) => {
          void new ActorHelperPanel({ document: actor }).render({ force: true });
        }),
      );
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
      if (!actorId) return false;
      const actor = game.actors?.get(actorId);
      if (!actor) {
        return false;
      }
      DieDescending.OverrideResource(actor, resourceNumber);
    },
  );

  Hooks.on(
    "wild-magic-surge-5e.SetIncrementalCheck",
    async function (actorId, resourceNumber) {
      if (!actorId) return false;
      const actor = game.actors?.get(actorId);
      if (!actor) {
        return false;
      }
      IncrementalCheck.OverrideResource(actor, resourceNumber);
    },
  );
});
