# Secret Shredder implementation notes

## What is now wired

### Front-end
- Demo shred interaction with redesigned mode controls and more obvious animation states
- Launch form posts to `/api/waitlist`
- Paid CTA posts to `/api/create-checkout-session`
- Separate free demo vs paid shred UI with honest CTA labels
- Stripe return verification via `session_id` lookup before paid access is unlocked
- Session-scoped paid access on the front-end after successful verification
- Friendly inline UI states for loading, success, and failure

### Cloudflare-friendly backend
Implemented with Cloudflare Pages Functions / Workers-compatible request handlers:
- `functions/api/config.js` — exposes safe runtime capability flags to the front-end
- `functions/api/create-checkout-session.js` — creates a Stripe Checkout session via Stripe's REST API
- `functions/api/waitlist.js` — validates signups, upserts them into Brevo, and sends the operator/user email flows
- `functions/api/checkout-status.js` — verifies a Stripe Checkout return by looking up the session server-side
- `functions/api/stripe-webhook.js` — verifies webhook signatures and provides the event handling entrypoint
- `functions/_lib/*` — shared config, Stripe, email, and safety helpers

## Architecture choices

### Why Pages Functions
The repo started as a static landing page. Cloudflare Pages Functions let the site stay mostly static while adding server-side endpoints without moving to a heavier app framework.

### Why Stripe via direct REST calls
This keeps the worker lightweight and avoids depending on a Node-only runtime path. Checkout session creation is a simple form-encoded POST to Stripe's API.

### Why Brevo API instead of SMTP in Workers
Direct SMTP is awkward inside edge runtimes. For Cloudflare deployment, the reliable path is Brevo's HTTP API. SMTP-compatible variables are still documented in `.env.example` so the contract stays portable if the product later adds a Node server or a background job outside Workers.

## Data handling stance
- Do not store the secret text in local files or public logs
- Only a short preview is passed to Stripe metadata, capped tightly for support/debug context
- Waitlist notifications include email, selected category, optional note, and a SHA-256 digest of the email for operator reference
- The front-end and API both steer users away from names, threats, doxxing, and genuinely harmful content

## Stripe flow
1. Front-end calls `/api/create-checkout-session`
2. Front-end includes the current page path so the return lands back on the page that launched checkout
3. Worker validates the payload and creates a Checkout session
4. Browser redirects to Stripe Checkout
5. Stripe returns to the originating page with `checkout=success&session_id=...`
6. Front-end calls `/api/checkout-status?session_id=...`
7. Worker looks up the Checkout session server-side and only unlocks the paid shred when Stripe reports a paid/complete session
8. Stripe webhook posts to `/api/stripe-webhook`
9. Webhook signature is verified before any event handling

## Waitlist flow
1. Front-end calls `/api/waitlist`
2. Worker validates email/category/note
3. Worker sends internal notification email via Brevo API
4. Worker optionally sends a simple auto-reply to the user
5. Front-end shows a friendly success or failure message

## Deployment steps
1. Install deps:
   ```bash
   npm install
   ```
2. Set local env in `.env.local` for local testing.
3. For Cloudflare Pages / Workers, set secrets:
   ```bash
   wrangler secret put STRIPE_SECRET_KEY
   wrangler secret put STRIPE_WEBHOOK_SECRET
   wrangler secret put BREVO_API_KEY
   ```
4. Set non-secret vars in Cloudflare dashboard or `wrangler.toml`.
5. Create a Stripe product/price and put the `STRIPE_PRICE_ID` in the environment.
6. Point Stripe webhook endpoint at:
   ```
   https://secretshredder.com/api/stripe-webhook
   ```
7. Listen for at least:
   - `checkout.session.completed`
   - `checkout.session.async_payment_succeeded`
   - `checkout.session.expired`

## Remaining credentials / operator work
- Real Stripe live/test keys
- A real `STRIPE_PRICE_ID`
- `STRIPE_WEBHOOK_SECRET` from Stripe
- `BREVO_API_KEY`
- sender + destination mailbox values (`NOTIFY_FROM_EMAIL`, `NOTIFY_TO_EMAIL`)

## Recommended next production step
Add durable persistence for paid orders / early-access entries if the business needs a dashboard, CRM sync, or resend protection. Right now the wiring is good for launch-day notifications and checkout initiation, but not a full admin system.
s and checkout initiation, but not a full admin system.
