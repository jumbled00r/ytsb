const SEARCH_SUGGESTIONS_STYLE_ID = 'yt-search-suggestions-block-style';
const VOICE_SEARCH_STYLE_ID = 'yt-voice-search-block-style';
const AI_REC_STYLE_ID = 'yt-ai-rec-block-style';
const AI_SESSION_ASK_STYLE_ID = 'yt-ai-session-ask-block-style';
const AI_SESSION_VIDEO_SUMMARY_STYLE_ID = 'yt-ai-session-video-summary-block-style';
const PLAYABLES_STYLE_ID = 'yt-playables-block-style';
const PREMIUM_NAG_STYLE_ID = 'yt-premium-nag-block-style';
const SURVEYS_STYLE_ID = 'yt-surveys-block-style';
const SPONSOR_STYLE_ID = 'yt-sponsor-block-style';
const CLIP_STYLE_ID = 'yt-clip-block-style';
const CHIP_BAR_STYLE_ID = 'yt-chip-bar-block-style';
const COMMENTS_STYLE_ID = 'yt-comments-block-style';
const RELATED_SESSION_SUGGESTIONS_STYLE_ID = 'yt-related-session-suggestions-block-style';
const RELATED_SESSION_END_CARDS_STYLE_ID = 'yt-related-session-end-cards-block-style';
const DOWNLOADS_LINK_STYLE_ID = 'yt-downloads-link-block-style';
const SHORTS_LINK_STYLE_ID = 'yt-shorts-link-block-style';
const SHORTS_HOMEPAGE_SUGGESTIONS_STYLE_ID = 'yt-shorts-homepage-suggestions-block-style';
const SHORTS_SESSION_SUGGESTIONS_STYLE_ID = 'yt-shorts-session-suggestions-block-style';
const SHORTS_SEARCH_SUGGESTIONS_STYLE_ID = 'yt-shorts-search-suggestions-block-style';

let currentPathName = location.pathname;
let videoElement = null;
let blockExploreSectionGlobal = false;
let blockMoreSectionGlobal = false;
let blockPlaybackOnNavGlobal = false;
let blockHomepageGlobal = false;
let debugGlobal = false;

const SEARCH_SUGGESTIONS_CSS = `
.ytSearchboxComponentSuggestionsContainer {
	display: none !important;
}
`;

const VOICE_SEARCH_CSS = `
#voice-search-button {
	display: none !important;
}
`;

const AI_REC_CSS = `
ytd-feed-nudge-renderer,
ytd-statement-banner-renderer,
yt-talk-to-recs-view-model,
ytd-rich-section-renderer:has(ytd-talk-to-recs-flow-renderer) {
	display: none !important;
}
`;

const AI_SESSION_ASK_CSS = `
yt-button-view-model:has(button[aria-label="Ask"]) {
	display: none !important;
}
`;

const AI_SESSION_VIDEO_SUMMARY_CSS = `
ytd-expandable-metadata-renderer[has-video-summary] {
	display: none !important;
}
`;

