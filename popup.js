document.addEventListener('DOMContentLoaded', () => {
	const allToggles = {
		'toggleSearchSuggestions': 'blockSearchSuggestions',
		'toggleVoiceSearch': 'blockVoiceSearch',
		'toggleProgressFocus': 'blockProgressFocus',
		'toggleAIrec': 'blockAIrec',
		'toggleAIsessionAsk': 'blockAIsessionAsk',
		'toggleAIsessionVideoSummary': 'blockAIsessionVideoSummary',
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
	};

	const storageKeys = Object.values(allToggles);

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
			browser.tabs.query({url: "*://*.youtube.com/*"}, (tabs) => {
				tabs.forEach((tab) => {
					browser.tabs.sendMessage(tab.id, {
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
			});
		});
	}

	browser.storage.local.get(storageKeys, (result) => {
		for (const [toggleId, storageKey] of Object.entries(allToggles)) {
			const toggleElement = document.getElementById(toggleId);
			if (toggleElement) {
				if (storageKey === 'blockChipBar' || storageKey === 'blockComments' || 
					storageKey === 'blockRelatedSessionSuggestions') {
					toggleElement.checked = result[storageKey] === true;
				} else {
					toggleElement.checked = result[storageKey] !== false;
				}
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
