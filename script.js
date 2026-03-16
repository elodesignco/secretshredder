const input = document.getElementById('secretInput');
const preview = document.getElementById('secretPreview');
const button = document.getElementById('shredButton');
const sampleButton = document.getElementById('sampleButton');
const checkoutButton = document.getElementById('checkoutButton');
const launchCheckoutButton = document.getElementById('launchCheckoutButton');
const launchSubmitButton = document.getElementById('launchSubmitButton');
const paper = document.getElementById('paper');
const confetti = document.getElementById('confetti');
const stripBed = document.getElementById('stripBed');
const ashBed = document.getElementById('ashBed');
const crosscutGrid = document.getElementById('crosscutGrid');
const voidBurst = document.getElementById('voidBurst');
const charCount = document.getElementById('charCount');
const machineStatus = document.getElementById('machineStatus');
const launchForm = document.getElementById('launchForm');
const formFeedback = document.getElementById('formFeedback');
const modeTabs = document.querySelectorAll('.mode-tab');
const machineFrame = document.querySelector('.machine-frame');
const shredderCard = document.getElementById('shredderCard');
const paperModeLabel = document.getElementById('paperModeLabel');
const siteBanner = document.getElementById('siteBanner');

const DEFAULT_SECRET = '“I waved back at someone who absolutely weren’t waving at me.”';
const SAMPLE_SECRETS = [
  '“I practised an argument in the shower and still lost it in real life.”',
  '“I accidentally sent the thumbs-up to a paragraph that deserved compassion.”',
  '“I said \"love you\" at the end of a work call and simply kept living.”',
  '“I checked whether my own message had been seen four times in ninety seconds.”',
  '“I laughed at a joke I did not understand because everyone else looked committed.”'
];

const MODES = {
  classic: {
    label: 'classic shred armed',
    status: 'Classic shred selected',
    running: 'Feeding the rollers',
    complete: 'Gone in elegant little strips',
    button: 'Send it through the rollers',
    cardState: 'is-classic'
  },
  crosscut: {
    label: 'cross-cut armed',
    status: 'Cross-cut selected',
    running: 'Cross-cutting the evidence',
    complete: 'Reduced to suspiciously festive squares',
    button: 'Cross-cut this disaster',
    cardState: 'is-crosscut'
  },
  incinerate: {
    label: 'incinerate armed',
    status: 'Incinerate selected',
    running: 'Applying dramatic fire',
    complete: 'Reduced to warm ash and poor choices',
    button: 'Burn it with ceremony',
    cardState: 'is-incinerate'
  },
  yeet: {
    label: 'void launch armed',
    status: 'Void launch selected',
    running: 'Opening a tasteful little void',
    complete: 'Launched into the digital abyss',
    button: 'Yeet it into the void',
    cardState: 'is-yeet'
  }
};

let shredding = false;
let sampleIndex = 0;
let currentMode = 'classic';
let runtimeConfig = {
  checkoutEnabled: true,
  waitlistEnabled: true
};

function updatePreview(text) {
  preview.textContent = text.trim() || DEFAULT_SECRET;
}

function updateCount() {
  charCount.textContent = `${input.value.length} / 220`;
}

function setStatus(message) {
  machineStatus.textContent = message;
}

function setBanner(message, type = 'info') {
  if (!siteBanner) return;
  if (!message) {
    siteBanner.hidden = true;
    siteBanner.textContent = '';
    siteBanner.className = 'site-banner wrap';
    return;
  }
  siteBanner.hidden = false;
  siteBanner.textContent = message;
  siteBanner.className = `site-banner wrap ${type}`;
}

function clearEffects() {
  confetti.innerHTML = '';
  stripBed.innerHTML = '';
  ashBed.innerHTML = '';
  crosscutGrid.innerHTML = '';
  voidBurst.innerHTML = '';
}

