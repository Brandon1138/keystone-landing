import { expect, test } from "@playwright/test";

const githubUrl = "https://github.com/Brandon1138/keystone";

function oklchLightness(value) {
  const match = value.match(/oklch\(\s*([0-9.]+)/i);
  return match ? Number(match[1]) : Number.NaN;
}

async function readRootTheme(page) {
  return page.evaluate(() => {
    const rootStyles = getComputedStyle(document.documentElement);
    const bodyStyles = getComputedStyle(document.body);

    return {
      metaColorScheme: document.querySelector('meta[name="color-scheme"]')?.getAttribute("content") ?? "",
      background: rootStyles.getPropertyValue("--color-background").trim(),
      surface: rootStyles.getPropertyValue("--color-surface").trim(),
      foreground: rootStyles.getPropertyValue("--color-foreground").trim(),
      bodyBackground: bodyStyles.backgroundColor,
      bodyColor: bodyStyles.color,
    };
  });
}

test.describe("Landing — system theme", () => {
  test("keeps the light palette when the system prefers light", async ({ page }) => {
    await page.emulateMedia({ colorScheme: "light" });
    await page.goto("/");

    const theme = await readRootTheme(page);
    expect(theme.metaColorScheme).toBe("light dark");
    expect(oklchLightness(theme.background)).toBeGreaterThan(0.9);
    expect(oklchLightness(theme.foreground)).toBeLessThan(0.3);
  });

  test("switches to a near-black palette when the system prefers dark", async ({ page }) => {
    await page.emulateMedia({ colorScheme: "dark" });
    await page.goto("/");

    const theme = await readRootTheme(page);
    const backgroundLightness = oklchLightness(theme.background);
    const surfaceLightness = oklchLightness(theme.surface);
    const foregroundLightness = oklchLightness(theme.foreground);

    expect(theme.metaColorScheme).toBe("light dark");
    expect(backgroundLightness).toBeLessThan(0.12);
    expect(surfaceLightness).toBeGreaterThan(backgroundLightness);
    expect(foregroundLightness).toBeGreaterThan(0.84);
    expect(theme.bodyBackground).not.toBe("rgb(255, 255, 255)");
  });
});

test.describe("Landing — Nav", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("renders the macOS-style header, primary links, GitHub, and download action", async ({ page }) => {
    const nav = page.getByRole("banner");
    await expect(nav).toBeVisible();
    await expect(nav.getByRole("link", { name: "Keystone home" })).toBeVisible();

    const primaryNav = nav.getByRole("navigation", { name: "Primary" });
    const viewport = page.viewportSize();
    if ((viewport?.width ?? 0) > 1040) {
      for (const label of ["Benchmarks", "Docs", "Releases"]) {
        await expect(primaryNav.getByRole("link", { name: label })).toBeVisible();
      }
      await expect(primaryNav.getByRole("link", { name: "Overview" })).toHaveCount(0);
      await expect(primaryNav.getByRole("link", { name: "About" })).toHaveCount(0);
    } else {
      await expect(primaryNav).toBeHidden();
    }

    await expect(nav.locator('a[aria-label="GitHub"]')).toHaveAttribute("href", githubUrl);
    await expect(nav.locator(".download-link")).toHaveAttribute("href", /^(#download|https:\/\/github\.com\/.*)$/);
  });
});

test.describe("Landing — Hero", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("leads with a visible headline above the centered app preview", async ({ page }) => {
    const heading = page.getByRole("heading", { level: 1, name: /Post-quantum benchmarking/i });
    await expect(heading).toBeVisible();
    await expect(page.locator(".hero-background")).toHaveCount(0);
    await expect(page.locator(".hero-contour-field canvas.keystone-contour-field__canvas")).toHaveCount(1);
    await expect.poll(async () => {
      return page.locator(".hero-contour-field canvas").evaluate((canvas) => {
        if (!(canvas instanceof HTMLCanvasElement)) return 0;
        const ctx = canvas.getContext("2d");
        if (!ctx || canvas.width === 0 || canvas.height === 0) return 0;

        const sampleWidth = Math.min(canvas.width, 360);
        const sampleHeight = Math.min(canvas.height, 240);
        const data = ctx.getImageData(0, 0, sampleWidth, sampleHeight).data;
        let alphaPixels = 0;
        for (let i = 3; i < data.length; i += 4) {
          if (data[i] !== 0) alphaPixels++;
        }
        return alphaPixels;
      });
    }).toBeGreaterThan(0);

    const heroPanel = page.locator("[data-contour-anchor='hero-panel']");
    await expect(heroPanel).toBeVisible();
    const panelBounds = await heroPanel.evaluate((panel) => {
      const rect = panel.getBoundingClientRect();
      const viewportWidth = document.documentElement.clientWidth;
      const centerDelta = Math.abs(rect.left + rect.width / 2 - viewportWidth / 2);
      return { centerDelta, viewportWidth };
    });
    expect(panelBounds.centerDelta).toBeLessThan(panelBounds.viewportWidth * 0.08);

    const bandTop = await page.locator("#benchmarks").evaluate((section) => section.getBoundingClientRect().top);
    const viewportHeight = await page.evaluate(() => window.innerHeight);
    expect(bandTop).toBeGreaterThanOrEqual(viewportHeight - 1);
  });

  test("renders the layered Keystone app preview with the dashboard", async ({ page }) => {
    const win = page.getByTestId("keystone-window");
    await expect(win).toBeVisible();
    await expect(win.getByTestId("traffic-lights").locator("span")).toHaveCount(3);
    await expect(win.getByRole("heading", { name: "Dashboard" })).toBeVisible();
    await expect(win.getByText("Recent runs")).toBeVisible();
    await expect(win.getByText("Evidence status")).toBeVisible();
    await expect(win.getByRole("button", { name: /Run Benchmark/i })).toBeVisible();
    await expect(win.getByText("Ready").first()).toBeVisible();
    await expect(win.getByText("completed").first()).toBeVisible();
    await expect(win.getByText("failed").first()).toBeVisible();
  });
});

test.describe("Landing — Evidence band", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("renders the benchmark readout with real figures and relative bars", async ({ page }) => {
    const band = page.locator("#benchmarks");
    await expect(band.getByRole("heading", { name: "Measured, not promised." })).toBeVisible();

    const table = band.getByTestId("bench-table");
    for (const name of ["ML-KEM", "ML-DSA", "Falcon", "SPHINCS+"]) {
      await expect(table.getByText(name, { exact: true })).toBeVisible();
    }
    await expect(table.getByText("0.0060")).toBeVisible();
    await expect(table.getByText("0.5033")).toBeVisible();
    await expect(table.getByText("1.0×")).toBeVisible();
    await expect(table.locator(".bench-bar i")).toHaveCount(4);
  });

  test("carries the coverage and package-gate ledgers", async ({ page }) => {
    const band = page.locator("#benchmarks");
    await expect(band.getByRole("heading", { name: "Coverage" })).toBeVisible();
    await expect(band.getByText("RSA · ECDSA · AES")).toBeVisible();

    await expect(band.getByRole("heading", { name: "Package gates" })).toBeVisible();
    for (const gate of ["verify-native", "build-addon", "verify-crypto-addons", "build-benchmarks", "package-mac-prod"]) {
      await expect(band.getByText(gate)).toBeVisible();
    }
  });
});

