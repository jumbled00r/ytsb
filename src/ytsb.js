const YTSB_INIT_BLOCK_STYLE_ID = 'ytsb-init-style';
let initBlock = false;

function setupYTSBinitBlock() {
	if (initBlock) return;
	const styleBlock = document.createElement('style');
	styleBlock.textContent = `
	.${YTSB_INIT_BLOCK_STYLE_ID} body {
		visibility: hidden !important;
		overflow: hidden !important;
		opacity: 0 !important;
	}
	.${YTSB_INIT_BLOCK_STYLE_ID} html {
		visibility: hidden !important;
		overflow: hidden !important;
	}
	`;
	styleBlock.id = YTSB_INIT_BLOCK_STYLE_ID;
	const target = document.documentElement;
	if (target) {
		target.appendChild(styleBlock);
		target.classList.add(YTSB_INIT_BLOCK_STYLE_ID);
		initBlock = true;
	}
}

setupYTSBinitBlock();

function destroyYTSBinitBlock() {
	if (!initBlock) return;
	document.getElementById(YTSB_INIT_BLOCK_STYLE_ID).remove();
	const target = document.documentElement;
	target.classList.remove(YTSB_INIT_BLOCK_STYLE_ID);
	if (target.className === '') target.removeAttribute('class');
	initBlock = false;
}

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
let resolution = null;
const stdRes = [
	144, 240, 360, 480, 720, 1080, 1440, 2160, 4320
];
let stdResI = null;
let videoElement = null;
let checkPlayedID = null;
let keepPausedID = null;
let checkNavigationID = null;
let headerBarObserver = null;
let autoHDglobal = false;
let backgroundPlayState = false;
let isPlaylistPanelVisible = false;
let blockChipBarGlobal = false;
let blockExploreSectionGlobal = false;
let blockMoreSectionGlobal = false;
let exploreFound = true;
let moreFound = true;
let blockPlaybackOnNavGlobal = false;
let blockMiniplayerGlobal = false;
let blockHomepageGlobal = false;
let settingsInitialized = false;
let settingsApplied = false;
let initPaused = false;
let mobileDomain = false;
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
ytm-rich-section-renderer:has(a[href^="/feed/history"]),
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
	a[href^="/feed/storefront"]),
ytm-compact-channel-renderer:has(
	a[href^="/channel/UClgRkhTL3_hImCAmdLfDE4g"],
	a[href^="/channel/UCC7QOlwrWzQyOlZ1zpjOSjg"],
	a[href^="/@youtubetv"]),
ytm-video-with-context-renderer:has(
	ytm-badge[data-type="BADGE_STYLE_TYPE_YPC"]),
ytd-universal-watch-card-renderer:has(badge-shape[aria-label="$"]),
ytd-tvfilm-offer-module-renderer,
yt-lockup-view-model:has(.yt-badge-shape--commerce),
ytd-shelf-renderer:has(
	a[href^="/feed/storefront"]),
ytd-channel-renderer:has(
	a[href^="/channel/UClgRkhTL3_hImCAmdLfDE4g"],
	a[href^="/channel/UCC7QOlwrWzQyOlZ1zpjOSjg"],
	a[href^="/@youtubetv"]),
ytd-movie-renderer {
	display: none !important;
}
`;

const PLAYABLES_CSS = `
ytd-horizontal-card-list-renderer:has([href^="/gaming"]),
ytd-item-section-renderer:has(a[href^="/playables"]),
ytd-rich-shelf-renderer:has(a[href^="/playables"]) {
	display: none !important;
}
`;

const PREMIUM_NAG_CSS = `
ytm-compact-link-renderer:has(a[href^="/premium"]),
a[aria-label="Open App"],
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
ytd-live-chat-frame,
#teaser-carousel:has([aria-label*="chat"]),
ytd-comments {
	display: none !important;
}
`;

const RELATED_SESSION_SUGGESTIONS_CSS = `
.related-items-container,
ytm-item-section-renderer[section-identifier="related-items"],
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
.ytDownloadListItemViewModelHost,
ytd-guide-downloads-entry-renderer {
	display: none !important;
}
`;

const EXPLORE_LINK_CSS = `
ytm-chip-cloud-chip-renderer > .chip-container[aria-label="Explore"],
#teaser-carousel:has(a[href*="ytkids"]),
ytd-rich-metadata-renderer:has(a[href^="/gaming"]),
ytd-rich-metadata-renderer:has(a[href^="/podcasts"]),
ytd-rich-metadata-renderer:has(a[href^="/feed/storefront"]),
ytd-rich-metadata-renderer:has(a[href^="/channel/UC-9-kyTW8ZkZNDHQJ6FgpwQ"]),
ytd-rich-metadata-renderer:has(a[href^="/channel/UCEgdi0XIXXZ-qJOFPf4JSKw"]) {
	display: none !important;
}
`;

const SHORTS_LINK_CSS = `
ytm-pivot-bar-item-renderer:has(.pivot-shorts),
a[title="Shorts"],
a[href^="/shorts"] {
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
				timeoutId = null;
			}, delay);
		}
	};
}

