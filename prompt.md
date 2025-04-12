Here’s a complete and production-ready **Product Requirements Document (PRD)** for **🔧 Console Whisperer**, your browser extension that translates cryptic dev console errors into plain English fixes with AI support.

---

# 📄 Product Requirements Document (PRD)
## Project Name: **Console Whisperer**
### TL;DR:
A browser extension that listens to JavaScript console errors in real-time, explains them in plain English using Gemini 2.0 Flash Lite, and suggests possible fixes with links to StackOverflow, GitHub issues, and AI-generated code snippets.

---

## 🔧 1. Problem Statement
JavaScript developers often encounter vague and complex error messages in the browser console. Understanding and resolving them requires experience, Googling, and context switching. This slows down debugging and kills dev flow.

---

## 🎯 2. Goals & Objectives
- Detect console errors as they appear.
- Use AI to explain the error in plain English.
- Suggest potential fixes and reasons.
- Provide direct links to relevant StackOverflow/GitHub threads.
- Keep everything inline and non-intrusive.

---

## 🧩 3. Key Features

### 🔍 Console Monitoring
- Intercepts errors and uncaught exceptions via `window.onerror`, `console.error`, and `window.addEventListener("unhandledrejection")`.

### 🧠 AI Explanation Engine
- Sends error stack trace or message to Gemini 2.0 Flash Lite via the backend.
- Receives a **plain-English explanation** and **suggested fix**.
- Optionally includes code samples.

### 🌐 Contextual Link Aggregator
- Searches for related StackOverflow/GitHub Issues using OpenRouter or web scraping backend.
- Displays top 3-5 helpful links inline.

### 💬 Error Overlay UI
- Mini panel appears inline under the console with:
  - ❗ Original error message
  - 💡 AI-generated explanation
  - 🛠 Fix suggestions
  - 🔗 Helpful links
  - 📄 “Copy fix” button (if available)

### 📋 Fix Preview
- One-click preview of how the code might look after applying a suggested fix.
- Option to export or copy the updated code block.

---

## 🏗 4. Tech Stack

### Frontend (extension/)
- **HTML/CSS/JS** (Manifest V3)
- Background service worker
- Content script injected on page load
- UI components: Popup, Sidebar overlay, Toasts

### Backend (backend/)
- **Node.js + Express.js**
- Gemini 2.0 Flash Lite API (via OpenRouter or direct)
- Optional: Bing/WebSearch API or Firecrawler for link aggregation

### ML/AI
- **Gemini 2.0 Flash Lite**: Prompted with stack traces or raw errors to generate explanations + fixes.

---

## 🗂 5. Project Structure

```
console-whisperer/
├── extension/
│   ├── manifest.json
│   ├── background.js
│   ├── content.js
│   ├── popup.html / popup.js
│   └── styles/
├── backend/
│   ├── index.js
│   ├── routes/
│   ├── services/gemini.js
│   └── utils/linkScraper.js
└── README.md
```

---

## 🧪 6. User Flow

1. Dev opens a site and encounters an error.
2. Extension detects error in real time.
3. Extension sends error data to backend.
4. Backend uses Gemini to generate:
   - Explanation
   - Fix (if possible)
5. Extension displays result in overlay under dev tools or on-page.
6. Dev can click links, preview fix, or copy code.

---

## 🧠 7. Gemini Prompt Format

```txt
Explain this JavaScript error in plain English and suggest a fix.
Error: "Uncaught TypeError: Cannot read properties of undefined (reading 'foo')"
Context: "Occurred in function bar() at app.js:45"
```

---

## 🔐 8. Permissions (Manifest V3)

```json
"permissions": [
  "scripting",
  "activeTab",
  "storage"
],
"host_permissions": [
  "<all_urls>"
],
"background": {
  "service_worker": "background.js"
}
```

---

## 🚀 9. MVP Scope

### Must-Have
- Console error detection
- Gemini API explanation
- Overlay panel
- Link preview (static)

### Nice-to-Have
- AI fix previews
- Click-to-copy patch
- DevTools panel integration

---

## 📆 10. Timeline

| Week | Goal |
|------|------|
| Week 1 | Setup extension scaffold + console listener |
| Week 2 | Build backend + Gemini integration |
| Week 3 | Overlay UI + API connection |
| Week 4 | Link scraping + polish + deploy MVP |

---

## 📊 11. Success Metrics

- 🧠 90% of errors explained accurately
- ⏱ Time-to-fix reduced by at least 40%
- 🧪 Dev satisfaction score > 8/10
- 🔁 Re-engagement from > 50% of users in 7 days

make the Project Structure as modular as possible.
