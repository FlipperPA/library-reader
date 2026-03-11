chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ enabledDomains: [] });
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "toggleReader") {
    const tabId = sender.tab.id;
    const domain = new URL(sender.tab.url).hostname;

    chrome.storage.sync.get(["enabledDomains"], ({ enabledDomains }) => {
      const index = enabledDomains.indexOf(domain);
      if (index > -1) {
        enabledDomains.splice(index, 1);
      } else {
        enabledDomains.push(domain);
      }
      chrome.storage.sync.set({ enabledDomains }, () => {
        chrome.tabs.sendMessage(tabId, { action: "updateReaderState", enabled: index === -1 });
      });
    });
  }
});
