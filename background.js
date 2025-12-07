browser.runtime.onInstalled.addListener(() => {
	browser.storage.local.set(DEFAULT_SETTINGS);
});

browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
	if (changeInfo.status === 'complete' && tab.url && tab.url.includes('youtube.com')) {
		const keys = ALL_SETTING_KEYS;
		browser.storage.local.get(keys, (result) => {
			const settingsToSend = {};
			keys.forEach(key => {
				settingsToSend[key] = resolveSetting(key, result);
			});
			browser.tabs.sendMessage(tabId, {
				action: 'updateCSS',
				...settingsToSend
			}).catch(() => {});
		});
	}
});

let platform = null;
let platformState = null;

async function initializePlatform() {
	const userAgent = navigator.userAgent.toLowerCase();
	const isMobile =
		userAgent.includes('android') ||
		userAgent.includes('iphone') ||
		userAgent.includes('ipad') ||
		userAgent.includes('ipod') ||
		userAgent.includes('mobile') ||
		userAgent.includes('tablet') ||
		userAgent.includes('silk');
	if (isMobile) {
		platform = 'mobile';
	} else {
		platform = 'desktop';
	}
}

async function setPopup() {
	await platformState;
	if (platform === 'desktop') {
		browser.action.setPopup({ popup: 'popup.html'});
	} else {
		browser.action.setPopup({ popup: '' });
		browser.action.onClicked.addListener(() => 
			browser.tabs.create({ url: 'popup.html?platform=mobile' }));
	}
}

platformState = initializePlatform();
setPopup();
