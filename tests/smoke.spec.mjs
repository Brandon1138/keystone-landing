import { test, expect } from "@playwright/test";

test("home page responds and contains the title", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/Keystone/);
});
