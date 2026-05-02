import { expect, test } from "@playwright/test";

const viewports = [
  { name: "mobile", width: 390, height: 1200 },
  { name: "tablet", width: 768, height: 1100 },
  { name: "desktop", width: 1440, height: 1100 },
];

for (const viewport of viewports) {
  test(`landing page fits without horizontal overflow on ${viewport.name}`, async ({ page }) => {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.goto("http://127.0.0.1:4173/");
    await expect(page).toHaveTitle(/Keystone/);

    const documentWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    expect(documentWidth).toBeLessThanOrEqual(viewport.width + 1);

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

    expect(overflow).toEqual([]);
    await expect(page.getByRole("link", { name: /download/i }).first()).toBeVisible();
  });
}

test("copying the checksum gives visible feedback", async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: {
        writeText: async (text) => {
          window.__copiedText = text;
        },
      },
    });
  });

  await page.goto("http://127.0.0.1:4173/");
  await page.getByRole("button", { name: "Copy SHA256" }).click();

  await expect(page.getByText("Copied")).toBeVisible();
  const copiedText = await page.evaluate(() => window.__copiedText);
  expect(copiedText).toMatch(/^[a-f0-9]{64}$/);
});

test("approved brand pass uses hidden-K glyph and removes tweak tooling", async ({ page }) => {
  await page.goto("http://127.0.0.1:4173/");

  await expect(page.locator('[data-keystone-glyph="hidden-k"]').first()).toBeVisible();
  await expect(page.getByText("Post-quantum cryptography & benchmarking platform")).toBeVisible();

  const glyphCount = await page.locator('[data-keystone-glyph="hidden-k"]').count();
  expect(glyphCount).toBeGreaterThanOrEqual(2);

  const hasTweakRuntime = await page.evaluate(() => Boolean(window.TweaksPanel || window.useTweaks));
  expect(hasTweakRuntime).toBe(false);

  const accent = await page.evaluate(() =>
    getComputedStyle(document.documentElement).getPropertyValue("--accent").trim()
  );
  expect(accent).toBe("#2E5E91");
});

test("polished hero uses the viewport and CTA band keeps high-contrast actions", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1100 });
  await page.goto("http://127.0.0.1:4173/");

  const heroWidth = await page.locator(".hero-grid").evaluate((element) =>
    Math.round(element.getBoundingClientRect().width)
  );
  expect(heroWidth).toBeGreaterThan(1240);

  const ctaPolish = await page.locator("#download").evaluate((section) => {
    const lede = section.querySelector("p");
    const primary = section.querySelector(".btn.primary");
    const secondary = [...section.querySelectorAll(".btn")].find((button) => !button.classList.contains("primary"));
    const parse = (value) => (value.match(/\d+(\.\d+)?/g) || []).slice(0, 3).map(Number);
    const [textR, textG, textB] = parse(getComputedStyle(lede).color);
    const [primaryR, primaryG, primaryB] = parse(getComputedStyle(primary).backgroundColor);
    const [secondaryR, secondaryG, secondaryB] = parse(getComputedStyle(secondary).color);
    const luminance = (r, g, b) => 0.2126 * r + 0.7152 * g + 0.0722 * b;

    return {
      ledeLuminance: luminance(textR, textG, textB),
      primaryBackground: [primaryR, primaryG, primaryB],
      secondaryTextLuminance: luminance(secondaryR, secondaryG, secondaryB),
    };
  });

  expect(ctaPolish.ledeLuminance).toBeGreaterThan(220);
  expect(ctaPolish.primaryBackground[0]).toBeGreaterThan(230);
  expect(ctaPolish.primaryBackground[1]).toBeGreaterThan(230);
  expect(ctaPolish.primaryBackground[2]).toBeGreaterThan(230);
  expect(ctaPolish.secondaryTextLuminance).toBeGreaterThan(220);
});
