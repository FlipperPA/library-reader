chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.get(["enabledDomains", "readerFont", "readerTheme"], (data) => {
    const enabledDomains = data.enabledDomains || [];
    const readerFont = data.readerFont || "sans";
    const readerTheme = data.readerTheme || "light";
    chrome.storage.sync.set({ enabledDomains, readerFont, readerTheme });

    chrome.contextMenus.create({
      id: "toggleDomain",
      title: "Always on for this domain",
      type: "checkbox",
      checked: false,
      contexts: ["action"],
    });

    chrome.contextMenus.create({
      id: "fontMenu",
      title: "Font",
      contexts: ["action"],
    });

    chrome.contextMenus.create({
      id: "fontSans",
      parentId: "fontMenu",
      title: "Sans Serif",
      type: "radio",
      checked: readerFont === "sans",
      contexts: ["action"],
    });

    chrome.contextMenus.create({
      id: "fontSerif",
      parentId: "fontMenu",
      title: "Serif",
      type: "radio",
      checked: readerFont === "serif",
      contexts: ["action"],
    });

    chrome.contextMenus.create({
      id: "fontDyslexic",
      parentId: "fontMenu",
      title: "OpenDyslexic",
      type: "radio",
      checked: readerFont === "dyslexic",
      contexts: ["action"],
    });

    chrome.contextMenus.create({
      id: "themeMenu",
      title: "Theme",
      contexts: ["action"],
    });

    chrome.contextMenus.create({
      id: "themeLight",
      parentId: "themeMenu",
      title: "Light",
      type: "radio",
      checked: readerTheme === "light",
      contexts: ["action"],
    });

    chrome.contextMenus.create({
      id: "themeDark",
      parentId: "themeMenu",
      title: "Dark",
      type: "radio",
      checked: readerTheme === "dark",
      contexts: ["action"],
    });

    chrome.contextMenus.create({
      id: "themeCb",
      parentId: "themeMenu",
      title: "Color Blind Safe",
      type: "radio",
      checked: readerTheme === "cb",
      contexts: ["action"],
    });
  });
});

// Icon click → toggle reader mode on the active tab
chrome.action.onClicked.addListener((tab) => {
  chrome.tabs.sendMessage(tab.id, { action: "toggleReaderMode" });
});

// Ctrl+Space keyboard shortcut → toggle reader mode on the active tab
chrome.commands.onCommand.addListener((command) => {
  if (command === "toggle-reader-mode") {
    chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
      if (tab?.id) {
        chrome.tabs.sendMessage(tab.id, { action: "toggleReaderMode" });
      }
    });
  }
});

const FONT_MENU_IDS = { fontSans: "sans", fontSerif: "serif", fontDyslexic: "dyslexic" };
const THEME_MENU_IDS = { themeLight: "light", themeDark: "dark", themeCb: "cb" };

// Right-click context menu handler
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "toggleDomain") {
    if (!tab?.url) return;
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
  } else if (info.menuItemId in FONT_MENU_IDS) {
    const font = FONT_MENU_IDS[info.menuItemId];
    chrome.storage.sync.set({ readerFont: font }, () => {
      if (tab?.id) {
        chrome.tabs.sendMessage(tab.id, { action: "setFont", font });
      }
    });
  } else if (info.menuItemId in THEME_MENU_IDS) {
    const theme = THEME_MENU_IDS[info.menuItemId];
    chrome.storage.sync.set({ readerTheme: theme }, () => {
      if (tab?.id) {
        chrome.tabs.sendMessage(tab.id, { action: "setTheme", theme });
      }
    });
  }
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
