# Keystone Landing — Next.js Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the Keystone landing page on Next.js 15 + TypeScript + Tailwind v4 + Shadcn with a redesigned dark product-showcase visual matching `docs/superpowers/specs/2026-05-26-nextjs-landing-redesign-design.md`. Sub-pages remain unchanged via rewrites.

**Architecture:** Next.js App Router at repo root. Sub-pages migrate into `public/` and continue serving at their current URLs via `next.config.ts` rewrites. Landing is composed from server components in `components/landing/`. Hero centerpiece is a live HTML/CSS/SVG desktop-app mockup. Dark theme only; CSS-only motion.

**Tech Stack:** Next.js 15, React 19, TypeScript (strict), Tailwind CSS v4, Shadcn UI (selective: Button, Card), IBM Plex Sans/Mono via `next/font`, `lucide-react`, Playwright.

---

## Task 1: Initialize Next.js Project Base

**Files:**
- Modify: `package.json`
- Create: `tsconfig.json`
- Create: `next.config.ts`
- Create: `next-env.d.ts`
- Create: `app/layout.tsx`
- Create: `app/page.tsx`
- Create: `app/globals.css`
- Modify: `.gitignore`

- [ ] **Step 1: Replace `package.json`**

```json
{
  "name": "keystone-landing",
  "version": "2.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "typecheck": "tsc --noEmit",
    "test": "playwright test"
  },
  "dependencies": {
    "next": "15.0.3",
    "react": "19.0.0",
    "react-dom": "19.0.0"
  },
  "devDependencies": {
    "@playwright/test": "^1.49.0",
    "@types/node": "^22.10.0",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "eslint": "^9.16.0",
    "eslint-config-next": "15.0.3",
    "typescript": "^5.7.2"
  }
}
```

- [ ] **Step 2: Create `tsconfig.json`**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": false,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules", "tests", "uploads", "tmp-folder"]
}
```

- [ ] **Step 3: Create `next.config.ts` (rewrites added in Task 5)**

```ts
import type { NextConfig } from "next";

const config: NextConfig = {
  reactStrictMode: true,
};

export default config;
```

- [ ] **Step 4: Create `next-env.d.ts`**

```ts
/// <reference types="next" />
/// <reference types="next/image-types/global" />

// NOTE: This file should not be edited
// see https://nextjs.org/docs/basic-features/typescript for more information.
```

- [ ] **Step 5: Create `app/globals.css` (tokens added in Task 2)**

```css
@import "tailwindcss";

html, body { margin: 0; padding: 0; }
body { -webkit-font-smoothing: antialiased; text-rendering: optimizeLegibility; }
```

- [ ] **Step 6: Create `app/layout.tsx` (placeholder; fonts wired in Task 2)**

```tsx
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Keystone — Post-Quantum Benchmarking, Made Observable",
  description:
    "Keystone is a desktop workbench for benchmarking classical and post-quantum cryptography.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body>{children}</body>
    </html>
  );
}
```

- [ ] **Step 7: Create `app/page.tsx` (placeholder)**

```tsx
export default function Page() {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <p>Keystone landing — under construction.</p>
    </main>
  );
}
```

- [ ] **Step 8: Add Next build artifacts to `.gitignore`**

Current `.gitignore`:
```
node_modules/
.vite/
dist/
.superpowers/
```

Replace with:
```
node_modules/
.vite/
dist/
.superpowers/
.next/
out/
*.tsbuildinfo
.env*.local
```

- [ ] **Step 9: Install dependencies**

Run: `npm install`
Expected: Installs Next 15, React 19, Playwright; creates `package-lock.json`.

- [ ] **Step 10: Verify dev server boots**

Run: `npm run dev` in one terminal; in another terminal, run `curl -s http://localhost:3000 | head -c 200`.
Expected: HTML output containing `"Keystone landing — under construction."`. Stop the dev server.

- [ ] **Step 11: Commit**

```bash
git add package.json package-lock.json tsconfig.json next.config.ts next-env.d.ts app/ .gitignore
git commit -m "feat(scaffold): initialize Next.js 15 + TypeScript project"
```

---

## Task 2: Tailwind v4 Setup + IBM Plex Fonts + Design Tokens

**Files:**
- Modify: `package.json`
- Create: `postcss.config.mjs`
- Modify: `app/globals.css`
- Modify: `app/layout.tsx`

- [ ] **Step 1: Add Tailwind v4 deps to `package.json`**

Add to `devDependencies`:
```json
    "tailwindcss": "^4.0.0",
    "@tailwindcss/postcss": "^4.0.0",
    "postcss": "^8.4.49"
```

Run: `npm install`
Expected: Installs Tailwind v4 + PostCSS plugin.

- [ ] **Step 2: Create `postcss.config.mjs`**

```js
export default {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};
```

- [ ] **Step 3: Replace `app/globals.css` with full design tokens**

```css
@import "tailwindcss";

@theme {
  /* Surface */
  --color-background: #0A0F1A;
  --color-surface: #0F1626;
  --color-surface-2: #141C2E;
  --color-surface-3: #1A2238;

  /* Border */
  --color-border: #1E293B;
  --color-border-strong: #2A3548;

  /* Foreground */
  --color-foreground: #E5E7EB;
  --color-foreground-muted: #94A3B8;
  --color-foreground-subtle: #64748B;

  /* Accent — primary teal */
  --color-primary: #14B8A6;
  --color-primary-light: #2DD4BF;
  --color-primary-glow: #0D9488;

  /* Accent — secondary violet */
  --color-secondary: #A78BFA;
  --color-secondary-light: #C4B5FD;

  /* Semantic */
  --color-success: #22C55E;
  --color-warning: #F59E0B;
  --color-danger: #EF4444;

  /* Type */
  --font-sans: var(--font-plex-sans), system-ui, -apple-system, sans-serif;
  --font-mono: var(--font-plex-mono), ui-monospace, SFMono-Regular, monospace;

  /* Spacing */
  --container-max: 1248px;
}

html, body { margin: 0; padding: 0; }
html { background: var(--color-background); color-scheme: dark; }
body {
  background: var(--color-background);
  color: var(--color-foreground);
  font-family: var(--font-sans);
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
}

* { box-sizing: border-box; }

/* Gradient text utility for hero accent word */
.text-gradient {
  background: linear-gradient(90deg, var(--color-primary), var(--color-primary-light));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

/* Hero load reveal stagger */
@keyframes rise {
  from { opacity: 0; transform: translateY(14px); }
  to   { opacity: 1; transform: translateY(0); }
}
.reveal > * { animation: rise 700ms cubic-bezier(0.16, 1, 0.3, 1) both; }
.reveal > *:nth-child(1) { animation-delay: 0.05s; }
.reveal > *:nth-child(2) { animation-delay: 0.18s; }
.reveal > *:nth-child(3) { animation-delay: 0.32s; }
.reveal > *:nth-child(4) { animation-delay: 0.46s; }
.reveal > *:nth-child(5) { animation-delay: 0.60s; }

/* Ambient hero glow */
@keyframes breathe {
  0%, 100% { opacity: 0.55; }
  50%      { opacity: 0.85; }
}
.glow-breathe { animation: breathe 8s ease-in-out infinite; }

/* Container helper */
.container-page {
  width: 100%;
  max-width: var(--container-max);
  margin-left: auto;
  margin-right: auto;
  padding-left: clamp(20px, 4vw, 48px);
  padding-right: clamp(20px, 4vw, 48px);
}

/* Respect reduced motion */
@media (prefers-reduced-motion: reduce) {
  .reveal > * { animation: none; }
  .glow-breathe { animation: none; }
}
```

- [ ] **Step 4: Wire fonts in `app/layout.tsx`**

```tsx
import type { Metadata } from "next";
import { IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const plexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  variable: "--font-plex-sans",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
  variable: "--font-plex-mono",
});

export const metadata: Metadata = {
  title: "Keystone — Post-Quantum Benchmarking, Made Observable",
  description:
    "Keystone is a desktop workbench for benchmarking classical and post-quantum cryptography. Visualize performance, explore runtime trade-offs, and ship cryptography with confidence.",
  metadataBase: new URL("https://keystone.example.com"),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`dark ${plexSans.variable} ${plexMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
```

- [ ] **Step 5: Update `app/page.tsx` to verify tokens render**

```tsx
export default function Page() {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <p className="font-sans text-foreground">
        Keystone landing — <span className="text-gradient font-mono">tokens wired.</span>
      </p>
    </main>
  );
}
```

- [ ] **Step 6: Verify the dev server picks up tokens**

Run: `npm run dev`, then visit `http://localhost:3000` in a browser (or `curl -s http://localhost:3000 | grep -E 'text-gradient|font-plex'`).
Expected: Dark page with Plex Sans body; "tokens wired." renders in teal gradient mono.
Stop dev server.

- [ ] **Step 7: Commit**

```bash
git add package.json package-lock.json postcss.config.mjs app/globals.css app/layout.tsx app/page.tsx
git commit -m "feat(theme): wire Tailwind v4 tokens and IBM Plex fonts"
```

---

## Task 3: Install Shadcn Primitives (Button + Card)

**Files:**
- Modify: `package.json`
- Create: `components.json`
- Create: `lib/utils.ts`
- Create: `components/ui/button.tsx`
- Create: `components/ui/card.tsx`

- [ ] **Step 1: Add Shadcn-adjacent deps to `package.json`**

Add to `dependencies`:
```json
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "tailwind-merge": "^2.5.5",
    "lucide-react": "^0.469.0",
    "@radix-ui/react-slot": "^1.1.1"
```

Run: `npm install`

- [ ] **Step 2: Create `components.json`**

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "default",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "",
    "css": "app/globals.css",
    "baseColor": "neutral",
    "cssVariables": true,
    "prefix": ""
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  },
  "iconLibrary": "lucide"
}
```

- [ ] **Step 3: Create `lib/utils.ts`**

```ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

- [ ] **Step 4: Create `components/ui/button.tsx`**

```tsx
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-background hover:bg-primary-light",
        outline:
          "border border-border-strong bg-transparent text-foreground hover:bg-surface-2",
        ghost:
          "text-foreground hover:bg-surface-2",
      },
      size: {
        sm: "h-9 px-3",
        md: "h-11 px-5",
        lg: "h-12 px-6 text-base",
      },
    },
    defaultVariants: { variant: "default", size: "md" },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    );
  },
);
Button.displayName = "Button";

export { buttonVariants };
```

- [ ] **Step 5: Create `components/ui/card.tsx`**

```tsx
import * as React from "react";
import { cn } from "@/lib/utils";

export const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("rounded-xl border border-border bg-surface p-6", className)}
      {...props}
    />
  ),
);
Card.displayName = "Card";

export const CardTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3 ref={ref} className={cn("text-lg font-semibold text-foreground", className)} {...props} />
  ),
);
CardTitle.displayName = "CardTitle";

export const CardBody = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("mt-2 text-sm text-foreground-muted leading-relaxed", className)} {...props} />
  ),
);
CardBody.displayName = "CardBody";
```

