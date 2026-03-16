import { getBaseUrl, getProductName, json } from '../_lib/config.js';

export async function onRequestGet(context) {
  const { env, request } = context;

  return json({
    ok: true,
    product: getProductName(env),
    baseUrl: getBaseUrl(env, request.url),
    checkoutEnabled: Boolean(env.STRIPE_SECRET_KEY && env.STRIPE_PRICE_ID),
    waitlistEnabled: Boolean(env.BREVO_API_KEY && env.NOTIFY_FROM_EMAIL && env.NOTIFY_TO_EMAIL),
    publishableKeyPresent: Boolean(env.STRIPE_PUBLISHABLE_KEY),
    modeLabels: {
      classic: 'Classic shred',
      crosscut: 'Cross-cut',
      incinerate: 'Incinerate',
      yeet: 'Yeet to void'
    }
  });
}
