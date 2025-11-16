importScripts('shim.js');

browser.runtime.onInstalled.addListener(() => {
	browser.storage.local.set({
		blockSearchSuggestions: true,
		blockVoiceSearch: true,
		blockProgressFocus: true,
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
		blockRelatedSessionEndCards: true,
		blockDownloadsLink: true,
		blockExploreSection: true,
		blockMoreSection: true,
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
			'blockProgressFocus',
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
			'blockRelatedSessionEndCards',
			'blockDownloadsLink',
			'blockExploreSection',
			'blockMoreSection',
			'blockShortsLink',
			'blockShortsHomepageSuggestions',
			'blockShortsSessionSuggestions',
			'blockShortsSearchSuggestions'
			], (result) => {
			browser.tabs.sendMessage(tabId, {
				action: "updateCSS",
				blockSearchSuggestions: result.blockSearchSuggestions !== false,
				blockVoiceSearch: result.blockVoiceSearch !== false,
				blockProgressFocus: result.blockProgressFocus !== false,
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
				blockRelatedSessionEndCards: result.blockRelatedSessionEndCards !== false,
				blockDownloadsLink: result.blockDownloadsLink !== false,
				blockExploreSection: result.blockExploreSection !== false,
				blockMoreSection: result.blockMoreSection !== false,
				blockShortsLink: result.blockShortsLink !== false,
				blockShortsHomepageSuggestions: result.blockShortsHomepageSuggestions !== false,
				blockShortsSessionSuggestions: result.blockShortsSessionSuggestions !== false,
				blockShortsSearchSuggestions: result.blockShortsSearchSuggestions !== false
			}).catch(() => {});
		});
	}
});