- [ ] **Step 6: Verify typecheck passes**

Run: `npm run typecheck`
Expected: PASS, no errors.

- [ ] **Step 7: Commit**

```bash
git add package.json package-lock.json components.json lib/ components/ui/
git commit -m "feat(ui): add Shadcn-style Button and Card primitives"
```

---

## Task 4: Set Up Playwright

**Files:**
- Create: `playwright.config.mjs`
- Modify: existing `playwright.config.mjs` will be replaced
- Modify: `package.json` (test script already exists from Task 1)

- [ ] **Step 1: Replace `playwright.config.mjs`**

The current file targets the old static server. Replace fully:

```js
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: "list",
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
  },
  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
  projects: [
    { name: "chromium-desktop", use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 } } },
  ],
});
```

- [ ] **Step 2: Install Playwright browsers (if not already)**

Run: `npx playwright install chromium`
Expected: Chromium installed.

- [ ] **Step 3: Smoke test — verify it can boot the app**

Create `tests/smoke.spec.mjs`:

```js
import { test, expect } from "@playwright/test";

test("home page responds and contains the title", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/Keystone/);
});
```

- [ ] **Step 4: Run the smoke test**

Run: `npx playwright test tests/smoke.spec.mjs`
Expected: PASS — `Keystone` is in `<title>` from layout metadata.

- [ ] **Step 5: Commit**

```bash
git add playwright.config.mjs tests/smoke.spec.mjs
git commit -m "test: configure Playwright against Next dev server"
```

---

## Task 5: Migrate Sub-Pages into `public/` and Add Rewrites

**Files:**
- Modify: `next.config.ts`
- Move: 12 sub-page directories + `static-page.css` + `design-mockups/` into `public/`

- [ ] **Step 1: Move sub-page directories into `public/`**

Run from repo root:

```bash
mkdir -p public
mv about benchmarks blog contact platform privacy releases reports schemes security terms public/
```

Verify: `ls public/` shows: `about benchmarks blog contact platform privacy public releases reports schemes security terms screenshots` (plus any pre-existing items).

- [ ] **Step 2: Move `docs/index.html` into `public/docs/`**

The existing `docs/` directory contains BOTH the served `docs/index.html` AND the internal `docs/superpowers/` (specs and plans). We only move the served file.

```bash
mkdir -p public/docs
mv docs/index.html public/docs/index.html
# If there are sibling assets the docs page references via relative paths, move them too:
# (None expected based on inspection. If `docs/` has other html/img/css after the move,
# investigate them before continuing.)
```

Verify: `ls docs/` now shows only `superpowers/` (no `index.html`).

- [ ] **Step 3: Move `static-page.css` and `design-mockups/`**

```bash
mv static-page.css public/static-page.css
mv design-mockups public/design-mockups
```

- [ ] **Step 4: Flatten the nested `public/public/` directory**

The pre-existing repo has `public/public/screenshots/` (a Vite-era quirk). Flatten:

```bash
if [ -d public/public ]; then mv public/public/* public/ 2>/dev/null; rmdir public/public; fi
```

- [ ] **Step 5: Replace `next.config.ts` with rewrites**

```ts
import type { NextConfig } from "next";

const SUB_PAGES = [
  "about",
  "benchmarks",
  "blog",
  "contact",
  "docs",
  "platform",
  "privacy",
  "releases",
  "reports",
  "schemes",
  "security",
  "terms",
] as const;

const config: NextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return SUB_PAGES.flatMap((slug) => [
      { source: `/${slug}`, destination: `/${slug}/index.html` },
      { source: `/${slug}/`, destination: `/${slug}/index.html` },
    ]);
  },
};

export default config;
```

- [ ] **Step 6: Sanity-check the rewrites by hand**

Run: `npm run dev` in one terminal; in another, run:

```bash
for slug in about benchmarks blog contact docs platform privacy releases reports schemes security terms; do
  status=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:3000/$slug")
  echo "$status /$slug"
done
```

Expected: All twelve return `200`. Stop the dev server.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat(routing): migrate static sub-pages into public/ with rewrites"
```

---

## Task 6: Verify Sub-Pages Still Serve Their Original Content

**Files:**
- Modify: `tests/footer-pages.spec.mjs` (only if currently broken by the move)

- [ ] **Step 1: Inspect the existing footer-pages test**

Run: `cat tests/footer-pages.spec.mjs | head -60`
Note the URLs it visits and assertions it makes. If the test hardcodes `http://localhost:5173` or `http://localhost:4173`, update it; otherwise it should work as-is since baseURL is set in `playwright.config.mjs`.

- [ ] **Step 2: Update baseURL references if needed**

If `tests/footer-pages.spec.mjs` references a hardcoded port other than `3000`, replace with relative paths so it uses `playwright.config.mjs`'s `baseURL`. Example:

Before:
```js
await page.goto("http://localhost:5173/about/");
```

After:
```js
await page.goto("/about/");
```

- [ ] **Step 3: Run the footer-pages test**

Run: `npx playwright test tests/footer-pages.spec.mjs`
Expected: PASS — all sub-page URLs respond with their original HTML.

- [ ] **Step 4: Commit (only if changes were made)**

```bash
git add tests/footer-pages.spec.mjs
git commit -m "test(footer-pages): point at Playwright baseURL after migration"
```

If no changes were needed, skip the commit step.

---

## Task 7: Remove Old Top-Level Static Code

**Files:**
- Delete: `index.html`
- Delete: `src/`
- Delete: `tweaks-panel.jsx`
- Delete: `vercel.json` (auto-detect Next)
- Delete: `tests/responsive.spec.mjs`

- [ ] **Step 1: Delete the old landing source**

```bash
rm -f index.html tweaks-panel.jsx
rm -rf src
```

- [ ] **Step 2: Delete `vercel.json`**

Vercel auto-detects Next.js and applies the correct preset. The existing file points at static output, which is wrong for Next.

```bash
rm -f vercel.json
```

- [ ] **Step 3: Delete the obsolete responsive test**

```bash
rm -f tests/responsive.spec.mjs
```

- [ ] **Step 4: Verify the smoke + footer-pages tests still pass**

Run: `npx playwright test`
Expected: PASS for `smoke.spec.mjs` and `footer-pages.spec.mjs`.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "chore: remove pre-Next static landing code and vercel.json"
```

---

## Task 8: Create `lib/mockData.ts`

**Files:**
- Create: `lib/mockData.ts`

- [ ] **Step 1: Create the file with all hand-tuned values used by the hero mockup**

```ts
export const TOP_METRICS = [
  { label: "Total Benchmarks", value: "1,248", delta: "+18%" },
  { label: "Avg. Operations / s", value: "2.34M", delta: "+27%" },
  { label: "Median Latency", value: "0.42 ms", delta: "-12%" },
  { label: "Success Rate", value: "99.8%", delta: "+0.3%" },
] as const;

export const OPS_BARS = [
  { label: "ML-KEM",    value: "3.21M", width: 86 },
  { label: "ML-DSA",    value: "2.14M", width: 62 },
  { label: "Falcon",    value: "1.28M", width: 38 },
  { label: "SPHINCS+",  value: "0.73M", width: 22 },
  { label: "RSA (3072)",value: "0.31M", width: 9 },
  { label: "ECC (P-256)",value: "1.95M", width: 56 },
  { label: "AES-GCM",   value: "6.72M", width: 100 },
];

export const LATENCY_GAUGE = {
  value: "0.42",
  unit: "ms",
  p50: "0.42 ms",
  p95: "1.37 ms",
  p99: "2.81 ms",
};

export const LATENCY_SERIES = [
  // four series of 12 points each, normalized 0-100
  { name: "ML-KEM",    color: "var(--color-primary)",         points: [60, 58, 62, 55, 50, 48, 52, 45, 48, 43, 41, 38] },
  { name: "ML-DSA",    color: "var(--color-primary-light)",   points: [72, 70, 68, 73, 65, 62, 60, 58, 55, 53, 50, 48] },
  { name: "Falcon",    color: "var(--color-secondary)",       points: [80, 78, 82, 76, 73, 70, 72, 68, 65, 62, 60, 58] },
  { name: "SPHINCS+",  color: "var(--color-secondary-light)", points: [88, 86, 90, 84, 82, 80, 82, 78, 75, 72, 70, 68] },
];

export const HISTOGRAM_BINS = [
  4, 7, 11, 18, 26, 35, 48, 62, 78, 88, 95, 100, 92, 78, 60, 44, 30, 20, 12, 7, 4,
];

export const SCHEME_TABLE = [
  { scheme: "ML-KEM (768)",   category: "PQC (KEM)",         level: "Lvl 1",   keyGen: "0.36", sign: "0.58", verify: "0.61", ops: "3.21M",  size: "1.2",  ok: true  },
  { scheme: "ML-DSA (87)",    category: "PQC (Signature)",   level: "Lvl 1",   keyGen: "0.41", sign: "0.93", verify: "0.71", ops: "2.14M",  size: "1.6",  ok: true  },
  { scheme: "Falcon (512)",   category: "PQC (Signature)",   level: "Lvl 1",   keyGen: "1.22", sign: "1.48", verify: "1.31", ops: "1.28M",  size: "0.9",  ok: true  },
  { scheme: "SPHINCS+ (SHA256)", category: "PQC (Signature)", level: "Lvl 1", keyGen: "8.77", sign: "8.28", verify: "9.11", ops: "0.73M",  size: "17.3", ok: true  },
  { scheme: "RSA (3072)",     category: "Classical (Sig.)",  level: "128-bit", keyGen: "2.14", sign: "4.73", verify: "0.26", ops: "0.38M",  size: "0.6",  ok: true  },
  { scheme: "ECC (P-256)",    category: "Classical (Sig.)",  level: "128-bit", keyGen: "0.19", sign: "0.51", verify: "0.18", ops: "1.95M",  size: "0.1",  ok: true  },
  { scheme: "AES-GCM (256)",  category: "Symmetric (AEAD)",  level: "256-bit", keyGen: "0.06", sign: "0.06", verify: "0.06", ops: "6.72M",  size: "—",    ok: true  },
];

export const COMPARISON = {
  legend: { pqc: "Post-Quantum", classical: "Classical" },
  metrics: [
    { label: "Security Level",  unit: "(Estimated security bits)", better: "Higher is better", pqc: { value: "128+", height: 88 }, classical: { value: "~128", height: 88 } },
    { label: "Throughput",      unit: "(Operations per second)",   better: "Higher is better", pqc: { value: "1.95M", height: 95 }, classical: { value: "1.11M", height: 56 } },
    { label: "Median Latency",  unit: "(Lower is better)",         better: "Lower is better",  pqc: { value: "0.72 ms", height: 78 }, classical: { value: "0.38 ms", height: 42 } },
    { label: "Artifact Size",   unit: "(Average size in KB)",      better: "Lower is better",  pqc: { value: "5.8 KB", height: 96 }, classical: { value: "0.9 KB", height: 18 } },
  ],
};
```

- [ ] **Step 2: Verify typecheck passes**

Run: `npm run typecheck`
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add lib/mockData.ts
git commit -m "feat(data): add mock data module for hero dashboard"
```

