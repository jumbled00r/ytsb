browser.runtime.onInstalled.addListener(() => {
	browser.storage.local.set({
		blockSearchSuggestions: true,
		blockVoiceSearch: true,
		blockPremiumNag: true,
		blockSurveys: true,
		blockSponsor: true,
		blockClip: true,
		blockComments: false,
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
			'blockPremiumNag',
			'blockSurveys',
			'blockSponsor',
			'blockClip',
			'blockComments',
			'blockShortsLink',
			'blockShortsHomepageSuggestions',
			'blockShortsSessionSuggestions'
			], (result) => {
			browser.tabs.sendMessage(tabId, {
				action: "updateCSS",
				blockSearchSuggestions: result.blockSearchSuggestions !== false,
				blockVoiceSearch: result.blockVoiceSearch !== false,
				blockPremiumNag: result.blockPremiumNag !== false,
				blockSurveys: result.blockSurveys !== false,
				blockSponsor: result.blockSponsor !== false,
				blockClip: result.blockClip !== false,
				blockComments: result.blockComments !== false,
				blockShortsLink: result.blockShortsLink !== false,
				blockShortsHomepageSuggestions: result.blockShortsHomepageSuggestions !== false,
				blockShortsSessionSuggestions: result.blockShortsSessionSuggestions !== false
			}).catch(() => {});
		});
	}
});
