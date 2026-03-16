# /test staging page

## Purpose
`/test/` is a safe staging route that mirrors the current homepage experience without replacing the production root page.

It is intended for:
- proving out copy/layout tweaks
- testing the live-ish browser flow against the existing backend endpoints
- validating Stripe redirect behaviour from a non-root page
- checking that the public experience stays clean and customer-facing

## Route structure
- Production homepage: `/`
- Staging homepage: `/test/`

For Cloudflare Pages static hosting, this is implemented as a plain directory:
- `index.html`
- `test/index.html`

The `/test/` page reuses the shared root assets:
- `../styles.css`
- `../script.js`
- `../assets/*`
- same `/api/*` backend endpoints

## Behaviour
Both `/` and `/test/`:
- post launch form submissions to `/api/waitlist`
- start checkout via `/api/create-checkout-session`
- read runtime capability flags from `/api/config`

A small shared refactor now lets checkout include the current page path in the request payload, so Stripe success/cancel returns land back on the page that launched checkout.

Examples:
- checkout started from `/` returns to `/?checkout=success`
- checkout started from `/test/` returns to `/test/?checkout=success`

## Promotion path
If `/test/` becomes the preferred homepage version:
1. compare `test/index.html` against `index.html`
2. promote the approved HTML into root `index.html`
3. keep `/test/` as the next proving ground, or refresh it from the new root
4. verify both waitlist and checkout flows after promotion

## Guardrails
- keep public copy customer-facing; no builder/dev language on-page
- do not change backend endpoints unless both `/` and `/test/` still work
- do not hardcode environment-specific origins into the front-end
- if `PUBLIC_SITE_URL` is set, keep it aligned with the deployed origin so Stripe redirects remain correct
