import type { WMSHookNotificationPayloads } from "../utils/CallHooks";

declare global {
  interface LenientGlobalVariableTypes {
    game: never; // the type doesn't matter
  }
  interface Window {
    Hooks: typeof Hooks;
  }

  type SurgeType = "WMS" | "POWM" | "TOCSURGE";

  type Comparison = "EQ" | "GT" | "LT";

  type DieValue = undefined | "1d20" | "1d12" | "1d10" | "1d8" | "1d6" | "1d4";

  type TidesItemData = {
    hasTidesOfChaosResource: boolean;
    hasTidesOfChaosFeat: boolean;
    isValid: boolean;
  };

  type SpellLevelFormula = {
    roll?: string;
    equation: string;
    target: number;
  };

  type ModuleSetup = {
    actor: {
      name: string;
    };
    settings: {
      isValid: boolean;
      hasWildMagicFeat: boolean;
      hasTidesOfChaosResource: boolean;
      hasTidesOfChaosFeat: boolean;
    };
  };

  type FlagValue = {
    max?: number;
    min?: number;
    value: number;
    dieValue?: DieValue;
  };

  interface ResourceValues {
    max: number;
    value: number;
  }

  interface ResourceValue extends ResourceValues {
    label: string;
    lr: boolean;
    sr: boolean;
  }

    type Dnd5ePostUseActivity = {
      item: Item;
      consumption: {
        spellSlot?: boolean;
      };
    };
}

  declare module "@league-of-foundry-developers/foundry-vtt-types/configuration" {
    namespace Hooks {
      interface HookConfig {
        "wild-magic-surge-5e.manualTriggerWMS": (actor: Actor, roll: Roll) => void;
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
