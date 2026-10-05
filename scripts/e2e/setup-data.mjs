import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import {
  assertEmptyOrMarked,
  getDataPath,
  markerName,
  moduleId,
} from "./environment.mjs";

const dataPath = getDataPath({ requireMarker: false });
assertEmptyOrMarked(dataPath);
mkdirSync(dataPath, { recursive: true });
if (!existsSync(join(dataPath, markerName))) {
  writeFileSync(join(dataPath, markerName), `${moduleId}\n`, { flag: "wx" });
}
console.log(`Dedicated Foundry test data: ${dataPath}`);
