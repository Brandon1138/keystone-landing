# Keystone Landing Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the Keystone static landing page around the approved brand-board direction and the full hidden-K logo asset.

**Architecture:** Keep the repo as a plain static HTML/Babel site. Use `index.html` for global CSS and script composition, `src/src/app.jsx` for top-level section ordering, `src/src/parts.jsx` for shared primitives, `src/src/sections.jsx` for page content, and `src/src/icons.jsx` for small line icons. Remove the production tweak runtime from the page.

**Tech Stack:** Static HTML, React 18 UMD, Babel standalone, CSS, Playwright.

---

### Task 1: Verify Current Failures

**Files:**
- Test: `tests/responsive.spec.mjs`

- [x] **Step 1: Run the existing Playwright suite**

Run: `npx playwright test tests/responsive.spec.mjs`
Expected: FAIL on current implementation for mobile/tablet overflow, checksum feedback, hidden-K glyph, and tweak runtime removal.

### Task 2: Rebuild Brand System And Shell

**Files:**
- Modify: `index.html`
- Modify: `src/src/app.jsx`
- Modify: `src/src/parts.jsx`

- [x] **Step 1: Remove tweak runtime from production**

Delete the `tweaks-panel.jsx` script tag from `index.html` and remove all `window.TweaksPanel` usage from `src/src/app.jsx`.

- [x] **Step 2: Set brand CSS variables**

Set `--accent: #2E5E91`, light-first surfaces, dark technical surfaces, responsive containers, and utility classes in `index.html`.

- [x] **Step 3: Build shared primitives**

Create shared `BrandMark`, `Nav`, `Btn`, `Section`, `SectionHeader`, `MetricStrip`, `LogoWordmark`, and checksum copy components in `src/src/parts.jsx`.

### Task 3: Rebuild Page Sections

**Files:**
- Modify: `src/src/sections.jsx`
- Modify: `src/src/icons.jsx`

- [x] **Step 1: Implement mockup-faithful section flow**

Build hero, metrics, core capabilities, evidence panel, trust/process, schemes, CTA, and footer using the full hidden-K logo asset and live product screenshots.

- [x] **Step 2: Preserve product proof**

Use the existing screenshot assets under `public/public/screenshots/` and keep algorithm/benchmark claims factual.

### Task 4: Verify And Iterate

**Files:**
- Test: `tests/responsive.spec.mjs`

- [x] **Step 1: Run Playwright**

Run: `npx playwright test tests/responsive.spec.mjs`
Expected: PASS.

- [x] **Step 2: Fix verification fallout**

If any test fails, adjust the implementation and rerun the full suite until it passes or a blocker is identified.
