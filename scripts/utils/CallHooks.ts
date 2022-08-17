export default class CallHooks {
  /**
   * @param hookName - The name of the hook to trigger
   * @param value - The value to send to the Hook
   * @return {void}
   */
  static Call(hookName: string, value: HookValue | HookSurgeValue): void {
    Hooks.callAll(`wild-magic-surge-5e.${hookName}`, value);
  }
}
