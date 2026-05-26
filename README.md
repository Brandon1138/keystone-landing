# Keystone Landing

The marketing landing for Keystone, a desktop workbench for benchmarking classical and post-quantum cryptography.

## Stack

- Next.js 15 (App Router) + React 19 + TypeScript
- Tailwind CSS v4 (CSS-first `@theme` tokens in [`app/globals.css`](app/globals.css))
- Shadcn-style primitives (Button, Card) under [`components/ui/`](components/ui)
- IBM Plex Sans / Plex Mono via `next/font`
- Lucide icons
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
| `npm run dev` | Next dev server on `:3000` |
| `npm run build` | Production build |
| `npm run start` | Run the production build |
| `npm run lint` | Next's ESLint config |
| `npm run typecheck` | `tsc --noEmit` |
| `npm test` | Playwright suite (boots `npm run dev` automatically) |

## Routing

- `/` → Next.js landing (App Router, [`app/page.tsx`](app/page.tsx))
- `/about`, `/blog`, `/contact`, `/platform`, `/benchmarks`, `/schemes`, `/security`, `/privacy`, `/terms`, `/releases`, `/reports`, `/docs` → static HTML in [`public/`](public), mapped via rewrites in [`next.config.ts`](next.config.ts). These remain on the previous design language until a future redesign pass.

## Deploy

Vercel auto-detects Next.js and uses the correct preset. No `vercel.json` is needed.
