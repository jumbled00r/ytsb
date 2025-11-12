document.addEventListener('DOMContentLoaded', () => {
	const toggleSearchSuggestions = document.getElementById('toggleSearchSuggestions');
	const toggleVoiceSearch = document.getElementById('toggleVoiceSearch');
	const togglePremiumNag = document.getElementById('togglePremiumNag');
	const toggleSurveys = document.getElementById('toggleSurveys');
	const toggleSponsor = document.getElementById('toggleSponsor');
	const toggleClip = document.getElementById('toggleClip');
	const toggleComments = document.getElementById('toggleComments');
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
	
	document.body.classList.add('no-transition');

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
		toggleSearchSuggestions.checked = result.blockSearchSuggestions !== false;
		toggleVoiceSearch.checked = result.blockVoiceSearch !== false;
		togglePremiumNag.checked = result.blockPremiumNag !== false;
		toggleSurveys.checked = result.blockSurveys !== false;
		toggleSponsor.checked = result.blockSponsor !== false;
		toggleClip.checked = result.blockClip !== false;
		toggleComments.checked = result.blockComments === true;
		toggleShortsLink.checked = result.blockShortsLink !== false;
		toggleShortsHomepageSuggestions.checked = result.blockShortsHomepageSuggestions !== false;
		toggleShortsSessionSuggestions.checked = result.blockShortsSessionSuggestions !== false;

		setTimeout(() => {
			document.body.classList.remove('no-transition');
		}, 100);
	});

	function saveAndApplySettings() {
		const blockSearchSuggestions = toggleSearchSuggestions.checked;
		const blockVoiceSearch = toggleVoiceSearch.checked;
		const blockPremiumNag = togglePremiumNag.checked;
		const blockSurveys = toggleSurveys.checked;
		const blockSponsor = toggleSponsor.checked;
		const blockClip = toggleClip.checked;
		const blockComments = toggleComments.checked;
		const blockShortsLink = toggleShortsLink.checked;
		const blockShortsHomepageSuggestions = toggleShortsHomepageSuggestions.checked;
		const blockShortsSessionSuggestions = toggleShortsSessionSuggestions.checked;

		browser.storage.local.set({
			blockSearchSuggestions,
			blockVoiceSearch,
			blockPremiumNag,
			blockSurveys,
			blockSponsor,
			blockClip,
			blockComments,
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
						blockPremiumNag: blockPremiumNag,
						blockSurveys: blockSurveys,
						blockSponsor: blockSponsor,
						blockClip: blockClip,
						blockComments: blockComments,
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
	togglePremiumNag.addEventListener('change', saveAndApplySettings);
	toggleSurveys.addEventListener('change', saveAndApplySettings);
	toggleSponsor.addEventListener('change', saveAndApplySettings);
	toggleClip.addEventListener('change', saveAndApplySettings);
	toggleComments.addEventListener('change', saveAndApplySettings);
	toggleShortsLink.addEventListener('change', saveAndApplySettings);
	toggleShortsHomepageSuggestions.addEventListener('change', saveAndApplySettings);
	toggleShortsSessionSuggestions.addEventListener('change', saveAndApplySettings);
});