---

## Task 9: Build Nav Component

**Files:**
- Create: `components/landing/Nav.tsx`
- Modify: `app/page.tsx` (to mount Nav)
- Create: `tests/landing.spec.mjs`

- [ ] **Step 1: Write failing Playwright assertion**

Create `tests/landing.spec.mjs`:

```js
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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx playwright test tests/landing.spec.mjs`
Expected: FAIL — banner not present, no nav links.

- [ ] **Step 3: Create `components/landing/Nav.tsx`**

```tsx
import Link from "next/link";
import { Github, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

const PRIMARY_LINKS = [
  { label: "Features",   href: "#features" },
  { label: "Benchmarks", href: "#comparison" },
  { label: "Security",   href: "#trust" },
  { label: "Download",   href: "#download" },
  { label: "Docs",       href: "/docs/" },
];

export function Nav() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container-page flex h-16 items-center justify-between gap-8">
        <Link href="/" className="flex items-center gap-2" aria-label="Keystone home">
          <span aria-hidden className="block h-7 w-7 rounded-md bg-gradient-to-br from-primary to-primary-light" />
          <span className="text-lg font-semibold tracking-tight text-foreground">Keystone</span>
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-8 md:flex">
          {PRIMARY_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-sm font-medium text-foreground-muted transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="#"
            aria-label="GitHub"
            className="text-foreground-muted transition-colors hover:text-foreground"
          >
            <Github className="h-5 w-5" />
          </Link>
          <Button asChild variant="outline" size="sm">
            <Link href="#">
              <Star className="h-4 w-4" />
              Star on GitHub
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
```

- [ ] **Step 4: Mount the Nav in `app/page.tsx`**

```tsx
import { Nav } from "@/components/landing/Nav";

export default function Page() {
  return (
    <>
      <Nav />
      <main className="min-h-[60vh]" />
    </>
  );
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npx playwright test tests/landing.spec.mjs`
Expected: PASS for both Nav tests.

- [ ] **Step 6: Commit**

```bash
git add components/landing/Nav.tsx app/page.tsx tests/landing.spec.mjs
git commit -m "feat(landing): add sticky Nav with primary links and GitHub CTA"
```

---

## Task 10: Build Hero (copy, CTAs, inline trust pillars) — no mockup yet

**Files:**
- Create: `components/landing/Hero.tsx`
- Modify: `app/page.tsx`
- Modify: `tests/landing.spec.mjs`

- [ ] **Step 1: Extend Playwright assertions for the hero**

Append to `tests/landing.spec.mjs`:

```js
test.describe("Landing — Hero", () => {
  test.beforeEach(async ({ page }) => { await page.goto("/"); });

  test("renders h1 with gradient 'Observable.' word", async ({ page }) => {
    const h1 = page.getByRole("heading", { level: 1 });
    await expect(h1).toContainText("Post-Quantum Benchmarking");
    await expect(h1.getByText("Observable.", { exact: false })).toBeVisible();
  });

  test("primary CTA anchors to #download, secondary links to /reports/", async ({ page }) => {
    await expect(page.getByRole("link", { name: /Download Keystone/i })).toHaveAttribute("href", "#download");
    await expect(page.getByRole("link", { name: /View Case Study/i })).toHaveAttribute("href", "/reports/");
  });

  test("renders three inline trust pillars under the CTAs", async ({ page }) => {
    for (const label of ["Open Source", "Reproducible", "Built for Engineers"]) {
      await expect(page.getByText(label, { exact: false })).toBeVisible();
    }
  });
});
```

- [ ] **Step 2: Run test to verify failures**

Run: `npx playwright test tests/landing.spec.mjs`
Expected: New Hero tests FAIL.

- [ ] **Step 3: Create `components/landing/Hero.tsx`**

```tsx
import Link from "next/link";
import { ArrowRight, Shield, RefreshCw, Terminal } from "lucide-react";
import { Button } from "@/components/ui/button";

const PILLARS = [
  { Icon: Shield,    title: "Open Source",        body: "Apache 2.0" },
  { Icon: RefreshCw, title: "Reproducible",        body: "Deterministic runs" },
  { Icon: Terminal,  title: "Built for Engineers", body: "Not just dashboards" },
];

export function Hero({ mockup }: { mockup?: React.ReactNode }) {
  return (
    <section id="platform" className="relative overflow-hidden">
      {/* Ambient hero glow */}
      <div
        aria-hidden
        className="glow-breathe pointer-events-none absolute -top-40 right-[-10%] h-[640px] w-[640px] rounded-full"
        style={{
          background:
            "radial-gradient(closest-side, color-mix(in oklab, var(--color-primary) 28%, transparent), transparent 70%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-[-180px] right-[-160px] h-[420px] w-[420px] rounded-full opacity-60"
        style={{
          background:
            "radial-gradient(closest-side, color-mix(in oklab, var(--color-secondary) 24%, transparent), transparent 70%)",
        }}
      />
      {/* Faint topographic dot grid in the bottom-right of the hero */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[280px] opacity-50"
        style={{
          maskImage:
            "linear-gradient(to top right, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 60%)",
          WebkitMaskImage:
            "linear-gradient(to top right, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 60%)",
          backgroundImage:
            "radial-gradient(circle, rgba(148,163,184,0.18) 1px, transparent 1.5px)",
          backgroundSize: "22px 22px",
        }}
      />

      <div className="container-page relative grid items-center gap-12 py-20 lg:grid-cols-[1fr_1.35fr] lg:gap-16 lg:py-28">
        <div className="reveal">
          <h1 className="text-balance text-[clamp(40px,5.2vw,72px)] font-bold leading-[1.04] tracking-[-0.035em] text-foreground">
            Post-Quantum<br />Benchmarking,<br />
            <span className="text-gradient">Made Observable.</span>
          </h1>

          <p className="mt-6 max-w-[44ch] text-[17px] leading-[1.65] text-foreground-muted">
            Keystone is a desktop workbench for benchmarking classical and
            post-quantum cryptography. Visualize performance, explore runtime
            trade-offs, and ship cryptography with confidence.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button asChild size="lg">
              <Link href="#download">
                Download Keystone
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/reports/">
                View Case Study
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          <ul className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
            {PILLARS.map(({ Icon, title, body }) => (
              <li key={title} className="flex items-center gap-3 text-sm">
                <span className="grid h-8 w-8 place-items-center rounded-md border border-border bg-surface text-primary">
                  <Icon className="h-4 w-4" />
                </span>
                <span className="text-foreground-muted">
                  <span className="font-medium text-foreground">{title}</span>
                  <span className="mx-1.5 text-foreground-subtle">·</span>
                  {body}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="relative">{mockup}</div>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Mount Hero in `app/page.tsx`**

```tsx
import { Nav } from "@/components/landing/Nav";
import { Hero } from "@/components/landing/Hero";

export default function Page() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
      </main>
    </>
  );
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npx playwright test tests/landing.spec.mjs`
Expected: All Hero tests PASS.

- [ ] **Step 6: Commit**

```bash
git add components/landing/Hero.tsx app/page.tsx tests/landing.spec.mjs
git commit -m "feat(landing): add Hero copy, CTAs, and inline trust pillars"
```

---

## Task 11: Build MockupWindow Chrome + Sidebar

**Files:**
- Create: `components/landing/app-mockup/MockupWindow.tsx`
- Create: `components/landing/app-mockup/Sidebar.tsx`
- Modify: `app/page.tsx` (mount mockup-in-progress)
- Modify: `tests/landing.spec.mjs`

- [ ] **Step 1: Add Playwright assertion for the mockup window**

Append to `tests/landing.spec.mjs`:

```js
test.describe("Landing — Mockup chrome", () => {
  test.beforeEach(async ({ page }) => { await page.goto("/"); });

  test("renders macOS window chrome with three dots and title", async ({ page }) => {
    const win = page.getByTestId("mockup-window");
    await expect(win).toBeVisible();
    await expect(win.getByTestId("traffic-lights").locator("span")).toHaveCount(3);
    await expect(win.getByText("Keystone", { exact: true }).first()).toBeVisible();
    await expect(win.getByRole("button", { name: /Run Benchmark/i })).toBeVisible();
  });

  test("sidebar lists all 8 navigation items", async ({ page }) => {
    const sidebar = page.getByTestId("mockup-sidebar");
    for (const label of ["Overview", "Benchmarks", "Schemes", "Runtimes", "Workflows", "Results", "Reports", "Settings"]) {
      await expect(sidebar.getByText(label, { exact: true })).toBeVisible();
    }
    await expect(sidebar.getByText("Default Lab")).toBeVisible();
    await expect(sidebar.getByText(/Apple M2 Pro/)).toBeVisible();
  });
});
```

- [ ] **Step 2: Run test to verify failures**

Run: `npx playwright test tests/landing.spec.mjs`
Expected: New mockup tests FAIL.

- [ ] **Step 3: Create `components/landing/app-mockup/MockupWindow.tsx`**

```tsx
import { Settings, ChevronDown } from "lucide-react";

export function MockupWindow({ children }: { children: React.ReactNode }) {
  return (
    <div
      data-testid="mockup-window"
      className="overflow-hidden rounded-2xl border border-border-strong bg-surface shadow-[0_30px_80px_-20px_rgba(0,0,0,0.5),0_8px_24px_-8px_rgba(20,184,166,0.18)]"
    >
      {/* Title bar */}
      <div className="flex h-10 items-center justify-between border-b border-border bg-surface-2 px-4">
        <div data-testid="traffic-lights" className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-danger" />
          <span className="h-3 w-3 rounded-full bg-warning" />
          <span className="h-3 w-3 rounded-full bg-success" />
        </div>
        <span className="text-xs font-medium text-foreground-muted">Keystone</span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="rounded-md bg-primary px-2.5 py-1 text-[11px] font-medium text-background hover:bg-primary-light"
          >
            Run Benchmark
          </button>
          <button
            type="button"
            className="flex items-center gap-1 rounded-md border border-border bg-surface px-2 py-1 text-[11px] text-foreground-muted hover:text-foreground"
          >
            Preset: Balanced <ChevronDown className="h-3 w-3" />
          </button>
          <button
            type="button"
            aria-label="Settings"
            className="grid h-6 w-6 place-items-center rounded-md text-foreground-muted hover:text-foreground"
          >
            <Settings className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
      {children}
    </div>
  );
}
```

- [ ] **Step 4: Create `components/landing/app-mockup/Sidebar.tsx`**

```tsx
import { ChevronDown } from "lucide-react";

