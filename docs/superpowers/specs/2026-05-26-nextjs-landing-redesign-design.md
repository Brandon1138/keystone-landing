# Keystone Landing — Next.js Redesign

**Date:** 2026-05-26
**Author:** Brandon (drafted with Claude)
**Status:** Design spec — pending review

## Goal

Rebuild the Keystone landing page (`/`) on a modern stack (Next.js 15 + TypeScript + Tailwind v4 + Shadcn) with a redesigned dark product-showcase visual language matching the user-supplied reference. Existing static sub-pages keep functioning unchanged via Next.js rewrites — they are not redesigned this pass.

## Background

The current repo is a no-build static site: `index.html` plus JSX files compiled in the browser by `@babel/standalone`, loading React 18 from unpkg. The landing's visual language is a warm cream/blueprint paper with a `#2E5E91` blue accent. Twelve static HTML sub-pages (`/about`, `/blog`, `/contact`, `/platform`, `/benchmarks`, `/schemes`, `/security`, `/privacy`, `/terms`, `/releases`, `/reports`, `/docs`) sit as physical directories with their own `index.html` and a shared `static-page.css`.

The user wants a stack migration *and* a redesign in the same pass:

- Brand identity is preserved (name, logo asset, positioning as a post-quantum benchmarking platform).
- Visual expression is reimagined to match a supplied reference image: dark navy surface with ambient blue/teal glow, teal/cyan primary, violet secondary, large hero with a live dashboard mockup on the right, multi-section product marketing layout below.
- Only `/` is rebuilt this pass. Sub-pages remain on their current static HTML.

## Stack

| Choice | Pick | Rationale |
|---|---|---|
| Framework | Next.js 15 (App Router) | Default modern stack; RSC by default; server actions available. |
| Language | TypeScript (strict) | Type safety; aligns with the broader product app. |
| Styling | Tailwind v4 | CSS-first `@theme` config, ~10× faster builds, no `tailwind.config.js` needed. Shadcn supports v4. |
| Components | Shadcn — selective | `Button` and `Card` likely; others (`Tabs`, `NavigationMenu`, `DropdownMenu`) added only if a section earns them. Hero-specific pieces (window chrome, charts, comparison bars) built bespoke. |
| Fonts | IBM Plex Sans + IBM Plex Mono via `next/font/google` | Extends the product app's font family. Distinctive vs generic Inter/Geist. |
| Icons | `lucide-react` | Matches Shadcn's icon convention; lightweight; consistent line weight. |
| Motion | CSS-only (keyframes + transitions) | One staggered hero load reveal, subtle ambient gradient breathing, restrained hover polish. No `framer-motion` this pass. |
| Linter / formatter | Default Next.js ESLint config + Prettier | Standard. |
| Hosting | Vercel | Existing deploy target. Auto-detects Next.js preset. |

## Repo Shape

### After migration

```
/
├── app/
│   ├── layout.tsx                # Root layout: fonts, metadata, html dark class
│   ├── page.tsx                  # The landing — composes section components
│   └── globals.css               # Tailwind v4 @theme + base styles
├── components/
│   ├── landing/
│   │   ├── Nav.tsx
│   │   ├── Hero.tsx
│   │   ├── TrustStrip.tsx
│   │   ├── Features.tsx
│   │   ├── ClassicalVsPqc.tsx
│   │   ├── TrustPillars.tsx
│   │   ├── Download.tsx
│   │   ├── Footer.tsx
│   │   └── app-mockup/
│   │       ├── MockupWindow.tsx  # macOS chrome wrapper
│   │       ├── Sidebar.tsx
│   │       ├── MetricCard.tsx
│   │       ├── OpsBarChart.tsx
│   │       ├── LatencyGauge.tsx
│   │       ├── LatencyLineChart.tsx
│   │       ├── ThroughputHistogram.tsx
│   │       └── SchemeTable.tsx
│   └── ui/                       # Shadcn primitives, only what we use
│       ├── button.tsx
│       └── card.tsx
├── lib/
│   ├── utils.ts                  # Shadcn `cn()` helper (clsx + tailwind-merge)
│   └── mockData.ts               # Hand-tuned plausible numbers for the dashboard
├── public/                       # All static sub-pages migrate here
│   ├── about/index.html
│   ├── benchmarks/index.html
│   ├── blog/index.html
│   ├── contact/index.html
│   ├── docs/index.html
│   ├── platform/index.html
│   ├── privacy/index.html
│   ├── releases/index.html
│   ├── reports/index.html
│   ├── schemes/index.html
│   ├── security/index.html
│   ├── terms/index.html
│   ├── design-mockups/           # keystone_logo.png + brief assets
│   ├── static-page.css           # shared sub-page stylesheet
│   └── favicon.ico
├── tests/
│   ├── landing.spec.mjs          # NEW — replaces tests/responsive.spec.mjs
│   └── footer-pages.spec.mjs     # unchanged — sub-pages still serve at same URLs
├── docs/superpowers/             # internal specs/plans, not served
├── playwright.config.mjs
├── next.config.ts                # rewrites for sub-page slugs
├── tsconfig.json
├── components.json               # Shadcn config
├── postcss.config.mjs            # Tailwind v4 PostCSS plugin
├── package.json
├── vercel.json                   # cleared (let Vercel auto-detect Next)
└── .gitignore                    # adds .next/, node_modules/, .superpowers/
```

