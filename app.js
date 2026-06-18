// ── State ──
let wordCount = 15;
let wordList = [];
let deck = [];
let missedCards = [];
let cur = 0, correct = 0, wrong = 0;
let checked = false;
let entryRows = [];
let quizDir = 'both'; // 'both' | 'en_de' | 'de_en'

// ── Theme ──
const html = document.documentElement;
const themeBtn = document.getElementById('theme-toggle');
const savedTheme = localStorage.getItem('vocalift-theme');
if (savedTheme === 'dark') {
  html.setAttribute('data-theme', 'dark');
  themeBtn.textContent = '🌙';
}
themeBtn.onclick = () => {
  const isDark = html.getAttribute('data-theme') === 'dark';
  html.setAttribute('data-theme', isDark ? '' : 'dark');
  themeBtn.textContent = isDark ? '☀️' : '🌙';
  localStorage.setItem('vocalift-theme', isDark ? 'light' : 'dark');
};

// ── Navigation ──
function goTo(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  window.scrollTo(0, 0);
}

// ── Setup ──
function selectCount(n, el) {
  wordCount = n;
  document.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
  el.classList.add('active');
  document.getElementById('custom-count').value = '';
}

function onCustomCount(inp) {
  const v = parseInt(inp.value);
  if (v >= 2) {
    wordCount = v;
    document.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
  }
}

function goToEnter() {
  buildEntryForm(wordCount);
  document.getElementById('enter-title').textContent = 'Enter your vocabulary';
  document.getElementById('enter-subtitle').textContent = 'Fill in each word in English and German. You can add more words any time.';
  document.getElementById('enter-back-btn').onclick = () => goTo('screen-setup');
  goTo('screen-enter');
}

// ── File Upload ──
function handleFileUpload(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    const text = e.target.result;
    const parsed = parseWordFile(text);
    if (parsed.length === 0) {
      alert('Could not find any word pairs in the file.\n\nMake sure each line has two words separated by a comma, tab, or semicolon.\nExample: keyboard,Tastatur');
      event.target.value = '';
      return;
    }
    loadUploadedWords(parsed, file.name);
  };
  reader.readAsText(file);
  event.target.value = '';
}

function parseWordFile(text) {
  const lines = text.split(/\r?\n/).map(l => l.trim()).filter(l => l && !l.startsWith('#'));
  const pairs = [];
  for (const line of lines) {
    // Try comma, semicolon, tab as separators
    const sep = line.includes('\t') ? '\t' : line.includes(';') ? ';' : ',';
    const parts = line.split(sep).map(p => p.trim()).filter(Boolean);
    if (parts.length >= 2) {
      pairs.push({ en: parts[0], de: parts[1] });
    }
  }
  return pairs;
}

function loadUploadedWords(pairs, filename) {
  // Build review form from parsed pairs
  buildEntryForm(0); // clear
  entryRows = [];
  const container = document.getElementById('word-entries');
  container.innerHTML = '';

  pairs.forEach((pair, i) => {
    const card = createWordCard(i, pair.en, pair.de);
    container.appendChild(card);
    entryRows.push({ en: pair.en, de: pair.de });
  });

  updateEntryProgress();

  document.getElementById('enter-title').textContent = '📂 Review imported words';
  document.getElementById('enter-subtitle').textContent =
    `Imported ${pairs.length} word${pairs.length !== 1 ? 's' : ''} from "${filename}". Check each pair, edit anything that looks wrong, then start the quiz.`;
  document.getElementById('enter-back-btn').onclick = () => goTo('screen-home');
  goTo('screen-enter');
}

// ── Word Entry ──
function buildEntryForm(count) {
  const container = document.getElementById('word-entries');
  container.innerHTML = '';
  entryRows = [];
  for (let i = 0; i < count; i++) addWordRow(false);
  updateEntryProgress();
}

function createWordCard(idx, enVal, deVal) {
  const card = document.createElement('div');
  card.className = 'word-card' + (enVal && deVal ? ' complete' : '');
  card.innerHTML = `
    <div class="word-card-header">
      <div class="word-num">Word ${idx + 1}</div>
      <button class="delete-row-btn" onclick="deleteWordRow(this)" title="Remove this word">✕</button>
    </div>
    <div class="word-inputs">
      <div class="input-group">
        <label>🇬🇧 English</label>
        <input type="text" placeholder="e.g. keyboard" value="${escHtml(enVal)}"
          data-idx="${idx}" data-lang="en" autocomplete="off" spellcheck="false" />
      </div>
      <div class="input-group">
        <label>🇩🇪 German</label>
        <input type="text" placeholder="e.g. Tastatur" value="${escHtml(deVal)}"
          data-idx="${idx}" data-lang="de" autocomplete="off" spellcheck="false" />
      </div>
    </div>`;

  card.querySelectorAll('input').forEach(inp => {
    if (inp.classList) inp.classList.toggle('valid', inp.value.trim().length > 0);
    inp.addEventListener('input', () => {
      const i = getRowIndex(inp);
      if (i === -1) return;
      entryRows[i][inp.dataset.lang] = inp.value.trim();
      card.classList.toggle('complete', !!(entryRows[i].en && entryRows[i].de));
      inp.classList.toggle('valid', inp.value.trim().length > 0);
      updateEntryProgress();
    });
    inp.addEventListener('keydown', e => {
      if (e.key === 'Tab' || e.key === 'Enter') {
        const inputs = [...document.querySelectorAll('#word-entries input')];
        const ci = inputs.indexOf(inp);
        if (ci < inputs.length - 1) { e.preventDefault(); inputs[ci + 1].focus(); }
      }
    });
  });

  return card;
}

