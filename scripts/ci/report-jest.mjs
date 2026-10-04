import { readFileSync, appendFileSync } from "node:fs";

function readAttribute(xml, name) {
  const value = xml.match(new RegExp(`\\b${name}="([^"]+)"`))?.[1];
  if (value === undefined) throw new Error(`Missing ${name} in JUnit report`);
  return value;
}

let junit;
let coverage;
try {
  junit = readFileSync("test-results/junit/results.xml", "utf8");
  coverage = JSON.parse(readFileSync("coverage/coverage-summary.json", "utf8")).total;
  if (!junit.includes("<testsuites") || !coverage) throw new Error("Incomplete Jest reports");
} catch (error) {
  console.error(`Unable to read Jest reports: ${error.message}`);
  process.exit(1);
}

const counts = Object.fromEntries(
  ["tests", "failures", "errors", "skipped"].map((key) => [key, Number(readAttribute(junit, key))]),
);
const summary = [
  "## Jest",
  "",
  `**${counts.tests - counts.failures - counts.errors - counts.skipped} passed**, ${counts.failures + counts.errors} failed, ${counts.skipped} skipped (${counts.tests} total).`,
  "",
  "| Coverage | Percent | Covered / Total |",
  "| --- | ---: | ---: |",
  ...["lines", "statements", "branches", "functions"].map((key) =>
    `| ${key} | ${coverage[key].pct}% | ${coverage[key].covered} / ${coverage[key].total} |`,
  ),
  "",
];
if (process.env.GITHUB_STEP_SUMMARY) {
  appendFileSync(process.env.GITHUB_STEP_SUMMARY, `${summary.join("\n")}\n`);
}
console.log(summary.join("\n"));
