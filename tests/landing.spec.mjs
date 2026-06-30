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
    await expect(page.getByTestId("keystone-window")).toHaveAttribute("data-ks-theme", "light");
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
    await expect(page.getByTestId("keystone-window")).toHaveAttribute("data-ks-theme", "dark");
  });
});

test.describe("Landing — Nav", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("renders the macOS-style header, primary links, and verified download", async ({ page }) => {
    const nav = page.getByRole("banner");
    await expect(nav).toBeVisible();
    await expect(nav.getByRole("link", { name: "Keystone home" })).toBeVisible();

    const primaryNav = nav.getByRole("navigation", { name: "Primary" });
    const viewport = page.viewportSize();
    if ((viewport?.width ?? 0) > 1040) {
      for (const label of ["Benchmarks", "Quantum", "Releases"]) {
        await expect(primaryNav.getByRole("link", { name: label })).toBeVisible();
      }
      await expect(primaryNav.getByRole("link", { name: "Overview" })).toHaveCount(0);
      await expect(primaryNav.getByRole("link", { name: "About" })).toHaveCount(0);
    } else {
      await expect(primaryNav).toBeHidden();
    }

    await expect(nav.locator('a[aria-label="GitHub"]')).toHaveCount(0);
    await expect(nav.getByTestId("release-pending")).toHaveCount(0);
    await expect(nav.getByTestId("download-unavailable")).toHaveCount(0);
    if ((viewport?.width ?? 0) > 1040) {
      await expect(nav.getByText("1.0.0")).toBeVisible();
      await expect(nav.getByRole("link", { name: /Download/i })).toHaveAttribute("href", "/download");
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

test.describe("Landing — Quantum", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("presents the measured Shor run and an interactive scaling predictor", async ({ page }) => {
    const section = page.locator("#quantum");
    await expect(section.getByRole("heading", { name: "We ran the attack." })).toBeVisible();

    // Beat 1: the measured run on real IBM hardware.
    const run = section.getByLabel("Measured Shor run on IBM hardware");
    await expect(run).toContainText("ibm_brisbane");
    await expect(run).toContainText("3 × 5");
    await expect(run).toContainText("34.53");
    await expect(run).toContainText("234.7");

    // Beat 2: the interactive resource scaling predictor.
    const rail = section.getByRole("radiogroup", { name: "Cryptographic target" });
    await expect(rail.getByRole("radio")).toHaveCount(4);

    // RSA-2048 is the default selection.
    const rsa = rail.getByRole("radio", { name: /RSA-2048/ });
    await expect(rsa).toHaveAttribute("aria-checked", "true");
    const readout = section.locator(".scale-readout");
    await expect(readout).toContainText("6,157");
    await expect(readout).toContainText("Shor's algorithm");
    await expect(readout).toContainText("At risk");

    // Selecting AES-256 switches the attack to Grover and the verdict to holding.
    await rail.getByRole("radio", { name: /AES-256/ }).click();
    await expect(readout).toContainText("Grover's search");
    await expect(readout).toContainText("Holds");
    await expect(readout).toContainText("6,681");
  });
});

test.describe("Landing — Download", () => {
  test("release routes expose the verified manifest and canonical artifact", async ({
    request,
  }) => {
    const manifest = await request.get("/releases/latest.json");
    expect(manifest.status()).toBe(200);
    await expect(manifest.json()).resolves.toMatchObject({
      version: "1.0.0",
      filename: "Keystone-1.0.0-macOS.dmg",
      sha256:
        "a79db8d97bbcfcb117f53d65e5df2e3aa4aae3b69123204e578a5cf8a37d8bf8",
      signed: true,
      notarized: true,
      minimumMacOS: "13.5",
      verifiedMacOS: "27",
    });

    const download = await request.get("/download", { maxRedirects: 0 });
    expect(download.status()).toBe(404);
    await expect(download.json()).resolves.toMatchObject({
      available: false,
      message: "The artifact origin is not configured for this environment.",
    });
  });

  test("closes with the verified macOS download beside the signed release record", async ({ page }) => {
    await page.goto("/");
    const section = page.locator("#download");
    await expect(section.getByRole("heading", { name: "Keystone for macOS." })).toBeVisible();
    await expect(section.getByTestId("download-macos")).toHaveAttribute(
      "href",
      "/download",
    );
    await expect(section.locator('a[href="/download"]')).toHaveCount(1);

    // The proof is inline, not behind a second call to action.
    await expect(section.getByRole("link", { name: /View evidence/i })).toHaveCount(0);
    const record = section.getByRole("figure", { name: /release record/i });
    await expect(record).toBeVisible();
    await expect(record.getByText("Keystone-1.0.0-macOS.dmg")).toBeVisible();
    await expect(record.getByText("Verified macOS")).toBeVisible();
    await expect(record.getByText("macOS 27")).toBeVisible();
    await expect(record.getByText(/^a79db8d97bbcfcb11/)).toBeVisible();
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
    await expect(footer.getByRole("link", { name: /Case study/i })).toHaveCount(0);
    await expect(footer.getByRole("link", { name: /Terms of Use/i })).toHaveAttribute("href", /^\/terms\/?$/);
    await expect(footer.getByRole("link", { name: /Privacy Policy/i })).toHaveAttribute("href", /^\/privacy\/?$/);
    await expect(
      footer.getByText("Signed macOS 1.0.0."),
    ).toBeVisible();
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
    await expect(menu.getByTestId("release-pending")).toHaveCount(0);
    await expect(menu.getByRole("link", { name: /Download Keystone 1.0.0 for macOS/i })).toHaveAttribute("href", "/download");
    await expect(menu.getByTestId("download-unavailable")).toHaveCount(0);

    await page.keyboard.press("Escape");
    await expect(menu).toBeHidden();
  });
});

test("does not expose private source and links the verified download", async ({ page }) => {
  await page.goto("/");
  await expect(
    page.locator('a[href*="github.com/Brandon1138/keystone"]'),
  ).toHaveCount(0);
  await expect(page.locator('a[href*="/archive/refs/"]')).toHaveCount(0);
  await expect(page.getByRole("link", { name: /View on GitHub/i })).toHaveCount(0);
  await expect(page.getByTestId("release-pending")).toHaveCount(0);
  await expect(page.getByText("Download unavailable")).toHaveCount(0);
  await expect(page.locator('a[href="/download"]').first()).toBeVisible();
});