test.describe("Landing — Local by design", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("states the proof points as sentences beside the product evidence panel", async ({ page }) => {
    const section = page.locator("#local");
    await expect(section.getByRole("heading", { name: "Not a cloud dashboard pretending to be cryptography." })).toBeVisible();
    await expect(section.locator("[data-testid=proof-card]")).toHaveCount(3);

    for (const title of ["Local execution", "Parameter evidence", "Exportable reports"]) {
      await expect(section.getByRole("heading", { name: title })).toBeVisible();
    }
    await expect(section.locator(".detail-frame").getByText("Evidence status", { exact: true })).toBeVisible();
    await expect(section.locator(".detail-frame figcaption")).toBeVisible();
    await expect(section.getByRole("link", { name: /Read the docs/i })).toHaveAttribute("href", /^\/docs\/?$/);
  });
});

test.describe("Landing — Download", () => {
  test("closes with a single macOS download anchored by the glyph", async ({ page }) => {
    await page.goto("/");
    const section = page.locator("#download");
    await expect(section.getByRole("heading", { name: "Keystone for macOS." })).toBeVisible();
    await expect(section.getByTestId("download-macos")).toHaveAttribute("href", githubUrl);
    await expect(section.getByRole("link", { name: /View on GitHub/i })).toHaveAttribute("href", githubUrl);
    await expect(section.getByText(/Windows and Linux follow/i)).toBeVisible();
    await expect(section.locator("button:disabled")).toHaveCount(0);
  });
});