function spawnConfetti(palette = ['#ff6b3d', '#ffbf5f', '#fff0cf']) {
  confetti.innerHTML = '';
  for (let i = 0; i < 34; i += 1) {
    const bit = document.createElement('span');
    bit.style.left = `${8 + Math.random() * 84}%`;
    bit.style.top = `${172 + Math.random() * 36}px`;
    bit.style.animationDelay = `${Math.random() * 0.24}s`;
    bit.style.animationDuration = `${0.9 + Math.random() * 0.8}s`;
    const colorA = palette[Math.floor(Math.random() * palette.length)];
    const colorB = palette[Math.floor(Math.random() * palette.length)];
    bit.style.background = `linear-gradient(180deg, ${colorA}, ${colorB})`;
    confetti.appendChild(bit);
  }
}

function spawnPaperBurst(type = 'strip') {
  const amount = type === 'square' ? 16 : 12;
  for (let i = 0; i < amount; i += 1) {
    const burst = document.createElement('span');
    burst.className = 'paper-burst';
    burst.style.left = `${50 + (Math.random() - 0.5) * 16}%`;
    burst.style.top = `${172 + Math.random() * 18}px`;
    burst.style.background = type === 'square'
      ? 'linear-gradient(180deg, #fff5de, #e5cfaf)'
      : 'linear-gradient(180deg, #fffef5, #ecd9b6)';
    burst.style.width = type === 'square' ? '14px' : `${8 + Math.random() * 4}px`;
    burst.style.height = type === 'square' ? '14px' : `${48 + Math.random() * 22}px`;
    burst.style.borderRadius = type === 'square' ? '3px' : '999px';
    burst.style.animationDelay = `${Math.random() * 0.05}s`;
    burst.style.setProperty('--drift', `${(Math.random() - 0.5) * 110}px`);
    burst.style.setProperty('--rot', `${(Math.random() - 0.5) * 100}deg`);
    shredderCard.appendChild(burst);
    setTimeout(() => burst.remove(), 1100);
  }
}

function spawnStrips() {
  stripBed.innerHTML = '';
  for (let i = 0; i < 36; i += 1) {
    const strip = document.createElement('span');
    strip.className = 'strip';
    strip.style.left = `${4 + i * 2.55}%`;
    strip.style.animationDelay = `${Math.random() * 0.18}s`;
    strip.style.height = `${90 + Math.random() * 32}px`;
    strip.style.background = Math.random() > 0.35
      ? 'linear-gradient(180deg, #ff6b3d, #ffbf5f)'
      : 'linear-gradient(180deg, #fffef5, #e8d9c1)';
    stripBed.appendChild(strip);
  }
  spawnPaperBurst('strip');
}

function spawnSquares() {
  crosscutGrid.innerHTML = '';
  for (let i = 0; i < 58; i += 1) {
    const square = document.createElement('span');
    square.className = 'square';
    square.style.left = `${6 + Math.random() * 88}%`;
    square.style.top = `${Math.random() * 26}px`;
    square.style.animationDelay = `${Math.random() * 0.18}s`;
    square.style.background = Math.random() > 0.3
      ? 'linear-gradient(135deg, #ff6b3d, #ffbf5f)'
      : 'linear-gradient(135deg, #fff7df, #e8d9c1)';
    crosscutGrid.appendChild(square);
  }
  spawnPaperBurst('square');
}

function spawnAsh() {
  ashBed.innerHTML = '';
  voidBurst.innerHTML = '';

  for (let i = 0; i < 44; i += 1) {
    const ash = document.createElement('span');
    ash.className = 'ash';
    ash.style.left = `${10 + Math.random() * 80}%`;
    ash.style.top = `${Math.random() * 16}px`;
    ash.style.animationDelay = `${Math.random() * 0.16}s`;
    ash.style.setProperty('--drift', `${(Math.random() - 0.5) * 30}px`);
    ashBed.appendChild(ash);
  }

  for (let i = 0; i < 18; i += 1) {
    const spark = document.createElement('span');
    spark.className = 'spark';
    spark.style.left = `${18 + Math.random() * 64}%`;
    spark.style.bottom = '92px';
    spark.style.animationDelay = `${Math.random() * 0.12}s`;
    spark.style.setProperty('--drift', `${(Math.random() - 0.5) * 56}px`);
    voidBurst.appendChild(spark);
  }
}