const PLAYABLES_CSS = `
ytd-rich-shelf-renderer:has(a[href="/playables"]) {
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
ytd-rich-item-renderer:has(.badge-style-type-members-only),
yt-live-chat-paid-sticker-button-renderer,
#donation-shelf,
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

const CHIP_BAR_CSS = `
ytd-feed-filter-chip-bar-renderer {
	display: none !important;
}
#frosted-glass.with-chipbar {
	height: 56px !important;
}
`;

const COMMENTS_CSS = `
ytd-comments {
	display: none !important;
}
`;

const RELATED_SESSION_SUGGESTIONS_CSS = `
#items.style-scope.ytd-watch-next-secondary-results-renderer,
#secondary.style-scope.ytd-watch-flexy {
	display: none !important;
}
`;

const RELATED_SESSION_END_CARDS_CSS = `
.ytp-fullscreen-grid-stills-container > .ytp-modern-videowall-still {
	display: none !important;
}
`;

const DOWNLOADS_LINK_CSS = `
ytd-download-button-renderer,
ytd-mini-guide-entry-renderer a[title="Downloads"],
ytd-guide-downloads-entry-renderer {
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

const SHORTS_SEARCH_SUGGESTIONS_CSS = `
ytd-video-renderer:has(ytd-thumbnail-overlay-time-status-renderer[overlay-style="SHORTS"]),
grid-shelf-view-model:has(ytm-shorts-lockup-view-model) {
	display: none !important;
}
`;

lockedFunctions = [];

function throttle(func, delay) {
	const funcName = func.name;	
	let timeoutId = null;
	return function() {
		if (lockedFunctions.includes(funcName)) {
			if (debugGlobal) {
				console.log(`[ytsb] ${funcName}() is locked.`);
			}
			return;
		}
		const context = this;
		const args = arguments;
		if (!timeoutId) {
			timeoutId = setTimeout(() => {
				func.apply(context, args);
				if (debugGlobal) {
					console.log(`[ytsb] ${funcName}() not throttled.`)
				}
				timeoutId = null;
			}, delay);
		} else if (debugGlobal) {
			console.log(`[ytsb] ${funcName}() throttled.`);
		}
	};
}

function attempt(func, max_attempts, delay, overrideLock = false) {
	const funcName = func.name;
	if (!overrideLock) {
		if (lockedFunctions.includes(funcName)) {
			if (debugGlobal) {
				console.log(`[ytsb] ${funcName}() is locked.`);
			}
			return;
		}
		lockedFunctions.push(funcName);
	}
	let attempts = 0;
	let intervalId;
	const cleanup = () => {
		clearInterval(intervalId);
		if (!overrideLock) {
			lockedFunctions = lockedFunctions.filter(name => name !== funcName);
		}
	};
	intervalId = setInterval(() => {
		const success = func();
		attempts++;
		if (success) {
			if (debugGlobal) {
				console.log(`[ytsb] ${funcName}() attempt ${attempts} succeeded.`);
			}
			cleanup();
			return;
		}
		if (attempts >= max_attempts) {
			if (debugGlobal) {
				console.log(`[ytsb] ${funcName}() max_attempts (${attempts}) reached.`);
			}
			cleanup();
		}
	}, delay);
}

function blockSideBarSections() {
	const sections = document.querySelectorAll('ytd-guide-section-renderer');
	if (sections.length < 6) {
		return false;
	}
	for (const section of sections) {
		const element = section.querySelector('#guide-section-title');
		if (!element) {
			continue;
		}
		const title = element.textContent.trim();
		if (!title) {
			continue;
		}
		let shouldBlock = false;
		switch (title) {
			case 'Explore':
				shouldBlock = blockExploreSectionGlobal;
				break;
			case 'More from YouTube':
				shouldBlock = blockMoreSectionGlobal;
				break;
			default:
				continue;
		}
		if (shouldBlock) {
			section.style.setProperty('display', 'none', 'important');
		} else {
			section.style.removeProperty('display');
		}
	}
	return true;
}

function togglePlayback() {
	if (blockPlaybackOnNavGlobal) {
		if (videoElement && !videoElement.paused) {
			videoElement.pause();
		}
	}
}

function redirectHomepage() {
	if (blockHomepageGlobal) {
		if (location.pathname === '/') {
			location.href = '/feed/subscriptions';
		}
	}
}

function setVideoElement() {
	videoElement = document.querySelector('.html5-main-video');
	if (videoElement) {
		return true;
	}
	return false;
}

let isNavigationListenerAttached = false;

function setupNavigationListener() {
	if (isNavigationListenerAttached) {
		return;
	}
	document.addEventListener('yt-navigate-start', function(event) {
		if (currentPathName === '/watch') {
			togglePlayback();
		}
		redirectHomepage();
	});
	document.addEventListener('yt-navigate-finish', function(event) {
		currentPathName = location.pathname;
		if (currentPathName === '/watch') {
			attempt(setVideoElement, 30, 75, true);
		}
		attempt(blockSideBarSections, 30, 75, true);
	});
	redirectHomepage();
	isNavigationListenerAttached = true;
}

let isGuideListenerAttached = false;

function setupGuideButtonListener() {
	if (isGuideListenerAttached) {
		return true;
	}
	const guideButton = document.querySelector('#guide-button');
	if (guideButton) {
		guideButton.addEventListener('click', () => {
			attempt(blockSideBarSections, 30, 75, true);
		});
		isGuideListenerAttached = true;
		return true;
	}
	return false;
}

let isResizeListenerAttached = false;
const throttledBlockSideBarSections = throttle(blockSideBarSections, 75);

function setupResizeListener() {
	if (isResizeListenerAttached) {
		return;
	}
	window.addEventListener('resize', throttledBlockSideBarSections);
	isResizeListenerAttached = true;
}

let progressFocusListener = null;

function toggleProgressFocus(enable) {
	if (progressFocusListener) {
		document.removeEventListener('focusin', progressFocusListener, true); 
		progressFocusListener = null;
	}
	if (!enable) {
		return;
	}
	progressFocusListener = (event) => {
		if (!window.location.pathname.startsWith('/watch') || !videoElement) {
			return;
		}
		const focusedElement = event.target;
		const isProgressBarControl =
			focusedElement.closest('.ytp-progress-bar-container') ||
			focusedElement.closest('.ytp-volume-control-hover');
		if (isProgressBarControl) {
			setTimeout(() => {
				videoElement.focus();
			}, 0);
		}
	};
	document.addEventListener('focusin', progressFocusListener, true);
}

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
	blockProgressFocus,
	blockPlaybackOnNav,
	blockHomepage,
	blockAIrec,
	blockAIsessionAsk,
	blockAIsessionVideoSummary,
	blockPlayables,
	blockPremiumNag,
	blockSurveys,
	blockSponsor,
	blockClip,
	blockChipBar,
	blockComments,
	blockRelatedSessionSuggestions,
	blockRelatedSessionEndCards,
	blockDownloadsLink,
	blockExploreSection,
	blockMoreSection,
	blockShortsLink,
	blockShortsHomepageSuggestions,
	blockShortsSessionSuggestions,
	blockShortsSearchSuggestions,
	debug) {
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
	toggleProgressFocus(blockProgressFocus);
	blockPlaybackOnNavGlobal = blockPlaybackOnNav;
	blockHomepageGlobal = blockHomepage;
	redirectHomepage();
	if (blockAIrec) {
		applyCSS(AI_REC_CSS, AI_REC_STYLE_ID);
	} else {
		removeCSS(AI_REC_STYLE_ID);
	}
	if (blockAIsessionAsk) {
		applyCSS(AI_SESSION_ASK_CSS, AI_SESSION_ASK_STYLE_ID);
	} else {
		removeCSS(AI_SESSION_ASK_STYLE_ID);
	}
	if (blockAIsessionVideoSummary) {
		applyCSS(AI_SESSION_VIDEO_SUMMARY_CSS, AI_SESSION_VIDEO_SUMMARY_STYLE_ID);
	} else {
		removeCSS(AI_SESSION_VIDEO_SUMMARY_STYLE_ID);
	}
	if (blockPlayables) {
		applyCSS(PLAYABLES_CSS, PLAYABLES_STYLE_ID);
	} else {
		removeCSS(PLAYABLES_STYLE_ID);
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
	if (blockChipBar) {
		applyCSS(CHIP_BAR_CSS, CHIP_BAR_STYLE_ID);
	} else {
		removeCSS(CHIP_BAR_STYLE_ID);
	}
	if (blockComments) {
		applyCSS(COMMENTS_CSS, COMMENTS_STYLE_ID);
	} else {
		removeCSS(COMMENTS_STYLE_ID);
	}
	if (blockRelatedSessionSuggestions) {
		applyCSS(RELATED_SESSION_SUGGESTIONS_CSS, RELATED_SESSION_SUGGESTIONS_STYLE_ID);
	} else {
		removeCSS(RELATED_SESSION_SUGGESTIONS_STYLE_ID);
	}
	if (blockRelatedSessionEndCards) {
		applyCSS(RELATED_SESSION_END_CARDS_CSS, RELATED_SESSION_END_CARDS_STYLE_ID);
	} else {
		removeCSS(RELATED_SESSION_END_CARDS_STYLE_ID);
	}
	if (blockDownloadsLink) {
		applyCSS(DOWNLOADS_LINK_CSS, DOWNLOADS_LINK_STYLE_ID);
	} else {
		removeCSS(DOWNLOADS_LINK_STYLE_ID);
	}
	blockExploreSectionGlobal = blockExploreSection;
	blockMoreSectionGlobal = blockMoreSection;
	attempt(blockSideBarSections, 30, 75);
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
	if (blockShortsSearchSuggestions) {
		applyCSS(SHORTS_SEARCH_SUGGESTIONS_CSS, SHORTS_SEARCH_SUGGESTIONS_STYLE_ID);
	} else {
		removeCSS(SHORTS_SEARCH_SUGGESTIONS_STYLE_ID);
	}
	debugGlobal = debug;
}

browser.runtime.onMessage.addListener((request) => {
	if (request.action === "updateCSS") {
		updateBlocking(
			request.blockSearchSuggestions,
			request.blockVoiceSearch,
			request.blockProgressFocus,
			request.blockPlaybackOnNav,
			request.blockHomepage,
			request.blockAIrec,
			request.blockAIsessionAsk,
			request.blockAIsessionVideoSummary,
			request.blockPlayables,
			request.blockPremiumNag,
			request.blockSurveys,
			request.blockSponsor,
			request.blockClip,
			request.blockChipBar,
			request.blockComments,
			request.blockRelatedSessionSuggestions,
			request.blockRelatedSessionEndCards,
			request.blockDownloadsLink,
			request.blockExploreSection,
			request.blockMoreSection,
			request.blockShortsLink,
			request.blockShortsHomepageSuggestions,
			request.blockShortsSessionSuggestions,
			request.blockShortsSearchSuggestions,
			request.debug);
	}
});

browser.storage.local.get(ALL_SETTING_KEYS, (result) => {
	const settings = {};
	const keys = ALL_SETTING_KEYS;
	keys.forEach(key => {
		settings[key] = resolveSetting(key, result);
	});
	updateBlocking(
		settings.blockSearchSuggestions,
		settings.blockVoiceSearch,
		settings.blockProgressFocus,
		settings.blockPlaybackOnNav,
		settings.blockHomepage,
		settings.blockAIrec,
		settings.blockAIsessionAsk,
		settings.blockAIsessionVideoSummary,
		settings.blockPlayables,
		settings.blockPremiumNag,
		settings.blockSurveys,
		settings.blockSponsor,
		settings.blockClip,
		settings.blockChipBar,
		settings.blockComments,
		settings.blockRelatedSessionSuggestions,
		settings.blockRelatedSessionEndCards,
		settings.blockDownloadsLink,
		settings.blockExploreSection,
		settings.blockMoreSection,
		settings.blockShortsLink,
		settings.blockShortsHomepageSuggestions,
		settings.blockShortsSessionSuggestions,
		settings.blockShortsSearchSuggestions,
		settings.debug);
	setupNavigationListener();
	attempt(setupGuideButtonListener, 30, 75, true);
	setupResizeListener();
});
