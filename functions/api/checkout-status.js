import { json } from '../_lib/config.js';
import { fetchCheckoutSession } from '../_lib/stripe.js';

export async function onRequestGet(context) {
  try {
    const url = new URL(context.request.url);
    const sessionId = url.searchParams.get('session_id') || '';
    const session = await fetchCheckoutSession({ env: context.env, sessionId });
    const paid = session.payment_status === 'paid' || session.status === 'complete';

    return json({
      ok: true,
      sessionId: session.id,
      status: session.status,
      paymentStatus: session.payment_status,
      paid
    });
  } catch (error) {
    return json({ ok: false, error: error.message || 'Checkout status could not be checked.' }, { status: 500 });
  }
}