function spawnVoid() {
  voidBurst.innerHTML = '';
  const ring = document.createElement('span');
  ring.className = 'void-ring';
  voidBurst.appendChild(ring);

  for (let i = 0; i < 24; i += 1) {
    const star = document.createElement('span');
    star.className = 'star';
    star.style.left = '50%';
    star.style.top = '42%';
    star.style.setProperty('--x', `${(Math.random() - 0.5) * 280}px`);
    star.style.setProperty('--y', `${(Math.random() - 0.5) * 180}px`);
    star.style.animationDelay = `${Math.random() * 0.12}s`;
    voidBurst.appendChild(star);
  }
}

function resetPaper() {
  paper.classList.remove('shredding-classic', 'shredding-crosscut', 'shredding-incinerate', 'shredding-yeet');
  shredderCard.classList.remove('is-classic', 'is-crosscut', 'is-incinerate', 'is-yeet');
}

function applyMode(mode) {
  currentMode = mode;
  modeTabs.forEach((tab) => {
    const active = tab.dataset.mode === mode;
    tab.classList.toggle('active', active);
    tab.setAttribute('aria-selected', String(active));
  });
  machineFrame.dataset.mode = mode;
  shredderCard.dataset.mode = mode;
  paperModeLabel.textContent = MODES[mode].label;
  button.textContent = MODES[mode].button;
  setStatus(MODES[mode].status);
}

function finishShred() {
  preview.textContent = MODES[currentMode].complete;
  setStatus('Ritual complete');
  resetPaper();
  shredderCard.classList.remove('is-busy');
  shredding = false;
}

function shred() {
  if (shredding) return;
  shredding = true;

  const text = input.value.trim() || DEFAULT_SECRET;
  updatePreview(text.startsWith('“') ? text : `“${text.replace(/[“”]/g, '')}”`);
  clearEffects();
  resetPaper();
  shredderCard.classList.add('is-busy', MODES[currentMode].cardState);
  void paper.offsetWidth;

  setStatus(MODES[currentMode].running);

  if (currentMode === 'classic') {
    paper.classList.add('shredding-classic');
    setTimeout(() => spawnStrips(), 140);
    setTimeout(() => spawnConfetti(['#ff6b3d', '#ffbf5f', '#fff0cf']), 420);
  }

  if (currentMode === 'crosscut') {
    paper.classList.add('shredding-crosscut');
    setTimeout(() => spawnSquares(), 120);
    setTimeout(() => spawnConfetti(['#ff6b3d', '#ffe5b0', '#ffffff']), 360);
  }

  if (currentMode === 'incinerate') {
    paper.classList.add('shredding-incinerate');
    setTimeout(() => spawnAsh(), 100);
    setTimeout(() => spawnConfetti(['#ff7a3d', '#ffd05c', '#fff4d3']), 380);
  }

  if (currentMode === 'yeet') {
    paper.classList.add('shredding-yeet');
    setTimeout(() => spawnVoid(), 40);
    setTimeout(() => spawnConfetti(['#8d7bff', '#cbc2ff', '#ffffff']), 280);
  }

  setTimeout(finishShred, 1800);
}

function loadSample() {
  sampleIndex = (sampleIndex + 1) % SAMPLE_SECRETS.length;
  input.value = SAMPLE_SECRETS[sampleIndex].replace(/[“”]/g, '');
  updatePreview(`“${input.value}”`);
  updateCount();
  setStatus('Fresh nonsense loaded');
}

function getReturnPath() {
  const path = window.location.pathname || '/';
  return path === '/' ? '/' : path.replace(/\/+$/, '') || '/';
}

