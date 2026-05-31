import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: "list",
  use: {
    baseURL: "http://127.0.0.1:3210",
    trace: "on-first-retry",
  },
  webServer: {
    command: "npm run dev -- -H 127.0.0.1 -p 3210",
    url: "http://127.0.0.1:3210",
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
  projects: [
    { name: "chromium-desktop", use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 } } },
    { name: "chromium-tablet",  use: { ...devices["Desktop Chrome"], viewport: { width: 768,  height: 1024 } } },
    { name: "chromium-mobile",  use: { ...devices["Desktop Chrome"], viewport: { width: 390,  height: 844  } } },
  ],
});
