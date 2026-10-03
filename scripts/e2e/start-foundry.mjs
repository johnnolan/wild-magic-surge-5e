import { execFileSync, spawn } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { homedir } from "node:os";
import { join, resolve } from "node:path";
import {
  getDataPath,
  getPort,
  getWorldId,
  requireFoundryInstall,
} from "./environment.mjs";

const setupMode = process.argv.includes("--setup");
const dataPath = getDataPath();
const installPath = requireFoundryInstall();
const worldId = getWorldId();
const port = getPort();

function nodeVersion(executable) {
  try {
    return execFileSync(executable, ["--version"], {
      encoding: "utf8",
    }).trim();
  } catch {
    return undefined;
  }
}

function supportsFoundryV14(version) {
  return /^v(?:2[4-9]|[3-9]\d)\./.test(version ?? "");
}

function findFoundryNode() {
  const explicitPath = process.env.FOUNDRY_NODE_PATH;
  if (explicitPath) {
    const version = nodeVersion(explicitPath);
    if (version && !supportsFoundryV14(version)) {
      throw new Error(
        `FOUNDRY_NODE_PATH must point to Node 24 or newer; found ${version}.`,
      );
    }
    if (!existsSync(explicitPath)) {
      throw new Error(`FOUNDRY_NODE_PATH does not exist: ${explicitPath}`);
    }
    return { executable: explicitPath, version: version ?? "unknown" };
  }

  const projectRoot = resolve(import.meta.dirname, "../..");
  const pinnedVersion = readFileSync(
    join(projectRoot, ".nvmrc"),
    "utf8",
  ).trim();
  const nvmRoot = process.env.NVM_DIR ?? join(homedir(), ".nvm");
  const pinnedNode = join(
    nvmRoot,
    "versions",
    "node",
    `v${pinnedVersion}`,
    "bin",
    "node",
  );
  if (supportsFoundryV14(process.version)) {
    return { executable: process.execPath, version: process.version };
  }
  if (existsSync(pinnedNode)) {
    return { executable: pinnedNode, version: `v${pinnedVersion}` };
  }
  const pathVersion = nodeVersion("node");
  if (supportsFoundryV14(pathVersion)) {
    return { executable: "node", version: pathVersion };
  }

  throw new Error(
    `Foundry V14 needs Node 24 or newer. The current Node is ${process.version}. ` +
      "Run nvm install in this repo, or set FOUNDRY_NODE_PATH to a Node 24 executable.",
  );
}

const foundryNode = findFoundryNode();

if (!setupMode) {
  const worldPath = join(dataPath, "Data", "worlds", worldId, "world.json");
  const systemPath = join(dataPath, "Data", "systems", "dnd5e", "system.json");
  if (!existsSync(worldPath)) {
    throw new Error(
      `Test world ${worldId} is missing. Create it with yarn e2e:setup.`,
    );
  }
  if (!existsSync(systemPath)) {
    throw new Error(
      "dnd5e is missing from the dedicated test data. Install it with yarn e2e:setup.",
    );
  }
  const world = JSON.parse(readFileSync(worldPath, "utf8"));
  if (world.system !== "dnd5e") {
    throw new Error(`Test world ${worldId} must use the dnd5e system.`);
  }
}

const args = [
  join(installPath, "main.js"),
  `--dataPath=${dataPath}`,
  `--port=${port}`,
  "--noupnp",
  "--noupdate",
];
if (!setupMode) args.push(`--world=${worldId}`);

console.log(
  `Starting dedicated Foundry on http://127.0.0.1:${port} with Node ${foundryNode.version} (${foundryNode.executable})`,
);
const server = spawn(foundryNode.executable, args, {
  cwd: installPath,
  stdio: "inherit",
});
for (const signal of ["SIGINT", "SIGTERM"]) {
  process.on(signal, () => server.kill(signal));
}
server.on("error", (error) => {
  console.error(`Could not start Foundry: ${error.message}`);
  process.exitCode = 1;
});
server.on("exit", (code) => {
  process.exitCode = code ?? 1;
});
