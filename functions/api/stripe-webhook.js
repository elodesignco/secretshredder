import { json } from '../_lib/config.js';
import { verifyStripeWebhookSignature } from '../_lib/stripe.js';

export async function onRequestPost(context) {
  const secret = context.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    return json({ ok: false, error: 'STRIPE_WEBHOOK_SECRET is not configured.' }, { status: 500 });
  }

  const payload = await context.request.text();
  const signatureHeader = context.request.headers.get('stripe-signature') || '';
  const valid = await verifyStripeWebhookSignature({ payload, signatureHeader, secret });

  if (!valid) {
    return json({ ok: false, error: 'Invalid Stripe signature.' }, { status: 400 });
  }

  const event = JSON.parse(payload);

  switch (event.type) {
    case 'checkout.session.completed':
    case 'checkout.session.async_payment_succeeded':
    case 'checkout.session.expired':
      console.log('stripe-webhook', event.type, event.data?.object?.id || 'no-session-id');
      break;
    default:
      console.log('stripe-webhook-unhandled', event.type);
  }

  return json({ ok: true, received: true, type: event.type });
}
