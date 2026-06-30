import { expect, test } from "@playwright/test";

const footerPages = [
  { label: "Overview", path: "/platform/", heading: "Platform Overview" },
  { label: "Benchmarks", path: "/benchmarks/", heading: "Benchmarks" },
  { label: "Blog", path: "/blog/", heading: "Research Notes" },
  { label: "About", path: "/about/", heading: "About Keystone" },
  { label: "Contact", path: "/contact/", heading: "Contact" },
  { label: "Privacy", path: "/privacy/", heading: "Privacy" },
  { label: "Terms", path: "/terms/", heading: "Terms" },
];

const newFooterPages = footerPages.filter(({ path }) =>
  ["/platform/", "/benchmarks/", "/contact/"].includes(path),
);

function oklchLightness(value) {
  const match = value.match(/oklch\(\s*([0-9.]+)/i);
  return match ? Number(match[1]) : Number.NaN;
}

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

// Releases is no longer a static footer page: it is a React route that reuses
// the landing's design language (SiteHeader, signed release record, dark
// site-footer) rather than the shared static-page.css shell.
test("releases route reuses the landing design language", async ({ page }) => {
  const response = await page.goto("/releases");
  expect(response?.status()).toBe(200);

  await expect(page.getByRole("heading", { level: 1, name: "Releases" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Keystone home" }).first()).toHaveAttribute("href", "/");

  // It draws from the React design system, not the static shell.
  await expect(page.locator('link[rel="stylesheet"][href="/static-page.css"]')).toHaveCount(0);

  // The signed release record and its download path are present.
  await expect(page.getByLabel("Signed release record")).toBeVisible();
  await expect(page.locator(".release-actions .primary-action")).toHaveAttribute(
    "href",
    "/download",
  );
  await expect(page.getByRole("link", { name: "View manifest" })).toHaveAttribute(
    "href",
    "/releases/latest.json",
  );

  // Shares the landing's dark site-footer, not the static footer-lite.
  await expect(page.locator("footer.site-footer")).toBeVisible();
  await expect(page.locator("footer.footer-lite")).toHaveCount(0);
});

// Schemes is likewise a React route now: a catalog ledger in the landing's
// design language rather than the shared static-page.css shell. Its visible
// heading is "The Field"; the route stays at /schemes/.
test("schemes route reuses the landing design language", async ({ page }) => {
  const response = await page.goto("/schemes");
  expect(response?.status()).toBe(200);

  await expect(page.getByRole("heading", { level: 1, name: "The Field" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Keystone home" }).first()).toHaveAttribute("href", "/");

  // It draws from the React design system, not the static shell.
  await expect(page.locator('link[rel="stylesheet"][href="/static-page.css"]')).toHaveCount(0);

  // The classical-vs-post-quantum catalog and the two attacks are present.
  await expect(page.getByRole("heading", { level: 2, name: "Classical" })).toBeVisible();
  await expect(page.getByRole("heading", { level: 2, name: "Post-quantum" })).toBeVisible();
  await expect(page.getByRole("heading", { level: 3, name: /Shor.s Algorithm/ })).toBeVisible();
  await expect(page.getByRole("heading", { level: 3, name: /Grover.s Algorithm/ })).toBeVisible();

  // Shares the landing's dark site-footer, not the static footer-lite.
  await expect(page.locator("footer.site-footer")).toBeVisible();
  await expect(page.locator("footer.footer-lite")).toHaveCount(0);
});

test("static footer pages follow the system dark appearance", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "dark" });
  await page.goto("/about/");

  const theme = await page.evaluate(() => {
    const rootStyles = getComputedStyle(document.documentElement);
    const bodyStyles = getComputedStyle(document.body);

    return {
      colorScheme: rootStyles.getPropertyValue("color-scheme").trim(),
      background: rootStyles.getPropertyValue("--bg").trim(),
      surface: rootStyles.getPropertyValue("--surface").trim(),
      ink: rootStyles.getPropertyValue("--ink").trim(),
      bodyBackground: bodyStyles.backgroundColor,
    };
  });
  const backgroundLightness = oklchLightness(theme.background);
  const surfaceLightness = oklchLightness(theme.surface);

  expect(theme.colorScheme).toContain("dark");
  expect(backgroundLightness).toBeLessThan(0.12);
  expect(surfaceLightness).toBeGreaterThan(backgroundLightness);
  expect(oklchLightness(theme.ink)).toBeGreaterThan(0.84);
  expect(theme.bodyBackground).not.toBe("rgb(255, 255, 255)");
});

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
