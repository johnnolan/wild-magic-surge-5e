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

  type HookValue = {
    value: string | boolean | number;
  };

  type HookSurgeValue = {
    surge: boolean;
    result: string | undefined;
    tokenId: string;
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
}

export {};
