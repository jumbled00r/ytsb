document.addEventListener('DOMContentLoaded', () => {
	const allToggles = {
		'toggleSearchSuggestions': 'blockSearchSuggestions',
		'toggleVoiceSearch': 'blockVoiceSearch',
		'toggleProgressFocus': 'blockProgressFocus',
		'togglePlaybackOnNav': 'blockPlaybackOnNav',
		'toggleMiniplayer': 'blockMiniplayer',
		'toggleHomepage': 'blockHomepage',
		'toggleAIrec': 'blockAIrec',
		'toggleAIplaylists': 'blockAIplaylists',
		'toggleAIsessionAsk': 'blockAIsessionAsk',
		'toggleAIsessionVideoSummary': 'blockAIsessionVideoSummary',
		'toggleMovies': 'blockMovies',
		'togglePlayables': 'blockPlayables',
		'togglePremiumNag': 'blockPremiumNag',
		'toggleSurveys': 'blockSurveys',
		'toggleSponsor': 'blockSponsor',
		'toggleClip': 'blockClip',
		'toggleChipBar': 'blockChipBar',
		'toggleComments': 'blockComments',
		'toggleRelatedSessionSuggestions': 'blockRelatedSessionSuggestions',
		'toggleRelatedSessionEndCards': 'blockRelatedSessionEndCards',
		'toggleDownloadsLink': 'blockDownloadsLink',
		'toggleExploreSection': 'blockExploreSection',
		'toggleMoreSection': 'blockMoreSection',
		'toggleShortsLink': 'blockShortsLink',
		'toggleShortsHomepageSuggestions': 'blockShortsHomepageSuggestions',
		'toggleShortsSessionSuggestions': 'blockShortsSessionSuggestions',
		'toggleShortsSearchSuggestions': 'blockShortsSearchSuggestions',
		'toggleDebug': 'debug'
	};
	const storageKeys = Object.values(allToggles);
	const urlParams = new URLSearchParams(window.location.search);
	const platform = urlParams.get('platform');
	if (platform === 'mobile') {
		let scaleFactor = window.innerWidth / 435;
		document.body.style.setProperty('min-width', 'unset');
		document.body.style.transformOrigin = '0 0';
		document.body.style.transform = `scale(${scaleFactor})`;
		document.body.style.width = '410px';
	}
	function updateBackground(isDark) {
		document.body.style.setProperty('--background-color', isDark ? '#202020' : '#f0f0f0');
		document.body.style.setProperty('--text-color', isDark ? '#ffffff' : '#000000');
	}
	if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
		updateBackground(true);
	} else {
		updateBackground(false);
	}
	window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
		updateBackground(event.matches);
	});
	document.body.classList.add('no-transition');
	function broadcastAllSettings() {
		browser.storage.local.get(storageKeys, (result) => {
			const settingsToSend = {
				action: "updateCSS"
			};
			ALL_SETTING_KEYS.forEach(key => {
				settingsToSend[key] = resolveSetting(key, result);
			});
			browser.tabs.query({url: "*://*.youtube.com/*"}, (tabs) => {
				tabs.forEach((tab) => {
					browser.tabs.sendMessage(tab.id, settingsToSend).catch(() => {});
				});
			});
		});
	}
	browser.storage.local.get(storageKeys, (result) => {
		for (const [toggleId, storageKey] of Object.entries(allToggles)) {
			const toggleElement = document.getElementById(toggleId);
			if (toggleElement) {
				toggleElement.checked = resolveSetting(storageKey, result);
			}
		}
		setTimeout(() => {
			document.body.classList.remove('no-transition');
		}, 100);
	});
	function saveAndApplySettings(event) {
		const element = event.target;
		if (!element || !element.id) return;
		const storageKey = allToggles[element.id];
		const newValue = element.checked;
		if (storageKey) {
			browser.storage.local.set({
				[storageKey]: newValue
			}, broadcastAllSettings);
		}
	}
	for (const toggleId of Object.keys(allToggles)) {
		const toggleElement = document.getElementById(toggleId);
		if (toggleElement) {
			toggleElement.addEventListener('change', saveAndApplySettings);
		}
	}
});
