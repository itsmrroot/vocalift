// ── State ──
let wordCount = 15;
let wordList = [];
let deck = [];
let missedCards = [];
let cur = 0, correct = 0, wrong = 0;
let checked = false;
let entryRows = [];
let quizDir = 'both'; // 'both' | 'en_de' | 'de_en'

// ── i18n ──
let lang = localStorage.getItem('vocalift-lang') || 'en';

const TRANSLATIONS = {
  en: {
    eyebrow: 'vocabulary trainer',
    'hero-title': 'Learn any words,<br><em>your way</em>',
    'hero-sub': 'Add your own vocabulary list, then let VocaLift quiz you until you know every word cold.',
    'btn-manual': '✏️ Enter words manually',
    'btn-upload': '📂 Upload a file',
    'upload-hint': 'Supported formats: <code>.csv</code> or <code>.txt</code> — one pair per line, separated by a comma, tab, or semicolon.<br>Example: <code>keyboard,Tastatur</code>',
    'feat1-title': 'Your own words',
    'feat1-desc': 'Type pairs manually or upload a file instantly.',
    'feat2-title': 'Choose direction',
    'feat2-desc': 'Quiz EN→DE, DE→EN, or both randomly.',
    'feat3-title': 'Type to learn',
    'feat3-desc': 'Type every answer — no multiple choice shortcuts.',
    'setup-step': 'Step 1 of 2',
    'setup-title': 'How many words<br>do you want to learn?',
    'count-label': 'Choose a preset or enter a custom number',
    'custom-label': 'or custom:',
    'btn-back': '← Back',
    'setup-next': 'Next: enter words →',
    'enter-step': 'Step 2 of 2',
    'enter-title': 'Enter your vocabulary',
    'enter-subtitle': 'Fill in each word in English and German. You can add more words any time.',
    'btn-add-word': '+ add another word',
    'enter-next': 'Next: quiz settings →',
    'label-en': '🇬🇧 English',
    'label-de': '🇩🇪 German',
    'ph-en': 'e.g. keyboard',
    'ph-de': 'e.g. Tastatur',
    'word-n': 'Word',
    'n-filled': (f, t) => `${f} / ${t} filled`,
    'import-title': '📂 Review imported words',
    'import-subtitle': (n, name) => `Imported ${n} word${n !== 1 ? 's' : ''} from "${name}". Check each pair, edit anything that looks wrong, then start the quiz.`,
    'qs-step': 'Almost ready',
    'qs-title': 'Choose quiz direction',
    'qs-sub': 'Which direction should the quiz go?',
    'dir-both-label': 'Both directions',
    'dir-both-desc': 'Random mix of EN→DE and DE→EN',
    'dir-en-label': 'English → German',
    'dir-en-desc': 'See English, type German',
    'dir-de-label': 'German → English',
    'dir-de-desc': 'See German, type English',
    'qs-start': 'Start quiz →',
    correct: 'correct',
    wrong: 'wrong',
    'pill-en': 'English → German',
    'pill-de': 'German → English',
    'ph-answer': 'type your answer…',
    'btn-check': 'Check',
    'show-hint': 'show hint',
    'hint-prefix': 'hint:',
    'press-enter': 'or press Enter',
    'btn-next': 'Next',
    'score-lbl': 'score',
    'rs-correct': 'correct',
    'rs-missed': 'missed',
    'btn-restart': '↺ Restart all',
    'btn-retry': 'Retry missed',
    'btn-new-list': 'New list',
    'missed-title': 'Words to review',
    'result-sub': (c, t) => `${c} out of ${t} words correct`,
    'result-100': 'Perfect score!',
    'result-80': 'Great job!',
    'result-60': 'Good effort!',
    'result-low': 'Keep practicing!',
    'fb-correct': '<span class="fb-icon">✓</span><span><strong>Correct!</strong></span>',
    'fb-wrong': (a) => `<span class="fb-icon">✗</span><span><strong>Not quite.</strong> Answer: <em>${a}</em></span>`,
    'alert-no-pairs': 'Could not find any word pairs in the file.\n\nMake sure each line has two words separated by a comma, tab, or semicolon.\nExample: keyboard,Tastatur',
  },
  de: {
    eyebrow: 'Vokabeltrainer',
    'hero-title': 'Lerne Vokabeln,<br><em>auf deine Art</em>',
    'hero-sub': 'Füge deine eigene Vokabelliste hinzu und lass dich von VocaLift abfragen, bis du jedes Wort sicher weißt.',
    'btn-manual': '✏️ Wörter manuell eingeben',
    'btn-upload': '📂 Datei hochladen',
    'upload-hint': 'Unterstützte Formate: <code>.csv</code> oder <code>.txt</code> — ein Paar pro Zeile, getrennt durch Komma, Tab oder Semikolon.<br>Beispiel: <code>keyboard,Tastatur</code>',
    'feat1-title': 'Eigene Wörter',
    'feat1-desc': 'Paare manuell eingeben oder sofort eine Datei hochladen.',
    'feat2-title': 'Richtung wählen',
    'feat2-desc': 'Quiz EN→DE, DE→EN, oder beides zufällig.',
    'feat3-title': 'Tippen zum Lernen',
    'feat3-desc': 'Jede Antwort eintippen — kein Multiple Choice.',
    'setup-step': 'Schritt 1 von 2',
    'setup-title': 'Wie viele Wörter<br>möchtest du lernen?',
    'count-label': 'Wähle eine Vorgabe oder gib eine eigene Zahl ein',
    'custom-label': 'oder eigene:',
    'btn-back': '← Zurück',
    'setup-next': 'Weiter: Wörter eingeben →',
    'enter-step': 'Schritt 2 von 2',
    'enter-title': 'Vokabeln eingeben',
    'enter-subtitle': 'Fülle jedes Wort auf Englisch und Deutsch aus. Du kannst jederzeit weitere Wörter hinzufügen.',
    'btn-add-word': '+ weiteres Wort hinzufügen',
    'enter-next': 'Weiter: Quiz-Einstellungen →',
    'label-en': '🇬🇧 Englisch',
    'label-de': '🇩🇪 Deutsch',
    'ph-en': 'z.B. keyboard',
    'ph-de': 'z.B. Tastatur',
    'word-n': 'Wort',
    'n-filled': (f, t) => `${f} / ${t} ausgefüllt`,
    'import-title': '📂 Importierte Wörter prüfen',
    'import-subtitle': (n, name) => `${n} ${n !== 1 ? 'Wörter' : 'Wort'} aus „${name}" importiert. Prüfe jedes Paar, bearbeite Fehler und starte dann das Quiz.`,
    'qs-step': 'Fast fertig',
    'qs-title': 'Quiz-Richtung wählen',
    'qs-sub': 'In welche Richtung soll das Quiz gehen?',
    'dir-both-label': 'Beide Richtungen',
    'dir-both-desc': 'Zufällige Mischung aus EN→DE und DE→EN',
    'dir-en-label': 'Englisch → Deutsch',
    'dir-en-desc': 'Englisch sehen, Deutsch tippen',
    'dir-de-label': 'Deutsch → Englisch',
    'dir-de-desc': 'Deutsch sehen, Englisch tippen',
    'qs-start': 'Quiz starten →',
    correct: 'richtig',
    wrong: 'falsch',
    'pill-en': 'Englisch → Deutsch',
    'pill-de': 'Deutsch → Englisch',
    'ph-answer': 'Antwort eingeben…',
    'btn-check': 'Prüfen',
    'show-hint': 'Hinweis zeigen',
    'hint-prefix': 'Hinweis:',
    'press-enter': 'oder Enter drücken',
    'btn-next': 'Weiter',
    'score-lbl': 'Punkte',
    'rs-correct': 'richtig',
    'rs-missed': 'verfehlt',
    'btn-restart': '↺ Alles wiederholen',
    'btn-retry': 'Verfehlte wiederholen',
    'btn-new-list': 'Neue Liste',
    'missed-title': 'Zu wiederholende Wörter',
    'result-sub': (c, t) => `${c} von ${t} Wörtern richtig`,
    'result-100': 'Perfekte Punktzahl!',
    'result-80': 'Tolle Arbeit!',
    'result-60': 'Gute Leistung!',
    'result-low': 'Weiter üben!',
    'fb-correct': '<span class="fb-icon">✓</span><span><strong>Richtig!</strong></span>',
    'fb-wrong': (a) => `<span class="fb-icon">✗</span><span><strong>Nicht ganz.</strong> Antwort: <em>${a}</em></span>`,
    'alert-no-pairs': 'Keine Wortpaare in der Datei gefunden.\n\nJede Zeile muss zwei Wörter enthalten, getrennt durch Komma, Tab oder Semikolon.\nBeispiel: keyboard,Tastatur',
  },
};

