import { Readability } from '@mozilla/readability';

let readerActive = false;
let originalContent = null;
let currentFont = 'sans';

function injectOpenDyslexicFont() {
  if (document.getElementById('library-reader-font-face')) return;
  const style = document.createElement('style');
  style.id = 'library-reader-font-face';
  style.textContent = [
    `@font-face { font-family: 'OpenDyslexic'; src: url('${chrome.runtime.getURL('assets/fonts/OpenDyslexic-Regular.otf')}') format('opentype'); font-weight: normal; font-style: normal; }`,
    `@font-face { font-family: 'OpenDyslexic'; src: url('${chrome.runtime.getURL('assets/fonts/OpenDyslexic-Bold.otf')}') format('opentype'); font-weight: bold; font-style: normal; }`,
    `@font-face { font-family: 'OpenDyslexic'; src: url('${chrome.runtime.getURL('assets/fonts/OpenDyslexic-Italic.otf')}') format('opentype'); font-weight: normal; font-style: italic; }`,
    `@font-face { font-family: 'OpenDyslexic'; src: url('${chrome.runtime.getURL('assets/fonts/OpenDyslexic-BoldItalic.otf')}') format('opentype'); font-weight: bold; font-style: italic; }`,
  ].join('\n');
  (document.head || document.documentElement).appendChild(style);
}

function applyFont(font) {
  const container = document.getElementById('library-reader-container');
  if (!container) return;
  container.classList.remove('font-sans', 'font-serif', 'font-dyslexic');
  container.classList.add(`font-${font}`);
}

function extractReadableContent() {
  const clone = document.cloneNode(true);
  const reader = new Readability(clone);
  const article = reader.parse();
  console.log('Extracted article:', article);

  if (article) {
    const title = article.title ? article.title : null;
    const byline = article.byline ? article.byline : null;
    const content = article.content ? article.content : null;

    return { title, byline, content };
  }
  return null
}

function activateReader() {
  if (readerActive) return;
  originalContent = document.body.innerHTML;
  const readable = extractReadableContent();
  if (!readable) {
    alert("No readable content found.");
    return;
  }
  injectOpenDyslexicFont();
  var readableHTML = `<div id="library-reader-container"><button id="exit-reader">Exit Reader Mode</button>`;
  if (readable.title) {
    readableHTML += `<h1>${readable.title}</h1>`;
  }
  if (readable.byline) {
    readableHTML += `<i>by ${readable.byline}</i>`;
  }
  readableHTML = readableHTML + `<article>${readable.content}</article></div>`;
  document.body.innerHTML = readableHTML;
  applyFont(currentFont);
  readerActive = true;
  document.getElementById("exit-reader").addEventListener("click", deactivateReader);
}

function deactivateReader() {
  if (!originalContent) return;
  document.body.innerHTML = originalContent;
  readerActive = false;
  originalContent = null;
}

// Listen for messages from background
chrome.runtime.onMessage.addListener((request) => {
  if (request.action === "activateReader") {
    activateReader();
  } else if (request.action === "deactivateReader") {
    deactivateReader();
  } else if (request.action === "toggleReaderMode") {
    if (readerActive) {
      deactivateReader();
    } else {
      activateReader();
    }
  } else if (request.action === "updateReaderState") {
    // Optional: auto-activate if domain is enabled
    if (request.enabled && !readerActive) {
      activateReader();
    }
  } else if (request.action === "setFont") {
    currentFont = request.font;
    applyFont(request.font);
  }
});

// Load preferences and auto-activate for enabled domains
chrome.storage.sync.get(["enabledDomains", "readerFont"], ({ enabledDomains, readerFont }) => {
  currentFont = readerFont || 'sans';
  const domain = window.location.hostname;
  if ((enabledDomains || []).includes(domain)) {
    setTimeout(activateReader, 500); // slight delay to ensure page loads
  }
});
