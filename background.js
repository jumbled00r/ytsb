importScripts('shim.js');

browser.runtime.onInstalled.addListener(() => {
	browser.storage.local.set({
		blockSearchSuggestions: true,
		blockVoiceSearch: true,
		blockAIrec: true,
		blockAIsessionAsk: true,
		blockAIsessionVideoSummary: true,
		blockPlayables: true,
		blockPremiumNag: true,
		blockSurveys: true,
		blockSponsor: true,
		blockClip: true,
		blockChipBar: false,
		blockComments: false,
		blockRelatedSessionSuggestions: false,
		blockDownloadsLink: true,
		blockShortsLink: true,
		blockShortsHomepageSuggestions: true,
		blockShortsSessionSuggestions: true,
		blockShortsSearchSuggestions: true
	});
});

browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
	if (changeInfo.status === 'complete' && tab.url && tab.url.includes('youtube.com')) {
		browser.storage.local.get([
			'blockSearchSuggestions',
			'blockVoiceSearch',
			'blockAIrec',
			'blockAIsessionAsk',
			'blockAIsessionVideoSummary',
			'blockPlayables',
			'blockPremiumNag',
			'blockSurveys',
			'blockSponsor',
			'blockClip',
			'blockChipBar',
			'blockComments',
			'blockRelatedSessionSuggestions',
			'blockDownloadsLink',
			'blockShortsLink',
			'blockShortsHomepageSuggestions',
			'blockShortsSessionSuggestions',
			'blockShortsSearchSuggestions'
			], (result) => {
			browser.tabs.sendMessage(tabId, {
				action: "updateCSS",
				blockSearchSuggestions: result.blockSearchSuggestions !== false,
				blockVoiceSearch: result.blockVoiceSearch !== false,
				blockAIrec: result.blockAIrec !== false,
				blockAIsessionAsk: result.blockAIsessionAsk !== false,
				blockAIsessionVideoSummary: result.blockAIsessionVideoSummary !== false,
				blockPlayables: result.blockPlayables !== false,
				blockPremiumNag: result.blockPremiumNag !== false,
				blockSurveys: result.blockSurveys !== false,
				blockSponsor: result.blockSponsor !== false,
				blockClip: result.blockClip !== false,
				blockChipBar: result.blockChipBar === true,
				blockComments: result.blockComments === true,
				blockRelatedSessionSuggestions: result.blockRelatedSessionSuggestions === true,
				blockDownloadsLink: result.blockDownloadsLink !== false,
				blockShortsLink: result.blockShortsLink !== false,
				blockShortsHomepageSuggestions: result.blockShortsHomepageSuggestions !== false,
				blockShortsSessionSuggestions: result.blockShortsSessionSuggestions !== false,
				blockShortsSearchSuggestions: result.blockShortsSearchSuggestions !== false
			}).catch(() => {});
		});
	}
});
