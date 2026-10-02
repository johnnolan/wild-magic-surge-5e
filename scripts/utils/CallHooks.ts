export interface WMSHookNotificationPayloads {
  CheckForSurge: { value: true };
  IsWildMagicSurge: {
    surge: boolean;
    result: string | undefined;
    tokenId: string | undefined;
    actorId: string | null;
  };
  DieDescendingChanged: ResourceValue;
  IncrementalCheckChanged: { value: number };
}

type WMSHookNotification = {
  [HookName in keyof WMSHookNotificationPayloads]: [
    hookName: HookName,
    payload: WMSHookNotificationPayloads[HookName],
  ];
}[keyof WMSHookNotificationPayloads];

export default class CallHooks {
  static Call(...notification: WMSHookNotification): void {
    switch (notification[0]) {
      case "CheckForSurge":
        Hooks.callAll("wild-magic-surge-5e.CheckForSurge", notification[1]);
        break;
      case "IsWildMagicSurge":
        Hooks.callAll("wild-magic-surge-5e.IsWildMagicSurge", notification[1]);
        break;
      case "DieDescendingChanged":
        Hooks.callAll("wild-magic-surge-5e.DieDescendingChanged", notification[1]);
        break;
      case "IncrementalCheckChanged":
        Hooks.callAll("wild-magic-surge-5e.IncrementalCheckChanged", notification[1]);
        break;
    }
  }
}
