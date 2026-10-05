export type SurgeType = "WMS" | "POWM" | "TOCSURGE";

export type Comparison = "EQ" | "GT" | "LT";

export type DieValue =
  undefined | "1d20" | "1d12" | "1d10" | "1d8" | "1d6" | "1d4";

export type TidesItemData = {
  hasTidesOfChaosResource: boolean;
  hasTidesOfChaosFeat: boolean;
  isValid: boolean;
};

export type SpellLevelFormula = {
  roll?: string;
  equation: string;
  target: number;
};

export type ModuleSetup = {
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

export type FlagValue = {
  max?: number;
  min?: number;
  value: number;
  dieValue?: DieValue;
};

export interface ResourceValues {
  max: number;
  value: number;
}

export interface ResourceValue extends ResourceValues {
  label: string;
  lr: boolean;
  sr: boolean;
}
