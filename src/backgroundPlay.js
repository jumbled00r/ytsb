function backgroundPlay() {
	const CHROME_VISIBILITY_OVERRIDE = `
(function() {
    Object.defineProperties(document, {
        'hidden': { value: false, writable: false, configurable: true },
        'visibilityState': { value: 'visible', writable: false, configurable: true }
    });
    window.addEventListener(
        'visibilitychange', evt => evt.stopImmediatePropagation(), true
    );
})();
`;
	function injectScript(code) {
		const script = document.createElement('script');
		script.textContent = code;
		(document.head || document.documentElement).appendChild(script);
		script.remove();
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
	if (mobileDomain) {
		if (typeof document.wrappedJSObject !== 'undefined') {
			Object.defineProperties(document.wrappedJSObject,
				{ 'hidden': {value: false}, 'visibilityState': {value: 'visible'} }
			);
		} else {
			injectScript(CHROME_VISIBILITY_OVERRIDE);
		}
	}
	window.addEventListener(
	  'visibilitychange', evt => evt.stopImmediatePropagation(), true);

	startJitteredPolling(sendKeyPress, 60 * 1000, 10 * 1000);
}