const ITEMS = [
  "Overview", "Benchmarks", "Schemes", "Runtimes",
  "Workflows", "Results", "Reports", "Settings",
];

export function Sidebar() {
  return (
    <aside
      data-testid="mockup-sidebar"
      className="hidden w-44 shrink-0 flex-col border-r border-border bg-surface-2 px-3 py-4 md:flex"
    >
      <ul className="flex flex-col gap-0.5">
        {ITEMS.map((label, idx) => {
          const active = idx === 0;
          return (
            <li key={label}>
              <span
                className={
                  active
                    ? "flex items-center gap-2 rounded-md border-l-2 border-primary bg-surface-3 px-3 py-1.5 text-xs font-medium text-foreground"
                    : "flex items-center gap-2 rounded-md px-3 py-1.5 text-xs text-foreground-muted hover:bg-surface-3 hover:text-foreground"
                }
              >
                <span
                  aria-hidden
                  className={active ? "h-1.5 w-1.5 rounded-full bg-primary" : "h-1.5 w-1.5 rounded-full bg-border-strong"}
                />
                {label}
              </span>
            </li>
          );
        })}
      </ul>

      <div className="mt-auto flex flex-col gap-3 pt-6">
        <div className="rounded-md border border-border bg-surface px-3 py-2">
          <div className="flex items-center justify-between text-[10px] uppercase tracking-wider text-foreground-subtle">
            Active Profile <ChevronDown className="h-3 w-3" />
          </div>
          <div className="mt-1 text-xs font-medium text-foreground">Default Lab</div>
        </div>
        <div className="rounded-md border border-border bg-surface px-3 py-2">
          <div className="text-[10px] uppercase tracking-wider text-foreground-subtle">Environment</div>
          <div className="mt-1 text-xs font-medium text-foreground">Apple M2 Pro</div>
          <div className="text-[11px] text-foreground-muted">macOS 14.4</div>
        </div>
        <div className="flex items-center gap-2 px-1 text-[11px] text-foreground-muted">
          <span className="h-1.5 w-1.5 rounded-full bg-success" /> All systems nominal
        </div>
      </div>
    </aside>
  );
}
```

- [ ] **Step 5: Mount in-progress mockup in the Hero via `app/page.tsx`**

```tsx
import { Nav } from "@/components/landing/Nav";
import { Hero } from "@/components/landing/Hero";
import { MockupWindow } from "@/components/landing/app-mockup/MockupWindow";
import { Sidebar } from "@/components/landing/app-mockup/Sidebar";

export default function Page() {
  return (
    <>
      <Nav />
      <main>
        <Hero
          mockup={
            <MockupWindow>
              <div className="flex">
                <Sidebar />
                <div className="flex-1 p-4 text-foreground-muted">Dashboard body — in progress</div>
              </div>
            </MockupWindow>
          }
        />
      </main>
    </>
  );
}
```

- [ ] **Step 6: Run test to verify it passes**

Run: `npx playwright test tests/landing.spec.mjs`
Expected: All mockup chrome tests PASS.

- [ ] **Step 7: Commit**

```bash
git add components/landing/app-mockup/MockupWindow.tsx components/landing/app-mockup/Sidebar.tsx app/page.tsx tests/landing.spec.mjs
git commit -m "feat(mockup): add window chrome and sidebar"
```

---

## Task 12: Build MetricCard Strip

**Files:**
- Create: `components/landing/app-mockup/MetricCard.tsx`
- Modify: `app/page.tsx`
- Modify: `tests/landing.spec.mjs`

- [ ] **Step 1: Add Playwright assertion**

Append to `tests/landing.spec.mjs`:

```js
test.describe("Mockup — metric strip", () => {
  test.beforeEach(async ({ page }) => { await page.goto("/"); });

  test("renders 4 metric cards with values from mockData", async ({ page }) => {
    const strip = page.getByTestId("mockup-metrics");
    await expect(strip.locator("[data-testid=metric-card]")).toHaveCount(4);
    await expect(strip.getByText("1,248")).toBeVisible();
    await expect(strip.getByText("2.34M")).toBeVisible();
    await expect(strip.getByText("0.42 ms")).toBeVisible();
    await expect(strip.getByText("99.8%")).toBeVisible();
  });
});
```

- [ ] **Step 2: Run test to verify failure**

Run: `npx playwright test tests/landing.spec.mjs`
Expected: metric strip test FAILS.

- [ ] **Step 3: Create `components/landing/app-mockup/MetricCard.tsx`**

```tsx
import { ArrowUp } from "lucide-react";
import { TOP_METRICS } from "@/lib/mockData";

