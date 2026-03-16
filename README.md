# Secret Shredder

Secret Shredder is a polished static marketing/demo site for a highly shareable product idea: drop in a harmless regret, pick a destruction style, and watch it die with unnecessary ceremony.

## Before touching public copy
Read:
- `docs/brand/VOICE.md`
- `docs/brand/PUBLIC_VS_INTERNAL.md`

Those docs define the product voice, humour limits, and the boundary between customer-facing language and internal builder notes.

## Repo structure
- `index.html` — public landing page + interactive demo
- `styles.css` — visual system, responsive layout, animation styles
- `script.js` — demo behaviour, mode switching, waitlist form feedback
- `privacy.html` — plain-language draft privacy page
- `terms.html` — plain-language draft terms page
- `docs/brand/*` — internal voice and publishing guidance
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
python3 -m http.server 8080
```

Open `http://localhost:8080`.

## Current state
This repo is still front-end only. The waitlist form and shred ritual are demo interactions until server-side endpoints exist.

## Suggested production follow-up
Keep this out of the public site and in docs/issues:
- waitlist API endpoint
- payment flow
- abuse prevention / moderation
- final legal review