### Removed

- `index.html` (top-level — replaced by `app/page.tsx`)
- `src/src/app.jsx`, `src/src/parts.jsx`, `src/src/sections.jsx`, `src/src/icons.jsx` (replaced by `components/landing/*`)
- `tweaks-panel.jsx` (already removed from production by an earlier pass; delete file)
- `public/public/` nested directory (flattened — landing-only screenshots removed; the new landing renders the mockup live in DOM)
- `tests/responsive.spec.mjs` (replaced by `tests/landing.spec.mjs`)

### Untouched

- `docs/superpowers/` (internal specs/plans)
- `tmp-folder/`, `uploads/` (thesis assets; not served)
- All sub-page HTML content (moves location but content unchanged)
- `static-page.css` (moves to `public/static-page.css`, content unchanged)
- `tests/footer-pages.spec.mjs`

## Design Tokens

Defined in `app/globals.css` via Tailwind v4 `@theme`. The landing is dark-only; no light theme toggle this pass.

### Surface palette

| Token | Hex | Use |
|---|---|---|
| `--color-background` | `#0A0F1A` | Page background |
| `--color-surface` | `#0F1626` | Cards, mockup window body |
| `--color-surface-2` | `#141C2E` | Raised cards, table rows |
| `--color-border` | `#1E293B` | Hairline dividers, card borders |
| `--color-border-strong` | `#2A3548` | Window chrome, table headers |
| `--color-foreground` | `#E5E7EB` | Primary text |
| `--color-foreground-muted` | `#94A3B8` | Secondary text, labels |
| `--color-foreground-subtle` | `#64748B` | Tertiary text, captions |

### Accent palette

| Token | Hex | Use |
|---|---|---|
| `--color-primary` | `#14B8A6` | Primary CTAs, gradient origin, primary chart series, "Observable." word |
| `--color-primary-light` | `#2DD4BF` | Gradient end, hover states |
| `--color-primary-glow` | `#0D9488` | Ambient hero glow base |
| `--color-secondary` | `#A78BFA` | Secondary chart series, "Classical" comparison bars |
| `--color-secondary-light` | `#C4B5FD` | Secondary hover, gradient end |
| `--color-success` | `#22C55E` | Metric deltas (e.g. "+18%"), success states |
| `--color-warning` | `#F59E0B` | Status indicators (reserved; not used on landing this pass) |
| `--color-danger` | `#EF4444` | Reserved; not used on landing this pass |

### Typography

- Display + body: **IBM Plex Sans** (`100`–`700`). Default weight `400`, headlines `600`, hero `700`.
- Technical / labels / numerals in mockup: **IBM Plex Mono** (`300`–`600`). Loaded via `next/font/google` with `subset: ['latin']`.
- Type scale (Tailwind classes mapped via `@theme`):
  - `text-hero` — `clamp(48px, 6vw, 80px)`, weight `700`, line-height `1.02`, tracking `-0.035em`
  - `text-h2` — `clamp(32px, 4vw, 48px)`, weight `600`, tracking `-0.03em`
  - `text-h3` — `20–22px`, weight `600`
  - `text-body` — `16–17px`, weight `400`, line-height `1.65`
  - `text-mono` — `12px` mono, letter-spacing `0.04em` (labels)
