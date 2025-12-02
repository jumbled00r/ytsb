const DEFAULT_SETTINGS = {
	'blockSearchSuggestions': true,
	'blockVoiceSearch': true,
	'blockProgressFocus': true,
	'blockPlaybackOnNav': true,
	'blockMiniplayer': true,
	'blockHomepage': false,
	'blockAIrec': true,
	'blockAIsessionAsk': true,
	'blockAIsessionVideoSummary': true,
	'blockAIsessionPlaylists': true,
	'blockPlayables': true,
	'blockPremiumNag': true,
	'blockSurveys': true,
	'blockSponsor': true,
	'blockClip': true,
	'blockChipBar': false,
	'blockComments': false,
	'blockRelatedSessionSuggestions': false,
	'blockRelatedSessionEndCards': true,
	'blockDownloadsLink': true,
	'blockExploreSection': true,
	'blockMoreSection': true,
	'blockShortsLink': true,
	'blockShortsHomepageSuggestions': true,
	'blockShortsSessionSuggestions': true,
	'blockShortsSearchSuggestions': true,
	'debug': false
};

function resolveSetting(key, result) {
	if (result.hasOwnProperty(key)) {
		return result[key];
	}
	return DEFAULT_SETTINGS[key];
}

const ALL_SETTING_KEYS = Object.keys(DEFAULT_SETTINGS);
