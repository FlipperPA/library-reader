let readerActive = false;

chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
  if (!tab) return;
  const domain = new URL(tab.url).hostname;
  chrome.storage.sync.get(["enabledDomains"], ({ enabledDomains }) => {
    readerActive = enabledDomains.includes(domain);
  });
});

document.getElementById("toggle").addEventListener("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
    chrome.tabs.sendMessage(tab.id, { action: readerActive ? "deactivateReader" : "activateReader" });
    readerActive = !readerActive;
  });
});

document.getElementById("always").addEventListener("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
    chrome.runtime.sendMessage({ action: "toggleReader" });
  });
});