- Gradient text utility: `.text-gradient` applies `linear-gradient(90deg, var(--color-primary), var(--color-primary-light))` with `background-clip: text`. Used only on the "Observable." word in the hero h1.

### Spacing & layout

- Container max width: `1248px`, gutter `clamp(20px, 4vw, 48px)`.
- Section vertical rhythm: `py-24` desktop, `py-16` mobile.
- Card radius: `rounded-xl` (`12px`).
- Border radius for the macOS mockup window: `rounded-2xl` (`16px`).

### Motion

```css
@keyframes rise { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
@keyframes breathe { 0%, 100% { opacity: 0.55; } 50% { opacity: 0.85; } }
```

- Hero load: `.reveal > *` with staggered `animation-delay` (`80ms` increments, first child at `50ms`).
- Ambient hero glow: `animation: breathe 8s ease-in-out infinite`.
- Hover: 200ms color/background transitions on links, buttons, cards. No scale, no shadow growth.
- No scroll-triggered reveals this pass.

## Information Architecture

Single page, anchor-linked. Section order:

### 1. Nav

Sticky-on-scroll thin nav. Left: wordmark (small gradient logo glyph + "Keystone"). Center: 5 links — Features (`#features`), Benchmarks (`#comparison`), Security (`#trust`), Download (`#download`), Docs (`/docs/`). Right: GitHub icon link + "Star on GitHub" outlined pill CTA. Both GitHub references link to `#` (placeholder) for v1 — a real repo URL is out of scope this pass and tracked under Open Questions.

### 2. Hero

Two-column grid (`1fr 1.4fr` desktop, single column on mobile).

**Left column**

- Optional eyebrow (skipped on this pass; the headline carries the message).
- H1: "Post-Quantum Benchmarking, Made Observable." — "Observable." in gradient text.
- Lede: "Keystone is a desktop workbench for benchmarking classical and post-quantum cryptography. Visualize performance, explore runtime trade-offs, and ship cryptography with confidence."
- Two CTAs: primary filled "Download Keystone" (teal-filled with arrow) anchoring to `#download`; secondary outlined "View Case Study →" linking to `/reports/`.
- Three trust pillars below the CTAs as inline mini-rows with icons:
  - Shield — "Open Source · Apache 2.0"
  - Refresh — "Reproducible · Deterministic runs"
  - Terminal — "Built for Engineers · Not just dashboards"

**Right column** — live HTML/CSS desktop-app mockup (see Hero Mockup section).

Background: ambient radial glow behind the right column, layered with a faint topographic grid pattern at low opacity in the bottom-right corner (matches the reference).

### 3. Features (5-up grid)

`grid-cols-5` desktop, `grid-cols-2` tablet, `grid-cols-1` mobile. Each card: cyan-bordered square icon tile (32×32), title, 3-line body.

| Title | Icon | Body |
|---|---|---|
| Real-time benchmarking | activity | "High-resolution metrics with live charts, percentiles, and throughput distributions." |
| Visual analytics | bar-chart | "Compare schemes at a glance with interactive dashboards and drill-down detail." |
| Hybrid workflows | git-branch | "Model hybrid and composite cryptography with flexible workflow builders." |
| Desktop workbench | terminal | "Run experiments locally with reproducible environments and offline confidence." |
| Cross-platform | layers | "Native packages for macOS, Windows, and Linux. Consistent everywhere." |

### 4. Classical vs Post-Quantum

Two-column layout. Left: heading "Classical vs Post-Quantum", subhead "See the trade-offs. Choose with confidence.", legend (teal dot = Post-Quantum, violet dot = Classical), and two annotation rows ("↑ Higher is better", "↓ Lower is better"). Right: 4-up grouped bar grid:

| Metric | Icon | Better direction | PQC value | Classical value |
|---|---|---|---|---|
| Security Level (bits) | shield | Higher | 128+ | ~128 |
| Throughput (ops/s) | gauge | Higher | 1.95M | 1.11M |
| Median Latency | clock | Lower | 0.72ms | 0.38ms |
| Artifact Size (KB) | box | Lower | 5.8 KB | 0.9 KB |

Each grouped chart: two vertical bars side-by-side, value label above each bar, axis label below. PQC bar = teal gradient, Classical bar = violet gradient. Footnote underneath the grid: "Results vary by scheme, parameters, and platform. Benchmark responsibly."

