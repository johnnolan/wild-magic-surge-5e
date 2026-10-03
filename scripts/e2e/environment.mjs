import { existsSync, lstatSync, readdirSync, readFileSync } from "node:fs";
import { resolve, join } from "node:path";

export const markerName = ".wild-magic-surge-5e-e2e";
export const moduleId = "wild-magic-surge-5e";

export function getDataPath({ requireMarker = true } = {}) {
  const suppliedPath = process.env.FOUNDRY_E2E_DATA_PATH;
  if (!suppliedPath) {
    throw new Error(
      "Set FOUNDRY_E2E_DATA_PATH to a dedicated test data directory.",
    );
  }

  const dataPath = resolve(suppliedPath);
  if (dataPath === "/") {
    throw new Error("FOUNDRY_E2E_DATA_PATH must not be the filesystem root.");
  }
  if (existsSync(dataPath) && lstatSync(dataPath).isSymbolicLink()) {
    throw new Error("FOUNDRY_E2E_DATA_PATH must not be a symlink.");
  }
  if (requireMarker) {
    if (!existsSync(join(dataPath, markerName))) {
      throw new Error(
        `Refusing to use ${dataPath}: E2E marker is missing. Run yarn e2e:setup first.`,
      );
    }
    assertEmptyOrMarked(dataPath);
  }
  return dataPath;
}

export function getPort() {
  const port = Number(process.env.FOUNDRY_E2E_PORT ?? 31000);
  if (!Number.isInteger(port) || port < 1024 || port > 65535) {
    throw new Error("FOUNDRY_E2E_PORT must be from 1024 to 65535.");
  }
  return port;
}

export function getWorldId() {
  const worldId = process.env.FOUNDRY_E2E_WORLD_ID ?? "wild-magic-surge-e2e";
  if (!/^[a-z0-9-]+$/.test(worldId)) {
    throw new Error(
      "FOUNDRY_E2E_WORLD_ID must use lowercase letters, digits, and hyphens.",
    );
  }
  return worldId;
}

export function requireFoundryInstall() {
  const suppliedPath = process.env.FOUNDRY_INSTALL_PATH;
  if (!suppliedPath) {
    throw new Error(
      "Set FOUNDRY_INSTALL_PATH to a licensed Foundry V14 Node installation.",
    );
  }
  const installPath = resolve(suppliedPath);
  if (!existsSync(join(installPath, "main.js"))) {
    throw new Error(`Foundry main.js was not found in ${installPath}.`);
  }
  return installPath;
}

export function assertEmptyOrMarked(dataPath) {
  if (!existsSync(dataPath)) return;
  const entries = readdirSync(dataPath);
  if (entries.length && !entries.includes(markerName)) {
    throw new Error(
      `Refusing to mark nonempty directory ${dataPath} as test data.`,
    );
  }
  if (entries.includes(markerName)) {
    const marker = readFileSync(join(dataPath, markerName), "utf8").trim();
    if (marker !== moduleId) {
      throw new Error(`Unexpected E2E marker in ${dataPath}.`);
    }
  }
}
