# Keystone Landing

Keystone's public product landing and release-routing surface.

## What this repository contains

This repository contains Keystone's public product landing and release-routing
surface. It does not contain the private Keystone application source.

## Distribution boundary

Keystone application binaries are served through the first-party `/download`
route and separate artifact storage. GitHub Releases and generated source
archives are not distribution channels for the Keystone application.

## Release manifest

`content/releases/latest.json` is the single release truth object. The download
remains unavailable unless the manifest is valid, the separate artifact origin
is configured, and the external release verifier passes checksum, signing,
Gatekeeper, notarization/stapling, filename/version, minimum-macOS, and response
checks.

## Stack

- Next.js 15 (App Router) + React 19 + TypeScript
- Tailwind CSS v4 (CSS-first `@theme` tokens in [`app/globals.css`](app/globals.css))
- Shadcn-style primitives (Button, Card) under [`components/ui/`](components/ui)
- System San Francisco / `system-ui` font stack (no web-font download; native on macOS, iOS, Safari)
- Lucide icons
- Playwright for end-to-end tests

## Local development

```sh
npm install
npm run dev
npm run typecheck
npm run test:release
npm run test
npm run build
```

## Scripts

| Script | Purpose |
|---|---|
| `npm run dev` | Next dev server on `:3000` |
| `npm run build` | Production build |
| `npm run start` | Run the production build |
| `npm run lint` | Next's ESLint config |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run test:release` | Validate manifest and release-state gating |
| `npm run create:release-manifest` | Generate manifest facts from the verified DMG and tested macOS version |
| `npm run verify:release` | Verify checksum, signing, notarization, and live response |
| `npm test` | Playwright suite (boots `npm run dev` automatically) |

## Routing

- `/` → Next.js landing (App Router, [`app/page.tsx`](app/page.tsx))
- `/about`, `/blog`, `/contact`, `/platform`, `/benchmarks`, `/schemes`, `/security`, `/privacy`, `/terms`, `/releases`, `/reports`, `/docs` → static HTML in [`public/`](public), mapped via rewrites in [`next.config.ts`](next.config.ts). These remain on the previous design language until a future redesign pass.

## Deploy

Vercel auto-detects Next.js and applies the correct preset. A minimal `vercel.json` pins the framework explicitly.
