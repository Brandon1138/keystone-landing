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