function t(key, ...args) {
  const val = (TRANSLATIONS[lang] ?? TRANSLATIONS.en)[key] ?? TRANSLATIONS.en[key];
  return typeof val === 'function' ? val(...args) : val;
}

function applyLang() {
  // Segmented EN/DE switch — highlight active lang
  document.getElementById('lang-en').classList.toggle('active', lang === 'en');
  document.getElementById('lang-de').classList.toggle('active', lang === 'de');

  // Home
  document.querySelector('.hero-eyebrow').textContent = t('eyebrow');
  document.querySelector('.hero-title').innerHTML = t('hero-title');
  document.querySelector('.hero-sub').textContent = t('hero-sub');
  document.getElementById('btn-manual').textContent = t('btn-manual');
  document.getElementById('btn-upload-file').textContent = t('btn-upload');
  document.querySelector('.upload-hint').innerHTML = t('upload-hint');
  const feats = document.querySelectorAll('.feat');
  feats[0].querySelector('.feat-title').textContent = t('feat1-title');
  feats[0].querySelector('.feat-desc').textContent = t('feat1-desc');
  feats[1].querySelector('.feat-title').textContent = t('feat2-title');
  feats[1].querySelector('.feat-desc').textContent = t('feat2-desc');
  feats[2].querySelector('.feat-title').textContent = t('feat3-title');
  feats[2].querySelector('.feat-desc').textContent = t('feat3-desc');

  // Setup
  document.getElementById('setup-step').textContent = t('setup-step');
  document.getElementById('setup-title').innerHTML = t('setup-title');
  document.querySelector('.count-label').textContent = t('count-label');
  document.getElementById('custom-label').textContent = t('custom-label');
  document.getElementById('setup-back-btn').textContent = t('btn-back');
  document.getElementById('setup-next-btn').textContent = t('setup-next');

  // Word entry
  document.getElementById('enter-step').textContent = t('enter-step');
  document.getElementById('add-more-btn').textContent = t('btn-add-word');
  document.getElementById('start-quiz-btn').textContent = t('enter-next');
  document.getElementById('enter-back-btn').textContent = t('btn-back');
  document.querySelectorAll('#word-entries .word-num').forEach((el, i) => {
    el.textContent = `${t('word-n')} ${i + 1}`;
  });
  document.querySelectorAll('#word-entries .word-card').forEach(card => {
    const labels = card.querySelectorAll('.input-group label');
    if (labels[0]) labels[0].textContent = t('label-en');
    if (labels[1]) labels[1].textContent = t('label-de');
    const inputs = card.querySelectorAll('input');
    if (inputs[0]) inputs[0].placeholder = t('ph-en');
    if (inputs[1]) inputs[1].placeholder = t('ph-de');
  });

  // Quiz settings
  document.getElementById('qs-step').textContent = t('qs-step');
  document.getElementById('qs-title').textContent = t('qs-title');
  document.getElementById('qs-sub').textContent = t('qs-sub');
  document.getElementById('dir-both-label').textContent = t('dir-both-label');
  document.getElementById('dir-both-desc').textContent = t('dir-both-desc');
  document.getElementById('dir-en-label').textContent = t('dir-en-label');
  document.getElementById('dir-en-desc').textContent = t('dir-en-desc');
  document.getElementById('dir-de-label').textContent = t('dir-de-label');
  document.getElementById('dir-de-desc').textContent = t('dir-de-desc');
  document.getElementById('qs-back-btn').textContent = t('btn-back');
  document.getElementById('qs-start-btn').textContent = t('qs-start');

  // Quiz
  document.getElementById('qs-correct-lbl').textContent = t('correct');
  document.getElementById('qs-wrong-lbl').textContent = t('wrong');
  document.getElementById('q-input').placeholder = t('ph-answer');
  document.getElementById('check-btn').textContent = t('btn-check');
  document.getElementById('q-enter-hint').textContent = t('press-enter');
  document.getElementById('next-lbl').textContent = t('btn-next');
  const pill = document.getElementById('q-pill');
  if (pill.classList.contains('pill-en')) pill.textContent = t('pill-en');
  else if (pill.classList.contains('pill-de')) pill.textContent = t('pill-de');
  const hintEl = document.getElementById('q-hint');
  const showHintTexts = [TRANSLATIONS.en['show-hint'], TRANSLATIONS.de['show-hint']];
  if (showHintTexts.includes(hintEl.textContent)) hintEl.textContent = t('show-hint');

  // Result
  document.querySelector('.score-pct-lbl').textContent = t('score-lbl');
  document.querySelector('.rs-correct .rs-lbl').textContent = t('rs-correct');
  document.querySelector('.rs-wrong .rs-lbl').textContent = t('rs-missed');
  document.getElementById('result-restart-btn').textContent = t('btn-restart');
  document.getElementById('retry-missed-btn').textContent = t('btn-retry');
  document.getElementById('result-new-list-btn').textContent = t('btn-new-list');
  document.querySelector('.missed-title').textContent = t('missed-title');
}

