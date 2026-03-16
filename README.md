# Secret Shredder

Secret Shredder is a polished marketing site and launch-ready interactive demo for a highly shareable product idea: drop in a harmless regret, pick a destruction style, and watch it die with unnecessary ceremony.

## Before touching public copy
Read:
- `docs/brand/VOICE.md`
- `docs/brand/PUBLIC_VS_INTERNAL.md`

Those docs define the product voice, humour limits, and the boundary between customer-facing language and internal builder notes.

## Repo structure
- `index.html` — public landing page + interactive demo + launch CTA
- `styles.css` — visual system, responsive layout, animation styles
- `script.js` — demo behaviour, launch form, checkout wiring, runtime states
- `functions/api/*` — Cloudflare Pages Functions / Worker-friendly backend endpoints
- `functions/_lib/*` — shared backend helpers
- `privacy.html` — privacy page
- `terms.html` — terms page
- `docs/brand/*` — internal voice and publishing guidance
- `docs/ENVIRONMENT.md` — env contract
- `docs/IMPLEMENTATION.md` — backend and flow notes
- `ACTIONS.md` — internal next steps / implementation notes

## Product principles
- The destruction moment is the product.
- Public copy should feel premium, funny, and instantly understandable.
- Controls, badges, and decorative labels must be visually distinct.
- Safety copy should be clear and non-performative.
- The site should feel good in screenshots, clips, and screen recordings.

## Local dev
```bash
cd /home/mark/.openclaw/workspace/secretshredder
npm install
npm run dev
```

## Current state
This repo now includes:
- a Cloudflare-friendly Stripe Checkout session endpoint
- a waitlist submission endpoint that uses Brevo's HTTP API
- a Stripe webhook verification endpoint
- front-end wiring for paid CTA + launch form
- improved shred animation and machine UI states

## Credentials still needed
- Stripe keys + price ID
- Stripe webhook secret
- Brevo API key
- sender / destination email values
