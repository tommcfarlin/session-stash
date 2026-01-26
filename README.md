# Session Stash

A browser extension that saves all your open tabs to bookmarks with a single click.

## Why Session Stash?

- **Tab overload?** Save everything before clearing the clutter
- **Need to switch contexts?** Preserve your current session and come back later
- **Doing research?** Archive your tabs for future reference
- **Browser acting up?** Create a backup before it crashes

## How It Works

1. Click the Session Stash icon in your toolbar (or press `Alt+Shift+S`)
2. All tabs from all windows are saved to your Bookmarks Bar
3. Tabs are organized in a timestamped folder (e.g., "Tabs - Jan 26, 2026 3:45 PM")
4. Each window gets its own subfolder
5. A notification confirms how many tabs were saved

Internal browser pages (`chrome://`, `brave://`, etc.) are automatically filtered out.

If you try to save again within 2 minutes, you'll be asked to confirm to prevent accidental duplicates.

## Installation

### From GitHub Releases (Recommended)

1. Download the latest `session-stash-x.x.x.zip` from [Releases](https://github.com/tommcfarlin/session-stash/releases)
2. Unzip the file
3. Open your browser's extension page:
   - **Brave**: `brave://extensions`
   - **Chrome**: `chrome://extensions`
4. Enable "Developer mode" (toggle in top-right)
5. Click "Load unpacked"
6. Select the unzipped folder

### From Source (Developer Mode)

1. Clone this repository
2. Run `npm install` (only needed for running tests)
3. Open your browser's extension page (see above)
4. Enable "Developer mode"
5. Click "Load unpacked"
6. Select the repository folder

### From Chrome Web Store

Coming soon.

## Browser Support

Tested and supported on:

- Brave
- Google Chrome

Should also work on other Chromium-based browsers (Edge, Opera, Vivaldi).

## Permissions

Session Stash requires four permissions:

- **tabs** - To read the URLs and titles of your open tabs
- **bookmarks** - To create bookmark folders and save your tabs
- **notifications** - To show confirmation when tabs are saved
- **storage** - To remember when you last saved (for duplicate detection)

No data is collected or transmitted. Everything stays in your browser.

## License

MIT License. See [LICENSE](LICENSE) for details.
