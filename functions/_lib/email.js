import { required } from './config.js';

async function brevoJson(env, path, body) {
  const apiKey = required(env.BREVO_API_KEY, 'BREVO_API_KEY');
  const response = await fetch(`https://api.brevo.com${path}`, {
    method: 'POST',
    headers: {
      'api-key': apiKey,
      'content-type': 'application/json',
      accept: 'application/json'
    },
    body: JSON.stringify(body)
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data?.message || 'Brevo request failed.');
  }
  return data;
}

export async function sendBrevoEmail({ env, subject, htmlContent, textContent, replyTo, to }) {
  const senderEmail = required(env.NOTIFY_FROM_EMAIL, 'NOTIFY_FROM_EMAIL');
  const senderName = env.NOTIFY_FROM_NAME || 'Secret Shredder';
  const destination = to?.length ? to : [{ email: required(env.NOTIFY_TO_EMAIL, 'NOTIFY_TO_EMAIL'), name: senderName }];

  return brevoJson(env, '/v3/smtp/email', {
    sender: { email: senderEmail, name: senderName },
    to: destination,
    replyTo: replyTo ? { email: replyTo } : undefined,
    subject,
    htmlContent,
    textContent,
    tags: env.WAITLIST_EMAIL_TAG ? [env.WAITLIST_EMAIL_TAG] : undefined
  });
}

export async function upsertBrevoContact({ env, payload }) {
  const attributes = {
    CATEGORY: payload.category,
    SOURCE: payload.source || 'website',
    NOTE: payload.note || '',
    EMAIL_DIGEST: payload.emailDigest || ''
  };

  return brevoJson(env, '/v3/contacts', {
    email: payload.email,
    attributes,
    emailBlacklisted: false,
    smsBlacklisted: true,
    updateEnabled: true,
    listIds: env.BREVO_LIST_ID ? [Number(env.BREVO_LIST_ID)] : undefined
  });
}

export async function sendWaitlistNotification({ env, payload }) {
  const safeRows = [
    ['Email', payload.email],
    ['Category', payload.category],
    ['Note', payload.note || '—'],
    ['Source', payload.source || 'website'],
    ['Digest', payload.emailDigest || '—']
  ];

  const htmlContent = `
    <h2>New Secret Shredder early access signup</h2>
    <table cellpadding="8" cellspacing="0" border="0">
      ${safeRows.map(([label, value]) => `<tr><td><strong>${label}</strong></td><td>${value}</td></tr>`).join('')}
    </table>
  `;

  const textContent = safeRows.map(([label, value]) => `${label}: ${value}`).join('\n');

  return sendBrevoEmail({
    env,
    subject: env.WAITLIST_EMAIL_SUBJECT || 'New Secret Shredder email signup',
    htmlContent,
    textContent,
    replyTo: payload.email
  });
}

export async function sendWaitlistAutoReply({ env, payload }) {
  if (!env.BREVO_API_KEY || !env.NOTIFY_FROM_EMAIL) return null;

  return sendBrevoEmail({
    env,
    to: [{ email: payload.email }],
    subject: env.LAUNCH_EMAIL_SUBJECT || 'You’re on the Secret Shredder list',
    htmlContent: `<p>You’re in.</p><p>We’ll send occasional launch notes, product updates, and tasteful nonsense from Secret Shredder. You can unsubscribe anytime.</p>`,
    textContent: 'You’re in. We’ll send occasional launch notes, product updates, and tasteful nonsense from Secret Shredder. You can unsubscribe anytime.'
  }).catch(() => null);
}
