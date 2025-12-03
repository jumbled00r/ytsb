importScripts('shim.js');
importScripts('settings.js');

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
				action: "updateCSS",
				...settingsToSend
			}).catch(() => {});
		});
	}
});