function getRowIndex(inp) {
  // Find the actual index in entryRows by matching card position in DOM
  const allCards = [...document.querySelectorAll('#word-entries .word-card')];
  const card = inp.closest('.word-card');
  return allCards.indexOf(card);
}

function escHtml(str) {
  return (str || '').replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

function addWordRow(scroll = true) {
  const idx = entryRows.length;
  const container = document.getElementById('word-entries');
  const card = createWordCard(idx, '', '');
  container.appendChild(card);
  entryRows.push({ en: '', de: '' });
  rebuildWordNumbers();
  updateEntryProgress();
  if (scroll) {
    setTimeout(() => card.scrollIntoView({ behavior: 'smooth', block: 'center' }), 50);
    card.querySelector('input').focus();
  }
}

function deleteWordRow(btn) {
  const card = btn.closest('.word-card');
  const allCards = [...document.querySelectorAll('#word-entries .word-card')];
  const idx = allCards.indexOf(card);
  if (entryRows.length <= 1) return; // keep at least 1
  entryRows.splice(idx, 1);
  card.remove();
  rebuildWordNumbers();
  updateEntryProgress();
}

function rebuildWordNumbers() {
  document.querySelectorAll('#word-entries .word-num').forEach((el, i) => {
    el.textContent = `Word ${i + 1}`;
  });
  // re-sync data-idx on all inputs
  document.querySelectorAll('#word-entries .word-card').forEach((card, i) => {
    card.querySelectorAll('input').forEach(inp => inp.dataset.idx = i);
  });
}

function syncEntryRowsFromDOM() {
  // Re-read all values from inputs into entryRows (needed after deletes/reorders)
  entryRows = [];
  document.querySelectorAll('#word-entries .word-card').forEach(card => {
    const enInp = card.querySelector('input[data-lang="en"]');
    const deInp = card.querySelector('input[data-lang="de"]');
    entryRows.push({
      en: enInp ? enInp.value.trim() : '',
      de: deInp ? deInp.value.trim() : '',
    });
  });
}

function updateEntryProgress() {
  syncEntryRowsFromDOM();
  const filled = entryRows.filter(r => r.en && r.de).length;
  const total = entryRows.length;
  const pct = total > 0 ? Math.round((filled / total) * 100) : 0;
  document.getElementById('ep-fill').style.width = pct + '%';
  document.getElementById('ep-count').textContent = filled + ' / ' + total + ' filled';
  document.getElementById('start-quiz-btn').disabled = filled < 2;
}

// ── Quiz Direction ──
function selectDir(dir, el) {
  quizDir = dir;
  document.querySelectorAll('.dir-option').forEach(d => d.classList.remove('active'));
  el.classList.add('active');
}

function goToQuizSetup() {
  syncEntryRowsFromDOM();
  wordList = entryRows.filter(r => r.en && r.de);
  goTo('screen-quiz-settings');
}

// ── Quiz Helpers ──
function norm(s) {
  return s.toLowerCase()
    .replace(/[äÄ]/g, 'ae').replace(/[öÖ]/g, 'oe').replace(/[üÜ]/g, 'ue').replace(/ß/g, 'ss')
    .replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, ' ').trim();
}

function getAlts(s) {
  const parts = s.split('/').map(p => p.trim());
  const all = new Set();
  parts.forEach(p => {
    all.add(norm(p));
    const stripped = norm(p.replace(/\(.*?\)/g, '').trim());
    if (stripped) all.add(stripped);
  });
  return [...all];
}

function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function assignDir(w) {
  if (quizDir === 'en_de') return { ...w, dir: 'en_de' };
  if (quizDir === 'de_en') return { ...w, dir: 'de_en' };
  return { ...w, dir: Math.random() < 0.5 ? 'en_de' : 'de_en' };
}

function buildDeck(source) {
  deck = source.map(assignDir);
  shuffle(deck);
}

// ── Quiz ──
function startQuiz() {
  missedCards = [];
  cur = 0; correct = 0; wrong = 0;
  buildDeck(wordList);
  goTo('screen-quiz');
  showCard();
}

