const input = document.getElementById('secretInput');
const preview = document.getElementById('secretPreview');
const button = document.getElementById('shredButton');
const sampleButton = document.getElementById('sampleButton');
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

const DEFAULT_SECRET = '“I waved back at someone who absolutely weren’t waving at me.”';
const SAMPLE_SECRETS = [
  '“I practised an argument in the shower and still lost it in real life.”',
  '“I accidentally sent the thumbs-up to a paragraph that deserved compassion.”',
  '“I said "love you" at the end of a work call and simply kept living.”',
  '“I checked whether my own message had been seen four times in ninety seconds.”',
  '“I laughed at a joke I did not understand because everyone else looked committed.”'
];

const MODES = {
  classic: {
    label: 'classic shred armed',
    status: 'Classic shred selected',
    running: 'Feeding the rollers',
    complete: 'Gone in elegant little strips',
    button: 'Send it through the rollers'
  },
  crosscut: {
    label: 'cross-cut armed',
    status: 'Cross-cut selected',
    running: 'Cross-cutting the evidence',
    complete: 'Reduced to suspiciously festive squares',
    button: 'Cross-cut this disaster'
  },
  incinerate: {
    label: 'incinerate armed',
    status: 'Incinerate selected',
    running: 'Applying dramatic fire',
    complete: 'Reduced to warm ash and poor choices',
    button: 'Burn it with ceremony'
  },
  yeet: {
    label: 'void launch armed',
    status: 'Void launch selected',
    running: 'Opening a tasteful little void',
    complete: 'Launched into the digital abyss',
    button: 'Yeet it into the void'
  }
};

let shredding = false;
let sampleIndex = 0;
let currentMode = 'classic';

function updatePreview(text) {
  preview.textContent = text.trim() || DEFAULT_SECRET;
}

function updateCount() {
  charCount.textContent = `${input.value.length} / 220`;
}

function setStatus(message) {
  machineStatus.textContent = message;
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
  for (let i = 0; i < 28; i += 1) {
    const bit = document.createElement('span');
    bit.style.left = `${8 + Math.random() * 84}%`;
    bit.style.top = `${148 + Math.random() * 42}px`;
    bit.style.animationDelay = `${Math.random() * 0.22}s`;
    const colorA = palette[Math.floor(Math.random() * palette.length)];
    const colorB = palette[Math.floor(Math.random() * palette.length)];
    bit.style.background = `linear-gradient(180deg, ${colorA}, ${colorB})`;
    confetti.appendChild(bit);
  }
}

function spawnPaperBurst(type = 'strip') {
  const amount = type === 'square' ? 12 : 10;
  for (let i = 0; i < amount; i += 1) {
    const burst = document.createElement('span');
    burst.className = 'paper-burst';
    burst.style.left = `${50 + (Math.random() - 0.5) * 10}%`;
    burst.style.background = type === 'square'
      ? 'linear-gradient(180deg, #fff5de, #e5cfaf)'
      : 'linear-gradient(180deg, #fffef5, #ecd9b6)';
    burst.style.width = type === 'square' ? '12px' : `${8 + Math.random() * 3}px`;
    burst.style.height = type === 'square' ? '12px' : `${34 + Math.random() * 18}px`;
    burst.style.borderRadius = type === 'square' ? '3px' : '999px';
    burst.style.animationDelay = `${Math.random() * 0.06}s`;
    burst.style.setProperty('--drift', `${(Math.random() - 0.5) * 90}px`);
    burst.style.setProperty('--rot', `${(Math.random() - 0.5) * 80}deg`);
    shredderCard.appendChild(burst);
    setTimeout(() => burst.remove(), 1000);
  }
}

function spawnStrips() {
  stripBed.innerHTML = '';
  for (let i = 0; i < 28; i += 1) {
    const strip = document.createElement('span');
    strip.className = 'strip';
    strip.style.left = `${6 + i * 3.25}%`;
    strip.style.animationDelay = `${Math.random() * 0.28}s`;
    strip.style.background = Math.random() > 0.35
      ? 'linear-gradient(180deg, #ff6b3d, #ffbf5f)'
      : 'linear-gradient(180deg, #fffef5, #e8d9c1)';
    stripBed.appendChild(strip);
  }
  spawnPaperBurst('strip');
}

