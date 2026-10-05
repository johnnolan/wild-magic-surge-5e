/**
 * Test suites install only the Foundry services they exercise. Their fixture
 * objects are deliberately incomplete; production code still sees Foundry's
 * full global declarations. Keep the document/global assertions here.
 */
interface TestGameAccess {
  actors: { get: jest.Mock };
  macros: Array<{ isOwner: boolean }>;
  roll: unknown;
  settings: {
    get: jest.Mock;
    set: jest.Mock;
    settings: Map<string, unknown>;
  };
  tables: Array<{ roll: jest.Mock }>;
}

/** Each suite installs a deliberately incomplete Game surface. */
interface TestGameFixture {
  settings?: {
    get?: jest.Mock;
    set?: jest.Mock;
    register?: jest.Mock;
    registerMenu?: jest.Mock;
    settings?: Map<string, unknown>;
  };
  actors?: { get?: jest.Mock };
  [key: string]: unknown;
}

interface TestGlobalAccess {
  game: TestGameAccess;
  Hooks: { callAll: jest.Mock };
  Roll: jest.Mock;
  canvas: { tokens: { get: jest.Mock } };
  ui: object;
}

// Foundry documents and globals have large runtime surfaces. A unit fixture
// intentionally implements only the properties used by the test under study.
export const testGlobals = globalThis as unknown as TestGlobalAccess;

export function setTestGame<T extends TestGameFixture>(fixture: T): T {
  testGlobals.game = fixture as unknown as TestGameAccess;
  return fixture;
}

export function setTestHooks<T extends object>(fixture: T): T {
  testGlobals.Hooks = fixture as unknown as TestGlobalAccess["Hooks"];
  return fixture;
}

export function setTestUi<T extends object>(fixture: T): T {
  testGlobals.ui = fixture;
  return fixture;
}

export function setTestCanvas<T extends object>(
  fixture: T | undefined,
): T | undefined {
  testGlobals.canvas = fixture as TestGlobalAccess["canvas"];
  return fixture;
}

type OtherFoundryGlobal =
  | "Roll"
  | "CONST"
  | "CONFIG"
  | "TextEditor"
  | "ChatMessage"
  | "foundry"
  | "Sequence"
  | "hasProperty";

export function setTestGlobal<
  Name extends OtherFoundryGlobal,
  T extends object,
>(name: Name, fixture: T): T {
  Object.defineProperty(globalThis, name, {
    value: fixture,
    writable: true,
    configurable: true,
  });
  return fixture;
}

export function actorFixture<T extends object>(fixture: T): Actor & T {
  return fixture as Actor & T;
}

export function itemFixture<T extends object>(fixture: T): Item.Stored & T {
  return fixture as Item.Stored & T;
}

export function rollFixture<T extends object>(fixture: T): Roll & T {
  return fixture as Roll & T;
}

export function combatFixture<T extends object>(fixture: T): Combat & T {
  return fixture as Combat & T;
}

export function chatMessageFixture<T extends object>(
  fixture: T,
): ChatMessage.Stored & T {
  return fixture as ChatMessage.Stored & T;
}

export function formDataFixture(
  object: Record<string, unknown>,
): foundry.applications.ux.FormDataExtended {
  return { object } as foundry.applications.ux.FormDataExtended;
}

export function rollTableFixture<T extends object>(fixture: T): RollTable & T {
  return fixture as RollTable & T;
}

export function tableDrawFixture<T extends object>(
  fixture: T,
): RollTable.Draw & T {
  return fixture as RollTable.Draw & T;
}

export function deferred<T>() {
  let resolve!: (value: T | PromiseLike<T>) => void;
  let reject!: (reason?: unknown) => void;
  const promise = new Promise<T>((fulfill, fail) => {
    resolve = fulfill;
    reject = fail;
  });
  return { promise, resolve, reject };
}
