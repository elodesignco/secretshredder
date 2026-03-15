# Secret Shredder

Premium static launch site for **secretshredder.com**.

## What changed
This repo is now positioned as a launch-ready front-end rather than a rough prototype.

### Upgrades in this overhaul
- stronger premium/editorial landing page layout
- vertically centered desktop hero with cleaner hierarchy
- richer interactive shredding demo with strips, confetti, status states, and reveal motion
- upgraded mascot-style logo direction for future 3D/character development
- copy aligned to a real launch path: **Stripe API + Cloudflare Workers + Breevo/SMTP**
- launch form framed for real delivery instead of a fake placeholder feel
- improved FAQ, positioning, and architecture sections

## Recommended production architecture
### Front-end
- **Cloudflare Pages** for the static site

### Server-side endpoints
- **Cloudflare Workers** for:
  - `POST /api/launch` to validate waitlist form submissions
  - `POST /api/create-checkout-session` to create Stripe Checkout Sessions
  - optional moderation / PII filtering before allowing a paid shred

### Payments
- **Stripe API**
  - create Checkout Sessions server-side
  - use webhooks for confirmation and fulfilment events
  - expand later into bundles, upsells, coupons, and premium effects

### Email / forms
- **Breevo SMTP** (or equivalent SMTP provider)
  - send launch form notifications
  - optionally send subscriber confirmations
  - optionally relay into a CRM/list tool later

## Environment variables still needed for production
### Stripe
- `STRIPE_SECRET_KEY`
- `STRIPE_PRICE_ID`
- `STRIPE_WEBHOOK_SECRET`
- optional: `STRIPE_PUBLISHABLE_KEY`

### Breevo / SMTP
- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_USERNAME`
- `SMTP_PASSWORD`
- `SMTP_FROM_EMAIL`
- `LAUNCH_INBOX_EMAIL`

### App / Cloudflare
- `PUBLIC_SITE_URL`
- optional: `TURNSTILE_SECRET_KEY`
- optional: analytics / event tracking keys

## Local dev
Because this is static HTML/CSS/JS, you can run it with any simple local server.

```bash
cd /home/mark/.openclaw/workspace/secretshredder
python3 -m http.server 8080
```

Then open:
- `http://localhost:8080`

## Notes
- The current form is still demo-mode on the front-end until a Worker endpoint is added.
- The current shred interaction is front-end only; it does not store or process secrets server-side.
- Privacy/terms pages were upgraded, but still need final legal review before public launch.
