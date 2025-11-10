browser.runtime.onInstalled.addListener(() => {
    browser.storage.local.set({
        blockSuggestions: true,
        blockShorts: true
    });
});

browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete' && tab.url && tab.url.includes('youtube.com')) {
        browser.storage.local.get(['blockSuggestions', 'blockShorts'], (result) => {
            browser.tabs.sendMessage(tabId, {
                action: "updateCSS",
                blockSuggestions: result.blockSuggestions !== false,
                blockShorts: result.blockShorts !== false
            }).catch(() => {});
        });
    }
});
