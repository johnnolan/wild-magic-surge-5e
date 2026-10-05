import type { WMSHookNotificationPayloads } from "../utils/CallHooks";
import type { Dnd5ePostUseActivity } from "../utils/Dnd5eActivity";

declare global {
  interface LenientGlobalVariableTypes {
    game: never; // the type doesn't matter
  }
  interface Window {
    Hooks: typeof Hooks;
  }
}

declare module "@league-of-foundry-developers/foundry-vtt-types/configuration" {
  namespace Hooks {
    interface HookConfig {
      "wild-magic-surge-5e.manualTriggerWMS": (
        actor: Actor,
        roll: Roll,
      ) => void;
      "wild-magic-surge-5e.reset": (actor: Actor) => void;
      "wild-magic-surge-5e.Reset": (actorId: string) => void;
      "wild-magic-surge-5e.ResetDieDescending": (actorId: string) => void;
      "wild-magic-surge-5e.ResetIncrementalCheck": (actorId: string) => void;
      "wild-magic-surge-5e.SetDieDescending": (
        actorId: string,
        resourceNumber: number,
      ) => void;
      "wild-magic-surge-5e.SetIncrementalCheck": (
        actorId: string,
        resourceNumber: number,
      ) => void;
      "wild-magic-surge-5e.CheckForSurge": (
        payload: WMSHookNotificationPayloads["CheckForSurge"],
      ) => void;
      "wild-magic-surge-5e.IsWildMagicSurge": (
        payload: WMSHookNotificationPayloads["IsWildMagicSurge"],
      ) => void;
      "wild-magic-surge-5e.DieDescendingChanged": (
        payload: WMSHookNotificationPayloads["DieDescendingChanged"],
      ) => void;
      "wild-magic-surge-5e.IncrementalCheckChanged": (
        payload: WMSHookNotificationPayloads["IncrementalCheckChanged"],
      ) => void;
      "dnd5e.postUseActivity": (
        activity: Dnd5ePostUseActivity,
        usageConfig: unknown,
        results: unknown,
      ) => boolean | void;
    }
  }
}

export {};
