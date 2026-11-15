# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repo is

`nextjs-web` is the Next.js 15 App Router marketing site + customer dashboard for Evenstamp (`@evenstamp/web`). It is a separate git repository inside the larger Evenstamp workspace; the Rust engine and SDK live in sibling directories (`../backend`, `../frontend-sdk`, `../wasm-core`). The parent `/Users/macos/Desktop/evenstamp.com/CLAUDE.md` documents the monorepo; this file covers the web app.

The web app is a **thin UI and proxy over the Rust engine**. Accounts, sites, subscriptions, usage, and sessions all live in the backend's SQLite database. There is no web-side database: do not add one.

## Commands

Run from this directory (Node >= 20; install dependencies from the workspace root with `npm ci`).

```bash
npm run dev        # http://127.0.0.1:3000
npm run build      # next build; works without a running backend
npm run start      # production server on :3000
npm run typecheck  # tsc --noEmit
```

This package has no test or lint script. Verification is `npm run typecheck` + `npm run build`; CI's `web` job only runs the workspace `npm ci` and `npm run build`. The Docker image (`Dockerfile`) is built from the **monorepo root** context and sets `NEXT_OUTPUT=standalone`.

## Environment

Next loads `.env`/`.env.local` automatically; there is no checked-in env template. Server-only variables:

- `RUST_BACKEND_INTERNAL_URL`: engine origin (default `http://127.0.0.1:8080`).
- `EVENSTAMP_INTERNAL_SECRET`: sent as `x-evenstamp-internal-secret`; must match backend `FP_INTERNAL_SECRET`. Required in Docker because the web container is not a loopback peer.
- `EVENSTAMP_APP_URL`: public origin for OAuth callbacks and checkout return URLs. Falls back to `NEXT_PUBLIC_APP_URL`, then `VERCEL_URL`, then `http://127.0.0.1:3000`.
- `EVENSTAMP_SNIPPET_ORIGIN`: origin shown in dashboard install snippets; defaults to `EVENSTAMP_APP_URL`. Set it when browsers can reach the engine directly.
- `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET`: Google OAuth; redirect URI is `${EVENSTAMP_APP_URL}/api/auth/google/callback`.
- `EVENSTAMP_TRUST_EDGE_HEADERS`, `EVENSTAMP_PROXY_SECRET`, `EVENSTAMP_EDGE_SECRET`: edge-header trust contract (see proxy section).
- `NEXT_PUBLIC_SITE_URL`: canonical/SEO base URL, default `https://evenstamp.com` (`lib/seo-schemas.ts`).

## Architecture

### Data flow and auth

- `src/lib/account.ts` is the single client for the engine's `/api/v1/account/*` API. It attaches the internal secret and the opaque `X-Evenstamp-Session` token read from the HttpOnly `es_session` cookie. `getMe()` is wrapped in React `cache()`; `requireUser()` redirects to `/login?next=…`. Add new account endpoints here rather than fetching the engine from components.
- Dashboard pages are async server components; mutations are `'use server'` actions in `src/app/dashboard/actions.ts` (create/delete site, start checkout), consumed by client components under `src/components/dashboard/` via `useActionState`. Checkout redirects to the provider's hosted page; activation arrives later through a webhook.
- `src/middleware.ts` only fast-path redirects `/dashboard/*` requests with no `es_session` cookie and marks proxied requests. It is **not** the authorization boundary: the dashboard layout calls `requireUser()`.
- The account routes must never be exposed at the public edge (the reference Nginx config 404s `/api/v1/account/`).

### Public engine proxies

`src/lib/engine-proxy.ts` implements the customer-facing proxies:

- `/api/v1/challenge` and `/api/v1/ingest` (`src/app/api/v1/*/route.ts`) are `nodejs`/`force-dynamic`, add wildcard CORS (the site key is public and requests are uncredentialed), cap bodies at 1 MiB, time out at 5 s, and forward to the engine.
- Upstream headers are built from a fixed allowlist (`CLIENT_HEADERS`, `WIRE_HEADERS`). Wire telemetry (`x-ja4-fingerprint`, `x-tcp-ttl`, TCP/TLS RTT, ASN, `x-forwarded-for`, …) is forwarded only when all three hold: `EVENSTAMP_TRUST_EDGE_HEADERS=true`, `EVENSTAMP_PROXY_SECRET` is set, and the incoming request carries a matching `EVENSTAMP_EDGE_SECRET`. Never enable trust without an edge that overwrites those headers.
- `/embed/v1.js` and `/sdk/v1.js` mirror the backend-served loader and SDK bundle for deployments where the engine is not directly reachable.

