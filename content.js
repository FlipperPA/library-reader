import { Readability } from '@mozilla/readability';

let readerActive = false;
let originalContent = null;

function extractReadableContent() {
  const clone = document.cloneNode(true);
  const reader = new Readability(clone);
  const article = reader.parse();
  return article ? article.content : null;
}

function activateReader() {
  if (readerActive) return;
  originalContent = document.body.innerHTML;
  const readable = extractReadableContent();
  if (!readable) {
    alert("No readable content found.");
    return;
  }
  document.body.innerHTML = `
    <div id="library-reader-container">
      <button id="exit-reader">Exit Reader Mode</button>
      <article>${readable}</article>
    </div>
  `;
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
  }
});

// Auto-check domain persistence on load
chrome.storage.sync.get(["enabledDomains"], ({ enabledDomains }) => {
  const domain = window.location.hostname;
  if (enabledDomains.includes(domain)) {
    setTimeout(activateReader, 500); // slight delay to ensure page loads
  }
});
