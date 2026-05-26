import { test, expect } from "@playwright/test";

test.describe("Landing — Nav", () => {
  test.beforeEach(async ({ page }) => { await page.goto("/"); });

  test("renders wordmark and 5 primary links", async ({ page }) => {
    const nav = page.getByRole("banner");
    await expect(nav).toBeVisible();
    await expect(nav.getByText("Keystone", { exact: false })).toBeVisible();
    for (const label of ["Features", "Benchmarks", "Security", "Download", "Docs"]) {
      await expect(nav.getByRole("link", { name: label })).toBeVisible();
    }
  });

  test('shows GitHub link and "Star on GitHub" CTA', async ({ page }) => {
    const nav = page.getByRole("banner");
    await expect(nav.getByRole("link", { name: /Star on GitHub/i })).toBeVisible();
  });
});

test.describe("Landing — Hero", () => {
  test.beforeEach(async ({ page }) => { await page.goto("/"); });

  test("renders h1 with gradient 'Observable.' word", async ({ page }) => {
    const h1 = page.getByRole("heading", { level: 1 });
    await expect(h1).toContainText("Post-Quantum");
    await expect(h1).toContainText("Benchmarking");
    await expect(h1.getByText("Observable.", { exact: false })).toBeVisible();
  });

  test("primary CTA anchors to #download, secondary links to /reports/", async ({ page }) => {
    await expect(page.getByRole("link", { name: /Download Keystone/i })).toHaveAttribute("href", "#download");
    await expect(page.getByRole("link", { name: /View Case Study/i })).toHaveAttribute("href", /^\/reports\/?$/);
  });

  test("renders three inline trust pillars under the CTAs", async ({ page }) => {
    const hero = page.locator("#platform");
    for (const label of ["Open Source", "Reproducible", "Built for Engineers"]) {
      await expect(hero.getByText(label, { exact: true })).toBeVisible();
    }
  });
});

test.describe("Landing — Mockup chrome", () => {
  test.beforeEach(async ({ page }) => { await page.goto("/"); });

  test("renders macOS window chrome with three dots and title", async ({ page }) => {
    const win = page.getByTestId("mockup-window");
    await expect(win).toBeVisible();
    await expect(win.getByTestId("traffic-lights").locator("span")).toHaveCount(3);
    await expect(win.getByText("Keystone", { exact: true }).first()).toBeVisible();
    await expect(win.getByRole("button", { name: /Run Benchmark/i })).toBeVisible();
  });

  test("sidebar lists all 8 navigation items", async ({ page }) => {
    const sidebar = page.getByTestId("mockup-sidebar");
    for (const label of ["Overview", "Benchmarks", "Schemes", "Runtimes", "Workflows", "Results", "Reports", "Settings"]) {
      await expect(sidebar.getByText(label, { exact: true })).toBeVisible();
    }
    await expect(sidebar.getByText("Default Lab")).toBeVisible();
    await expect(sidebar.getByText(/Apple M2 Pro/)).toBeVisible();
  });
});

test.describe("Mockup — dashboard pieces", () => {
  test.beforeEach(async ({ page }) => { await page.goto("/"); });

  test("renders 4 metric cards with values from mockData", async ({ page }) => {
    const strip = page.getByTestId("mockup-metrics");
    await expect(strip.locator("[data-testid=metric-card]")).toHaveCount(4);
    await expect(strip.getByText("1,248")).toBeVisible();
    await expect(strip.getByText("2.34M")).toBeVisible();
    await expect(strip.getByText("0.42 ms")).toBeVisible();
    await expect(strip.getByText("99.8%")).toBeVisible();
  });

  test("ops bar chart renders 7 bars with scheme labels", async ({ page }) => {
    const chart = page.getByTestId("mockup-ops-chart");
    await expect(chart.locator("[data-testid=ops-bar]")).toHaveCount(7);
    await expect(chart.getByText("ML-KEM")).toBeVisible();
    await expect(chart.getByText("AES-GCM")).toBeVisible();
    await expect(chart.getByText("3.21M")).toBeVisible();
  });

  test("latency gauge renders SVG with value and p50/p95/p99 labels", async ({ page }) => {
    const gauge = page.getByTestId("mockup-gauge");
    await expect(gauge.locator("svg")).toBeVisible();
    await expect(gauge.getByText("0.42", { exact: true })).toBeVisible();
    await expect(gauge.getByText("P50")).toBeVisible();
    await expect(gauge.getByText("P95")).toBeVisible();
    await expect(gauge.getByText("P99")).toBeVisible();
  });

  test("latency line chart renders 4 series and time labels", async ({ page }) => {
    const chart = page.getByTestId("mockup-line-chart");
    await expect(chart.locator("svg")).toBeVisible();
    await expect(chart.locator("svg polyline")).toHaveCount(4);
    await expect(chart.getByText("-60s")).toBeVisible();
    await expect(chart.getByText("Now")).toBeVisible();
    for (const label of ["ML-KEM", "ML-DSA", "Falcon", "SPHINCS+"]) {
      await expect(chart.getByText(label, { exact: true })).toBeVisible();
    }
  });

  test("throughput histogram renders 21 bars", async ({ page }) => {
    const chart = page.getByTestId("mockup-histogram");
    await expect(chart.locator("[data-testid=histogram-bar]")).toHaveCount(21);
    await expect(chart.getByText("10k")).toBeVisible();
    await expect(chart.getByText("100M")).toBeVisible();
  });

  test("scheme table renders 7 rows and footer caption", async ({ page }) => {
    const table = page.getByTestId("mockup-scheme-table");
    await expect(table.locator("tbody tr")).toHaveCount(7);
    await expect(table.getByText("ML-KEM (768)")).toBeVisible();
    await expect(table.getByText("AES-GCM (256)")).toBeVisible();
    await expect(page.getByText(/Completed 32 runs/)).toBeVisible();
    await expect(page.getByText(/Last run/)).toBeVisible();
  });
});