test.describe("Landing — Footer", () => {
  test("renders real links and the current visual-pass note", async ({ page }) => {
    await page.goto("/");
    const footer = page.getByRole("contentinfo");
    await expect(footer).toBeVisible();

    for (const heading of ["Product", "Resources", "Source", "Status"]) {
      await expect(footer.getByText(heading, { exact: true })).toBeVisible();
    }

    await expect(footer.locator("input, textarea")).toHaveCount(0);
    await expect(footer.getByRole("link", { name: "GitHub" })).toHaveAttribute("href", githubUrl);
    await expect(footer.getByRole("link", { name: /Terms of Use/i })).toHaveAttribute("href", /^\/terms\/?$/);
    await expect(footer.getByRole("link", { name: /Privacy Policy/i })).toHaveAttribute("href", /^\/privacy\/?$/);
    await expect(footer.getByText(/macOS available/i)).toBeVisible();
  });

  test("theme toggle overrides system appearance from the footer", async ({ page }) => {
    await page.emulateMedia({ colorScheme: "light" });
    await page.goto("/");

    const toggle = page.getByRole("radiogroup", { name: "Theme appearance" });
    await expect(toggle).toBeVisible();

    await toggle.getByRole("radio", { name: "Dark theme" }).click();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");

    let theme = await readRootTheme(page);
    expect(oklchLightness(theme.background)).toBeLessThan(0.12);

    await toggle.getByRole("radio", { name: "Light theme" }).click();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "light");

    theme = await readRootTheme(page);
    expect(oklchLightness(theme.background)).toBeGreaterThan(0.9);

    await toggle.getByRole("radio", { name: "System theme" }).click();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "system");
  });
});

test.describe("Landing — responsive", () => {
  for (const viewport of [
    { name: "mobile", width: 390, height: 900 },
    { name: "tablet", width: 768, height: 1000 },
    { name: "desktop", width: 1440, height: 1000 },
  ]) {
    test(`no document horizontal overflow on ${viewport.name}`, async ({ page }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto("/");
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      expect(overflow).toBeLessThanOrEqual(1);
      const panelBounds = await page.getByTestId("keystone-window").evaluate((panel) => {
        const rect = panel.getBoundingClientRect();
        const viewportWidth = document.documentElement.clientWidth;
        const centerDelta = Math.abs(rect.left + rect.width / 2 - viewportWidth / 2);
        return {
          centerDelta,
          viewportWidth,
        };
      });
      expect(panelBounds.centerDelta).toBeLessThan(panelBounds.viewportWidth * 0.08);
    });
  }
});

test.describe("Landing — Mobile nav", () => {
  test("exposes section links through an accessible toggle on narrow viewports", async ({ page }) => {
    await page.goto("/");
    const toggle = page.getByRole("button", { name: /open menu/i });
    const wide = (page.viewportSize()?.width ?? 0) > 1040;

    if (wide) {
      await expect(toggle).toBeHidden();
      return;
    }

    await expect(toggle).toBeVisible();
    await expect(toggle).toHaveAttribute("aria-expanded", "false");
    await toggle.click();

    const menu = page.getByRole("navigation", { name: "Mobile" });
    await expect(menu).toBeVisible();
    await expect(menu.getByRole("link", { name: "Benchmarks" })).toHaveAttribute("href", "#benchmarks");
    await expect(menu.getByRole("link", { name: "Docs" })).toHaveAttribute("href", /^\/docs\/?$/);

    await page.keyboard.press("Escape");
    await expect(menu).toBeHidden();
  });
});