function showCard() {
  checked = false;
  const c = deck[cur];
  const isEn = c.dir === 'en_de';
  const pill = document.getElementById('q-pill');
  pill.textContent = isEn ? 'English → German' : 'German → English';
  pill.className = 'dir-pill ' + (isEn ? 'pill-en' : 'pill-de');
  document.getElementById('q-text').textContent = isEn ? c.en : c.de;
  const inp = document.getElementById('q-input');
  inp.value = ''; inp.className = ''; inp.disabled = false;
  document.getElementById('q-feedback').style.display = 'none';
  document.getElementById('q-next-row').style.display = 'none';
  document.getElementById('q-hint').textContent = 'show hint';
  document.getElementById('qs-counter').textContent = (cur + 1) + ' / ' + deck.length;
  document.getElementById('qp-fill').style.width = Math.round((cur / deck.length) * 100) + '%';
  setTimeout(() => inp.focus(), 50);
}

function checkAnswer() {
  if (checked) return;
  const inp = document.getElementById('q-input');
  const user = inp.value.trim();
  if (!user) return;
  checked = true;
  inp.disabled = true;
  const c = deck[cur];
  const isEn = c.dir === 'en_de';
  const correctStr = isEn ? c.de : c.en;
  const alts = getAlts(correctStr);
  const isCorrect = alts.includes(norm(user));
  const fb = document.getElementById('q-feedback');

  if (isCorrect) {
    correct++;
    document.getElementById('qs-correct').textContent = correct;
    inp.className = 'inp-correct';
    fb.className = 'feedback-box fb-ok';
    fb.innerHTML = '<span class="fb-icon">✓</span><span><strong>Correct!</strong></span>';
  } else {
    wrong++;
    missedCards.push(c);
    document.getElementById('qs-wrong').textContent = wrong;
    inp.className = 'inp-wrong';
    fb.className = 'feedback-box fb-err';
    fb.innerHTML = '<span class="fb-icon">✗</span><span><strong>Not quite.</strong> Answer: <em>' + correctStr + '</em></span>';
  }

  fb.style.display = 'flex';
  document.getElementById('q-next-row').style.display = 'flex';
  document.getElementById('q-hint').textContent = '';
}

function nextCard() {
  cur++;
  if (cur >= deck.length) showResult();
  else showCard();
}

function showHint() {
  if (checked) return;
  const c = deck[cur];
  const isEn = c.dir === 'en_de';
  const answer = isEn ? c.de : c.en;
  const hinted = answer.charAt(0) + answer.slice(1).replace(/[a-zA-ZäöüÄÖÜßéàè]/g, '_');
  document.getElementById('q-hint').textContent = 'hint: ' + hinted;
}

document.getElementById('q-input').addEventListener('keydown', e => {
  if (e.key === 'Enter') {
    if (!checked) checkAnswer();
    else nextCard();
  }
});

// ── Results ──
function showResult() {
  goTo('screen-result');
  const total = correct + wrong;
  const pct = total > 0 ? Math.round((correct / total) * 100) : 0;
  const titles =
    pct === 100 ? 'Perfect score!' :
    pct >= 80   ? 'Great job!'     :
    pct >= 60   ? 'Good effort!'   : 'Keep practicing!';
  document.getElementById('result-title').textContent = titles;
  document.getElementById('result-sub').textContent = correct + ' out of ' + total + ' words correct';
  document.getElementById('r-pct').textContent = pct + '%';
  document.getElementById('r-correct').textContent = correct;
  document.getElementById('r-wrong').textContent = wrong;

  const circumference = 345.4;
  const offset = circumference - (pct / 100) * circumference;
  setTimeout(() => { document.getElementById('ring-fill').style.strokeDashoffset = offset; }, 100);

  document.getElementById('retry-missed-btn').style.display = missedCards.length > 0 ? '' : 'none';
  const missedList = document.getElementById('missed-list');
  const missedItems = document.getElementById('missed-items');
  if (missedCards.length > 0) {
    missedList.style.display = '';
    missedItems.innerHTML = missedCards.map(c =>
      `<div class="missed-item"><span class="missed-en">${c.en}</span><span class="missed-de">${c.de}</span></div>`
    ).join('');
  } else {
    missedList.style.display = 'none';
  }
}

function restartAll() {
  missedCards = []; cur = 0; correct = 0; wrong = 0;
  document.getElementById('qs-correct').textContent = 0;
  document.getElementById('qs-wrong').textContent = 0;
  buildDeck(wordList);
  goTo('screen-quiz');
  showCard();
}

function retryMissed() {
  const missed = [...missedCards];
  missedCards = []; cur = 0; correct = 0; wrong = 0;
  document.getElementById('qs-correct').textContent = 0;
  document.getElementById('qs-wrong').textContent = 0;
  buildDeck(missed);
  goTo('screen-quiz');
  showCard();
}