test.describe("Landing — Features", () => {
  test("renders 5 feature cards", async ({ page }) => {
    await page.goto("/");
    const section = page.locator("#features");
    await expect(section).toBeVisible();
    await expect(section.locator("[data-testid=feature-card]")).toHaveCount(5);
    for (const title of [
      "Real-time benchmarking",
      "Visual analytics",
      "Hybrid workflows",
      "Desktop workbench",
      "Cross-platform",
    ]) {
      await expect(section.getByText(title)).toBeVisible();
    }
  });
});

test.describe("Landing — Footer", () => {
  test("renders 6 column groups and bottom bar", async ({ page }) => {
    await page.goto("/");
    const footer = page.getByRole("contentinfo");
    await expect(footer).toBeVisible();
    for (const heading of ["Product", "Resources", "Community", "Company", "Stay in the loop"]) {
      await expect(footer.getByText(heading, { exact: true })).toBeVisible();
    }
    await expect(footer.getByRole("textbox", { name: /email/i })).toBeVisible();
    await expect(footer.getByText(/© 2026 Keystone Labs Inc\./i)).toBeVisible();
    await expect(footer.getByRole("link", { name: /Terms of Use/i })).toHaveAttribute("href", /^\/terms\/?$/);
    await expect(footer.getByRole("link", { name: /Privacy Policy/i })).toHaveAttribute("href", /^\/privacy\/?$/);
  });
});

test.describe("Landing — Download", () => {
  test("renders 3 platform cards; only Windows is enabled", async ({ page }) => {
    await page.goto("/");
    const section = page.locator("#download");
    await expect(section).toBeVisible();
    await expect(section.locator("[data-testid=download-card]")).toHaveCount(3);

    await expect(section.getByText("macOS")).toBeVisible();
    await expect(section.getByText("Windows", { exact: true })).toBeVisible();
    await expect(section.getByText("Linux")).toBeVisible();

    const macBtn = section.getByRole("button", { name: /Download \.dmg/i });
    await expect(macBtn).toBeDisabled();
    const winBtn = section.getByRole("link", { name: /Download \.exe/i });
    await expect(winBtn).toBeVisible();
    const linuxBtn = section.getByRole("button", { name: /Download \.AppImage/i });
    await expect(linuxBtn).toBeDisabled();

    await expect(section.getByText(/Coming soon/i).first()).toBeVisible();
  });
});

test.describe("Landing — responsive", () => {
  test("no horizontal overflow at any breakpoint", async ({ page }) => {
    await page.goto("/");
    const overflow = await page.evaluate(() =>
      document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(1);
  });
});

test("trust pillars section renders 5 cards", async ({ page }) => {
  await page.goto("/");
  const section = page.locator("#trust");
  await expect(section).toBeVisible();
  await expect(section.locator("[data-testid=trust-card]")).toHaveCount(5);
  for (const title of ["Open & Auditable", "Reproducible Runs", "Secure by Default", "Modular Architecture", "Data Privacy"]) {
    await expect(section.getByText(title)).toBeVisible();
  }
});

test.describe("Landing — Comparison", () => {
  test("renders 4 grouped comparison charts with PQC + Classical bars", async ({ page }) => {
    await page.goto("/");
    const section = page.locator("#comparison");
    await expect(section).toBeVisible();
    await expect(section.locator("[data-testid=comparison-chart]")).toHaveCount(4);
    for (const label of ["Security Level", "Throughput", "Median Latency", "Artifact Size"]) {
      await expect(section.getByText(label)).toBeVisible();
    }
    await expect(section.getByText("Post-Quantum", { exact: true })).toBeVisible();
    await expect(section.getByText("Classical", { exact: true })).toBeVisible();
    await expect(section.getByText(/Higher is better/i).first()).toBeVisible();
    await expect(section.getByText(/Lower is better/i).first()).toBeVisible();
  });
});
