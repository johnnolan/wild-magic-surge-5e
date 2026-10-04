import { readFileSync, appendFileSync } from "node:fs";
import { relative } from "node:path";

const escapeProperty = (value) =>
  String(value).replaceAll("%", "%25").replaceAll("\r", "%0D").replaceAll("\n", "%0A").replaceAll(":", "%3A").replaceAll(",", "%2C");
const escapeMessage = (value) =>
  String(value).replaceAll("%", "%25").replaceAll("\r", "%0D").replaceAll("\n", "%0A");
const escapeCell = (value) =>
  String(value).replaceAll("|", "\\|").replaceAll("\r", " ").replaceAll("\n", " ");
const plural = (count, word) => `${count} ${word}${count === 1 ? "" : "s"}`;

let results;
try {
  results = JSON.parse(readFileSync("eslint_report.json", "utf8"));
  if (!Array.isArray(results)) throw new Error("Expected an ESLint results array");
} catch (error) {
  console.error(`Unable to read ESLint report: ${error.message}`);
  process.exit(1);
}

const problems = results.flatMap(({ filePath, messages }) =>
  messages.map((message) => ({
    file: relative(process.cwd(), filePath).replaceAll("\\", "/"),
    ...message,
  })),
);
const errors = problems.filter(({ severity }) => severity === 2).length;
const warnings = problems.filter(({ severity }) => severity === 1).length;

for (const { file, line, column, ruleId, severity, message } of problems) {
  const kind = severity === 2 ? "error" : "warning";
  const location = [
    `file=${escapeProperty(file)}`,
    line ? `line=${line}` : null,
    column ? `col=${column}` : null,
    ruleId ? `title=${escapeProperty(ruleId)}` : null,
  ]
    .filter(Boolean)
    .join(",");
  console.log(`::${kind} ${location}::${escapeMessage(message)}`);
}

const summary = [
  "## ESLint",
  "",
  `**${plural(errors, "error")}, ${plural(warnings, "warning")}** across ${plural(results.length, "checked file")}.`,
  "",
];
if (problems.length) {
  summary.push("| Location | Rule | Severity | Message |", "| --- | --- | --- | --- |");
  for (const { file, line, column, ruleId, severity, message } of problems.slice(0, 50)) {
    summary.push(
      `| ${escapeCell(`${file}:${line ?? 1}:${column ?? 1}`)} | ${escapeCell(ruleId ?? "—")} | ${severity === 2 ? "Error" : "Warning"} | ${escapeCell(message)} |`,
    );
  }
  if (problems.length > 50) summary.push("", `Showing 50 of ${problems.length} findings; see the annotations for the rest.`);
}
if (process.env.GITHUB_STEP_SUMMARY) {
  appendFileSync(process.env.GITHUB_STEP_SUMMARY, `${summary.join("\n")}\n`);
}
console.log(`${plural(errors, "ESLint error")}, ${plural(warnings, "warning")}.`);
if (errors || process.env.ESLINT_OUTCOME === "failure") process.exitCode = 1;