### OAuth and billing

- Google login is hand-rolled with PKCE in `src/app/api/auth/google/{start,callback}`, using short-lived state/verifier/next cookies. The callback exchanges the code, calls the engine's `/api/v1/account/session`, and sets `es_session`. `safeNextPath` only allows same-site paths. Sign-out (`/api/auth/signout`) deletes the engine session and the cookie.
- Billing webhooks (`/api/billing/webhooks/[provider]`) forward the **raw** body and signature headers (`x-timestamp`, `x-signature`, `x-nowpayments-sig`) to the engine; verification happens in Rust before parsing. Do not parse or re-encode the body here.

### Marketing site and SEO

- `src/lib/site-data.ts` is the content source of truth (`PRICING_TIERS`, `TECHNIQUES`, `COMPARISON_ROWS`, `FAQ_ITEMS`, `STATS`, nav links). `lib/seo-schemas.ts` derives JSON-LD from it. Pricing also appears in `src/app/pricing/page.tsx` (`TIER_MATRIX`, `PRICING_FAQ`) and in `BillingActions` feature lists: keep plan keys (`starter`, `growth`, `scale`) and numbers consistent with the backend.
- Every page defines its own `metadata` (canonical URL, OG/Twitter). Root layout injects Organization/WebSite/SoftwareApplication JSON-LD, the theme script, and the Umami analytics script; `lib/umami.ts` exposes `trackEvent` and buttons use `data-umami-event`.
- `robots.ts` disallows `/dashboard`, `/api/`, `/login`, `/embed/`, `/sdk/`; `sitemap.ts` lists `/`, `/pricing`, `/privacy`. Dashboard/login are `force-dynamic` and noindex.

### Live HUD and session findings

- `src/components/TelemetryHudClient.tsx` is a client component that runs browser probes from `src/lib/collectors/` (local copies kept for the site; they are **not** imported from `frontend-sdk` and have diverged: sync them when changing probe logic). It computes demo DeviceID/BrowserID hashes locally and pings `/api/v1/challenge` to show edge reachability. Its "VPN + Incognito" and "Anti-Detect Bot" modes are canned demo telemetry, not real engine verdicts.
- `src/lib/anomaly-dictionary.ts` maps backend finding codes to plain-English titles, severity, category, and explanations, and provides `getExecutiveVerdict`, `interpretBehavior`, and `interpretNetwork` used by the session detail page. New backend finding codes need entries here or they render as generic/unknown badges.

### Styling

- Tailwind (`tailwind.config.ts`) maps semantic classes (`bg-canvas`, `text-ink`, `border-hairline`, `bg-surface-1/2/3`, accent colors) to CSS variables defined for light/dark in `src/app/globals.css`. Dark mode uses both the `dark` class and `[data-theme="dark"]`.
- Reusable component classes (`.eyebrow`, `.card-feature`, `.button-primary`, `.text-input`, `.metric`, …) live in `globals.css`. Follow `DESIGN.md` tokens rather than raw colors.
- `ThemeProvider` + the inline `THEME_SCRIPT` in `app/layout.tsx` persist the theme in `localStorage` under `evenstamp-theme` and avoid a flash; keep the two in sync.

## Gotchas

- `next.config.mjs` sets global security headers and enables standalone output only when `NEXT_OUTPUT=standalone`. The Docker runtime expects `/app/nextjs-web/server.js` from that build.
- Keep `src/middleware.ts` free of Node-only imports; it runs in the Edge runtime.
- When adding a public route that calls the engine, route it through `engine-proxy.ts` so CORS, body limits, timeouts, and the header allowlist stay consistent.
- `ENGINE_URL` is duplicated in `lib/account.ts` and `lib/engine-proxy.ts`; changing the env handling means changing both.
- Client components must not receive `EVENSTAMP_INTERNAL_SECRET`, `EVENSTAMP_PROXY_SECRET`, or `EVENSTAMP_EDGE_SECRET`; only `NEXT_PUBLIC_*` values are safe in the browser.
