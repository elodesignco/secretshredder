import { json, readJsonBody } from '../_lib/config.js';
import { sendWaitlistAutoReply, sendWaitlistNotification } from '../_lib/email.js';
import { isLikelySafeLowStakes, sanitizeText, sha256 } from '../_lib/security.js';

function isEmail(value = '') {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value).trim());
}

export async function onRequestPost(context) {
  try {
    const body = await readJsonBody(context.request);
    const email = sanitizeText(body.email || '', 160).toLowerCase();
    const category = sanitizeText(body.category || '', 80);
    const note = sanitizeText(body.note || '', 160);

    if (!isEmail(email)) {
      return json({ ok: false, error: 'Please use a real email address.' }, { status: 400 });
    }

    if (!category) {
      return json({ ok: false, error: 'Pick what you’d use the machine for first.' }, { status: 400 });
    }

    if (note && !isLikelySafeLowStakes(note)) {
      return json({ ok: false, error: 'Keep the optional note harmless and non-identifying.' }, { status: 400 });
    }

    const payload = {
      email,
      category,
      note,
      source: 'website-launch-form',
      emailDigest: await sha256(email)
    };

    await sendWaitlistNotification({ env: context.env, payload });
    await sendWaitlistAutoReply({ env: context.env, payload });

    return json({
      ok: true,
      message: 'You’re on the list. We’ll send a polite tap on the shoulder when the machine opens.'
    });
  } catch (error) {
    return json({ ok: false, error: error.message || 'The sign-up could not be sent.' }, { status: 500 });
  }
}
