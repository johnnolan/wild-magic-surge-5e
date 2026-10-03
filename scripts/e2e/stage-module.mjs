import {
  cpSync,
  existsSync,
  mkdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { join, resolve } from "node:path";
import { getDataPath, moduleId } from "./environment.mjs";

const projectRoot = resolve(import.meta.dirname, "../..");
const dataPath = getDataPath();
const modulePath = join(dataPath, "Data", "modules", moduleId);
const packageJson = JSON.parse(
  readFileSync(join(projectRoot, "package.json"), "utf8"),
);
const manifest = JSON.parse(
  readFileSync(join(projectRoot, "module.json"), "utf8"),
);
const directories = ["dist", "templates", "languages", "packs", "images"];

for (const directory of directories) {
  if (!existsSync(join(projectRoot, directory))) {
    throw new Error(
      `Module asset is missing: ${directory}. Run yarn build first.`,
    );
  }
}

manifest.version = packageJson.version;
delete manifest.url;
delete manifest.manifest;
delete manifest.download;

rmSync(modulePath, { recursive: true, force: true });
mkdirSync(modulePath, { recursive: true });
for (const directory of directories) {
  cpSync(join(projectRoot, directory), join(modulePath, directory), {
    recursive: true,
  });
}
writeFileSync(
  join(modulePath, "module.json"),
  `${JSON.stringify(manifest, null, 2)}\n`,
);

const referencedAssets = [
  ...manifest.esmodules,
  ...manifest.languages.map((language) => language.path),
  ...manifest.packs.map((pack) => pack.path),
  "templates/settings.html",
];
for (const asset of referencedAssets) {
  const path = join(modulePath, asset.replace(/^\//, ""));
  if (!existsSync(path))
    throw new Error(`Staged manifest asset is missing: ${asset}`);
}

console.log(`Staged ${moduleId} ${packageJson.version} in ${modulePath}`);
