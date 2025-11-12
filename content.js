const SEARCH_SUGGESTIONS_STYLE_ID = 'yt-search-suggestions-block-style';
const VOICE_SEARCH_STYLE_ID = 'yt-voice-search-block-style';
const PREMIUM_NAG_STYLE_ID = 'yt-premium-nag-block-style';
const SURVEYS_STYLE_ID = 'yt-surveys-block-style';
const SPONSOR_STYLE_ID = 'yt-sponsor-block-style';
const CLIP_STYLE_ID = 'yt-clip-block-style';
const COMMENTS_STYLE_ID = 'yt-comments-block-style';
const SHORTS_LINK_STYLE_ID = 'yt-shorts-link-block-style';
const SHORTS_HOMEPAGE_SUGGESTIONS_STYLE_ID = 'yt-shorts-homepage-suggestions-block-style';
const SHORTS_SESSION_SUGGESTIONS_STYLE_ID = 'yt-shorts-session-suggestions-block-style';

const SEARCH_SUGGESTIONS_CSS = `
div.ytSearchboxComponentSuggestionsContainer {
	display: none !important;
}
`;

const VOICE_SEARCH_CSS = `
#voice-search-button {
	display: none !important;
}
`;

const PREMIUM_NAG_CSS = `
yt-mealbar-promo-renderer,
tp-yt-paper-toast#toast.toast-button.style-scope.yt-notification-action-renderer {
    display: none !important;
}
`;

const SURVEYS_CSS = `
ytd-inline-survey-renderer {
	display: none !important;
}
`;

const SPONSOR_CSS = `
button-view-model:has(button[aria-label="Thanks"]),
ytd-creator-store-chip-bar-renderer,
ytd-commerce-button-renderer,
ytd-membership-item-renderer,
yt-live-chat-paid-sticker-button-renderer,
#chips-and-icon-grid,
#merch-shelf,
#ticket-shelf,
#purchase-button,
#sponsor-button {
    display: none !important;
}
`;

const CLIP_CSS = `
button-view-model:has(button[aria-label="Clip"]) {
    display: none !important;
}
`;

const COMMENTS_CSS = `
ytd-comments {
	display: none !important;
}
`;

const SHORTS_LINK_CSS = `
a[title="Shorts"] {
  display: none !important;
}
`;

const SHORTS_HOMEPAGE_SUGGESTIONS_CSS = `
ytd-rich-shelf-renderer[is-shorts] {
	display: none !important;
}
`;

const SHORTS_SESSION_SUGGESTIONS_CSS = `
ytd-reel-shelf-renderer {
	display: none !important;
}
`;

function applyCSS(css, styleId) {
	let style = document.getElementById(styleId);
	if (!style) {
		style = document.createElement('style');
		style.id = styleId;
		(document.head || document.documentElement).appendChild(style);
	}
	style.textContent = css;
}

function removeCSS(styleId) {
	const style = document.getElementById(styleId);
	if (style) {
		style.remove();
	}
}

function updateBlocking(
	blockSearchSuggestions,
	blockVoiceSearch,
	blockPremiumNag,
	blockSurveys,
	blockSponsor,
	blockClip,
	blockComments,
	blockShortsLink,
	blockShortsHomepageSuggestions,
	blockShortsSessionSuggestions) {

	if (blockSearchSuggestions) {
		applyCSS(SEARCH_SUGGESTIONS_CSS, SEARCH_SUGGESTIONS_STYLE_ID);
	} else {
		removeCSS(SEARCH_SUGGESTIONS_STYLE_ID);
	}

	if (blockVoiceSearch) {
		applyCSS(VOICE_SEARCH_CSS, VOICE_SEARCH_STYLE_ID);
	} else {
		removeCSS(VOICE_SEARCH_STYLE_ID);
	}
	
	if (blockPremiumNag) {
		applyCSS(PREMIUM_NAG_CSS, PREMIUM_NAG_STYLE_ID);
	} else {
		removeCSS(PREMIUM_NAG_STYLE_ID);
	}

	if (blockSurveys) {
		applyCSS(SURVEYS_CSS, SURVEYS_STYLE_ID);
	} else {
		removeCSS(SURVEYS_STYLE_ID);
	}

	if (blockSponsor) {
		applyCSS(SPONSOR_CSS, SPONSOR_STYLE_ID);
	} else {
		removeCSS(SPONSOR_STYLE_ID);
	}

	if (blockClip) {
		applyCSS(CLIP_CSS, CLIP_STYLE_ID);
	} else {
		removeCSS(CLIP_STYLE_ID);
	}

	if (blockComments) {
		applyCSS(COMMENTS_CSS, COMMENTS_STYLE_ID);
	} else {
		removeCSS(COMMENTS_STYLE_ID);
	}

	if (blockShortsLink) {
		applyCSS(SHORTS_LINK_CSS, SHORTS_LINK_STYLE_ID);
	} else {
		removeCSS(SHORTS_LINK_STYLE_ID);
	}

	if (blockShortsHomepageSuggestions) {
		applyCSS(SHORTS_HOMEPAGE_SUGGESTIONS_CSS, SHORTS_HOMEPAGE_SUGGESTIONS_STYLE_ID);
	} else {
		removeCSS(SHORTS_HOMEPAGE_SUGGESTIONS_STYLE_ID);
	}

	if (blockShortsSessionSuggestions) {
		applyCSS(SHORTS_SESSION_SUGGESTIONS_CSS, SHORTS_SESSION_SUGGESTIONS_STYLE_ID);
	} else {
		removeCSS(SHORTS_SESSION_SUGGESTIONS_STYLE_ID);
	}
}

browser.runtime.onMessage.addListener((request) => {
	if (request.action === "updateCSS") {
		updateBlocking(
			request.blockSearchSuggestions,
			request.blockVoiceSearch,
			request.blockPremiumNag,
			request.blockSurveys,
			request.blockSponsor,
			request.blockClip,
			request.blockComments,
			request.blockShortsLink,
			request.blockShortsHomepageSuggestions,
			request.blockShortsSessionSuggestions);
	}
});

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
	const blockSearchSuggestions = result.blockSearchSuggestions !== false;
	const blockVoiceSearch = result.blockVoiceSearch !== false;
	const blockPremiumNag = result.blockPremiumNag !== false;
	const blockSurveys = result.blockSurveys !== false;
	const blockSponsor = result.blockSponsor !== false;
	const blockClip = result.blockClip !== false;
	const blockComments = result.blockComments !== false;
	const blockShortsLink = result.blockShortsLink !== false;
	const blockShortsHomepageSuggestions = result.blockShortsHomepageSuggestions !== false;
	const blockShortsSessionSuggestions = result.blockShortsSessionSuggestions !== false;
	updateBlocking(
		blockSearchSuggestions,
		blockVoiceSearch,
		blockPremiumNag,
		blockSurveys,
		blockSponsor,
		blockClip,
		blockComments,
		blockShortsLink,
		blockShortsHomepageSuggestions,
		blockShortsSessionSuggestions);
	});