### 5. Trust Pillars (5-up grid)

Heading: "Built on a foundation you can trust." Subhead: "Keystone is engineered for correctness, transparency, and reproducibility." Link: "Learn more about our security model →" (anchors to `/security/`).

Right side / lower area: 5 cards in a row.

| Title | Icon | Body |
|---|---|---|
| Open & Auditable | github | "Open source core with peer-reviewed code and transparent builds." |
| Reproducible Runs | refresh | "Deterministic toolchains, locked dependencies, and environment capture." |
| Secure by Default | lock | "Memory-safe components, constant-time primitives, and side-channel aware." |
| Modular Architecture | grid | "Plugin system for schemes, runtimes, and custom experiment modules." |
| Data Privacy | eye-off | "All runs stay on your machine. No telemetry. Ever." |

### 6. Download

Heading "Download Keystone" centered. Subhead "Native installers. No cloud required."

Three platform cards in a horizontal grid:

| Platform | Icon | Status | Subtitle | Button |
|---|---|---|---|---|
| macOS | apple | Coming soon (disabled) | "10.15 or later · Apple Silicon & Intel" | "Download .dmg" (disabled) |
| Windows | windows | Available | "Windows 10 or later · x64" | "Download .exe" → links to existing checksum download (use the same SHA from current `parts.jsx` for visual consistency, even though no real file exists) |
| Linux | linux (tux) | Coming soon (disabled) | "Ubuntu 20.04+ / Fedora 39+ / Arch" | "Download .AppImage" (disabled, with a small split dropdown chevron suggesting variants) |

Footer line: "Verify downloads: checksums.txt · View all releases on GitHub →" — `checksums.txt` link is `#` placeholder, "View all releases" links to `/releases/`.

### 7. Footer

Six-column grid (`grid-cols-6` desktop, `grid-cols-3` tablet, `grid-cols-1` mobile). Brand column spans wider visually via column-width tuning if needed; default is equal widths.

- **Brand column** — wordmark + tagline "Post-Quantum Benchmarking, Made Observable." + social icons (GitHub `#`, Mastodon `#`, LinkedIn `#`).
- **Product** — Features (`#features`), Benchmarks (`#comparison`), Workflows (`#features`), Download (`#download`)
- **Resources** — Docs (`/docs/`), Case Studies (`/reports/`), Blog (`/blog/`), Security (`/security/`)
- **Community** — GitHub (`#`), Discussions (`#`), Contributing (`#`), Security (`/security/`)
- **Company** — About (`/about/`), Contact (`/contact/`), Privacy (`/privacy/`), License (`/terms/`)
- **Stay in the loop** — heading, copy "Get updates on releases and research.", email input + submit arrow button (form `onSubmit` prevents default; no backend wiring this pass; placeholder `you@company.com`)

Bottom bar: "© 2026 Keystone Labs Inc. All rights reserved." left, "Terms of Use (`/terms/`) · Privacy Policy (`/privacy/`)" right.

## Hero Mockup

A live HTML/CSS/SVG render of a Keystone desktop-app benchmark overview. All content static; no interactivity. Components are server-rendered. Mock data lives in `lib/mockData.ts`.

### Composition

