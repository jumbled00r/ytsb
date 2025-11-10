const SUGGESTIONS_STYLE_ID = 'yt-suggestions-block-style';
const SHORTS_STYLE_ID = 'yt-shorts-block-style';

const SUGGESTIONS_CSS = `
div.ytSearchboxComponentSuggestionsContainer {
    display: none !important;
}
`;

const SHORTS_CSS = `
a[title="Shorts"] {
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

function updateBlocking(blockSuggestions, blockShorts) {
    if (blockSuggestions) {
        applyCSS(SUGGESTIONS_CSS, SUGGESTIONS_STYLE_ID);
    } else {
        removeCSS(SUGGESTIONS_STYLE_ID);
    }

    if (blockShorts) {
        applyCSS(SHORTS_CSS, SHORTS_STYLE_ID);
    } else {
        removeCSS(SHORTS_STYLE_ID);
    }
}

browser.runtime.onMessage.addListener((request) => {
    if (request.action === "updateCSS") {
        updateBlocking(request.blockSuggestions, request.blockShorts);
    }
});

browser.storage.local.get(['blockSuggestions', 'blockShorts'], (result) => {
    const blockSuggestions = result.blockSuggestions !== false;
    const blockShorts = result.blockShorts !== false;
    updateBlocking(blockSuggestions, blockShorts);
});