export function MetricStrip() {
  return (
    <div data-testid="mockup-metrics" className="grid grid-cols-4 gap-3 border-b border-border p-4">
      {TOP_METRICS.map((m) => {
        const negative = m.delta.startsWith("-");
        return (
          <div
            key={m.label}
            data-testid="metric-card"
            className="rounded-lg border border-border bg-surface-2 px-4 py-3"
          >
            <div className="text-[11px] font-medium uppercase tracking-wider text-foreground-subtle">{m.label}</div>
            <div className="mt-1 flex items-baseline gap-2">
              <div className="text-xl font-semibold text-foreground">{m.value}</div>
              <span
                className={
                  negative
                    ? "text-[11px] font-medium text-danger"
                    : "inline-flex items-center gap-0.5 text-[11px] font-medium text-success"
                }
              >
                {!negative && <ArrowUp className="h-3 w-3" />}
                {m.delta}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
```

- [ ] **Step 4: Add it to the in-progress mockup in `app/page.tsx`**

Replace the `<div className="flex-1 p-4 ...">Dashboard body — in progress</div>` line with:

```tsx
<div className="flex-1">
  <MetricStrip />
</div>
```

And add the import:

```tsx
import { MetricStrip } from "@/components/landing/app-mockup/MetricCard";
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npx playwright test tests/landing.spec.mjs`
Expected: metric strip test PASSES.

- [ ] **Step 6: Commit**

```bash
git add components/landing/app-mockup/MetricCard.tsx app/page.tsx tests/landing.spec.mjs
git commit -m "feat(mockup): add top metric strip"
```

---

## Task 13: Build OpsBarChart

**Files:**
- Create: `components/landing/app-mockup/OpsBarChart.tsx`
- Modify: `app/page.tsx`
- Modify: `tests/landing.spec.mjs`

- [ ] **Step 1: Add Playwright assertion**

Append to `tests/landing.spec.mjs`:

```js
test("ops bar chart renders 7 bars with scheme labels", async ({ page }) => {
  await page.goto("/");
  const chart = page.getByTestId("mockup-ops-chart");
  await expect(chart.locator("[data-testid=ops-bar]")).toHaveCount(7);
  await expect(chart.getByText("ML-KEM")).toBeVisible();
  await expect(chart.getByText("AES-GCM")).toBeVisible();
  await expect(chart.getByText("3.21M")).toBeVisible();
});
```

- [ ] **Step 2: Run test to verify failure**

Run: `npx playwright test tests/landing.spec.mjs`
Expected: FAIL.

- [ ] **Step 3: Create `components/landing/app-mockup/OpsBarChart.tsx`**

```tsx
import { OPS_BARS } from "@/lib/mockData";

export function OpsBarChart() {
  return (
    <div
      data-testid="mockup-ops-chart"
      className="flex flex-col gap-3 rounded-lg border border-border bg-surface-2 p-4"
    >
      <div className="flex items-center justify-between">
        <h4 className="text-[12px] font-semibold text-foreground">Operations / second</h4>
        <span className="text-[10px] text-foreground-subtle">(higher is better)</span>
      </div>

      <ul className="flex flex-col gap-1.5">
        {OPS_BARS.map((row) => (
          <li
            key={row.label}
            data-testid="ops-bar"
            className="grid grid-cols-[72px_1fr_56px] items-center gap-3"
          >
            <span className="text-[11px] text-foreground-muted">{row.label}</span>
            <span className="h-2 rounded-full bg-surface-3">
              <span
                className="block h-full rounded-full"
                style={{
                  width: `${row.width}%`,
                  background: "linear-gradient(90deg, var(--color-primary), var(--color-primary-light))",
                }}
              />
            </span>
            <span className="text-right text-[11px] font-medium text-foreground">{row.value}</span>
          </li>
        ))}
      </ul>

      <div className="mt-2 flex justify-between border-t border-border pt-2 text-[10px] text-foreground-subtle">
        <span>0</span><span>2M</span><span>4M</span><span>6M</span><span>8M</span>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Mount in `app/page.tsx`**

Inside the mockup body, replace `<MetricStrip />` with:

```tsx
<>
  <MetricStrip />
  <div className="grid grid-cols-[1.4fr_1fr] gap-3 p-4">
    <OpsBarChart />
    <div className="rounded-lg border border-border bg-surface-2 p-4 text-foreground-muted">Gauge (next task)</div>
  </div>
</>
```

Add the import:
```tsx
import { OpsBarChart } from "@/components/landing/app-mockup/OpsBarChart";
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npx playwright test tests/landing.spec.mjs`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add components/landing/app-mockup/OpsBarChart.tsx app/page.tsx tests/landing.spec.mjs
git commit -m "feat(mockup): add operations-per-second bar chart"
```

---

## Task 14: Build LatencyGauge

**Files:**
- Create: `components/landing/app-mockup/LatencyGauge.tsx`
- Modify: `app/page.tsx`
- Modify: `tests/landing.spec.mjs`

- [ ] **Step 1: Add Playwright assertion**

Append to `tests/landing.spec.mjs`:

```js
test("latency gauge renders SVG with value and p50/p95/p99 labels", async ({ page }) => {
  await page.goto("/");
  const gauge = page.getByTestId("mockup-gauge");
  await expect(gauge.locator("svg")).toBeVisible();
  await expect(gauge.getByText("0.42")).toBeVisible();
  await expect(gauge.getByText(/P50/)).toBeVisible();
  await expect(gauge.getByText(/P95/)).toBeVisible();
  await expect(gauge.getByText(/P99/)).toBeVisible();
});
```

- [ ] **Step 2: Run test to verify failure**

Run: `npx playwright test tests/landing.spec.mjs`
Expected: FAIL.

- [ ] **Step 3: Create `components/landing/app-mockup/LatencyGauge.tsx`**

```tsx
import { LATENCY_GAUGE } from "@/lib/mockData";

export function LatencyGauge() {
  return (
    <div
      data-testid="mockup-gauge"
      className="flex flex-col rounded-lg border border-border bg-surface-2 p-4"
    >
      <div className="flex items-center justify-between">
        <h4 className="text-[12px] font-semibold text-foreground">Median Latency (ms)</h4>
      </div>

      <div className="relative mx-auto mt-2 w-full max-w-[220px]">
        <svg viewBox="0 0 200 120" className="w-full">
          <defs>
            <linearGradient id="gaugeStroke" x1="0" x2="1">
              <stop offset="0%" stopColor="var(--color-primary)" />
              <stop offset="100%" stopColor="var(--color-secondary)" />
            </linearGradient>
          </defs>
          {/* Track */}
          <path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke="#1E293B" strokeWidth="10" strokeLinecap="round" />
          {/* Value arc (≈ 30% of 180°) */}
          <path d="M 20 100 A 80 80 0 0 1 75 33" fill="none" stroke="url(#gaugeStroke)" strokeWidth="10" strokeLinecap="round" />
          {/* Tick marks */}
          {[20, 50, 100, 150, 180].map((x, i) => (
            <line key={i} x1={x} x2={x} y1="106" y2="112" stroke="#475569" strokeWidth="1.5" />
          ))}
        </svg>
        <div className="absolute inset-x-0 bottom-2 flex flex-col items-center">
          <span className="text-3xl font-semibold tracking-tight text-foreground">{LATENCY_GAUGE.value}</span>
          <span className="text-[11px] text-foreground-subtle">{LATENCY_GAUGE.unit}</span>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-3 gap-2 border-t border-border pt-3 text-center">
        {(["p50", "p95", "p99"] as const).map((k) => (
          <div key={k}>
            <div className="text-[10px] uppercase tracking-wider text-foreground-subtle">{k.toUpperCase()}</div>
            <div className="text-[11px] font-medium text-foreground">{LATENCY_GAUGE[k]}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Mount in `app/page.tsx`**

Replace the gauge placeholder div with `<LatencyGauge />`. Add the import:

```tsx
import { LatencyGauge } from "@/components/landing/app-mockup/LatencyGauge";
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npx playwright test tests/landing.spec.mjs`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add components/landing/app-mockup/LatencyGauge.tsx app/page.tsx tests/landing.spec.mjs
git commit -m "feat(mockup): add median latency gauge"
```

---

## Task 15: Build LatencyLineChart

**Files:**
- Create: `components/landing/app-mockup/LatencyLineChart.tsx`
- Modify: `app/page.tsx`
- Modify: `tests/landing.spec.mjs`

- [ ] **Step 1: Add Playwright assertion**

Append to `tests/landing.spec.mjs`:

```js
test("latency line chart renders 4 series and time labels", async ({ page }) => {
  await page.goto("/");
  const chart = page.getByTestId("mockup-line-chart");
  await expect(chart.locator("svg")).toBeVisible();
  await expect(chart.locator("svg polyline")).toHaveCount(4);
  await expect(chart.getByText("-60s")).toBeVisible();
  await expect(chart.getByText("Now")).toBeVisible();
  for (const label of ["ML-KEM", "ML-DSA", "Falcon", "SPHINCS+"]) {
    await expect(chart.getByText(label, { exact: true })).toBeVisible();
  }
});
```

- [ ] **Step 2: Run test to verify failure**

Run: `npx playwright test tests/landing.spec.mjs`
Expected: FAIL.

- [ ] **Step 3: Create `components/landing/app-mockup/LatencyLineChart.tsx`**

```tsx
import { LATENCY_SERIES } from "@/lib/mockData";

const W = 480;
const H = 160;
const PADDING = 24;

function toPolyline(points: readonly number[]): string {
  const usableW = W - PADDING * 2;
  const usableH = H - PADDING * 2;
  return points
    .map((y, i) => {
      const x = PADDING + (i / (points.length - 1)) * usableW;
      const yPx = PADDING + (y / 100) * usableH;
      return `${x.toFixed(1)},${yPx.toFixed(1)}`;
    })
    .join(" ");
}

export function LatencyLineChart() {
  return (
    <div
      data-testid="mockup-line-chart"
      className="flex flex-col rounded-lg border border-border bg-surface-2 p-4"
    >
      <div className="flex items-center justify-between">
        <h4 className="text-[12px] font-semibold text-foreground">Latency Over Time (ms)</h4>
        <span className="text-[10px] text-foreground-subtle">Window: 60s · Aggregation: P50</span>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className="mt-2 w-full" role="img" aria-label="Latency over time">
        {/* Grid */}
        {[0.25, 0.5, 0.75].map((t) => (
          <line
            key={t}
            x1={PADDING}
            x2={W - PADDING}
            y1={PADDING + t * (H - PADDING * 2)}
            y2={PADDING + t * (H - PADDING * 2)}
            stroke="#1E293B"
            strokeDasharray="2 4"
          />
        ))}
        {/* Series */}
        {LATENCY_SERIES.map((s) => (
          <polyline
            key={s.name}
            points={toPolyline(s.points)}
            fill="none"
            stroke={s.color}
            strokeWidth="1.6"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        ))}
        {/* Axes labels */}
        <g fontFamily="var(--font-mono)" fontSize="9" fill="#64748B">
          <text x={PADDING} y={H - 6}>-60s</text>
          <text x={W * 0.25} y={H - 6} textAnchor="middle">-45s</text>
          <text x={W * 0.5} y={H - 6} textAnchor="middle">-30s</text>
          <text x={W * 0.75} y={H - 6} textAnchor="middle">-15s</text>
          <text x={W - PADDING} y={H - 6} textAnchor="end">Now</text>
        </g>
      </svg>

      <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[10px] text-foreground-muted">
        {LATENCY_SERIES.map((s) => (
          <li key={s.name} className="flex items-center gap-1.5">
            <span className="h-1.5 w-3 rounded-full" style={{ background: s.color }} />
            {s.name}
          </li>
        ))}
      </ul>
    </div>
  );
}
```

- [ ] **Step 4: Mount in `app/page.tsx`**

Below the ops/gauge row, add a second row containing the line chart and a histogram placeholder:

```tsx
<div className="grid grid-cols-[1fr_1fr] gap-3 px-4 pb-4">
  <LatencyLineChart />
  <div className="rounded-lg border border-border bg-surface-2 p-4 text-foreground-muted">Histogram (next task)</div>
</div>
```

Add the import:
```tsx
import { LatencyLineChart } from "@/components/landing/app-mockup/LatencyLineChart";
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npx playwright test tests/landing.spec.mjs`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add components/landing/app-mockup/LatencyLineChart.tsx app/page.tsx tests/landing.spec.mjs
git commit -m "feat(mockup): add latency over-time line chart"
```

---

## Task 16: Build ThroughputHistogram

**Files:**
- Create: `components/landing/app-mockup/ThroughputHistogram.tsx`
- Modify: `app/page.tsx`
- Modify: `tests/landing.spec.mjs`

- [ ] **Step 1: Add Playwright assertion**

Append to `tests/landing.spec.mjs`:

```js
test("throughput histogram renders 21 bars", async ({ page }) => {
  await page.goto("/");
  const chart = page.getByTestId("mockup-histogram");
  await expect(chart.locator("[data-testid=histogram-bar]")).toHaveCount(21);
  await expect(chart.getByText("10k")).toBeVisible();
  await expect(chart.getByText("100M")).toBeVisible();
});
```

- [ ] **Step 2: Run test to verify failure**

Run: `npx playwright test tests/landing.spec.mjs`
Expected: FAIL.

- [ ] **Step 3: Create `components/landing/app-mockup/ThroughputHistogram.tsx`**

```tsx
import { HISTOGRAM_BINS } from "@/lib/mockData";

export function ThroughputHistogram() {
  return (
    <div
      data-testid="mockup-histogram"
      className="flex flex-col rounded-lg border border-border bg-surface-2 p-4"
    >
      <div className="flex items-center justify-between">
        <h4 className="text-[12px] font-semibold text-foreground">Throughput Distribution (ops/s)</h4>
      </div>

      <div className="mt-3 flex h-[120px] items-end gap-[3px]">
        {HISTOGRAM_BINS.map((value, idx) => (
          <span
            key={idx}
            data-testid="histogram-bar"
            className="flex-1 rounded-sm"
            style={{
              height: `${value}%`,
              background: "linear-gradient(180deg, var(--color-primary-light), var(--color-secondary))",
              opacity: 0.85,
            }}
          />
        ))}
      </div>

      <div className="mt-2 flex justify-between border-t border-border pt-2 text-[10px] text-foreground-subtle">
        <span>10k</span><span>100k</span><span>1M</span><span>10M</span><span>100M</span>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Mount in `app/page.tsx`**

Replace the histogram placeholder with `<ThroughputHistogram />`. Add the import:

```tsx
import { ThroughputHistogram } from "@/components/landing/app-mockup/ThroughputHistogram";
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npx playwright test tests/landing.spec.mjs`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add components/landing/app-mockup/ThroughputHistogram.tsx app/page.tsx tests/landing.spec.mjs
git commit -m "feat(mockup): add throughput distribution histogram"
```

---

## Task 17: Build SchemeTable + Caption

**Files:**
- Create: `components/landing/app-mockup/SchemeTable.tsx`
- Modify: `app/page.tsx`
- Modify: `tests/landing.spec.mjs`

- [ ] **Step 1: Add Playwright assertion**

Append to `tests/landing.spec.mjs`:

```js
test("scheme table renders 7 rows and footer caption", async ({ page }) => {
  await page.goto("/");
  const table = page.getByTestId("mockup-scheme-table");
  await expect(table.locator("tbody tr")).toHaveCount(7);
  await expect(table.getByText("ML-KEM (768)")).toBeVisible();
  await expect(table.getByText("AES-GCM (256)")).toBeVisible();
  await expect(page.getByText(/Completed 32 runs/)).toBeVisible();
  await expect(page.getByText(/Last run/)).toBeVisible();
});
```

- [ ] **Step 2: Run test to verify failure**

Run: `npx playwright test tests/landing.spec.mjs`
Expected: FAIL.

- [ ] **Step 3: Create `components/landing/app-mockup/SchemeTable.tsx`**

```tsx
import { Check, RefreshCw } from "lucide-react";
import { SCHEME_TABLE } from "@/lib/mockData";

const HEADERS = [
  "Scheme", "Category", "Security Level",
  "Key Gen (ms)", "Sign / Enc (ms)", "Verify / Dec (ms)",
  "Ops / s", "Size (KB)", "Status",
];

export function SchemeTable() {
  return (
    <div
      data-testid="mockup-scheme-table"
      className="rounded-lg border border-border bg-surface-2"
    >
      <div className="border-b border-border px-4 py-3">
        <h4 className="text-[12px] font-semibold text-foreground">Scheme Comparison</h4>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-[11px]">
          <thead>
            <tr className="border-b border-border bg-surface">
              {HEADERS.map((h) => (
                <th key={h} className="px-3 py-2 font-medium text-foreground-subtle whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {SCHEME_TABLE.map((row) => (
              <tr key={row.scheme} className="border-b border-border last:border-0">
                <td className="px-3 py-2 font-medium text-foreground whitespace-nowrap">{row.scheme}</td>
                <td className="px-3 py-2 text-foreground-muted whitespace-nowrap">{row.category}</td>
                <td className="px-3 py-2 text-foreground-muted whitespace-nowrap">{row.level}</td>
                <td className="px-3 py-2 font-mono text-foreground">{row.keyGen}</td>
                <td className="px-3 py-2 font-mono text-foreground">{row.sign}</td>
                <td className="px-3 py-2 font-mono text-foreground">{row.verify}</td>
                <td className="px-3 py-2 font-mono text-foreground">{row.ops}</td>
                <td className="px-3 py-2 font-mono text-foreground">{row.size}</td>
                <td className="px-3 py-2">
                  {row.ok && <Check className="h-3.5 w-3.5 text-success" aria-label="ok" />}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between border-t border-border px-4 py-2 text-[10px] text-foreground-subtle">
        <span>Completed 32 runs</span>
        <span className="inline-flex items-center gap-1.5">
          <RefreshCw className="h-3 w-3" /> Last run: 2m ago
        </span>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Mount in `app/page.tsx`**

Below the line-chart/histogram row, add a third row containing the table at full width:

```tsx
<div className="px-4 pb-4">
  <SchemeTable />
</div>
```

Add the import:
```tsx
import { SchemeTable } from "@/components/landing/app-mockup/SchemeTable";
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npx playwright test tests/landing.spec.mjs`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add components/landing/app-mockup/SchemeTable.tsx app/page.tsx tests/landing.spec.mjs
git commit -m "feat(mockup): add scheme comparison table"
```

---

## Task 18: Assemble Mockup into a Single Component and Wire into Hero

**Files:**
- Create: `components/landing/app-mockup/Mockup.tsx`
- Modify: `app/page.tsx` (collapse mockup composition into a single `<Mockup />`)

- [ ] **Step 1: Create `components/landing/app-mockup/Mockup.tsx`**

```tsx
import { MockupWindow } from "./MockupWindow";
import { Sidebar } from "./Sidebar";
import { MetricStrip } from "./MetricCard";
import { OpsBarChart } from "./OpsBarChart";
import { LatencyGauge } from "./LatencyGauge";
import { LatencyLineChart } from "./LatencyLineChart";
import { ThroughputHistogram } from "./ThroughputHistogram";
import { SchemeTable } from "./SchemeTable";

export function Mockup() {
  return (
    <MockupWindow>
      <div className="flex">
        <Sidebar />
        <div className="min-w-0 flex-1">
          <MetricStrip />
          <div className="grid grid-cols-1 gap-3 p-4 lg:grid-cols-[1.4fr_1fr]">
            <OpsBarChart />
            <LatencyGauge />
          </div>
          <div className="grid grid-cols-1 gap-3 px-4 pb-4 lg:grid-cols-2">
            <LatencyLineChart />
            <ThroughputHistogram />
          </div>
          <div className="px-4 pb-4">
            <SchemeTable />
          </div>
        </div>
      </div>
    </MockupWindow>
  );
}
```

- [ ] **Step 2: Simplify `app/page.tsx`**

```tsx
import { Nav } from "@/components/landing/Nav";
import { Hero } from "@/components/landing/Hero";
import { Mockup } from "@/components/landing/app-mockup/Mockup";

export default function Page() {
  return (
    <>
      <Nav />
      <main>
        <Hero mockup={<Mockup />} />
      </main>
    </>
  );
}
```

- [ ] **Step 3: Run full landing test suite**

Run: `npx playwright test tests/landing.spec.mjs`
Expected: All tests PASS (mockup composition unchanged in behavior).

- [ ] **Step 4: Commit**

```bash
git add components/landing/app-mockup/Mockup.tsx app/page.tsx
git commit -m "refactor(mockup): collapse hero mockup into single composite"
```

---

## Task 19: Build Features Section (5-up grid)

**Files:**
- Create: `components/landing/Features.tsx`
- Modify: `app/page.tsx`
- Modify: `tests/landing.spec.mjs`

- [ ] **Step 1: Add Playwright assertion**

Append to `tests/landing.spec.mjs`:

```js
test.describe("Landing — Features", () => {
  test("renders 5 feature cards", async ({ page }) => {
    await page.goto("/");
    const section = page.locator("#features");
    await expect(section).toBeVisible();
    await expect(section.locator("[data-testid=feature-card]")).toHaveCount(5);
    for (const title of [
      "Real-time benchmarking",
      "Visual analytics",
      "Hybrid workflows",
      "Desktop workbench",
      "Cross-platform",
    ]) {
      await expect(section.getByText(title)).toBeVisible();
    }
  });
});
```

- [ ] **Step 2: Run test to verify failure**

Run: `npx playwright test tests/landing.spec.mjs`
Expected: FAIL — `#features` not found.

- [ ] **Step 3: Create `components/landing/Features.tsx`**

```tsx
import { Activity, BarChart3, GitBranch, Terminal, Layers } from "lucide-react";

const FEATURES = [
  { Icon: Activity,    title: "Real-time benchmarking", body: "High-resolution metrics with live charts, percentiles, and throughput distributions." },
  { Icon: BarChart3,   title: "Visual analytics",       body: "Compare schemes at a glance with interactive dashboards and drill-down detail." },
  { Icon: GitBranch,   title: "Hybrid workflows",       body: "Model hybrid and composite cryptography with flexible workflow builders." },
  { Icon: Terminal,    title: "Desktop workbench",      body: "Run experiments locally with reproducible environments and offline confidence." },
  { Icon: Layers,      title: "Cross-platform",         body: "Native packages for macOS, Windows, and Linux. Consistent everywhere." },
];

export function Features() {
  return (
    <section id="features" className="container-page py-20 lg:py-28">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {FEATURES.map(({ Icon, title, body }) => (
          <article
            key={title}
            data-testid="feature-card"
            className="rounded-xl border border-border bg-surface p-5 transition-colors hover:border-border-strong"
          >
            <span className="grid h-9 w-9 place-items-center rounded-md border border-primary/40 bg-primary/10 text-primary">
              <Icon className="h-4 w-4" />
            </span>
            <h3 className="mt-4 text-[15px] font-semibold text-foreground">{title}</h3>
            <p className="mt-2 text-[13px] leading-relaxed text-foreground-muted">{body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Mount in `app/page.tsx`**

```tsx
import { Features } from "@/components/landing/Features";
```

Add `<Features />` after `<Hero ... />` inside `<main>`.

- [ ] **Step 5: Run test to verify it passes**

Run: `npx playwright test tests/landing.spec.mjs`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add components/landing/Features.tsx app/page.tsx tests/landing.spec.mjs
git commit -m "feat(landing): add 5-up Features grid"
```

---

## Task 20: Build Classical vs PQC Comparison

**Files:**
- Create: `components/landing/ClassicalVsPqc.tsx`
- Modify: `app/page.tsx`
- Modify: `tests/landing.spec.mjs`

- [ ] **Step 1: Add Playwright assertion**

Append to `tests/landing.spec.mjs`:

```js
test.describe("Landing — Comparison", () => {
  test("renders 4 grouped comparison charts with PQC + Classical bars", async ({ page }) => {
    await page.goto("/");
    const section = page.locator("#comparison");
    await expect(section).toBeVisible();
    await expect(section.locator("[data-testid=comparison-chart]")).toHaveCount(4);
    for (const label of ["Security Level", "Throughput", "Median Latency", "Artifact Size"]) {
      await expect(section.getByText(label)).toBeVisible();
    }
    await expect(section.getByText("Post-Quantum")).toBeVisible();
    await expect(section.getByText("Classical")).toBeVisible();
    await expect(section.getByText(/Higher is better/i)).toBeVisible();
    await expect(section.getByText(/Lower is better/i)).toBeVisible();
  });
});
```

- [ ] **Step 2: Run test to verify failure**

Run: `npx playwright test tests/landing.spec.mjs`
Expected: FAIL.

- [ ] **Step 3: Create `components/landing/ClassicalVsPqc.tsx`**

```tsx
import { ArrowUp, ArrowDown, Shield, Gauge, Clock, Box } from "lucide-react";
import { COMPARISON } from "@/lib/mockData";

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  "Security Level": Shield,
  "Throughput": Gauge,
  "Median Latency": Clock,
  "Artifact Size": Box,
};

export function ClassicalVsPqc() {
  return (
    <section id="comparison" className="container-page pb-20 lg:pb-28">
      <div className="rounded-2xl border border-border bg-surface p-6 lg:p-10">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_2fr] lg:items-end">
          <div>
            <h2 className="text-[clamp(28px,3.4vw,40px)] font-semibold leading-[1.05] tracking-tight text-foreground">
              Classical vs Post-Quantum
            </h2>
            <p className="mt-3 text-[15px] text-foreground-muted">See the trade-offs. Choose with confidence.</p>

            <ul className="mt-6 flex flex-col gap-2 text-sm">
              <li className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-primary" />
                <span className="text-foreground-muted">{COMPARISON.legend.pqc}</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-secondary" />
                <span className="text-foreground-muted">{COMPARISON.legend.classical}</span>
              </li>
            </ul>

            <ul className="mt-6 flex flex-col gap-2 text-[13px] text-foreground-subtle">
              <li className="inline-flex items-center gap-1.5"><ArrowUp className="h-3.5 w-3.5" /> Higher is better</li>
              <li className="inline-flex items-center gap-1.5"><ArrowDown className="h-3.5 w-3.5" /> Lower is better</li>
            </ul>
          </div>

          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {COMPARISON.metrics.map((m) => {
              const Icon = ICONS[m.label];
              return (
                <article
                  key={m.label}
                  data-testid="comparison-chart"
                  className="flex flex-col rounded-xl border border-border bg-background p-4"
                >
                  <div className="flex items-center gap-2">
                    {Icon && (
                      <span className="grid h-7 w-7 place-items-center rounded-md border border-border bg-surface text-primary">
                        <Icon className="h-3.5 w-3.5" />
                      </span>
                    )}
                    <div>
                      <div className="text-[13px] font-semibold text-foreground">{m.label}</div>
                      <div className="text-[10px] uppercase tracking-wider text-foreground-subtle">{m.unit}</div>
                    </div>
                  </div>

                  <div className="mt-5 grid h-[120px] grid-cols-2 items-end gap-2">
                    <Bar value={m.pqc.value} height={m.pqc.height} color="var(--color-primary)" />
                    <Bar value={m.classical.value} height={m.classical.height} color="var(--color-secondary)" />
                  </div>

                  <div className="mt-2 grid grid-cols-2 text-center text-[10px] text-foreground-muted">
                    <span>PQC (Avg)</span>
                    <span>Classical (Avg)</span>
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        <p className="mt-6 text-center text-[12px] text-foreground-subtle">
          Results vary by scheme, parameters, and platform. Benchmark responsibly.
        </p>
      </div>
    </section>
  );
}

function Bar({ value, height, color }: { value: string; height: number; color: string }) {
  return (
    <div className="flex h-full flex-col items-center justify-end">
      <span className="mb-1 text-[11px] font-medium text-foreground">{value}</span>
      <span
        className="w-full rounded-t-md"
        style={{ height: `${height}%`, background: `linear-gradient(180deg, ${color}, color-mix(in oklab, ${color} 70%, transparent))` }}
      />
    </div>
  );
}
```

- [ ] **Step 4: Mount in `app/page.tsx`**

```tsx
import { ClassicalVsPqc } from "@/components/landing/ClassicalVsPqc";
```

Add `<ClassicalVsPqc />` after `<Features />`.

- [ ] **Step 5: Run test to verify it passes**

Run: `npx playwright test tests/landing.spec.mjs`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add components/landing/ClassicalVsPqc.tsx app/page.tsx tests/landing.spec.mjs
git commit -m "feat(landing): add Classical vs Post-Quantum comparison"
```

---

## Task 21: Build Trust Pillars (5-up grid)

**Files:**
- Create: `components/landing/TrustPillars.tsx`
- Modify: `app/page.tsx`
- Modify: `tests/landing.spec.mjs`

- [ ] **Step 1: Add Playwright assertion**

Append to `tests/landing.spec.mjs`:

```js
test("trust pillars section renders 5 cards", async ({ page }) => {
  await page.goto("/");
  const section = page.locator("#trust");
  await expect(section).toBeVisible();
  await expect(section.locator("[data-testid=trust-card]")).toHaveCount(5);
  for (const title of ["Open & Auditable", "Reproducible Runs", "Secure by Default", "Modular Architecture", "Data Privacy"]) {
    await expect(section.getByText(title)).toBeVisible();
  }
});
```

- [ ] **Step 2: Run test to verify failure**

Run: `npx playwright test tests/landing.spec.mjs`
Expected: FAIL.

- [ ] **Step 3: Create `components/landing/TrustPillars.tsx`**

```tsx
import Link from "next/link";
import { Github, RefreshCw, Lock, Grid3x3, EyeOff, ArrowRight } from "lucide-react";

const PILLARS = [
  { Icon: Github,    title: "Open & Auditable",     body: "Open source core with peer-reviewed code and transparent builds." },
  { Icon: RefreshCw, title: "Reproducible Runs",     body: "Deterministic toolchains, locked dependencies, and environment capture." },
  { Icon: Lock,      title: "Secure by Default",     body: "Memory-safe components, constant-time primitives, and side-channel aware." },
  { Icon: Grid3x3,   title: "Modular Architecture",  body: "Plugin system for schemes, runtimes, and custom experiment modules." },
  { Icon: EyeOff,    title: "Data Privacy",          body: "All runs stay on your machine. No telemetry. Ever." },
];

export function TrustPillars() {
  return (
    <section id="trust" className="container-page pb-20 lg:pb-28">
      <div className="rounded-2xl border border-border bg-surface p-6 lg:p-10">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_2.4fr] lg:items-start">
          <div>
            <h2 className="text-[clamp(28px,3.4vw,40px)] font-semibold leading-[1.05] tracking-tight text-foreground">
              Built on a foundation<br />you can trust.
            </h2>
            <p className="mt-3 max-w-[36ch] text-[15px] text-foreground-muted">
              Keystone is engineered for correctness, transparency, and reproducibility.
            </p>
            <Link
              href="/security/"
              className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-primary-light"
            >
              Learn more about our security model <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {PILLARS.map(({ Icon, title, body }) => (
              <article
                key={title}
                data-testid="trust-card"
                className="rounded-xl border border-border bg-background p-4"
              >
                <span className="grid h-9 w-9 place-items-center rounded-md border border-primary/40 bg-primary/10 text-primary">
                  <Icon className="h-4 w-4" />
                </span>
                <h3 className="mt-4 text-[13px] font-semibold text-foreground">{title}</h3>
                <p className="mt-1.5 text-[12px] leading-relaxed text-foreground-muted">{body}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Mount in `app/page.tsx`**

```tsx
import { TrustPillars } from "@/components/landing/TrustPillars";
```

Add `<TrustPillars />` after `<ClassicalVsPqc />`.

- [ ] **Step 5: Run test to verify it passes**

Run: `npx playwright test tests/landing.spec.mjs`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add components/landing/TrustPillars.tsx app/page.tsx tests/landing.spec.mjs
git commit -m "feat(landing): add Built on a foundation Trust Pillars section"
```

---

## Task 22: Build Download Section

**Files:**
- Create: `components/landing/Download.tsx`
- Modify: `app/page.tsx`
- Modify: `tests/landing.spec.mjs`

- [ ] **Step 1: Add Playwright assertion**

Append to `tests/landing.spec.mjs`:

```js
test.describe("Landing — Download", () => {
  test("renders 3 platform cards; only Windows is enabled", async ({ page }) => {
    await page.goto("/");
    const section = page.locator("#download");
    await expect(section).toBeVisible();
    await expect(section.locator("[data-testid=download-card]")).toHaveCount(3);

    await expect(section.getByText("macOS")).toBeVisible();
    await expect(section.getByText("Windows")).toBeVisible();
    await expect(section.getByText("Linux")).toBeVisible();

    const macBtn = section.getByRole("button", { name: /Download \.dmg/i });
    await expect(macBtn).toBeDisabled();
    const winBtn = section.getByRole("link", { name: /Download \.exe/i });
    await expect(winBtn).toBeVisible();
    const linuxBtn = section.getByRole("button", { name: /Download \.AppImage/i });
    await expect(linuxBtn).toBeDisabled();

    await expect(section.getByText(/Coming soon/i).first()).toBeVisible();
  });
});
```

- [ ] **Step 2: Run test to verify failure**

Run: `npx playwright test tests/landing.spec.mjs`
Expected: FAIL.

- [ ] **Step 3: Create `components/landing/Download.tsx`**

```tsx
import Link from "next/link";
import { Apple, Github, ArrowRight, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

function WindowsLogo({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path fill="currentColor" d="M0 3.5L9.5 2.2v9.3H0V3.5zM10.6 2L24 0v11.3H10.6V2zM0 12.5h9.5v9.3L0 20.5v-8zM10.6 12.5H24V24l-13.4-2.1V12.5z" />
    </svg>
  );
}
function TuxLogo({ className = "" }: { className?: string }) {
  // A simple Tux silhouette
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path fill="currentColor" d="M12 2c-2.7 0-4.5 2.4-4.5 5.4 0 1.4.5 2.6 1.3 3.5-1.4 1.1-3 3.4-3.5 6.6-.4 2.4 1 5 4 5 1.2 0 2.4-.4 3.7-1.3 1.3.9 2.5 1.3 3.7 1.3 3 0 4.4-2.6 4-5-.5-3.2-2.1-5.5-3.5-6.6.8-.9 1.3-2.1 1.3-3.5 0-3-1.8-5.4-4.5-5.4z" />
    </svg>
  );
}

const PLATFORMS = [
  { name: "macOS",   Logo: Apple,        sub: "10.15 or later · Apple Silicon & Intel", label: "Download .dmg",      enabled: false, href: "#" },
  { name: "Windows", Logo: WindowsLogo,  sub: "Windows 10 or later · x64",               label: "Download .exe",      enabled: true,  href: "#" },
  { name: "Linux",   Logo: TuxLogo,      sub: "Ubuntu 20.04+ / Fedora 39+ / Arch",        label: "Download .AppImage", enabled: false, href: "#" },
];

export function Download() {
  return (
    <section id="download" className="container-page pb-24 text-center">
      <h2 className="text-[clamp(28px,3.4vw,40px)] font-semibold leading-[1.05] tracking-tight text-foreground">
        Download Keystone
      </h2>
      <p className="mt-3 text-[15px] text-foreground-muted">Native installers. No cloud required.</p>

      <div className="mt-10 grid grid-cols-1 gap-4 text-left sm:grid-cols-3">
        {PLATFORMS.map((p) => (
          <article
            key={p.name}
            data-testid="download-card"
            className="rounded-xl border border-border bg-surface p-5"
          >
            <div className="flex items-center gap-3">
              <span className="text-foreground"><p.Logo className="h-6 w-6" /></span>
              <div>
                <div className="text-[15px] font-semibold text-foreground">{p.name}</div>
                <div className="text-[11px] text-foreground-subtle">{p.sub}</div>
              </div>
            </div>

            <div className="mt-5">
              {p.enabled ? (
                <Button asChild className="w-full justify-center">
                  <Link href={p.href}>{p.label}</Link>
                </Button>
              ) : p.name === "Linux" ? (
                <div className="flex">
                  <Button disabled className="flex-1 justify-center rounded-r-none">{p.label}</Button>
                  <Button disabled className="rounded-l-none border-l border-background/30 px-3"><ChevronDown className="h-4 w-4" /></Button>
                </div>
              ) : (
                <Button disabled className="w-full justify-center">{p.label}</Button>
              )}
              {!p.enabled && (
                <div className="mt-2 text-center text-[11px] text-foreground-subtle">Coming soon</div>
              )}
            </div>
          </article>
        ))}
      </div>

      <div className="mt-10 text-[12px] text-foreground-subtle">
        Verify downloads:{" "}
        <Link href="#" className="text-foreground-muted underline-offset-4 hover:underline">checksums.txt</Link>
        {" · "}
        <Link href="/releases/" className="inline-flex items-center gap-1 text-foreground-muted hover:text-foreground">
          View all releases on GitHub <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Mount in `app/page.tsx`**

```tsx
import { Download } from "@/components/landing/Download";
```

Add `<Download />` after `<TrustPillars />`.

- [ ] **Step 5: Run test to verify it passes**

Run: `npx playwright test tests/landing.spec.mjs`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add components/landing/Download.tsx app/page.tsx tests/landing.spec.mjs
git commit -m "feat(landing): add Download section with 3 platform cards"
```

---

## Task 23: Build Footer

**Files:**
- Create: `components/landing/Footer.tsx`
- Modify: `app/page.tsx`
- Modify: `tests/landing.spec.mjs`

- [ ] **Step 1: Add Playwright assertion**

Append to `tests/landing.spec.mjs`:

```js
test.describe("Landing — Footer", () => {
  test("renders 6 column groups and bottom bar", async ({ page }) => {
    await page.goto("/");
    const footer = page.getByRole("contentinfo");
    await expect(footer).toBeVisible();
    for (const heading of ["Product", "Resources", "Community", "Company", "Stay in the loop"]) {
      await expect(footer.getByText(heading, { exact: true })).toBeVisible();
    }
    await expect(footer.getByRole("textbox", { name: /email/i })).toBeVisible();
    await expect(footer.getByText(/© 2026 Keystone Labs Inc\./i)).toBeVisible();
    await expect(footer.getByRole("link", { name: /Terms of Use/i })).toHaveAttribute("href", "/terms/");
    await expect(footer.getByRole("link", { name: /Privacy Policy/i })).toHaveAttribute("href", "/privacy/");
  });
});
```

- [ ] **Step 2: Run test to verify failure**

Run: `npx playwright test tests/landing.spec.mjs`
Expected: FAIL.

- [ ] **Step 3: Create `components/landing/Footer.tsx`**

This component contains a form whose `onSubmit` runs in the browser. Mark it as a client component.

```tsx
"use client";

import Link from "next/link";
import { Github, ArrowRight, Linkedin } from "lucide-react";

const COLUMNS = [
  { heading: "Product",   links: [["Features", "#features"], ["Benchmarks", "#comparison"], ["Workflows", "#features"], ["Download", "#download"]] },
  { heading: "Resources", links: [["Docs", "/docs/"], ["Case Studies", "/reports/"], ["Blog", "/blog/"], ["Security", "/security/"]] },
  { heading: "Community", links: [["GitHub", "#"], ["Discussions", "#"], ["Contributing", "#"], ["Security", "/security/"]] },
  { heading: "Company",   links: [["About", "/about/"], ["Contact", "/contact/"], ["Privacy", "/privacy/"], ["License", "/terms/"]] },
] as const;

function MastodonLogo({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path fill="currentColor" d="M21.6 7.6c0-4.4-2.9-5.7-2.9-5.7C17.3 1.3 14.7 1 12 1c-2.7 0-5.3.3-6.7.9 0 0-2.9 1.3-2.9 5.7v6.1c0 4.2 2.7 5.5 4.7 5.9 1 .2 1.8.3 2.4.3 1.1 0 1.9-.2 1.9-.2v-1.9s-1 .3-2.3.2c-1.3 0-2.7-.2-2.9-1.7.8.2 1.7.3 2.7.3 4 0 7.4-.8 7.4-3.6 0-3.4-.3-6-.7-6.4M16.9 14h-2.5V8.3c0-1.3-.6-1.9-1.7-1.9-1.3 0-1.9.8-1.9 2.4v3.5H8.4V8.8c0-1.6-.6-2.4-1.9-2.4-1.1 0-1.7.6-1.7 1.9V14H2.3V8.1c0-1.3.4-2.4 1.1-3.1.7-.7 1.6-1.1 2.7-1.1 1.3 0 2.3.5 2.9 1.5l.6 1 .6-1c.7-1 1.7-1.5 3-1.5 1.1 0 2 .4 2.7 1.1.7.7 1.1 1.8 1.1 3.1V14z" />
    </svg>
  );
}

export function Footer() {
  function onSubmit(e: React.FormEvent) { e.preventDefault(); }
  return (
    <footer role="contentinfo" className="border-t border-border bg-surface">
      <div className="container-page py-16">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-3 lg:grid-cols-6">
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2" aria-label="Keystone home">
              <span aria-hidden className="block h-7 w-7 rounded-md bg-gradient-to-br from-primary to-primary-light" />
              <span className="text-lg font-semibold tracking-tight text-foreground">Keystone</span>
            </Link>
            <p className="mt-4 text-[13px] text-foreground-muted">Post-Quantum Benchmarking,<br />Made Observable.</p>
            <ul className="mt-5 flex items-center gap-3">
              <li><Link href="#" aria-label="GitHub" className="text-foreground-muted hover:text-foreground"><Github className="h-4 w-4" /></Link></li>
              <li><Link href="#" aria-label="Mastodon" className="text-foreground-muted hover:text-foreground"><MastodonLogo className="h-4 w-4" /></Link></li>
              <li><Link href="#" aria-label="LinkedIn" className="text-foreground-muted hover:text-foreground"><Linkedin className="h-4 w-4" /></Link></li>
            </ul>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.heading}>
              <h3 className="text-[13px] font-semibold text-foreground">{col.heading}</h3>
              <ul className="mt-4 flex flex-col gap-2">
                {col.links.map(([label, href]) => (
                  <li key={label}>
                    <Link href={href} className="text-[13px] text-foreground-muted transition-colors hover:text-foreground">{label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="lg:col-span-1">
            <h3 className="text-[13px] font-semibold text-foreground">Stay in the loop</h3>
            <p className="mt-4 text-[13px] text-foreground-muted">Get updates on releases and research.</p>
            <form className="mt-3 flex items-center gap-2" onSubmit={onSubmit}>
              <label className="sr-only" htmlFor="footer-email">Email</label>
              <input
                id="footer-email"
                type="email"
                placeholder="you@company.com"
                className="h-9 flex-1 rounded-md border border-border bg-background px-3 text-[13px] text-foreground placeholder:text-foreground-subtle focus:border-primary focus:outline-none"
              />
              <button
                type="submit"
                aria-label="Subscribe"
                className="grid h-9 w-9 place-items-center rounded-md bg-primary text-background hover:bg-primary-light"
              >
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-border pt-6 text-[12px] text-foreground-subtle sm:flex-row sm:items-center">
          <span>© 2026 Keystone Labs Inc. All rights reserved.</span>
          <span className="flex items-center gap-4">
            <Link href="/terms/" className="hover:text-foreground">Terms of Use</Link>
            <Link href="/privacy/" className="hover:text-foreground">Privacy Policy</Link>
          </span>
        </div>
      </div>
    </footer>
  );
}
```

- [ ] **Step 4: Mount in `app/page.tsx`**

```tsx
import { Footer } from "@/components/landing/Footer";
```

Add `<Footer />` after the main content closes:

```tsx
<>
  <Nav />
  <main>
    <Hero mockup={<Mockup />} />
    <Features />
    <ClassicalVsPqc />
    <TrustPillars />
    <Download />
  </main>
  <Footer />
</>
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npx playwright test tests/landing.spec.mjs`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add components/landing/Footer.tsx app/page.tsx tests/landing.spec.mjs
git commit -m "feat(landing): add 6-column Footer with stubbed newsletter"
```

---

## Task 24: Responsive Sweep + No-Overflow Test

**Files:**
- Modify: `tests/landing.spec.mjs`
- Modify: `playwright.config.mjs` (add tablet + mobile projects)

- [ ] **Step 1: Add tablet + mobile projects to `playwright.config.mjs`**

Replace the `projects` block in `playwright.config.mjs`:

```js
projects: [
  { name: "chromium-desktop", use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 } } },
  { name: "chromium-tablet",  use: { ...devices["Desktop Chrome"], viewport: { width: 768,  height: 1024 } } },
  { name: "chromium-mobile",  use: { ...devices["Desktop Chrome"], viewport: { width: 390,  height: 844  } } },
],
```

- [ ] **Step 2: Add a responsive overflow assertion**

Append to `tests/landing.spec.mjs`:

```js
test.describe("Landing — responsive", () => {
  test("no horizontal overflow at any breakpoint", async ({ page }) => {
    await page.goto("/");
    const overflow = await page.evaluate(() =>
      document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    // Allow a 1px rounding margin.
    expect(overflow).toBeLessThanOrEqual(1);
  });
});
```

- [ ] **Step 3: Run all tests across all projects**

Run: `npx playwright test`
Expected: PASS across `chromium-desktop`, `chromium-tablet`, `chromium-mobile`. If any responsive test fails, identify the overflowing element with `await page.evaluate(...)` and fix the offending component (likely a fixed-width element in the mockup or a chart SVG) by adding `min-w-0` / `overflow-hidden` / `max-w-full` as appropriate.

- [ ] **Step 4: Commit**

```bash
git add tests/landing.spec.mjs playwright.config.mjs
git commit -m "test(landing): assert no horizontal overflow at desktop/tablet/mobile"
```

---

## Task 25: Final Build / Typecheck / Lint Verification

**Files:** none modified; this is a verification gate.

- [ ] **Step 1: Run typecheck**

Run: `npm run typecheck`
Expected: PASS, no errors.

- [ ] **Step 2: Run lint**

Run: `npm run lint`
Expected: PASS (or only warnings already acknowledged). Fix any errors inline before continuing.

- [ ] **Step 3: Run production build**

Run: `npm run build`
Expected: PASS. Output should list the `/` route as a Server Component, sub-page rewrites listed, no warnings.

- [ ] **Step 4: Smoke-test production server**

Run: `npm run start` in one terminal; in another:

```bash
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/
for slug in about benchmarks blog contact docs platform privacy releases reports schemes security terms; do
  status=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:3000/$slug")
  echo "$status /$slug"
done
```

Expected: All return `200`. Stop the production server.

- [ ] **Step 5: Run the full Playwright suite one more time**

Run: `npx playwright test`
Expected: All projects PASS — `landing.spec.mjs`, `footer-pages.spec.mjs`, `smoke.spec.mjs`.

- [ ] **Step 6: Commit (if any inline fixes were made; otherwise skip)**

```bash
git add -A
git commit -m "chore: address final typecheck/lint/build issues"
```

---

## Task 26: Add README and Final Cleanup

**Files:**
- Modify: `README.md`

- [ ] **Step 1: Replace `README.md`**

```md
# Keystone Landing

The marketing landing for [Keystone](https://github.com/), a desktop workbench for benchmarking classical and post-quantum cryptography.

## Stack

- Next.js 15 (App Router) + React 19 + TypeScript
- Tailwind CSS v4 (CSS-first `@theme`)
- Shadcn primitives (Button, Card)
- IBM Plex Sans / Plex Mono via `next/font`
- Playwright for end-to-end tests

## Develop

```sh
npm install
npm run dev
# open http://localhost:3000
```

## Scripts

| Script | Purpose |
|---|---|
| `npm run dev` | Start the Next dev server on `:3000` |
| `npm run build` | Production build |
| `npm run start` | Run the production build |
| `npm run lint` | Run Next's ESLint config |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run test` | Run Playwright suite (boots `npm run dev` automatically) |

## Routing

- `/` → Next.js landing (App Router, `app/page.tsx`)
- `/about`, `/blog`, `/contact`, `/platform`, `/benchmarks`, `/schemes`, `/security`, `/privacy`, `/terms`, `/releases`, `/reports`, `/docs` → static HTML in `public/`, mapped via `next.config.ts` rewrites. These remain on their previous design language until a future redesign pass.

## Deploy

Vercel auto-detects Next.js and uses the correct preset. No `vercel.json` is needed.
```

- [ ] **Step 2: Verify everything still passes**

Run: `npm run typecheck && npm run lint && npm run build && npx playwright test`
Expected: All PASS.

- [ ] **Step 3: Commit**

```bash
git add README.md
git commit -m "docs: rewrite README for Next.js stack"
```

---

## Done

All sections of the design spec are now implemented and tested. The landing matches the reference image; sub-pages continue to serve unchanged at their original URLs; production build succeeds; Playwright suite is green across desktop/tablet/mobile.
