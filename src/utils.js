/**
 * URLs to skip (internal browser pages)
 */
export const FILTERED_URL_PREFIXES = [
  'chrome://',
  'chrome-extension://',
  'brave://',
  'about:',
  'edge://',
  'devtools://'
];

/**
 * Format a date as a human-readable timestamp
 * @param {Date} date
 * @returns {string} e.g., "Jan 25, 2026 3:45 PM"
 */
export function formatTimestamp(date) {
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
}

/**
 * Check if a URL should be saved
 * @param {string} url
 * @returns {boolean}
 */
export function shouldSaveUrl(url) {
  if (!url) return false;
  return !FILTERED_URL_PREFIXES.some(prefix => url.startsWith(prefix));
}

/**
 * Format milliseconds as a human-readable duration
 * @param {number} ms
 * @returns {string}
 */
export function formatDuration(ms) {
  const seconds = Math.floor(ms / 1000);
  if (seconds < 60) return `${seconds} seconds`;
  const minutes = Math.floor(seconds / 60);
  return minutes === 1 ? '1 minute' : `${minutes} minutes`;
}
