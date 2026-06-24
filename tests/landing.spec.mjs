import { expect, test } from "@playwright/test";

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

async function readPreviewBezelRgb(page) {
  return page.locator(".container-scroll-content").evaluate((element) => {
    const color = getComputedStyle(element).borderTopColor;
    const canvas = document.createElement("canvas");
    canvas.width = 1;
    canvas.height = 1;
    const context = canvas.getContext("2d");
    if (!context) return [0, 0, 0];
    context.fillStyle = color;
    context.fillRect(0, 0, 1, 1);
    return Array.from(context.getImageData(0, 0, 1, 1).data.slice(0, 3));
  });
}

test.describe("Landing — system theme", () => {
  test("keeps the light palette when the system prefers light", async ({ page }) => {
    await page.emulateMedia({ colorScheme: "light" });
    await page.goto("/");

    const theme = await readRootTheme(page);
    const bezel = await readPreviewBezelRgb(page);
    expect(theme.metaColorScheme).toBe("light dark");
    expect(oklchLightness(theme.background)).toBeGreaterThan(0.9);
    expect(oklchLightness(theme.foreground)).toBeLessThan(0.3);
    expect(Math.min(...bezel)).toBeGreaterThan(210);
  });

  test("switches to a near-black palette when the system prefers dark", async ({ page }) => {
    await page.emulateMedia({ colorScheme: "dark" });
    await page.goto("/");

    const theme = await readRootTheme(page);
    const bezel = await readPreviewBezelRgb(page);
    const backgroundLightness = oklchLightness(theme.background);
    const surfaceLightness = oklchLightness(theme.surface);
    const foregroundLightness = oklchLightness(theme.foreground);

    expect(theme.metaColorScheme).toBe("light dark");
    expect(backgroundLightness).toBeLessThan(0.12);
    expect(surfaceLightness).toBeGreaterThan(backgroundLightness);
    expect(foregroundLightness).toBeGreaterThan(0.84);
    expect(theme.bodyBackground).not.toBe("rgb(255, 255, 255)");
    expect(Math.max(...bezel)).toBeLessThan(90);
  });
});

