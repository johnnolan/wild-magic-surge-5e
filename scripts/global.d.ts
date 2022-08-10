declare global {
  interface LenientGlobalVariableTypes {
    game: never; // the type doesn't matter
    ui: never; // the type doesn't matter
  }
}
