(function() {
	Object.defineProperties(document, {
		'hidden': { value: false, writable: false, configurable: true },
		'visibilityState': { value: 'visible', writable: false, configurable: true }
	});
	window.addEventListener(
		'visibilitychange', evt => evt.stopImmediatePropagation(), true
	);
})();
