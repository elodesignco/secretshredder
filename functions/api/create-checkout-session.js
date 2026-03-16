import { json, readJsonBody } from '../_lib/config.js';
import { isLikelySafeLowStakes, sanitizeText } from '../_lib/security.js';
import { createCheckoutSession } from '../_lib/stripe.js';

export async function onRequestPost(context) {
  try {
    const body = await readJsonBody(context.request);
    const secretText = sanitizeText(body.secretText || '', 220);
    const mode = sanitizeText(body.mode || 'classic', 24) || 'classic';

    if (secretText && !isLikelySafeLowStakes(secretText)) {
      return json({ ok: false, error: 'That one looks a bit too real-world spicy for the machine. Keep it harmless and non-identifying.' }, { status: 400 });
    }

    const session = await createCheckoutSession({
      env: context.env,
      requestUrl: context.request.url,
      secretText,
      mode
    });

    return json({
      ok: true,
      id: session.id,
      url: session.url
    });
  } catch (error) {
    return json({ ok: false, error: error.message || 'Checkout could not be started.' }, { status: 500 });
  }
}
