import { spawn } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
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

console.log(`Starting dedicated Foundry on http://127.0.0.1:${port}`);
const server = spawn(process.execPath, args, {
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
