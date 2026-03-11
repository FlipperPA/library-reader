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