test.describe("Landing — Nav", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("renders the macOS-style header, primary links, and gated download state", async ({ page }) => {
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

    await expect(nav.locator('a[aria-label="GitHub"]')).toHaveCount(0);
    await expect(nav.getByTestId("release-pending")).toContainText("Release pending");
    await expect(nav.getByTestId("download-unavailable")).toHaveCount(0);
    if ((viewport?.width ?? 0) > 1040) {
      await expect(nav.getByRole("link", { name: /View benchmarks/i })).toBeVisible();
    }
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

  test("renders the live Keystone app inside the container scroll preview", async ({ page }) => {
    const preview = page.getByTestId("app-preview");
    await expect(preview).toBeVisible();
    const win = preview.getByTestId("keystone-window");
    await expect(win).toBeVisible();
    await expect(win.getByTestId("traffic-lights").locator("span")).toHaveCount(3);
    await expect(win.getByRole("heading", { level: 1, name: "Dashboard" })).toBeVisible();
    await expect(win.getByRole("heading", { name: "Activity", exact: true })).toBeVisible();
    await expect(win.getByRole("heading", { name: "Algorithm mix" })).toBeVisible();
    await expect(win.getByRole("heading", { name: "Recent activity" })).toBeVisible();
    await expect(win.getByRole("button", { name: /Run Benchmark/i }).first()).toBeVisible();
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
    await expect(band.getByTestId("evidence-trace")).toBeVisible();
    for (const stage of ["01 · Measure", "02 · Cover", "03 · Verify"]) {
      await expect(band.getByText(stage, { exact: true })).toBeVisible();
    }
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

  test("turns the proof points into a synchronized local terminal transcript", async ({ page }) => {
    const section = page.locator("#local");
    await expect(section.getByRole("heading", { name: "Not a cloud dashboard pretending to be cryptography." })).toBeVisible();
    await expect(section.getByTestId("sticky-proof")).toBeVisible();
    await expect(section.locator("[data-testid=proof-card]")).toHaveCount(3);

    for (const title of ["Local execution", "Parameter evidence", "Exportable reports"]) {
      await expect(section.getByRole("heading", { name: title })).toBeVisible();
    }
    const terminal = section.getByTestId("evidence-terminal");
    await expect(terminal).toBeVisible();

    // The terminal starts with the local benchmark command and reads as still running.
    await expect(terminal).toHaveAttribute("data-step", "0");
    await expect(terminal.getByTestId("evidence-terminal-counter")).toHaveText("01 / 03");
    await expect(terminal).toContainText("keystone bench --scheme ML-KEM-768 --iterations 10000");
    await expect(terminal).toContainText("Local process");
    await expect(terminal).toContainText("None");
    await expect(terminal).toContainText("Run executing");
    await expect(terminal).not.toContainText("keystone report export --format json --seal");

    // Scrolling the copy advances the transcript until the record is sealed.
    await section.getByRole("link", { name: /Read the docs/i }).scrollIntoViewIfNeeded();
    await expect(terminal).toHaveAttribute("data-sealed", "true");
    await expect(terminal.getByTestId("evidence-terminal-counter")).toHaveText("03 / 03");
    await expect(terminal).toContainText("keystone report export --format json --seal");
    await expect(terminal).toContainText("Export ready");
    await expect(terminal).toContainText("Integrity verified");
    await expect(terminal).toContainText("7F3A · 91C2 · B84E");
    await expect(section.getByRole("link", { name: /Read the docs/i })).toHaveAttribute("href", /^\/docs\/?$/);
  });
});

test.describe("Landing — Download", () => {
  test("release routes fail closed while the manifest is disabled", async ({
    request,
  }) => {
    const manifest = await request.get("/releases/latest.json");
    expect(manifest.status()).toBe(404);
    await expect(manifest.json()).resolves.toEqual({ available: false });

    const download = await request.get("/download", { maxRedirects: 0 });
    expect(download.status()).toBe(404);
    await expect(download.json()).resolves.toEqual({
      available: false,
      message: "The verified macOS beta is not available yet.",
    });
  });

  test("closes with a gated macOS download anchored by the glyph", async ({ page }) => {
    await page.goto("/");
    const section = page.locator("#download");
    await expect(section.getByRole("heading", { name: "Keystone for macOS." })).toBeVisible();
    await expect(section.getByTestId("download-unavailable")).toBeVisible();
    await expect(section.getByRole("link", { name: /View evidence/i })).toHaveAttribute("href", /^\/reports\/?$/);
    await expect(section.locator('a[href="/download"]')).toHaveCount(0);
    await expect(section.getByRole("link", { name: /View on GitHub/i })).toHaveCount(0);
  });
});

test.describe("Landing — Footer", () => {
  test("renders real links and the current visual-pass note", async ({ page }) => {
    await page.goto("/");
    const footer = page.getByRole("contentinfo");
    await expect(footer).toBeVisible();

    for (const heading of ["Product", "Resources", "Project", "Status"]) {
      await expect(footer.getByText(heading, { exact: true })).toBeVisible();
    }

    await expect(footer.locator("input, textarea")).toHaveCount(0);
    await expect(footer.getByRole("link", { name: /Terms of Use/i })).toHaveAttribute("href", /^\/terms\/?$/);
    await expect(footer.getByRole("link", { name: /Privacy Policy/i })).toHaveAttribute("href", /^\/privacy\/?$/);
    await expect(footer.getByText(/release verification in progress/i)).toBeVisible();
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
      const panelBounds = await page.getByTestId("app-preview").evaluate((panel) => {
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
    await expect(menu.getByRole("link", { name: "Docs", exact: true })).toHaveAttribute("href", /^\/docs\/?$/);
    await expect(menu.getByTestId("release-pending")).toBeVisible();
    await expect(menu.getByTestId("download-unavailable")).toHaveCount(0);

    await page.keyboard.press("Escape");
    await expect(menu).toBeHidden();
  });
});

test("does not expose private source or a false download", async ({ page }) => {
  await page.goto("/");
  await expect(
    page.locator('a[href*="github.com/Brandon1138/keystone"]'),
  ).toHaveCount(0);
  await expect(page.locator('a[href*="/archive/refs/"]')).toHaveCount(0);
  await expect(page.getByRole("link", { name: /View on GitHub/i })).toHaveCount(0);
  await expect(page.getByTestId("release-pending").first()).toBeVisible();
  await expect(page.getByText("Download unavailable").first()).toBeVisible();
  await expect(page.locator('a[href="/download"]')).toHaveCount(0);
});
