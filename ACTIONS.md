# Secret Shredder — internal next actions

## Launch-critical
- Add live Stripe and Brevo credentials in Cloudflare
- Create the first Stripe product/price and connect webhook delivery
- Smoke-test checkout and waitlist against the deployed domain
- Decide whether paid shreds need persistence, fulfilment, or customer receipts beyond Stripe

## Product / ops follow-up
- Add rate limiting / abuse controls before public launch
- Decide whether waitlist signups should also write to a CRM, sheet, or database
- Add replay-safe webhook event handling if fulfilment logic grows
- Consider a minimal operator dashboard only if launch traction justifies it

## Design follow-up
- Record a couple of polished launch clips/GIFs from the stronger animation pass
- Consider subtle sound design / haptics for mobile
- Explore a post-checkout paid shred experience that feels more ceremonial than the free demo

## Policy follow-up
- Final legal review for privacy/terms
- Confirm prohibited-content handling escalation path
- Decide support/contact path for launch
