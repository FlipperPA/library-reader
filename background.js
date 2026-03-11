chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ enabledDomains: [] });
  chrome.contextMenus.create({
    id: "toggleDomain",
    title: "Always on for this domain",
    type: "checkbox",
    checked: false,
    contexts: ["action"],
  });
});

// Icon click → toggle reader mode on the active tab
chrome.action.onClicked.addListener((tab) => {
  chrome.tabs.sendMessage(tab.id, { action: "toggleReaderMode" });
});

// Right-click context menu → toggle domain always-on
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId !== "toggleDomain" || !tab?.url) return;
  const domain = new URL(tab.url).hostname;
  chrome.storage.sync.get(["enabledDomains"], ({ enabledDomains }) => {
    const index = enabledDomains.indexOf(domain);
    if (index > -1) {
      enabledDomains.splice(index, 1);
    } else {
      enabledDomains.push(domain);
    }
    const nowEnabled = index === -1;
    chrome.storage.sync.set({ enabledDomains }, () => {
      // Keep the checkbox in sync with the new state
      chrome.contextMenus.update("toggleDomain", { checked: nowEnabled });
      chrome.tabs.sendMessage(tab.id, { action: "updateReaderState", enabled: nowEnabled });
    });
  });
});

// Refresh the checkbox when the tab changes, since onShown is not available in Chrome
function syncMenuCheckbox(tabId) {
  chrome.tabs.get(tabId, (tab) => {
    if (chrome.runtime.lastError || !tab?.url) return;
    try {
      const domain = new URL(tab.url).hostname;
      chrome.storage.sync.get(["enabledDomains"], ({ enabledDomains }) => {
        chrome.contextMenus.update("toggleDomain", { checked: enabledDomains.includes(domain) });
      });
    } catch (e) {}
  });
}

chrome.tabs.onActivated.addListener(({ tabId }) => syncMenuCheckbox(tabId));
chrome.tabs.onUpdated.addListener((tabId, info) => {
  if (info.status === "complete") syncMenuCheckbox(tabId);
});
