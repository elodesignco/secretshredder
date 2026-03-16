import { required } from './config.js';

export async function sendBrevoEmail({ env, subject, htmlContent, textContent, replyTo }) {
  const apiKey = required(env.BREVO_API_KEY, 'BREVO_API_KEY');
  const senderEmail = required(env.NOTIFY_FROM_EMAIL, 'NOTIFY_FROM_EMAIL');
  const senderName = env.NOTIFY_FROM_NAME || 'Secret Shredder';
  const destination = required(env.NOTIFY_TO_EMAIL, 'NOTIFY_TO_EMAIL');

  const response = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'api-key': apiKey,
      'content-type': 'application/json',
      accept: 'application/json'
    },
    body: JSON.stringify({
      sender: { email: senderEmail, name: senderName },
      to: [{ email: destination, name: senderName }],
      replyTo: replyTo ? { email: replyTo } : undefined,
      subject,
      htmlContent,
      textContent,
      tags: env.WAITLIST_EMAIL_TAG ? [env.WAITLIST_EMAIL_TAG] : undefined
    })
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data?.message || 'Brevo email send failed.');
  }

  return data;
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
    subject: env.WAITLIST_EMAIL_SUBJECT || 'New Secret Shredder early access signup',
    htmlContent,
    textContent,
    replyTo: payload.email
  });
}

export async function sendWaitlistAutoReply({ env, payload }) {
  const apiKey = env.BREVO_API_KEY;
  if (!apiKey || !env.NOTIFY_FROM_EMAIL) return null;

  const response = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'api-key': apiKey,
      'content-type': 'application/json',
      accept: 'application/json'
    },
    body: JSON.stringify({
      sender: { email: env.NOTIFY_FROM_EMAIL, name: env.NOTIFY_FROM_NAME || 'Secret Shredder' },
      to: [{ email: payload.email }],
      subject: env.LAUNCH_EMAIL_SUBJECT || 'You’re on the Secret Shredder early access list',
      htmlContent: `<p>You’re in. We’ll send a polite tap on the shoulder when the machine is ready.</p>`,
      textContent: `You’re in. We’ll send a polite tap on the shoulder when the machine is ready.`
    })
  });

  if (!response.ok) return null;
  return response.json().catch(() => null);
}
