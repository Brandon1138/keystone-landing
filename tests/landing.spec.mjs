import { expect, test } from "@playwright/test";

const githubUrl = "https://github.com/Brandon1138/keystone";

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
      for (const label of ["Overview", "Benchmarks", "Visualize", "Workloads", "Evidence", "About"]) {
        await expect(primaryNav.getByRole("link", { name: label })).toBeVisible();
      }
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

  test("renders the Mac-first positioning and actions", async ({ page }) => {
    const h1 = page.getByRole("heading", { level: 1 });
    await expect(h1).toContainText("Post-quantum benchmarking");
    await expect(h1).toContainText("built for Mac");
    await expect(page.getByText("Built for Mac", { exact: true })).toBeVisible();

    await expect(page.getByRole("link", { name: /^Download$/i }).first()).toHaveAttribute("href", /^(#download|https:\/\/github\.com\/.*)$/);
    await expect(page.getByRole("link", { name: /View evidence/i })).toHaveAttribute("href", /^\/reports\/?$/);

    for (const label of ["macOS first", "Local benchmark runs", "Windows and Linux planned"]) {
      await expect(page.getByText(label, { exact: true })).toBeVisible();
    }
  });

  test("renders the layered Keystone app preview with benchmark controls", async ({ page }) => {
    const win = page.getByTestId("keystone-window");
    await expect(win).toBeVisible();
    await expect(win.getByRole("button", { name: /Run Benchmark/i })).toBeVisible();
    await expect(win.getByTestId("traffic-lights").locator("span")).toHaveCount(3);
    await expect(win.getByText("Ready").first()).toBeVisible();
    await expect(win.getByText("Complete").first()).toBeVisible();
    await expect(win.getByText("Average Time (ms)")).toBeVisible();
  });
});

test.describe("Landing — Algorithm strip", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("carries algorithm and specification evidence below the hero", async ({ page }) => {
    const strip = page.locator("#algorithms");
    await expect(strip.getByText("Algorithm coverage")).toBeVisible();
    await expect(strip.locator("[data-testid=algorithm-chip]")).toHaveCount(5);

    for (const label of ["ML-KEM", "ML-DSA", "Falcon", "SPHINCS+", "Classical"]) {
      await expect(strip.getByRole("heading", { name: label })).toBeVisible();
    }
  });
});

test.describe("Landing — Evidence Sections", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("renders proof points from the product workflow", async ({ page }) => {
    const section = page.locator("#benchmarks");
    await expect(section.locator("[data-testid=proof-card]")).toHaveCount(3);

    for (const title of ["Local execution", "Parameter evidence", "Exportable reports"]) {
      await expect(section.getByRole("heading", { name: title })).toBeVisible();
    }
  });

  test("keeps visualization and workflow language analytical", async ({ page }) => {
    const section = page.locator("#visualize");
    await expect(section.getByRole("heading", { name: "Not a cloud dashboard pretending to be cryptography." })).toBeVisible();

    for (const title of [
      "Benchmarks resolve into evidence.",
      "Visualization remains analytical.",
      "Quantum workload setup is explicit.",
    ]) {
      await expect(section.getByRole("heading", { name: title })).toBeVisible();
    }
  });

  test("renders the dark specification table and release-gate disclosure", async ({ page }) => {
    const section = page.locator("#evidence");
    await expect(section.getByText("Average time, lower is better")).toBeVisible();
    await expect(section.getByText("ML-KEM (Kyber)")).toBeVisible();
    await expect(section.getByText("Keep release claims honest until every platform is packaged.")).toBeVisible();

    for (const gate of ["verify-native", "build-addon", "verify-crypto-addons", "build-benchmarks", "package-mac-prod"]) {
      await expect(section.getByText(gate)).toBeVisible();
    }
  });
});

test.describe("Landing — Download", () => {
  test("renders macOS as available and Windows/Linux as pending", async ({ page }) => {
    await page.goto("/");
    const section = page.locator("#workloads");
    await expect(section.locator("[data-testid=download-card]")).toHaveCount(3);

    await expect(section.getByRole("link", { name: /Download for macOS/i })).toHaveAttribute("href", githubUrl);
    await expect(section.getByRole("button", { name: /Windows package later/i })).toBeDisabled();
    await expect(section.getByRole("button", { name: /Linux package later/i })).toBeDisabled();
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
    await expect(footer.getByText(/macOS build ships today/i)).toBeVisible();
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
    await expect(menu.getByRole("link", { name: /^Download$/i })).toHaveAttribute("href", /^(#download|https:\/\/github\.com\/.*)$/);

    await page.keyboard.press("Escape");
    await expect(menu).toBeHidden();
  });
});
