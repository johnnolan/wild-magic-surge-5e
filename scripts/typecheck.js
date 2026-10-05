import { spawnSync } from "node:child_process";

// Lower these reviewed baselines as diagnostics are fixed; do not raise them to hide regressions.
const projects = {
  production: { config: "tsconfig.json", baseline: 425 },
  test: { config: "tsconfig.test.json", baseline: 145 },
};
const projectName = process.argv[2] ?? "production";
const project = projects[projectName];

if (!project) {
  console.error(`Unknown typecheck project: ${projectName}`);
  process.exit(1);
}

const compiler = process.platform === "win32" ? "tsc.cmd" : "tsc";
const result = spawnSync(
  compiler,
  ["--noEmit", "--pretty", "false", "-p", project.config],
  { encoding: "utf8" },
);

if (result.error) {
  console.error(`Unable to run TypeScript: ${result.error.message}`);
  process.exit(1);
}

const output = `${result.stdout ?? ""}${result.stderr ?? ""}`;
const diagnostics = output.match(/error TS\d+:/g) ?? [];

if (result.status === 0 && diagnostics.length === 0) {
  console.log("Production typecheck passed with no diagnostics.");
  process.exit(0);
}

if (
  result.status !== 0 &&
  diagnostics.length > 0 &&
  diagnostics.length <= project.baseline
) {
  console.log(
    `${projectName} typecheck is within the recorded baseline: ${diagnostics.length}/${project.baseline} diagnostics.`,
  );
  process.exit(0);
}

console.error(output);
console.error(
  `${projectName} typecheck failed: ${diagnostics.length} diagnostics; baseline is ${project.baseline}.`,
);
process.exit(1);
