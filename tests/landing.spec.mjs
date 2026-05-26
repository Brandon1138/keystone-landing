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
    for (const label of ["Open Source", "Reproducible", "Built for Engineers"]) {
      await expect(page.getByText(label, { exact: false })).toBeVisible();
    }
  });
});
