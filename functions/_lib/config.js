export function getBaseUrl(env, requestUrl) {
  return env.PUBLIC_SITE_URL || new URL(requestUrl).origin;
}

export function json(data, init = {}) {
  return new Response(JSON.stringify(data, null, 2), {
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
      ...(init.headers || {})
    },
    status: init.status || 200
  });
}

export function readJsonBody(request) {
  return request.json().catch(() => ({}));
}

export function required(value, label) {
  if (!value) {
    throw new Error(`${label} is not configured.`);
  }
  return value;
}

export function getStripePrice(env) {
  return env.STRIPE_PRICE_ID || '';
}

export function getProductName(env) {
  return env.PRODUCT_NAME || 'Secret Shredder';
}