function spawnSquares() {
  crosscutGrid.innerHTML = '';
  for (let i = 0; i < 42; i += 1) {
    const square = document.createElement('span');
    square.className = 'square';
    square.style.left = `${6 + Math.random() * 88}%`;
    square.style.top = `${Math.random() * 10}px`;
    square.style.animationDelay = `${Math.random() * 0.28}s`;
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

  for (let i = 0; i < 32; i += 1) {
    const ash = document.createElement('span');
    ash.className = 'ash';
    ash.style.left = `${10 + Math.random() * 80}%`;
    ash.style.top = `${Math.random() * 10}px`;
    ash.style.animationDelay = `${Math.random() * 0.22}s`;
    ash.style.setProperty('--drift', `${(Math.random() - 0.5) * 26}px`);
    ashBed.appendChild(ash);
  }

  for (let i = 0; i < 12; i += 1) {
    const spark = document.createElement('span');
    spark.className = 'spark';
    spark.style.left = `${18 + Math.random() * 64}%`;
    spark.style.bottom = '56px';
    spark.style.animationDelay = `${Math.random() * 0.12}s`;
    spark.style.setProperty('--drift', `${(Math.random() - 0.5) * 40}px`);
    voidBurst.appendChild(spark);
  }
}

function spawnVoid() {
  voidBurst.innerHTML = '';
  const ring = document.createElement('span');
  ring.className = 'void-ring';
  voidBurst.appendChild(ring);

  for (let i = 0; i < 18; i += 1) {
    const star = document.createElement('span');
    star.className = 'star';
    star.style.left = '50%';
    star.style.top = '44%';
    star.style.setProperty('--x', `${(Math.random() - 0.5) * 240}px`);
    star.style.setProperty('--y', `${(Math.random() - 0.5) * 140}px`);
    star.style.animationDelay = `${Math.random() * 0.1}s`;
    voidBurst.appendChild(star);
  }
}

function resetPaper() {
  paper.classList.remove('shredding-classic', 'shredding-crosscut', 'shredding-incinerate', 'shredding-yeet');
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
  shredderCard.classList.add('is-busy');
  void paper.offsetWidth;

  setStatus(MODES[currentMode].running);

  if (currentMode === 'classic') {
    paper.classList.add('shredding-classic');
    setTimeout(() => spawnStrips(), 260);
    setTimeout(() => spawnConfetti(['#ff6b3d', '#ffbf5f', '#fff0cf']), 620);
  }

  if (currentMode === 'crosscut') {
    paper.classList.add('shredding-crosscut');
    setTimeout(() => spawnSquares(), 250);
    setTimeout(() => spawnConfetti(['#ff6b3d', '#ffe5b0', '#ffffff']), 600);
  }

  if (currentMode === 'incinerate') {
    paper.classList.add('shredding-incinerate');
    setTimeout(() => spawnAsh(), 220);
    setTimeout(() => spawnConfetti(['#ff7a3d', '#ffd05c', '#fff4d3']), 640);
  }

  if (currentMode === 'yeet') {
    paper.classList.add('shredding-yeet');
    setTimeout(() => spawnVoid(), 140);
    setTimeout(() => spawnConfetti(['#8d7bff', '#cbc2ff', '#ffffff']), 480);
  }

  setTimeout(finishShred, 1950);
}

function loadSample() {
  sampleIndex = (sampleIndex + 1) % SAMPLE_SECRETS.length;
  input.value = SAMPLE_SECRETS[sampleIndex].replace(/[“”]/g, '');
  updatePreview(`“${input.value}”`);
  updateCount();
  setStatus('Fresh nonsense loaded');
}

button?.addEventListener('click', shred);
sampleButton?.addEventListener('click', loadSample);

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

launchForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  const email = launchForm.querySelector('input[name="email"]').value.trim();
  const category = launchForm.querySelector('select[name="category"]').value.trim();

  if (!email || !category) {
    formFeedback.textContent = 'Need an email and a category before the machine can act important.';
    formFeedback.className = 'form-note error';
    return;
  }

  formFeedback.textContent = `You’re on the list for ${category.toLowerCase()}. We’ll let you know when the machine opens.`;
  formFeedback.className = 'form-note success';
  launchForm.reset();
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
