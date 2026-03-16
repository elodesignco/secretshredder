# Secret Shredder environment contract

## Public / app config
| Variable | Required | Purpose |
| --- | --- | --- |
| `PUBLIC_SITE_URL` | yes | Canonical site origin used for Stripe redirects |
| `PRODUCT_NAME` | no | Product label used in operator-facing metadata |
| `DEFAULT_CURRENCY` | no | Reserved for future pricing display / multi-currency use |
| `STRIPE_MODE` | no | Stripe Checkout mode, default `payment` |
| `WAITLIST_EMAIL_SUBJECT` | no | Internal notification subject |
| `WAITLIST_EMAIL_TAG` | no | Brevo tag for waitlist notification emails |
| `LAUNCH_EMAIL_SUBJECT` | no | Auto-reply subject to the user |

## Stripe
| Variable | Required | Purpose |
| --- | --- | --- |
| `STRIPE_SECRET_KEY` | yes for payments | Server-side key used to create Checkout sessions |
| `STRIPE_PUBLISHABLE_KEY` | optional right now | Reserved for future client-side Stripe features |
| `STRIPE_WEBHOOK_SECRET` | yes for webhook verification | Validates incoming Stripe webhook payloads |
| `STRIPE_PRICE_ID` | yes for payments | Checkout line item price |
| `STRIPE_PRODUCT_ID` | optional | Operator reference only |

## Brevo / launch emails
| Variable | Required | Purpose |
| --- | --- | --- |
| `BREVO_API_KEY` | yes for launch form | Used for Brevo contact sync and email sends |
| `BREVO_LIST_ID` | optional | Brevo list to add marketing signups into |
| `NOTIFY_FROM_EMAIL` | yes | Sender mailbox |
| `NOTIFY_FROM_NAME` | no | Sender display name |
| `NOTIFY_TO_EMAIL` | yes | Internal destination for waitlist notifications |
| `SMTP_HOST` | optional | Portability reference for non-worker SMTP environments |
| `SMTP_PORT` | optional | Portability reference for non-worker SMTP environments |
| `SMTP_USERNAME` | optional | Portability reference for non-worker SMTP environments |
| `SMTP_PASSWORD` | optional | Portability reference for non-worker SMTP environments |
| `SMTP_FROM_EMAIL` | optional | Portability reference / parity |
| `SMTP_FROM_NAME` | optional | Portability reference / parity |
| `SMTP_REPLY_TO` | optional | Portability reference / parity |

## Where values should live
### Local dev
- `.env.local` for real local values
- `.env.example` for the safe committed contract

### Cloudflare
- put secrets in Cloudflare secrets
- put safe defaults/non-secret vars in Pages project vars or `wrangler.toml`

## Notes
- Do not commit real keys
- Keep `PUBLIC_SITE_URL` aligned with the deployed origin
- If using Stripe test mode locally, keep all Stripe values from the same mode
- Brevo HTTP API is the edge-native send path; SMTP values are documented for parity with future non-edge services
