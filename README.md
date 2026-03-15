# Secret Shredder

Static front-end concept for **secretshredder.com**.

## Stack
- Plain HTML/CSS/JS
- Static-host friendly
- Designed for Cloudflare Pages

## What this is
A fast-launch prototype for a novelty micro-product:
- user types a secret/regret/cringe memory
- pays a small amount (suggested: $2)
- watches it get shredded

## Current status
This repo currently includes:
- landing page
- logo + favicon assets
- animated shredder demo
- waitlist form placeholder
- positioning copy for launch

## Next integration steps
1. Connect repo to GitHub
2. Connect GitHub repo to Cloudflare Pages
3. Set custom domain `secretshredder.com`
4. Replace placeholder waitlist form with a real endpoint
5. Add Stripe payment link / checkout flow
6. Add privacy + terms pages
7. Add real post-payment shred flow

## Local dev
Open `index.html` directly, or use any simple static server.

Example:
```bash
python3 -m http.server 8080
```

## Suggested launch messaging
- Confess it. Shred it. Move on.
- A tiny internet ritual for bad decisions.
- Cheaper than therapy. Worse than prayer. Better than texting your ex.
