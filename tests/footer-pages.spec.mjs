import { expect, test } from "@playwright/test";

const footerPages = [
  { label: "Overview", path: "/platform/", heading: "Platform Overview" },
  { label: "Benchmarks", path: "/benchmarks/", heading: "Benchmarks" },
  { label: "Schemes", path: "/schemes/", heading: "Schemes" },
  { label: "Reports", path: "/reports/", heading: "Reports" },
  { label: "Documentation", path: "/docs/", heading: "Documentation" },
  { label: "Blog", path: "/blog/", heading: "Research Notes" },
  { label: "Security", path: "/security/", heading: "Security" },
  { label: "Releases", path: "/releases/", heading: "Releases" },
  { label: "About", path: "/about/", heading: "About Keystone" },
  { label: "Contact", path: "/contact/", heading: "Contact" },
  { label: "Privacy", path: "/privacy/", heading: "Privacy" },
  { label: "Terms", path: "/terms/", heading: "Terms" },
];

const newFooterPages = footerPages.filter(({ path }) =>
  ["/platform/", "/benchmarks/", "/schemes/", "/reports/", "/contact/"].includes(path),
);

// Tests that assert behavior on the landing page (/) live in
// tests/landing.spec.mjs. This file is scoped to the static sub-pages
// reachable from the landing's footer.

test("all footer-linked sub-pages return 200", async ({ request }) => {
  for (const { path } of footerPages) {
    const response = await request.get(path);
    expect(response.status(), `${path} should respond 200`).toBe(200);
  }
});

for (const { path, heading } of footerPages) {
  test(`${path} has the expected heading and home link`, async ({ page }) => {
    await page.goto(path);

    await expect(page.getByRole("heading", { level: 1, name: heading })).toBeVisible();
    await expect(page.getByRole("link", { name: "Keystone home" }).first()).toHaveAttribute("href", "/");
  });
}

for (const { path } of footerPages) {
  test(`${path} loads shared styling, glyphs, and footer-lite links`, async ({ page }) => {
    await page.goto(path);

    await expect(page.locator('link[rel="stylesheet"][href="/static-page.css"]')).toHaveCount(1);

    const glyphs = page.locator('[data-keystone-glyph="hidden-k"]');
    await expect(glyphs.first()).toBeVisible();
    await expect(glyphs).toHaveCount(2);

    const footer = page.locator("footer.footer-lite");
    await expect(footer).toBeVisible();

    for (const { path: footerPath } of footerPages) {
      await expect(footer.locator(`a[href="${footerPath}"]`)).toHaveCount(1);
    }
  });
}

test("contact page does not present a fake working form or backend", async ({ page }) => {
  await page.goto("/contact/");

  await expect(page.getByText("No contact form is wired on this static site.")).toBeVisible();
  await expect(page.locator("form")).toHaveCount(0);
  await expect(page.locator("input, textarea")).toHaveCount(0);
  await expect(page.locator('button[type="submit"]')).toHaveCount(0);
  await expect(page.locator("body")).not.toContainText("Message sent");
});

for (const { path, heading } of newFooterPages) {
  test(`${path} is a truthful static footer page`, async ({ page }) => {
    await page.goto(path);

    await expect(page.getByRole("heading", { level: 1, name: heading })).toBeVisible();
    await expect(page.locator("main")).toContainText("research");
    await expect(page.locator("main")).not.toContainText("certified");
    await expect(page.locator("main")).not.toContainText("production-ready");
  });
}

for (const viewport of [
  { name: "mobile", width: 390, height: 1200 },
  { name: "tablet", width: 768, height: 1100 },
  { name: "desktop", width: 1440, height: 1100 },
]) {
  test(`footer pages avoid horizontal overflow on ${viewport.name}`, async ({ page }) => {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });

    for (const { path } of footerPages) {
      await page.goto(path);

      const documentWidth = await page.evaluate(() => document.documentElement.scrollWidth);
      expect(documentWidth, `${path} document width`).toBeLessThanOrEqual(viewport.width + 1);

      const overflow = await page.evaluate(() => {
        const viewportWidth = window.innerWidth;
        return [...document.querySelectorAll("body *")]
          .map((element) => {
            const rect = element.getBoundingClientRect();
            return {
              tag: element.tagName.toLowerCase(),
              text: (element.textContent || "").replace(/\s+/g, " ").trim().slice(0, 80),
              left: Math.round(rect.left),
              right: Math.round(rect.right),
              width: Math.round(rect.width),
              height: Math.round(rect.height),
              viewportWidth,
            };
          })
          .filter((item) => item.width > 0 && item.height > 0)
          .filter((item) => item.left < -1 || item.right > item.viewportWidth + 1)
          .slice(0, 10);
      });

      expect(overflow, `${path} overflowing elements`).toEqual([]);
    }
  });
}
