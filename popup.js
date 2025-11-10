document.addEventListener('DOMContentLoaded', () => {
    const toggleSuggestions = document.getElementById('toggleSuggestions');
    const toggleShorts = document.getElementById('toggleShorts');

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

    browser.storage.local.get(['blockSuggestions', 'blockShorts'], (result) => {
        toggleSuggestions.checked = result.blockSuggestions !== false;
        toggleShorts.checked = result.blockShorts !== false;
    });

    function saveAndApplySettings() {
        const blockSuggestions = toggleSuggestions.checked;
        const blockShorts = toggleShorts.checked;

        browser.storage.local.set({ blockSuggestions, blockShorts }, () => {
            browser.tabs.query({url: "*://*.youtube.com/*"}, (tabs) => {
                tabs.forEach((tab) => {
                    browser.tabs.sendMessage(tab.id, {
                        action: "updateCSS",
                        blockSuggestions: blockSuggestions,
                        blockShorts: blockShorts
                    });
                });
            });
        });
    }

    toggleSuggestions.addEventListener('change', saveAndApplySettings);
    toggleShorts.addEventListener('change', saveAndApplySettings);
});
