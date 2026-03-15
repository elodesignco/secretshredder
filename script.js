const input = document.getElementById('secretInput');
const preview = document.getElementById('secret-preview');
const button = document.getElementById('shredButton');
const sampleButton = document.getElementById('sampleButton');
const paper = document.getElementById('paper');
const confetti = document.getElementById('confetti');
const stripBed = document.getElementById('stripBed');
const charCount = document.getElementById('charCount');
const machineStatus = document.getElementById('machineStatus');
const launchForm = document.getElementById('launchForm');
const formFeedback = document.getElementById('formFeedback');

const DEFAULT_SECRET = '“I waved back at someone who absolutely wasn’t waving at me.”';
const SAMPLE_SECRETS = [
  '“I practised an argument in the shower and still lost it in real life.”',
  '“I accidentally sent the thumbs-up to a paragraph that deserved compassion.”',
  '“I said ‘love you’ at the end of a work call and simply kept living.”',
  '“I checked whether my own message had been seen four times in ninety seconds.”',
  '“I laughed at a joke I did not understand because everyone else looked committed.”'
];

let shredding = false;
let sampleIndex = 0;

function updatePreview(text) {
  preview.textContent = text.trim() || DEFAULT_SECRET;
}

function updateCount() {
  charCount.textContent = `${input.value.length} / 220`;
}

function setStatus(message) {
  machineStatus.textContent = message;
}

function spawnConfetti() {
  confetti.innerHTML = '';
  for (let i = 0; i < 34; i += 1) {
    const bit = document.createElement('span');
    bit.style.left = `${8 + Math.random() * 84}%`;
    bit.style.top = `${138 + Math.random() * 26}px`;
    bit.style.animationDelay = `${Math.random() * 0.22}s`;
    bit.style.background = Math.random() > 0.45
      ? 'linear-gradient(180deg, #ff6b3d, #ffbf5f)'
      : 'linear-gradient(180deg, #fff0cf, #ffffff)';
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

function shred() {
  if (shredding) return;
  shredding = true;

  const text = input.value.trim() || DEFAULT_SECRET;
  updatePreview(text);
  setStatus('Destroying confession');

  paper.classList.remove('shredding');
  confetti.innerHTML = '';
  stripBed.innerHTML = '';
  void paper.offsetWidth;
  paper.classList.add('shredding');
  spawnConfetti();
  spawnStrips();

  setTimeout(() => {
    preview.textContent = 'Shredded. Spiritually, socially, and with unnecessary production value.';
    setStatus('Confession destroyed');
    paper.classList.remove('shredding');
    shredding = false;
  }, 1750);
}

function loadSample() {
  sampleIndex = (sampleIndex + 1) % SAMPLE_SECRETS.length;
  input.value = SAMPLE_SECRETS[sampleIndex].replace(/[“”]/g, '');
  updatePreview(`“${input.value}”`);
  updateCount();
  setStatus('Sample loaded');
}

button?.addEventListener('click', shred);
sampleButton?.addEventListener('click', loadSample);

input?.addEventListener('input', () => {
  const cleanValue = input.value.trim();
  updatePreview(cleanValue ? `“${cleanValue}”` : DEFAULT_SECRET);
  updateCount();
  setStatus(cleanValue ? 'Confession staged' : 'Awaiting confession');
});

launchForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  const email = launchForm.querySelector('input[name="email"]').value.trim();
  const category = launchForm.querySelector('select[name="category"]').value.trim();

  if (!email || !category) {
    formFeedback.textContent = 'Need an email and a category before the launch gods can help you.';
    formFeedback.className = 'form-note error';
    return;
  }

  formFeedback.textContent = `Demo captured: ${email} wants in for “${category}”. Production should post this to a Worker and relay through Breevo SMTP.`;
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
setStatus('Awaiting confession');
