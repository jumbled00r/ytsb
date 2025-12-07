const SEARCH_SUGGESTIONS_STYLE_ID = 'ytsb-search-suggestions';
const VOICE_SEARCH_STYLE_ID = 'ytsb-voice-search';
const MINIPLAYER_STYLE_ID = 'ytsb-miniplayer';
const AI_REC_STYLE_ID = 'ytsb-ai-rec';
const AI_PLAYLISTS_STYLE_ID = 'ytsb-ai-playlists';
const AI_SESSION_ASK_STYLE_ID = 'ytsb-ai-session-ask';
const AI_SESSION_VIDEO_SUMMARY_STYLE_ID = 'ytsb-ai-session-video-summary';
const MOVIES_STYLE_ID = 'ytsb-movies';
const PLAYABLES_STYLE_ID = 'ytsb-playables';
const PREMIUM_NAG_STYLE_ID = 'ytsb-premium-nag';
const SURVEYS_STYLE_ID = 'ytsb-surveys';
const SPONSOR_STYLE_ID = 'ytsb-sponsor';
const CLIP_STYLE_ID = 'ytsb-clip';
const CHIP_BAR_STYLE_ID = 'ytsb-chip-bar';
const COMMENTS_STYLE_ID = 'ytsb-comments';
const RELATED_SESSION_SUGGESTIONS_STYLE_ID = 'ytsb-related-session-suggestions';
const RELATED_SESSION_END_CARDS_STYLE_ID = 'ytsb-related-session-end-cards';
const DOWNLOADS_LINK_STYLE_ID = 'ytsb-downloads-link';
const EXPLORE_LINK_STYLE_ID = 'ytsb-explore-link';
const SHORTS_LINK_STYLE_ID = 'ytsb-shorts-link';
const SHORTS_HOMEPAGE_SUGGESTIONS_STYLE_ID = 'ytsb-shorts-homepage-suggestions';
const SHORTS_SESSION_SUGGESTIONS_STYLE_ID = 'ytsb-shorts-session-suggestions';
const SHORTS_SEARCH_SUGGESTIONS_STYLE_ID = 'ytsb-shorts-search-suggestions';

let currentPathName = location.pathname;
let videoElement = null;
let sidebarFound = false;
let blockExploreSectionGlobal = false;
let blockMoreSectionGlobal = false;
let blockPlaybackOnNavGlobal = false;
let blockMiniplayerGlobal = false;
let blockHomepageGlobal = false;
let debugGlobal = false;

const SEARCH_SUGGESTIONS_CSS = `
.ytSearchboxComponentSuggestionsContainer {
	display: none !important;
}
`;

const VOICE_SEARCH_CSS = `
.ytSearchboxComponentVoiceSearchWrapper,
.mobile-topbar-header-voice-search-button,
#voice-search-button {
	display: none !important;
}
`;

const MINIPLAYER_CSS = `
ytd-miniplayer {
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
button-view-model:has(button[aria-label="Ask"]),
yt-button-view-model:has(button[aria-label="Ask"]) {
	display: none !important;
}
`;

const AI_SESSION_VIDEO_SUMMARY_CSS = `
ytm-expandable-metadata-renderer,
ytd-expandable-metadata-renderer[has-video-summary] {
	display: none !important;
}
`;

const AI_PLAYLISTS_CSS = `
ytm-rich-item-renderer:has(a[href*="list=RD"]),
ytm-universal-watch-card-renderer:has(a[href*="list=RD"]),
ytd-rich-item-renderer:has(div[class*="content-id-RD"]),
yt-lockup-view-model:has(div[class*="content-id-RD"]),
ytd-playlist-panel-renderer[playlist-type^="RD"] {
	display: none !important;
}
`;

const MOVIES_CSS = `
ytm-compact-link-renderer:has(
	a[href*="/feed/storefront"]),
ytm-compact-channel-renderer:has(
	a[href*="/channel/UClgRkhTL3_hImCAmdLfDE4g"],
	a[href*="/channel/UCC7QOlwrWzQyOlZ1zpjOSjg"],
	a[href*="/@youtubetv"]),
ytm-video-with-context-renderer:has(
	ytm-badge[data-type="BADGE_STYLE_TYPE_YPC"]),
ytd-shelf-renderer:has(
	a[href*="/feed/storefront"]),
ytd-channel-renderer:has(
	a[href*="/channel/UClgRkhTL3_hImCAmdLfDE4g"],
	a[href*="/channel/UCC7QOlwrWzQyOlZ1zpjOSjg"],
	a[href*="/@youtubetv"]),
ytd-movie-renderer {
	display: none !important;
}
`;

const PLAYABLES_CSS = `
ytd-rich-shelf-renderer:has(a[href*="/playables"]) {
	display: none !important;
}
`;

const PREMIUM_NAG_CSS = `
ytm-compact-link-renderer:has(a[href="/premium"]),
yt-mealbar-promo-renderer,
tp-yt-paper-toast#toast {
	display: none !important;
}
`;

const SURVEYS_CSS = `
ytm-backstage-post-thread-renderer,
ytd-inline-survey-renderer {
	display: none !important;
}
`;

const SPONSOR_CSS = `
ytm-donation-shelf-renderer,
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
ytm-feed-filter-chip-bar-renderer,
ytd-feed-filter-chip-bar-renderer {
	display: none !important;
}
ytm-app.sticky-player {
	padding-top: 0px !important;
}
#frosted-glass.with-chipbar {
	height: 56px !important;
}
`;