function attempt(func, max_attempts, delay, callback) {
	let attempts = 0;
	const intervalID = setInterval(() => {
		const success = func();
		attempts++;
		if (success) {
			(debugGlobal) &&
				console.log(`[ytsb] ${func.name}() attempt ${attempts} succeeded.`);
			clearInterval(intervalID);
			if (callback) callback();
		}
		if (attempts >= max_attempts) {
			(debugGlobal) &&
				console.log(`[ytsb] ${func.name}() max_attempts (${attempts}) reached.`);
			clearInterval(intervalID);
			if (callback) callback();
		}
	}, delay);
}

function blockSidebarSections() {
	if (exploreFound && moreFound) return true;
	const sections = document.querySelectorAll('ytd-guide-section-renderer');
	if (sections.length === 0) return false;
	for (const section of sections) {
		const element = section.querySelector('#guide-section-title');
		if (!element) continue;
		const title = element.textContent.trim();
		if (!title) continue;
		let shouldBlock = false;
		switch (title) {
			case 'Explore':
				if (exploreFound) continue;
				exploreFound = true;
				shouldBlock = blockExploreSectionGlobal;
				break;
			case 'More from YouTube':
				if (moreFound) continue;
				moreFound = true;
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
	return (exploreFound && moreFound);
}

function closeMiniplayer() {
	const closeButton = document.querySelector('.ytp-miniplayer-close-button');
	if (closeButton) {
		setTimeout(() => {
			closeButton.click();
		}, 0);
		return true; 
	}
	return false;
}

function setVideoQuality() {
	function findElement(el_options, el_selection, label_lowercase) {
		return Array.from(document.querySelectorAll(el_options)).find(item => 
			item.querySelector(el_selection)?.textContent?.trim().toLowerCase() === label_lowercase);
	}
	function findVideoQualityOption(quality_options, quality_label, res) {
		return Array.from(document.querySelectorAll(quality_options)).find(el => {
			const label = 
				el.querySelector(quality_label)?.textContent?.toLowerCase();
			const includesRes = label?.includes(`${res}p`);
			const isPremium = label?.includes('premium');
			return includesRes && !isPremium;
		});
	}
	if (mobileDomain) {
		function mvq_settings() {
			const settingsButton = 
				document.querySelector('.icon-button.player-settings-icon');
			if (!settingsButton) return false;
			setTimeout(() => {
				settingsButton.click();
			}, 0);
			return true;
		}
		function mvq_qualityListOption() {
			const qualityListOption = findElement('yt-list-item-view-model', '.yt-list-item-view-model__title', 'quality');
			if (!qualityListOption) return false;
			setTimeout(() => {
				qualityListOption.click();
			}, 1);
			return true;
		}
		function mvq_qualityOption() {
			if (Array.from(document.querySelectorAll('yt-list-item-view-model')).length === 0) {
				return false;
			}
			const qualityOption = findVideoQualityOption('yt-list-item-view-model', '.yt-list-item-view-model__title', resolution);
			if (qualityOption) {
				setTimeout(() => {
					qualityOption.click();
				}, 1);
				(debugGlobal) && 
					console.log(`[ytsb] Successfully set video quality to ${resolution}p`);
				return true;
			} else {
				const firstOptionLabel = document.querySelector('yt-list-item-view-model .yt-list-item-view-model__title')?.textContent;
				if (firstOptionLabel && !firstOptionLabel.includes('Auto')) {
					for (let i = stdResI; i >= 0; i--) {
						const altRes = stdRes[i];
						const tResOpt = findVideoQualityOption('yt-list-item-view-model', '.yt-list-item-view-model__title', altRes);
						if (tResOpt) {
							setTimeout(() => {
								tResOpt.click();
							}, 1);
							(debugGlobal) && 
								console.log(`[ytsb] ${resolution}p unavailable. Set quality to closest fallback: ${altRes}p`);
							return true;
						}
					}
				}
				return false;
			}
		}
		attempt(mvq_settings, 250, 1, () => {
			attempt(mvq_qualityListOption, 250, 1, () => {
				attempt(mvq_qualityOption, 250, 1, () => {
					setTimeout(() => {
						videoElement.play();
					}, 1);
				});
			});
		});
	} else {
		function dvq_settings() {
			const settingsButton = document.querySelector('.ytp-settings-button');
			if (!settingsButton) return false;
			setTimeout(() => {
				settingsButton.click();
			}, 0);
			return true;
		}
		function dvq_qualityMenuItem() {
			const qualityMenuItem = findElement('.ytp-menuitem', '.ytp-menuitem-label', 'quality');
			if (!qualityMenuItem) return false;
			setTimeout(() => {
				qualityMenuItem.click();
			}, 1);
			return true;
		}
		function dvq_qualityOption() {
			const qualityOption = findVideoQualityOption('.ytp-quality-menu .ytp-menuitem', '.ytp-menuitem-label span', resolution);
			if (qualityOption) {
				setTimeout(() => {
					qualityOption.click();
				}, 1);
				(debugGlobal) && 
					console.log(`[ytsb] Successfully set video quality to ${resolution}p`);
				return true;
			} else {
				for (let i = stdResI; i >= 0; i--) {
					const altRes = stdRes[i];
					const tResOpt = findVideoQualityOption('.ytp-quality-menu .ytp-menuitem', '.ytp-menuitem-label span', altRes);
					if (tResOpt) {
						setTimeout(() => {
							tResOpt.click();
						}, 1);
						(debugGlobal) && 
							console.log(`[ytsb] ${resolution}p unavailable. Set quality to closest fallback: ${altRes}p`);
						return true;
					}
				}
			}
			return false;
		}
		function dvq_closeSettings() {
			const settingsButton = document.querySelector('.ytp-settings-button');
			if (!settingsButton) return false;
			setTimeout(() => {
				settingsButton.click();
			}, 1);
			setTimeout(() => {
				settingsButton.click();
			}, 1);
			return true;
		}
		attempt(dvq_settings, 250, 1, () => {
			attempt(dvq_qualityMenuItem, 250, 1, () => {
				attempt(dvq_qualityOption, 250, 1, () => {
					attempt(dvq_closeSettings, 250, 1, () => {
						clearKeepPaused();
						setTimeout(() => {
							videoElement.play();
						}, 1);
					});
				});
			});
		});
	}
}

function clickSubscriptions() {
	if (!location.pathname === '/') return true;
	if (mobileDomain) {
		const link = document.querySelector('div[role="tab"].pivot-subs')
		if (!link) return false;
		link.click();
		return true;
	} else {
		const link = document.querySelector('a[href="/feed/subscriptions"]');
		if (!link) return false;
		link.click();
		return true;
	}
}

function redirectHomepage() {
	if (blockHomepageGlobal) {
		if (location.pathname === '/') {
			let ma = 50;
			if (mobileDomain) ma = 15;
			attempt(clickSubscriptions, 40, ma);
		}
	}
}

function setIsPlaylistPanelVisible() {
	const playlistPanel =
		mobileDomain ? 
		document.querySelector('ytm-playlist-engagement-panel-header') : 
		document.querySelector('ytd-playlist-panel-renderer');
	isPlaylistPanelVisible =
		!playlistPanel ?
		false :
		window.getComputedStyle(playlistPanel).display !== 'none';
}

function setVideoElement() {
	videoElement = document.querySelector('.html5-main-video');
	if (videoElement) {
		if (mobileDomain) {
			if (videoElement.muted) videoElement.muted = false;
			if (videoElement.currentTime <= 1) videoElement.currentTime = 0;
		}
		if (autoHDglobal) {
			setIsPlaylistPanelVisible();
			if (isPlaylistPanelVisible) return true;
			if (!mobileDomain) {
				setVideoQuality();
			} else {
				function clearCheckPlayed() {
					clearInterval(checkPlayedID);
					checkPlayedID = null;
					(debugGlobal) && console.log('[ytsb] checkPlayed() finished.');
				}
				function checkPlayed() {
					videoElement = document.querySelector('.html5-main-video');
					if (!videoElement.paused) {
						clearCheckPlayed();
						setVideoQuality();
					}
					setIsPlaylistPanelVisible();
					if (currentPathName !== '/watch' ||
						!autoHDglobal ||
						isPlaylistPanelVisible)
						clearCheckPlayed();
				}
				if(!checkPlayedID) {
					checkPlayedID = setInterval(checkPlayed, 250);
					(debugGlobal) && console.log('[ytsb] checkPlayed() started.');
				}
			}
		}
		return true;
	}
	return false;
}

function setupResolution() {
	const width = window.screen.width * window.devicePixelRatio;
	const height = window.screen.height * window.devicePixelRatio;
	const minRes = Math.min(width, height);
	let minDiff = Infinity;
	resolution = stdRes[0];
	stdResI = 0;
	for (let i = 0; i < stdRes.length; i++) {
		const res = stdRes[i];
		const diff = Math.abs(minRes - res);
		if (diff > minDiff) break;
		if (diff <= minDiff) {
			minDiff = diff;
			resolution = res;
			stdResI = i - 1;
		}
	}
	(debugGlobal) && console.log(`[ytsb] Resolution = ${resolution}`);
}
	
function clearKeepPaused() {
	if (!keepPausedID) return;
	clearInterval(keepPausedID);
	keepPausedID = null;
	(debugGlobal) && console.log('[ytsb] keepPaused() finished.');
}

function setupKeepPaused() {
	setIsPlaylistPanelVisible();
	if (keepPausedID || isPlaylistPanelVisible) return;
	function keepPaused() {
		const tVideoElement = document.querySelector('.html5-main-video');
		if (!tVideoElement) return;
		tVideoElement.pause();
		if (tVideoElement.currentTime <= 0.1) tVideoElement.currentTime = 0;
		setIsPlaylistPanelVisible();
		if (isPlaylistPanelVisible) {
			clearKeepPaused();
			tVideoElement.play();
		}
	}
	keepPausedID = setInterval(keepPaused, 16);
	(debugGlobal) && console.log('[ytsb] keepPaused() started.');
}

function setupHeaderBarObserver() {
	if (headerBarObserver) {
		headerBarObserver.disconnect();
		headerBarObserver = null;
	}
	const headerBar = document.getElementById('header-bar');
	if (!headerBar) return false;
	headerBarObserver = new MutationObserver((mutationsList) => {
		for (const mutation of mutationsList) {
			if (mutation.attributeName === 'inert') {
				headerBar.removeAttribute('inert');
				(debugGlobal) && 
					console.log('[ytsb] removed inert from header-bar.');
			}
		}
	});
	const config = { attributes: true };
	headerBarObserver.observe(headerBar, config);
	return true;
}

let isNavigationListenerAttached = false;

function setupNavigationListener() {
	if (isNavigationListenerAttached) return;
	if (mobileDomain) {
		const getVideoID = () => new URLSearchParams(new URL(location.href).search).get('v');
		currentPathName = null;
		let cVideoID = null;
		let nVideoID = null;
		function checkNavigation() {
			redirectHomepage();
			if (location.pathname !== currentPathName) {
				currentPathName = location.pathname;
				if (blockChipBarGlobal && currentPathName === '/')
					appendCSS(CHIP_BAR_CSS, CHIP_BAR_STYLE_ID);
				if (currentPathName === '/watch') {
					if (blockChipBarGlobal) removeCSS(CHIP_BAR_STYLE_ID);
					cVideoID = getVideoID();
					(debugGlobal) &&
						console.log('[ytsb] cVideoID = ' + cVideoID);
					attempt(setVideoElement, 200, 10);
					attempt(setupHeaderBarObserver, 40, 50);
				}
			} else if (currentPathName === '/watch') {
				nVideoID = getVideoID();
				if (cVideoID !== nVideoID) {
					cVideoID = nVideoID;
					(debugGlobal) &&
						console.log('[ytsb] cVideoID = ' + cVideoID);
					attempt(setVideoElement, 200, 10);
					attempt(setupHeaderBarObserver, 40, 50);
				}
			}
		}
		checkNavigationID = setInterval(checkNavigation, 750);
		attempt(setupHeaderBarObserver, 40, 50);
	} else {
		document.addEventListener('yt-navigate-start', function(event) {
			redirectHomepage();
			if (autoHDglobal &&
				blockPlaybackOnNavGlobal &&
				!isPlaylistPanelVisible &&
				location.pathname === '/watch') {
					setupKeepPaused();
			}
			if (blockPlaybackOnNavGlobal && currentPathName === '/watch') {
				if (videoElement && !videoElement.paused) {
					videoElement.pause();
				}
			}
		});
		document.addEventListener('yt-navigate-finish', function(event) {
			if (currentPathName === '/watch' && location.pathname !== '/watch') {
				if (blockMiniplayerGlobal) {
					attempt(closeMiniplayer, 40, 50);
				}
			}
			currentPathName = location.pathname;
			if (settingsApplied) {
				if (currentPathName === '/watch') {
					if (!initPaused) attempt(setVideoElement, 200, 10);
				}
				(!exploreFound || !moreFound) && attempt(blockSidebarSections, 40, 50);
			}
		});
	}
	isNavigationListenerAttached = true;
}

let isGuideListenerAttached = false;

function setupGuideButtonListener() {
	if (isGuideListenerAttached) return true;
	const guideButton = document.querySelector('#guide-button');
	if (guideButton) {
		guideButton.addEventListener('click', () => {
			(!exploreFound || !moreFound) && attempt(blockSidebarSections, 40, 50);
		});
		isGuideListenerAttached = true;
		return true;
	}
	return false;
}

let isResizeListenerAttached = false;
const throttledBlockSidebarSections = throttle(blockSidebarSections, 25);

function setupResizeListener() {
	if (isResizeListenerAttached) return;
	window.addEventListener('resize', throttledBlockSidebarSections);
	isResizeListenerAttached = true;
}

let progressFocusListener = null;

function toggleProgressFocus(enable) {
	if (progressFocusListener) {
		document.removeEventListener('focusin', progressFocusListener, true); 
		progressFocusListener = null;
	}
	if (!enable) return;
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

function setupBackgroundPlay() {
	function injectScript(path) {
		const script = document.createElement('script');
		script.src = browser.runtime.getURL(path);
		(document.head || document.documentElement).appendChild(script);
	}
	function sendKeyEvent(aEvent, aKey) {
		document.dispatchEvent(new KeyboardEvent(aEvent, {
			bubbles: true,
			cancelable: true,
			keyCode: aKey,
			which: aKey,
		}));
	}
	function sendKeyPress() {
		const keyCodes = [18];
		const key = keyCodes[getRandomInt(0, keyCodes.length)];
		sendKeyEvent("keydown", key);
		sendKeyEvent("keyup", key);
	}
	function startJitteredPolling(callback, iDelay, iJitter) {
		const jitterAmount = getRandomInt(-iJitter / 2, iJitter / 2);
		const newDelay = Math.max(iDelay + jitterAmount, 0);
		window.setTimeout(() => {
			callback();
			startJitteredPolling(callback, iDelay, iJitter);
		}, newDelay);
	}
	function getRandomInt(aMin, aMax) {
		const min = Math.ceil(aMin);
		const max = Math.floor(aMax);
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}
	injectScript("backgroundPlay.js");
	startJitteredPolling(sendKeyPress, 60 * 1000, 10 * 1000);
	(debugGlobal) &&
		console.log('[ytsb] backgroundPlay.js injected.');
}

function appendCSS(css, styleId) {
	let style = document.getElementById(styleId);
	if (style) return;
	style = document.createElement('style');
	style.id = styleId;
	style.textContent = css;
	(document.head || document.documentElement).appendChild(style);
}

function removeCSS(styleId) {
	const style = document.getElementById(styleId);
	if (style) style.remove();
}

function updateBlocking(
	blockSearchSuggestions,
	blockVoiceSearch,
	autoHD,
	backgroundPlay,
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
		appendCSS(SEARCH_SUGGESTIONS_CSS, SEARCH_SUGGESTIONS_STYLE_ID);
	} else {
		removeCSS(SEARCH_SUGGESTIONS_STYLE_ID);
	}
	if (blockVoiceSearch) {
		appendCSS(VOICE_SEARCH_CSS, VOICE_SEARCH_STYLE_ID);
	} else {
		removeCSS(VOICE_SEARCH_STYLE_ID);
	}
	autoHDglobal = autoHD;
	if (backgroundPlay !== backgroundPlayState) {
		if (backgroundPlay && !backgroundPlayState) {
			setupBackgroundPlay();
			backgroundPlayState = true;
		}
		if (!backgroundPlay && backgroundPlayState) {
			window.location.reload();
			backgroundPlayState = false;
		}
	}
	toggleProgressFocus(blockProgressFocus);
	blockPlaybackOnNavGlobal = blockPlaybackOnNav;
	blockMiniplayerGlobal = blockMiniplayer;
	if (blockMiniplayer) {
		closeMiniplayer();
		appendCSS(MINIPLAYER_CSS, MINIPLAYER_STYLE_ID);
	} else {
		removeCSS(MINIPLAYER_STYLE_ID);
	}
	blockHomepageGlobal = blockHomepage;
	redirectHomepage();
	if (blockAIrec) {
		appendCSS(AI_REC_CSS, AI_REC_STYLE_ID);
	} else {
		removeCSS(AI_REC_STYLE_ID);
	}
	if (blockAIplaylists) {
		appendCSS(AI_PLAYLISTS_CSS, AI_PLAYLISTS_STYLE_ID);
	} else {
		removeCSS(AI_PLAYLISTS_STYLE_ID);
	}
	if (blockAIsessionAsk) {
		appendCSS(AI_SESSION_ASK_CSS, AI_SESSION_ASK_STYLE_ID);
	} else {
		removeCSS(AI_SESSION_ASK_STYLE_ID);
	}
	if (blockAIsessionVideoSummary) {
		appendCSS(AI_SESSION_VIDEO_SUMMARY_CSS, AI_SESSION_VIDEO_SUMMARY_STYLE_ID);
	} else {
		removeCSS(AI_SESSION_VIDEO_SUMMARY_STYLE_ID);
	}
	if (blockMovies) {
		appendCSS(MOVIES_CSS, MOVIES_STYLE_ID);
	} else {
		removeCSS(MOVIES_STYLE_ID);
	}
	if (blockPlayables) {
		appendCSS(PLAYABLES_CSS, PLAYABLES_STYLE_ID);
	} else {
		removeCSS(PLAYABLES_STYLE_ID);
	}
	if (blockPremiumNag) {
		appendCSS(PREMIUM_NAG_CSS, PREMIUM_NAG_STYLE_ID);
	} else {
		removeCSS(PREMIUM_NAG_STYLE_ID);
	}
	if (blockSurveys) {
		appendCSS(SURVEYS_CSS, SURVEYS_STYLE_ID);
	} else {
		removeCSS(SURVEYS_STYLE_ID);
	}
	if (blockSponsor) {
		appendCSS(SPONSOR_CSS, SPONSOR_STYLE_ID);
	} else {
		removeCSS(SPONSOR_STYLE_ID);
	}
	if (blockClip) {
		appendCSS(CLIP_CSS, CLIP_STYLE_ID);
	} else {
		removeCSS(CLIP_STYLE_ID);
	}
	blockChipBarGlobal = blockChipBar;
	if (blockChipBar) {
		if (mobileDomain && currentPathName === '/' || !mobileDomain)
			appendCSS(CHIP_BAR_CSS, CHIP_BAR_STYLE_ID);
	} else {
		removeCSS(CHIP_BAR_STYLE_ID);
	}
	if (blockComments) {
		appendCSS(COMMENTS_CSS, COMMENTS_STYLE_ID);
	} else {
		removeCSS(COMMENTS_STYLE_ID);
	}
	if (blockRelatedSessionSuggestions) {
		appendCSS(RELATED_SESSION_SUGGESTIONS_CSS, RELATED_SESSION_SUGGESTIONS_STYLE_ID);
	} else {
		removeCSS(RELATED_SESSION_SUGGESTIONS_STYLE_ID);
	}
	if (blockRelatedSessionEndCards) {
		appendCSS(RELATED_SESSION_END_CARDS_CSS, RELATED_SESSION_END_CARDS_STYLE_ID);
	} else {
		removeCSS(RELATED_SESSION_END_CARDS_STYLE_ID);
	}
	if (blockDownloadsLink) {
		appendCSS(DOWNLOADS_LINK_CSS, DOWNLOADS_LINK_STYLE_ID);
	} else {
		removeCSS(DOWNLOADS_LINK_STYLE_ID);
	}
	if (blockExploreSection !== blockExploreSectionGlobal) {
		exploreFound = false;
		blockExploreSectionGlobal = blockExploreSection;
	}
	if (blockExploreSection) {
		appendCSS(EXPLORE_LINK_CSS, EXPLORE_LINK_STYLE_ID);	
	} else {
		removeCSS(EXPLORE_LINK_STYLE_ID);
	}
	if (blockMoreSection !== blockMoreSectionGlobal) {
		moreFound = false;
		blockMoreSectionGlobal = blockMoreSection;
	}
	(!mobileDomain && !exploreFound || !moreFound) && attempt(blockSidebarSections, 40, 50);
	if (blockShortsLink) {
		appendCSS(SHORTS_LINK_CSS, SHORTS_LINK_STYLE_ID);
	} else {
		removeCSS(SHORTS_LINK_STYLE_ID);
	}
	if (blockShortsHomepageSuggestions) {
		appendCSS(SHORTS_HOMEPAGE_SUGGESTIONS_CSS, SHORTS_HOMEPAGE_SUGGESTIONS_STYLE_ID);
	} else {
		removeCSS(SHORTS_HOMEPAGE_SUGGESTIONS_STYLE_ID);
	}
	if (blockShortsSessionSuggestions) {
		appendCSS(SHORTS_SESSION_SUGGESTIONS_CSS, SHORTS_SESSION_SUGGESTIONS_STYLE_ID);
	} else {
		removeCSS(SHORTS_SESSION_SUGGESTIONS_STYLE_ID);
	}
	if (blockShortsSearchSuggestions) {
		appendCSS(SHORTS_SEARCH_SUGGESTIONS_CSS, SHORTS_SEARCH_SUGGESTIONS_STYLE_ID);
	} else {
		removeCSS(SHORTS_SEARCH_SUGGESTIONS_STYLE_ID);
	}
	debugGlobal = debug;
}

browser.runtime.onMessage.addListener((request) => {
	switch (request.action) {
		case "initSettings":
			if (settingsInitialized) {
				return;
			}
			settingsInitialized = true;
			debugGlobal = request.debug;
			autoHDglobal = request.autoHD;
			mobileDomain =
				window.location.hostname.startsWith('m.') ? true : mobileDomain;
			setupResolution();
			if (!mobileDomain &&
				request.autoHD &&
				request.blockPlaybackOnNav &&
				location.pathname === '/watch') {
				setupKeepPaused();
				attempt(setVideoElement, 200, 10);	
				initPaused = true;
				setTimeout(() => {
					initPaused = false;
					settingsApplied = true;
				}, 2000);
			} else {
				setTimeout(() => {
					settingsApplied = true;
				}, 1000);
			}

			setupNavigationListener();
			if (!mobileDomain) {
				attempt(setupGuideButtonListener, 40, 50);
				setupResizeListener();
			}
			if (request.backgroundPlay) {
				setupBackgroundPlay();
				backgroundPlayState = true;
			}
		case "updateSettings":
			updateBlocking(
				request.blockSearchSuggestions,
				request.blockVoiceSearch,
				request.autoHD,
				request.backgroundPlay,
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
				request.debug
			);
			destroyYTSBinitBlock();
			(debugGlobal) && console.log("[ytsb] Settings applied.");
			break;
		default:
			return;
	}
});
