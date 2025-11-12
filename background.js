browser.runtime.onInstalled.addListener(() => {
    browser.storage.local.set({
        blockSearchSuggestions: true,
		blockVoiceSearch: true,
		blockSurveys: true,
        blockShortsLink: true,
		blockShortsHomepageSuggestions: true,
		blockShortsSessionSuggestions: true
    });
});

browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete' && tab.url && tab.url.includes('youtube.com')) {
        browser.storage.local.get([
			'blockSearchSuggestions',
			'blockVoiceSearch',
			'blockSurveys',
			'blockShortsLink',
			'blockShortsHomepageSuggestions',
			'blockShortsSessionSuggestions'
			], (result) => {
            browser.tabs.sendMessage(tabId, {
                action: "updateCSS",
                blockSearchSuggestions: result.blockSearchSuggestions !== false,
				blockVoiceSearch: result.blockVoiceSearch !== false,
				blockSurveys: result.blockSurveys !== false,
                blockShortsLink: result.blockShortsLink !== false,
                blockShortsHomepageSuggestions: result.blockShortsHomepageSuggestions !== false,
                blockShortsSessionSuggestions: result.blockShortsSessionSuggestions !== false
            }).catch(() => {});
        });
    }
});
