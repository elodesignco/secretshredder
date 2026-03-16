# Public vs Internal Guidance

## Public-facing copy may include
- the product story
- the ritual flow
- humour that helps people instantly get it
- clear boundaries around safe use
- launch messaging and sign-up prompts

## Public-facing copy must NOT include
- roadmap language
- implementation details
- payment/provider wiring notes
- internal debates
- placeholder disclaimers like "production should..."
- any copy clearly written for builders rather than customers

## Internal docs should hold
- architecture choices
- provider decisions
- moderation plans
- analytics ideas
- backlog items
- voice/brand reasoning
- legal TODOs

## Litmus test
If the sentence helps someone decide whether they want to use Secret Shredder, it may belong on the site.
If it helps someone build, debug, launch, or govern Secret Shredder, it belongs in docs.

## UI semantics
To avoid the current confusion:
- **Buttons** = solid or outlined controls with clear verbs
- **Badges** = small status labels only, never clickable unless explicitly styled as tabs
- **Tabs / mode chips** = grouped controls with active state and pointer affordance
- **Inline highlighted words** = use underline/highlight styling, not pill styling

Never use the same pill treatment for decorative copy and actual controls.

## Review checklist before shipping public copy
- Could a user mistake decorative text for a button?
- Is any builder/investor/roadmap language leaking onto the page?
- Is the joke still understandable with no explanation?
- Does the page still sound premium, not try-hard?
- Are safety boundaries plain and visible?