```
┌─ Window (rounded-2xl, surface-2 background, drop shadow) ─────────────────┐
│ ● ● ●                            Keystone                  [Run Benchmark] [Preset: Balanced ▾] [⚙]
├─ Sidebar (160px) ─┬─ Body (fills) ───────────────────────────────────────┤
│  ● Overview        │ ┌─ Metric strip (4 cards) ────────────────────────┐│
│    Benchmarks      │ │ Total: 1,248 (+18%)  Ops/s: 2.34M (+27%)        ││
│    Schemes         │ │ Latency: 0.42ms (-12%)  Success: 99.8% (+0.3%)  ││
│    Runtimes        │ └─────────────────────────────────────────────────┘│
│    Workflows       │ ┌─ Ops/sec bar chart ─────┬─ Latency gauge ────────┐│
│    Results         │ │ ML-KEM ▓▓▓▓▓ 3.21M       │     ╭─────╮            ││
│    Reports         │ │ ML-DSA ▓▓▓▓ 2.14M        │     │ 0.42│ ms         ││
│    Settings        │ │ Falcon ▓▓▓ 1.28M         │     ╰─────╯            ││
│                    │ │ SPHINCS+▓ 0.73M          │  P50 P95 P99           ││
│                    │ │ ...                      │                        ││
│                    │ ├─ Latency line chart ──── ┼─ Throughput histogram ┤│
│                    │ │ /\_/\_/\_/\_/  (4 series)│ ▓▓▓██▓▓▓▓▓             ││
│                    │ ├─ Scheme Comparison table (full width) ───────────┤│
│                    │ │ Scheme | Category | Sec Lvl | KeyGen | Sign ... ││
│                    │ │ ML-KEM | PQC (KEM)| Lvl 1   | 0.36   | 0.58  ✓ ││
│                    │ │ ...                                              ││
│                    │ └─ Completed 32 runs · Last run 2m ago ────────────┘│
│  Active Profile:   │                                                    │
│  Default Lab       │                                                    │
│  Environment:      │                                                    │
│  Apple M2 Pro      │                                                    │
│  macOS 14.4        │                                                    │
│  ● All systems nominal                                                  │
└────────────────────┴──────────────────────────────────────────────────────┘
```

### Implementation notes

- **Window chrome** — traffic-light dots (12px circles in `#ef4444`/`#f59e0b`/`#22c55e`), 36px tall title bar with "Keystone" centered. Right side: pill "Run Benchmark" (teal-filled), "Preset: Balanced ▾" (surface-2 select), gear icon. All non-interactive.
- **Sidebar** — `w-44` (`176px`), `surface-2` background, hairline right border. Overview row has teal left border + teal text + surface-3 highlight. Other rows muted.
- **Metric cards** — 4-up grid. Each card: label top, value below, delta pill right. Deltas use `success` color and a tiny up-arrow glyph.
- **Ops/sec bar chart** — horizontal bars. Each row: scheme label + bar + numeric label aligned right. Bars are teal gradient. Axis ticks below: 0, 2M, 4M, 6M, 8M.
- **Latency gauge** — semicircular SVG gauge. Tick marks on the arc. Big numeric center "0.42 ms". Three labels below: "P50 0.42 ms", "P95 1.37 ms", "P99 2.81 ms". Stroke gradient from teal to violet.
- **Latency line chart** — 4 series (ML-KEM teal, ML-DSA primary-light, Falcon secondary, SPHINCS+ secondary-light). 60s window. Window labels: "-60s", "-45s", "-30s", "-15s", "Now". Y-axis labels: 0.01, 0.1, 1, 10. Y-axis label "Latency Over Time (ms)" top-left. "Window: 60s · Aggregation: P50" top-right.
- **Throughput histogram** — 30-bin histogram, teal→violet gradient bars. X-axis ticks: 10k, 100k, 1M, 10M, 100M. Y-axis: 100, 1k, 10k, 100k. Header: "Throughput Distribution (ops/s)".
- **Scheme Comparison table** — `surface` background, 8 rows × 9 columns. Header row: Scheme, Category, Security Level, Key Gen (ms), Sign / Enc (ms), Verify / Dec (ms), Ops / s, Size (KB), Status. Status = green checkmarks. Numbers from `mockData.ts`.
- **Footer caption** — "Completed 32 runs" left, "Last run: 2m ago ↻" right, with hairline border above.

### Responsiveness

- Mockup retains layout structure down to ~`md` (768px); below that, the mockup scales as a single image-like block via `transform: scale()` to preserve composition without trying to reflow internally. At `<md`, sidebar collapses to a thin icon strip.
- All SVGs use `viewBox` + `preserveAspectRatio` so they scale crisply.

## Component Inventory

### Section components (server, no client JS)

`Nav`, `Hero`, `TrustStrip`, `Features`, `ClassicalVsPqc`, `TrustPillars`, `Download`, `Footer` — each receives no props for v1; content is hardcoded inside (small marketing site, single page, no CMS).

### Hero mockup subcomponents

`MockupWindow`, `Sidebar`, `MetricCard`, `OpsBarChart`, `LatencyGauge`, `LatencyLineChart`, `ThroughputHistogram`, `SchemeTable` — all server, all consume from `lib/mockData.ts`.

### UI primitives

`Button` (Shadcn), `Card` (Shadcn) — added via `npx shadcn@latest add button card`. No other primitives unless a section uniquely earns one (currently none planned).

