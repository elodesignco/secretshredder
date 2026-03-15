const input = document.getElementById('secretInput');
const preview = document.getElementById('secret-preview');
const button = document.getElementById('shredButton');
const paper = document.getElementById('paper');
const confetti = document.getElementById('confetti');

const DEFAULT_SECRET = '“I said \'you too\' when the waiter told me to enjoy the movie.”';

function spawnConfetti() {
  confetti.innerHTML = '';
  for (let i = 0; i < 28; i += 1) {
    const bit = document.createElement('span');
    bit.style.left = `${8 + Math.random() * 84}%`;
    bit.style.top = `${140 + Math.random() * 24}px`;
    bit.style.animationDelay = `${Math.random() * 0.25}s`;
    bit.style.background = Math.random() > 0.5
      ? 'linear-gradient(180deg, #ff5a36, #ffb02e)'
      : 'linear-gradient(180deg, #ffe4c4, #ffffff)';
    confetti.appendChild(bit);
  }
}

function shred() {
  const text = input.value.trim() || DEFAULT_SECRET;
  preview.textContent = text;
  paper.classList.remove('shredding');
  confetti.innerHTML = '';
  void paper.offsetWidth;
  paper.classList.add('shredding');
  spawnConfetti();

  setTimeout(() => {
    preview.textContent = 'Shredded. Spiritually, emotionally, and aesthetically.';
    paper.classList.remove('shredding');
  }, 1700);
}

button.addEventListener('click', shred);
input.addEventListener('input', () => {
  preview.textContent = input.value.trim() || DEFAULT_SECRET;
});

document.querySelector('[data-static-form]')?.addEventListener('submit', (event) => {
  event.preventDefault();
  const email = event.currentTarget.querySelector('input[name="email"]').value;
  alert(`Nice. ${email} is on the pretend launch list for now. Hook this form to a real backend next.`);
  event.currentTarget.reset();
});