const COMMENTS_CSS = `
yt-video-metadata-carousel-view-model:has(
	yt-comment-teaser-carousel-item-view-model),
ytd-comments {
	display: none !important;
}
`;

const RELATED_SESSION_SUGGESTIONS_CSS = `
.related-items-container,
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

const EXPLORE_LINK_CSS = `
ytm-chip-cloud-chip-renderer > .chip-container[aria-label="Explore"] {
	display: none !important;
}
`;

const SHORTS_LINK_CSS = `
ytm-pivot-bar-item-renderer:has(.pivot-shorts),
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
ytm-reel-shelf-renderer,
ytd-reel-shelf-renderer {
	display: none !important;
}
`;

const SHORTS_SEARCH_SUGGESTIONS_CSS = `
ytm-video-with-context-renderer:has(
	ytm-thumbnail-overlay-time-status-renderer[data-style="SHORTS"]),
ytd-video-renderer:has(
	ytd-thumbnail-overlay-time-status-renderer[overlay-style="SHORTS"]),
grid-shelf-view-model:has(ytm-shorts-lockup-view-model) {
	display: none !important;
}
`;

function throttle(func, delay) {
	let timeoutId = null;
	return function() {
		const context = this;
		const args = arguments;
		if (!timeoutId) {
			timeoutId = setTimeout(() => {
				func.apply(context, args);
				if (debugGlobal) {
					console.log(`[ytsb] ${func.name}() not throttled.`)
				}
				timeoutId = null;
			}, delay);
		} else if (debugGlobal) {
			console.log(`[ytsb] ${func.name}() throttled.`);
		}
	};
}

function attempt(func, max_attempts, delay) {
	let attempts = 0;
	const intervalId = setInterval(() => {
		const success = func();
		attempts++;
		if (success) {
			if (debugGlobal) {
				console.log(`[ytsb] ${func.name}() attempt ${attempts} succeeded.`);
			}
			clearInterval(intervalId);
			return;
		}
		if (attempts >= max_attempts) {
			if (debugGlobal) {
				console.log(`[ytsb] ${func.name}() max_attempts (${attempts}) reached.`);
			}
			clearInterval(intervalId);
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
	sidebarFound = true;
	return true;
}

function closeMiniplayer() {
	const closeButton = document.querySelector('.ytp-miniplayer-close-button');
	if (closeButton) {
		closeButton.click();
		return true; 
	}
	return false;
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
	if (window.location.hostname.startsWith('m.')) {
		function checkNavigation() {
			if (location.pathname != currentPathName)
			{
				currentPathName = location.pathname;
				redirectHomepage();
			}
		}
		setInterval(checkNavigation, 2000);
	} else {
		document.addEventListener('yt-navigate-start', function(event) {
			if (blockPlaybackOnNavGlobal && currentPathName === '/watch') {
				if (videoElement && !videoElement.paused) {
					videoElement.pause();
				}
			}
			redirectHomepage();
		});
		document.addEventListener('yt-navigate-finish', function(event) {
			if (currentPathName === '/watch' && location.pathname !== '/watch') {
				if (blockMiniplayerGlobal) {
					attempt(closeMiniplayer, 30, 75);
				}
			}
			currentPathName = location.pathname;
			if (currentPathName === '/watch') {
				attempt(setVideoElement, 30, 75);
			}
			if (sidebarFound) {
				attempt(blockSideBarSections, 30, 75);
			}
		});
	}
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
			attempt(blockSideBarSections, 30, 75);
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
		if (location.pathname !== '/watch' || !videoElement) {
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
	blockMiniplayer,
	blockHomepage,
	blockAIrec,
	blockAIplaylists,
	blockAIsessionAsk,
	blockAIsessionVideoSummary,
	blockMovies,
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
	blockMiniplayerGlobal = blockMiniplayer
	if (blockMiniplayer) {
		closeMiniplayer();
		applyCSS(MINIPLAYER_CSS, MINIPLAYER_STYLE_ID);
	} else {
		removeCSS(MINIPLAYER_STYLE_ID);
	}
	blockHomepageGlobal = blockHomepage;
	setTimeout(redirectHomepage, 500);
	if (blockAIrec) {
		applyCSS(AI_REC_CSS, AI_REC_STYLE_ID);
	} else {
		removeCSS(AI_REC_STYLE_ID);
	}
	if (blockAIplaylists) {
		applyCSS(AI_PLAYLISTS_CSS, AI_PLAYLISTS_STYLE_ID);
	} else {
		removeCSS(AI_PLAYLISTS_STYLE_ID);
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
	if (blockMovies) {
		applyCSS(MOVIES_CSS, MOVIES_STYLE_ID);
	} else {
		removeCSS(MOVIES_STYLE_ID);
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
	if (blockExploreSection) {
		applyCSS(EXPLORE_LINK_CSS, EXPLORE_LINK_STYLE_ID);	
	} else {
		removeCSS(EXPLORE_LINK_STYLE_ID);
	}
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
			request.blockMiniplayer,
			request.blockHomepage,
			request.blockAIrec,
			request.blockAIplaylists,
			request.blockAIsessionAsk,
			request.blockAIsessionVideoSummary,
			request.blockMovies,
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
		settings.blockMiniplayer,
		settings.blockHomepage,
		settings.blockAIrec,
		settings.blockAIplaylists,
		settings.blockAIsessionAsk,
		settings.blockAIsessionVideoSummary,
		settings.blockMovies,
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
	attempt(setupGuideButtonListener, 30, 75);
	setupResizeListener();
});
