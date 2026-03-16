const BLOCKED_PATTERNS = [
  /\b(?:doxx?|address|phone number|email address|contact details)\b/i,
  /\b(?:kill|murder|threat|suicide|self-harm|rape|bomb|weapon)\b/i,
  /\b(?:revenge|blackmail|extort|illegal|crime)\b/i
];

export function isLikelySafeLowStakes(text = '') {
  const value = String(text || '').trim();
  if (!value) return true;
  return !BLOCKED_PATTERNS.some((pattern) => pattern.test(value));
}

export function sanitizeText(value = '', max = 280) {
  return String(value || '').replace(/\s+/g, ' ').trim().slice(0, max);
}

export async function sha256(text) {
  const encoded = new TextEncoder().encode(text);
  const hash = await crypto.subtle.digest('SHA-256', encoded);
  return [...new Uint8Array(hash)].map((byte) => byte.toString(16).padStart(2, '0')).join('');
}
