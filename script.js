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
  '“I said \"love you\" at the end of a work call and simply kept living.”',
  '“I checked whether my own message had been seen four times in ninety seconds.”',
  '“I laughed at a joke I did not understand because everyone else looked committed.”'
];

const MODES = {
  classic: {
    label: 'classic shred armed',
    status: 'Classic shred selected',
    complete: 'Gone in elegant little strips',
    button: 'Send it through the rollers'
  },
  crosscut: {
    label: 'cross-cut armed',
    status: 'Cross-cut selected',
    complete: 'Reduced to suspiciously festive squares',
    button: 'Cross-cut this disaster'
  },
  incinerate: {
    label: 'incinerate armed',
    status: 'Incinerate selected',
    complete: 'Reduced to warm ash and poor choices',
    button: 'Burn it with ceremony'
  },
  yeet: {
    label: 'void launch armed',
    status: 'Void launch selected',
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
    bit.style.top = `${138 + Math.random() * 36}px`;
    bit.style.animationDelay = `${Math.random() * 0.22}s`;
    const colorA = palette[Math.floor(Math.random() * palette.length)];
    const colorB = palette[Math.floor(Math.random() * palette.length)];
    bit.style.background = `linear-gradient(180deg, ${colorA}, ${colorB})`;
    confetti.appendChild(bit);
  }
}

function spawnStrips() {
  stripBed.innerHTML = '';
  for (let i = 0; i < 28; i += 1) {
    const strip = document.createElement('span');
    strip.className = 'strip';
    strip.style.left = `${6 + i * 3.25}%`;
    strip.style.animationDelay = `${Math.random() * 0.35}s`;
    strip.style.background = Math.random() > 0.35
      ? 'linear-gradient(180deg, #ff6b3d, #ffbf5f)'
      : 'linear-gradient(180deg, #fffef5, #e8d9c1)';
    stripBed.appendChild(strip);
  }
}

function spawnSquares() {
  crosscutGrid.innerHTML = '';
  for (let i = 0; i < 42; i += 1) {
    const square = document.createElement('span');
    square.className = 'square';
    square.style.left = `${6 + Math.random() * 88}%`;
    square.style.top = `${Math.random() * 8}px`;
    square.style.animationDelay = `${Math.random() * 0.28}s`;
    square.style.background = Math.random() > 0.3
      ? 'linear-gradient(135deg, #ff6b3d, #ffbf5f)'
      : 'linear-gradient(135deg, #fff7df, #e8d9c1)';
    crosscutGrid.appendChild(square);
  }
}

function spawnAsh() {
  ashBed.innerHTML = '';
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

function shred() {
  if (shredding) return;
  shredding = true;

  const text = input.value.trim() || DEFAULT_SECRET;
  updatePreview(text.startsWith('“') ? text : `“${text.replace(/[“”]/g, '')}”`);
  clearEffects();
  resetPaper();
  void paper.offsetWidth;

  if (currentMode === 'classic') {
    setStatus('Running classic shred');
    paper.classList.add('shredding-classic');
    spawnStrips();
    spawnConfetti(['#ff6b3d', '#ffbf5f', '#fff0cf']);
  }

  if (currentMode === 'crosscut') {
    setStatus('Cross-cutting the evidence');
    paper.classList.add('shredding-crosscut');
    spawnSquares();
    spawnConfetti(['#ff6b3d', '#ffe5b0', '#ffffff']);
  }

  if (currentMode === 'incinerate') {
    setStatus('Applying dramatic fire');
    paper.classList.add('shredding-incinerate');
    spawnAsh();
    spawnConfetti(['#ff7a3d', '#ffd05c', '#fff4d3']);
  }

  if (currentMode === 'yeet') {
    setStatus('Opening a small and tasteful void');
    paper.classList.add('shredding-yeet');
    spawnVoid();
    spawnConfetti(['#8d7bff', '#cbc2ff', '#ffffff']);
  }

  setTimeout(() => {
    preview.textContent = MODES[currentMode].complete;
    setStatus('Ritual complete');
    resetPaper();
    shredding = false;
  }, 1800);
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

  formFeedback.textContent = `Demo captured: ${email} is in for “${category}”. Wire this to a real endpoint before launch.`;
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