### Shared

`lib/cn.ts` — Shadcn's standard `cn` utility (`clsx` + `tailwind-merge`).
`lib/mockData.ts` — all mocked numbers (metrics, ops/sec series, latency series, gauge values, histogram bins, table rows). One file for easy retuning.

## Sub-Page Passthrough

All twelve existing sub-page directories move into `public/`:

| URL | Source path after migration |
|---|---|
| `/about` | `public/about/index.html` |
| `/benchmarks` | `public/benchmarks/index.html` |
| `/blog` | `public/blog/index.html` |
| `/contact` | `public/contact/index.html` |
| `/docs` | `public/docs/index.html` |
| `/platform` | `public/platform/index.html` |
| `/privacy` | `public/privacy/index.html` |
| `/releases` | `public/releases/index.html` |
| `/reports` | `public/reports/index.html` |
| `/schemes` | `public/schemes/index.html` |
| `/security` | `public/security/index.html` |
| `/terms` | `public/terms/index.html` |

`static-page.css` and `design-mockups/` (containing `keystone_logo.png`) also move into `public/`.

Note on `docs/`: the existing top-level `docs/` directory contains BOTH the served `docs/index.html` AND internal `docs/superpowers/specs|plans/`. The migration moves only `docs/index.html` (and any same-directory served assets) into `public/docs/`. The `docs/superpowers/` subtree stays at the repo root and is excluded from any build output.

### Rewrites

Next.js does not implicitly serve `public/<slug>/index.html` at `/<slug>` (it serves it at `/<slug>/index.html`). Configure explicit rewrites in `next.config.ts`:

```ts
import type { NextConfig } from "next";

const SUB_PAGES = [
  "about", "benchmarks", "blog", "contact", "docs", "platform",
  "privacy", "releases", "reports", "schemes", "security", "terms",
] as const;

const config: NextConfig = {
  async rewrites() {
    return SUB_PAGES.flatMap((slug) => [
      { source: `/${slug}`, destination: `/${slug}/index.html` },
      { source: `/${slug}/`, destination: `/${slug}/index.html` },
    ]);
  },
};

export default config;
```

This preserves every existing URL exactly. No redirects, no link breakage.

## Testing

### Playwright

Replace `tests/responsive.spec.mjs` with a new `tests/landing.spec.mjs` covering the redesigned landing. Keep `tests/footer-pages.spec.mjs` unchanged.

`tests/landing.spec.mjs` scope:

- **Smoke** — page renders, no console errors, no broken images.
- **Nav** — clicking each nav link scrolls to the right section (Features / Benchmarks / Security / Download / Docs).
- **Hero CTAs** — primary "Download Keystone" anchors to `#download`; secondary "View Case Study →" is present and clickable.
- **Trust strip** — three pillar items visible, icons render.
- **Features grid** — 5 cards present at desktop; reflows to 2 columns at tablet, 1 at mobile.
- **Comparison section** — 4 grouped bar charts present; "Higher is better"/"Lower is better" annotations visible; values match `mockData.ts`.
- **Trust pillars** — 5 cards visible at desktop.
- **Download cards** — 3 cards visible; Windows button enabled (anchor href present), macOS and Linux buttons disabled and labeled "Coming soon" or visually attenuated.
- **Footer** — five columns visible at desktop; signup input present but stubbed (no network on submit).
- **Responsive** — pages at 360px, 768px, 1280px, 1600px viewports have no horizontal overflow.
- **Mockup** — window chrome traffic lights render; sidebar items render; metric strip shows 4 cards; ops chart bars present; gauge SVG present; line chart present; histogram present; table has 8 rows.

`playwright.config.mjs` runs the suite against `http://localhost:3000` (Next dev server), started by Playwright's `webServer` config (`npm run dev`).

### Type checking

`tsc --noEmit` must pass. Wire into `npm run typecheck`.

### Lint

`next lint` must pass. Wire into `npm run lint`.

## Deployment

### Vercel

- Replace `vercel.json` content with an empty `{}` or delete it entirely — Vercel auto-detects Next.js and uses the correct preset (build with `next build`, output `.next/`).
- No environment variables required this pass.
- The existing project on Vercel continues to work; first deploy on the new branch will switch the build runtime from "Other" to "Next.js" automatically.