function setLang(l) {
  lang = l;
  localStorage.setItem('vocalift-lang', lang);
  applyLang();
}

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
  document.getElementById('enter-title').textContent = t('enter-title');
  document.getElementById('enter-subtitle').textContent = t('enter-subtitle');
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
      alert(t('alert-no-pairs'));
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

  document.getElementById('enter-title').textContent = t('import-title');
  document.getElementById('enter-subtitle').textContent = t('import-subtitle', pairs.length, filename);
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
      <div class="word-num">${t('word-n')} ${idx + 1}</div>
      <button class="delete-row-btn" onclick="deleteWordRow(this)" title="Remove this word">✕</button>
    </div>
    <div class="word-inputs">
      <div class="input-group">
        <label>${t('label-en')}</label>
        <input type="text" placeholder="${t('ph-en')}" value="${escHtml(enVal)}"
          data-idx="${idx}" data-lang="en" autocomplete="off" spellcheck="false" />
      </div>
      <div class="input-group">
        <label>${t('label-de')}</label>
        <input type="text" placeholder="${t('ph-de')}" value="${escHtml(deVal)}"
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
    el.textContent = `${t('word-n')} ${i + 1}`;
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
  document.getElementById('ep-count').textContent = t('n-filled', filled, total);
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
  pill.textContent = isEn ? t('pill-en') : t('pill-de');
  pill.className = 'dir-pill ' + (isEn ? 'pill-en' : 'pill-de');
  document.getElementById('q-text').textContent = isEn ? c.en : c.de;
  const inp = document.getElementById('q-input');
  inp.value = ''; inp.className = ''; inp.disabled = false;
  document.getElementById('q-feedback').style.display = 'none';
  document.getElementById('q-next-row').style.display = 'none';
  document.getElementById('q-hint').textContent = t('show-hint');
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
    fb.innerHTML = t('fb-correct');
  } else {
    wrong++;
    missedCards.push(c);
    document.getElementById('qs-wrong').textContent = wrong;
    inp.className = 'inp-wrong';
    fb.className = 'feedback-box fb-err';
    fb.innerHTML = t('fb-wrong', correctStr);
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
  document.getElementById('q-hint').textContent = t('hint-prefix') + ' ' + hinted;
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
  const titleKey = pct === 100 ? 'result-100' : pct >= 80 ? 'result-80' : pct >= 60 ? 'result-60' : 'result-low';
  document.getElementById('result-title').textContent = t(titleKey);
  document.getElementById('result-sub').textContent = t('result-sub', correct, total);
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

// Apply saved language on load
applyLang();
