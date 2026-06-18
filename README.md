# VocaLift 🎓

> **Learn any vocabulary, your way.** Add your own word pairs, get quizzed in both directions, and track your progress — all in a single HTML file.

![HTML](https://img.shields.io/badge/HTML-single%20file-blue?style=flat-square)
![No dependencies](https://img.shields.io/badge/dependencies-none-brightgreen?style=flat-square)
![Dark mode](https://img.shields.io/badge/dark%20mode-supported-blueviolet?style=flat-square)

🌐 **Live demo:** [https://itsmrroot.github.io/vocalift/](https://itsmrroot.github.io/vocalift/)

---

## What is VocaLift?

VocaLift is a vocabulary flashcard trainer that runs entirely in the browser — no backend, no account, no install. You enter your own word pairs (e.g. English ↔ German), choose how many words to study, and the app quizzes you by making you **type** every answer.

Built originally for students preparing for English–German vocabulary exams.

---

## Features

- **Custom word lists** — enter any number of vocabulary pairs in any two languages
- **Typing-based quiz** — no multiple choice, you must recall and type the answer
- **Bidirectional** — randomly quizzed in both directions (EN→DE and DE→EN)
- **Smart answer checking** — accepts ä/ae, ö/oe, ü/ue, ß/ss interchangeably; also handles slash-separated alternatives (e.g. `Zeigegerät / Maus`)
- **Hint system** — reveals the first letter and blanks the rest
- **Score tracking** — correct / wrong counter throughout the quiz
- **Results screen** — animated score ring, breakdown of missed words, retry missed option
- **Dark & light mode** — toggle with one click, preference saved in localStorage
- **Zero dependencies** — one `.html` file, works offline

---

## Getting started

### Option 1 — Open directly

Download `vocalift.html` and open it in any browser. No server needed.

### Option 2 — Host it

Upload `vocalift.html` to any static hosting provider:

| Provider | How |
|---|---|
| **GitHub Pages** | Push to a repo, enable Pages, point it at `vocalift.html` |
| **Netlify** | Drag-and-drop the file at [app.netlify.com/drop](https://app.netlify.com/drop) |
| **Vercel** | `vercel --prod` in the project folder |

---

## How to use

1. **Open** the app in a browser
2. **Choose** how many words you want to study (5, 10, 15, 20, 30, or a custom number)
3. **Enter** your vocabulary pairs — English on the left, German (or any other language) on the right
4. **Start the quiz** — each card shows a word in one language, you type the translation
5. **See your results** — review what you missed and retry until you know them all

---

## Project structure

```
vocalift/
├── index.html     # Markup and page structure
├── styles.css     # All styling, CSS variables, dark/light mode, responsive layout
├── app.js         # All logic — theme, navigation, word entry, quiz, results
└── README.md
```

No build step, no `node_modules`, no framework. Just open `index.html` in a browser and go.

---

## Browser support

Works in all modern browsers — Chrome, Firefox, Safari, Edge. No polyfills needed.

---

## License

MIT — free to use, modify, and distribute.