function setButtonLoading(element, loadingText, originalText) {
  if (!element) return () => {};
  const previous = originalText || element.textContent;
  element.disabled = true;
  element.dataset.originalText = previous;
  element.textContent = loadingText;
  return () => {
    element.disabled = false;
    element.textContent = element.dataset.originalText || previous;
  };
}

async function callJson(url, payload) {
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(payload)
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok || data.ok === false) {
    throw new Error(data.error || 'Something went sideways.');
  }
  return data;
}

async function startCheckout(triggerButton) {
  if (!runtimeConfig.checkoutEnabled) {
    setBanner('Checkout is not available on this page right now. Please try again once payments are enabled for this environment.', 'error');
    return;
  }

  const release = setButtonLoading(triggerButton, 'Opening checkout…');
  try {
    const payload = {
      secretText: input.value.trim(),
      mode: currentMode,
      returnPath: getReturnPath()
    };
    const data = await callJson('/api/create-checkout-session', payload);
    window.location.href = data.url;
  } catch (error) {
    setBanner(error.message || 'Checkout could not be started.', 'error');
  } finally {
    release();
  }
}

async function submitLaunchForm(event) {
  event.preventDefault();

  if (!runtimeConfig.waitlistEnabled) {
    formFeedback.textContent = 'Early access sign-up is not available on this page right now. Please try again once the inbox is enabled for this environment.';
    formFeedback.className = 'form-note error';
    return;
  }

  const formData = new FormData(launchForm);
  const payload = {
    email: String(formData.get('email') || '').trim(),
    category: String(formData.get('category') || '').trim(),
    note: String(formData.get('note') || '').trim()
  };

  const release = setButtonLoading(launchSubmitButton, 'Joining…');
  formFeedback.textContent = 'Sending your details now…';
  formFeedback.className = 'form-note';

  try {
    const data = await callJson('/api/waitlist', payload);
    formFeedback.textContent = data.message;
    formFeedback.className = 'form-note success';
    launchForm.reset();
  } catch (error) {
    formFeedback.textContent = error.message || 'The sign-up could not be sent.';
    formFeedback.className = 'form-note error';
  } finally {
    release();
  }
}

function handleReturnState() {
  const params = new URLSearchParams(window.location.search);
  const state = params.get('checkout');
  if (!state) return;

  if (state === 'success') {
    setBanner('Payment received. Your first dramatic send-off is booked.', 'success');
  }

  if (state === 'cancelled') {
    setBanner('Checkout was cancelled. The machine remains patient.', 'info');
  }

  params.delete('checkout');
  const nextUrl = `${window.location.pathname}${params.toString() ? `?${params.toString()}` : ''}${window.location.hash}`;
  window.history.replaceState({}, '', nextUrl);
}

async function loadConfig() {
  try {
    const response = await fetch('/api/config');
    if (!response.ok) return;
    const data = await response.json();
    runtimeConfig = { ...runtimeConfig, ...data };
  } catch (_) {
    // Static fallback; buttons will still fail gracefully if API is absent.
  }
}

button?.addEventListener('click', shred);
sampleButton?.addEventListener('click', loadSample);
checkoutButton?.addEventListener('click', () => startCheckout(checkoutButton));
launchCheckoutButton?.addEventListener('click', () => startCheckout(launchCheckoutButton));
launchForm?.addEventListener('submit', submitLaunchForm);

modeTabs.forEach((tab) => {
  tab.addEventListener('click', () => {
    if (shredding) return;
    applyMode(tab.dataset.mode);
  });
});

input?.addEventListener('input', () => {
  const cleanValue = input.value.trim();
  updatePreview(cleanValue ? `“${cleanValue}”` : DEFAULT_SECRET);
  updateCount();
  setStatus(cleanValue ? 'Confession staged' : MODES[currentMode].status);
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));

updatePreview(DEFAULT_SECRET);
updateCount();
applyMode(currentMode);
handleReturnState();
loadConfig();
