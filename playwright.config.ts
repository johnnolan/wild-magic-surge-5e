import { defineConfig, devices } from "@playwright/test";

const port = Number(process.env.FOUNDRY_E2E_PORT ?? 31000);
if (!Number.isInteger(port) || port < 1024 || port > 65535) {
  throw new Error(
    "FOUNDRY_E2E_PORT must be an available port from 1024 to 65535.",
  );
}

const baseURL = `http://127.0.0.1:${port}`;

export default defineConfig({
  testDir: "./e2e",
  timeout: 90_000,
  expect: { timeout: 15_000 },
  workers: 1,
  fullyParallel: false,
  retries: 0,
  reporter: [
    ["list"],
    ["html", { open: "never", outputFolder: "playwright-report" }],
  ],
  outputDir: "test-results/playwright",
  use: {
    baseURL,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    command: "node ./scripts/e2e/start-foundry.mjs",
    url: baseURL,
    timeout: 120_000,
    reuseExistingServer: false,
  },
});
