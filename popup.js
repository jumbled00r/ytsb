document.addEventListener('DOMContentLoaded', () => {
	const toggleSearchSuggestions = document.getElementById('toggleSearchSuggestions');
	const toggleVoiceSearch = document.getElementById('toggleVoiceSearch');
	const toggleSurveys = document.getElementById('toggleSurveys');
	const toggleShortsLink = document.getElementById('toggleShortsLink');
	const toggleShortsHomepageSuggestions = 
		document.getElementById('toggleShortsHomepageSuggestions');
	const toggleShortsSessionSuggestions = 
		document.getElementById('toggleShortsSessionSuggestions');

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

	browser.storage.local.get([
		'blockSearchSuggestions',
		'blockVoiceSearch',
		'blockSurveys', 
		'blockShortsLink',
		'blockShortsHomepageSuggestions',
		'blockShortsSessionSuggestions'
		], (result) => {
		toggleSearchSuggestions.checked = result.blockSearchSuggestions !== false;
		toggleVoiceSearch.checked = result.blockVoiceSearch !== false;
		toggleSurveys.checked = result.blockSurveys !== false;
		toggleShortsLink.checked = result.blockShortsLink !== false;
		toggleShortsHomepageSuggestions.checked = result.blockShortsHomepageSuggestions !== false;
		toggleShortsSessionSuggestions.checked = result.blockShortsSessionSuggestions !== false;
	});

	function saveAndApplySettings() {
		const blockSearchSuggestions = toggleSearchSuggestions.checked;
		const blockVoiceSearch = toggleVoiceSearch.checked;
		const blockSurveys = toggleSurveys.checked;
		const blockShortsLink = toggleShortsLink.checked;
		const blockShortsHomepageSuggestions = toggleShortsHomepageSuggestions.checked;
		const blockShortsSessionSuggestions = toggleShortsSessionSuggestions.checked;

		browser.storage.local.set({
			blockSearchSuggestions,
			blockVoiceSearch,
			blockSurveys,
			blockShortsLink,
			blockShortsHomepageSuggestions,
			blockShortsSessionSuggestions
			}, () => {
			browser.tabs.query({url: "*://*.youtube.com/*"}, (tabs) => {
				tabs.forEach((tab) => {
					browser.tabs.sendMessage(tab.id, {
						action: "updateCSS",
						blockSearchSuggestions: blockSearchSuggestions,
						blockVoiceSearch: blockVoiceSearch,
						blockSurveys: blockSurveys,
						blockShortsLink: blockShortsLink,
						blockShortsHomepageSuggestions: blockShortsHomepageSuggestions,
						blockShortsSessionSuggestions: blockShortsSessionSuggestions
					});
				});
			});
		});
	}

	toggleSearchSuggestions.addEventListener('change', saveAndApplySettings);
	toggleVoiceSearch.addEventListener('change', saveAndApplySettings);
	toggleSurveys.addEventListener('change', saveAndApplySettings);
	toggleShortsLink.addEventListener('change', saveAndApplySettings);
	toggleShortsHomepageSuggestions.addEventListener('change', saveAndApplySettings);
	toggleShortsSessionSuggestions.addEventListener('change', saveAndApplySettings);
});
