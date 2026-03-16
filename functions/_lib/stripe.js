import { getBaseUrl, getProductName, getStripePrice, required } from './config.js';

function buildMetadata(payload = {}) {
  const metadata = {};
  Object.entries(payload).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      metadata[key] = String(value).slice(0, 500);
    }
  });
  return metadata;
}

function normalizeReturnPath(value = '/') {
  const raw = String(value || '/').trim();
  if (!raw.startsWith('/')) return '/';
  if (raw.startsWith('//')) return '/';
  return raw === '/' ? '/' : raw.replace(/\/+$/, '') || '/';
}

export async function createCheckoutSession({ env, requestUrl, secretText, mode, returnPath }) {
  const stripeSecretKey = required(env.STRIPE_SECRET_KEY, 'STRIPE_SECRET_KEY');
  const stripePriceId = required(getStripePrice(env), 'STRIPE_PRICE_ID');
  const baseUrl = getBaseUrl(env, requestUrl);
  const safeReturnPath = normalizeReturnPath(returnPath);

  const params = new URLSearchParams();
  params.set('mode', env.STRIPE_MODE || 'payment');
  params.set('success_url', `${baseUrl}${safeReturnPath}?checkout=success`);
  params.set('cancel_url', `${baseUrl}${safeReturnPath}?checkout=cancelled`);
  params.set('line_items[0][price]', stripePriceId);
  params.set('line_items[0][quantity]', '1');
  params.set('allow_promotion_codes', 'true');
  params.set('billing_address_collection', 'auto');
  params.set('submit_type', 'pay');

  const metadata = buildMetadata({
    product: getProductName(env),
    mode,
    preview: String(secretText || '').slice(0, 120)
  });

  Object.entries(metadata).forEach(([key, value]) => {
    params.set(`metadata[${key}]`, value);
  });

  const response = await fetch('https://api.stripe.com/v1/checkout/sessions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${stripeSecretKey}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: params
  });

  const data = await response.json();

  if (!response.ok) {
    const message = data?.error?.message || 'Stripe could not start checkout.';
    throw new Error(message);
  }

  return data;
}

function parseStripeSignature(header = '') {
  const entries = header.split(',').map((part) => part.trim());
  const parsed = {};
  entries.forEach((entry) => {
    const [key, value] = entry.split('=');
    if (key && value) parsed[key] = value;
  });
  return parsed;
}

async function computeHmac(secret, payload) {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(payload));
  return [...new Uint8Array(sig)].map((byte) => byte.toString(16).padStart(2, '0')).join('');
}

export async function verifyStripeWebhookSignature({ payload, signatureHeader, secret }) {
  const parsed = parseStripeSignature(signatureHeader);
  if (!parsed.t || !parsed.v1) return false;
  const signedPayload = `${parsed.t}.${payload}`;
  const expected = await computeHmac(secret, signedPayload);
  return expected === parsed.v1;
}
