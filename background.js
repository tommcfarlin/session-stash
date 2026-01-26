/**
 * Session Stash Extension
 * Saves all open tabs across all windows to a timestamped bookmark folder
 */

import { formatTimestamp, shouldSaveUrl, formatDuration } from './src/utils.js';

/** Time window (in ms) to consider a save as "recent" */
const DUPLICATE_THRESHOLD_MS = 2 * 60 * 1000; // 2 minutes

/** Notification ID for confirmation prompt */
const CONFIRM_NOTIFICATION_ID = 'session-stash-confirm';

/**
 * Show a notification to the user
 * @param {string} message
 */
function showNotification(message) {
  chrome.notifications.create(
    `session-stash-${Date.now()}`,
    {
      type: 'basic',
      iconUrl: 'icons/icon128.png',
      title: 'Session Stash',
      message
    },
    (notificationId) => {
      if (chrome.runtime.lastError) {
        console.error('Notification error:', chrome.runtime.lastError.message);
      }
    }
  );
}

/**
 * Show a confirmation notification with action buttons
 * @param {string} message
 */
function showConfirmation(message) {
  chrome.notifications.create(
    CONFIRM_NOTIFICATION_ID,
    {
      type: 'basic',
      iconUrl: 'icons/icon128.png',
      title: 'Session Stash',
      message,
      buttons: [
        { title: 'Save Anyway' },
        { title: 'Cancel' }
      ],
      requireInteraction: true
    },
    (notificationId) => {
      if (chrome.runtime.lastError) {
        console.error('Notification error:', chrome.runtime.lastError.message);
      }
    }
  );
}

/**
 * Find the Bookmarks Bar folder
 * @returns {Promise<chrome.bookmarks.BookmarkTreeNode>}
 */
async function getBookmarksBar() {
  const tree = await chrome.bookmarks.getTree();
  const rootChildren = tree[0].children;

  const bookmarksBar = rootChildren.find(node =>
    node.title.toLowerCase().includes('bookmark') &&
    node.title.toLowerCase().includes('bar')
  );

  return bookmarksBar || rootChildren[0];
}

/**
 * Get the timestamp of the last save
 * @returns {Promise<number|null>}
 */
async function getLastSaveTime() {
  const result = await chrome.storage.local.get('lastSaveTime');
  return result.lastSaveTime || null;
}

/**
 * Store the current time as the last save time
 */
async function setLastSaveTime() {
  await chrome.storage.local.set({ lastSaveTime: Date.now() });
}

/**
 * Save all tabs to bookmarks
 */
async function saveTabs() {
  try {
    const windows = await chrome.windows.getAll({ populate: true });
    const normalWindows = windows.filter(w => w.type === 'normal');

    if (normalWindows.length === 0) {
      showNotification('No tabs to save');
      return;
    }

    const bookmarksBar = await getBookmarksBar();
    const timestamp = formatTimestamp(new Date());
    const parentFolder = await chrome.bookmarks.create({
      parentId: bookmarksBar.id,
      title: `Tabs - ${timestamp}`
    });

    let totalTabs = 0;
    let windowCount = 0;

    for (let i = 0; i < normalWindows.length; i++) {
      const window = normalWindows[i];
      const tabs = window.tabs.filter(tab => shouldSaveUrl(tab.url));

      if (tabs.length === 0) continue;

      windowCount++;

      const windowFolder = await chrome.bookmarks.create({
        parentId: parentFolder.id,
        title: `Window ${i + 1}`
      });

      for (const tab of tabs) {
        await chrome.bookmarks.create({
          parentId: windowFolder.id,
          title: tab.title || tab.url,
          url: tab.url
        });
        totalTabs++;
      }
    }

    if (totalTabs === 0) {
      await chrome.bookmarks.remove(parentFolder.id);
      showNotification('No tabs to save');
      return;
    }

    await setLastSaveTime();

    const windowText = windowCount === 1 ? 'window' : 'windows';
    showNotification(`Saved ${totalTabs} tabs from ${windowCount} ${windowText}`);

  } catch (error) {
    console.error('Session Stash error:', error);
    showNotification('Failed to save tabs');
  }
}

/**
 * Main handler - checks for recent save before saving
 */
chrome.action.onClicked.addListener(async () => {
  console.log('Session Stash: Icon clicked');

  const lastSaveTime = await getLastSaveTime();
  console.log('Session Stash: Last save time:', lastSaveTime);

  if (lastSaveTime) {
    const elapsed = Date.now() - lastSaveTime;
    console.log('Session Stash: Elapsed ms:', elapsed);

    if (elapsed < DUPLICATE_THRESHOLD_MS) {
      const ago = formatDuration(elapsed);
      console.log('Session Stash: Showing confirmation (recent save detected)');
      showConfirmation(`You saved ${ago} ago. Save again?`);
      return;
    }
  }

  console.log('Session Stash: Proceeding to save');
  await saveTabs();
});

/**
 * Handle notification button clicks
 */
chrome.notifications.onButtonClicked.addListener((notificationId, buttonIndex) => {
  if (notificationId === CONFIRM_NOTIFICATION_ID) {
    chrome.notifications.clear(CONFIRM_NOTIFICATION_ID);

    if (buttonIndex === 0) {
      // "Save Anyway" clicked
      saveTabs();
    }
    // buttonIndex === 1 is "Cancel" - do nothing
  }
});