### Performance budget

- Lighthouse desktop Performance ≥ 95 on `/`.
- LCP < 2.5s.
- CLS < 0.05 (mockup must not cause layout shift on load).
- Total page weight (excluding the hero mockup which is all DOM) target < 200KB JS + 50KB CSS gzipped. IBM Plex fonts loaded via `next/font` with `display: 'swap'` and subset to `latin`.

## Acceptance Criteria

- [ ] `npm run dev` serves the redesigned landing at `http://localhost:3000/` matching the reference.
- [ ] Every existing sub-page URL (`/about`, `/blog`, `/contact`, `/platform`, `/benchmarks`, `/schemes`, `/security`, `/privacy`, `/terms`, `/releases`, `/reports`, `/docs`) returns the same HTML content it did before the migration.
- [ ] `npm run build` succeeds with no warnings.
- [ ] `npm run typecheck` passes.
- [ ] `npm run lint` passes.
- [ ] `npx playwright test` passes (both `landing.spec.mjs` and `footer-pages.spec.mjs`).
- [ ] Visual fidelity at 1440×900 desktop matches the reference image within reasonable tolerance: dark surface, ambient glow, two-column hero, gradient "Observable." word, app mockup with all 7 sub-elements, 5-up features, 4-up comparison, 5-up trust pillars, 3-up download, multi-column footer.
- [ ] No horizontal scroll at 360px, 768px, 1024px, 1280px, 1600px.
- [ ] Vercel preview deploy serves the page with no console errors and no failed network requests.

## Out of Scope (Explicitly)

- Sub-page redesigns. They keep their current cream/blue static styling; the visual mismatch between the new dark landing and the old sub-pages is accepted and flagged for future passes.
- Working download backends for macOS/Linux (the Windows link points at the existing static checksum download).
- Newsletter submission backend.
- Animated/interactive charts. All chart data is static SVG.
- Light theme / theme toggle.
- Internationalization.
- Analytics integration.
- Image optimization beyond what `next/image` provides by default (mockup has no raster images).
- A real Keystone product screenshot — we render the dashboard ourselves.
- Adopting teal+violet as the official brand palette in the product app at `~/code/personal/keystone`. The product app still uses its amber-led palette; only the marketing landing uses the new teal+violet+dark scheme. This divergence is acknowledged and flagged for a future brand-alignment pass.

## Risks & Mitigations

| Risk | Likelihood | Mitigation |
|---|---|---|
| Sub-page rewrites break a URL pattern we didn't anticipate (e.g., a `/blog/post-1` slug) | Low | Existing sub-pages are all flat `/{slug}/index.html` — no nested routes. Tests cover all twelve. |
| Tailwind v4 + Shadcn integration friction (Shadcn defaults assume v3 in older docs) | Medium | Follow Shadcn's v4 setup guide; use the `@latest` CLI which targets v4 by default. If genuinely blocked, stop and revise the spec before quietly falling back — do not silently downgrade to v3. |
| Hero mockup at small viewports collapses awkwardly | Medium | Specced fallback: scale-transform the mockup as a single block below `md`. Verify in Playwright at 360/768. |
| Old `public/public/screenshots/` references in archived `index.html` cause stale links | Low | Old `index.html` is deleted; sub-pages don't reference these screenshots. |
| Visual mismatch between dark landing and cream sub-pages confuses users | Medium | Accept this pass. Add a banner or design-system bridge in a follow-up pass. Sub-page nav back to `/` is preserved. |
| Fonts (IBM Plex) failing to load in offline-first scenarios | Low | `next/font` self-hosts fonts at build; no external CDN dependency. |
| Vercel auto-detect picks the wrong framework | Low | Manually verify the project's framework preset is set to "Next.js" after the first build; document in the implementation plan. |

## Open Questions

- **GitHub repo URL.** All GitHub references currently point to `#` placeholders. If/when a real repo exists, swap these in. Not blocking.
- **Real release artifacts.** The Windows download button visually references the existing checksum from `parts.jsx`, but no real installer exists yet. Honest behavior is "Download .exe" anchors to a `#` placeholder rather than serving a stale file. To revisit when a real installer ships.

Implementation may surface micro-decisions (exact tick-mark count on gauge, exact histogram bin distribution) — those are aesthetic call-by-judgment during build.
