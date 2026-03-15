# Secret Shredder — implementation plan and next actions

## Audit summary
The original repo had a solid static prototype foundation but still felt like a concept page:
- copy still referenced Payment Links instead of the desired Stripe API path
- form behaviour was explicitly placeholder-level
- layout was good, but not premium/editorial enough for launch or media clips
- animation worked, but the shredding moment lacked standout character
- legal pages were placeholders only
- branding was clean but not yet mascot/character-driven

## What this overhaul implemented
### Front-end
- rebuilt the homepage around a more polished, center-aligned, launch-ready hero
- upgraded the visual system with deeper glass panels, glow, premium typography, and better spacing
- reframed the product as a paid ritual, not a vague gimmick

### Motion / interaction
- expanded the shredder demo with:
  - machine status states
  - rotating sample confessions
  - animated paper strips
  - confetti burst
  - section reveal motion
- improved microcopy during interaction so the demo feels productised

### Brand direction
- replaced the mark with a stronger character/machine direction
- pushed the logo toward a future 3D mascot treatment rather than a generic utility icon

### Launch architecture messaging
- updated the entire site to align with:
  - **Stripe API from day one**
  - **SMTP/Breevo-backed forms from day one**
  - **Cloudflare Pages + Workers** as the preferred deployment shape

### Documentation
- updated README with env vars and production architecture
- upgraded privacy/terms pages from bare placeholders to more realistic launch-stage drafts

## Still needed before true production launch
### Credentials / secrets
- Stripe secret key, price ID, and webhook secret
- Breevo/SMTP host, port, username, password, from email
- destination inbox for launch submissions
- public site URL / Cloudflare environment config

### Engineering follow-up
- build a Cloudflare Worker for `/api/launch`
- build a Cloudflare Worker for `/api/create-checkout-session`
- wire Stripe webhook handling
- optionally add Turnstile / abuse prevention
- optionally add a lightweight moderation or PII warning pass

### Business / policy follow-up
- finalise legal copy with a proper privacy policy and terms review
- decide exact price point and currency logic
- decide whether secrets are transient-only, session-only, or stored briefly for fulfilment/audit
- define prohibited content boundaries clearly

## Recommended order from here
1. deploy updated front-end to Cloudflare Pages
2. add Worker endpoint for launch form + Breevo SMTP
3. add Worker endpoint for Stripe Checkout Session creation
4. connect Stripe webhook flow
5. test full paid shred funnel on the live domain
6. create short launch clips from the new shred demo and brand mark
