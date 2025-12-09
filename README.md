# YouTube Suggestion Blocker (YTSB)

Supported on: **Desktop** (`youtube.com`) and **Mobile Web** (`m.youtube.com`).

**YouTube Suggestion Blocker** delivers a focused, distraction-free viewing experience by removing clutter and interruptions.

[Firefox Extension](https://addons.mozilla.org/en-US/firefox/addon/ytsb/)

[Chrome Extension](https://chromewebstore.google.com/detail/youtube-suggestion-blocke/daddpnekmmiconjcnciaodbcbpnhhpbd)


## Key Features

### Playback Enhancements
* Enables background video playback.
* Automatically sets video quality to device resolution.
* Pauses video when changing pages.
* Blocks progress/volume bar focus.

### Content & UI De-clutter
* Blocks all Shorts suggestions (homepage, session, search, sidebar link).
* Removes related session suggestions/end cards.
* Hides comments, the miniplayer, clip button, and the homepage chip bar.

### Monetization & Promotion Block
* Blocks premium nags and surveys.
* Removes sponsorship buttons, commercially uploaded movies, and playables.

### AI & Search
* Removes AI chatbox, AI generated playlists/summaries, and the AI Ask button.
* Removes searchbox suggestions and voice search.

### Navigation & Sidebar
* Removes Downloads, Explore, and More sidebar sections.
* Redirects the homepage to your Subscriptions feed.


# Build from source
``./build firefox``

``./build chrome``

``./build clean``
### Loading the package
### Firefox
Load the packaged `.zip` into `about:debugging` or use the `addons.mozilla.org` link above.
### Chrome
Load the unzipped `.zip` in `chrome://extensions` by selecting the `manifest.json` when loading.
