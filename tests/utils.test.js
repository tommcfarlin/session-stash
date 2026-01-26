import {
  formatTimestamp,
  shouldSaveUrl,
  formatDuration,
  FILTERED_URL_PREFIXES
} from '../src/utils.js';

describe('formatTimestamp', () => {
  it('formats a date with month, day, year, and time', () => {
    const date = new Date('2026-01-25T15:45:00');
    const result = formatTimestamp(date);

    expect(result).toContain('Jan');
    expect(result).toContain('25');
    expect(result).toContain('2026');
    expect(result).toContain('45');
  });

  it('uses 12-hour format with AM/PM', () => {
    const morning = new Date('2026-01-25T09:30:00');
    const afternoon = new Date('2026-01-25T14:30:00');

    const morningResult = formatTimestamp(morning);
    const afternoonResult = formatTimestamp(afternoon);

    expect(morningResult).toContain('AM');
    expect(afternoonResult).toContain('PM');
  });

  it('handles midnight correctly', () => {
    const midnight = new Date('2026-01-25T00:00:00');
    const result = formatTimestamp(midnight);

    expect(result).toContain('12');
    expect(result).toContain('AM');
  });

  it('handles noon correctly', () => {
    const noon = new Date('2026-01-25T12:00:00');
    const result = formatTimestamp(noon);

    expect(result).toContain('12');
    expect(result).toContain('PM');
  });
});

describe('shouldSaveUrl', () => {
  describe('returns true for valid URLs', () => {
    it('accepts standard http URLs', () => {
      expect(shouldSaveUrl('http://example.com')).toBe(true);
    });

    it('accepts standard https URLs', () => {
      expect(shouldSaveUrl('https://example.com')).toBe(true);
    });

    it('accepts URLs with paths', () => {
      expect(shouldSaveUrl('https://example.com/path/to/page')).toBe(true);
    });

    it('accepts URLs with query strings', () => {
      expect(shouldSaveUrl('https://example.com?foo=bar')).toBe(true);
    });

    it('accepts file URLs', () => {
      expect(shouldSaveUrl('file:///path/to/file.html')).toBe(true);
    });
  });

  describe('returns false for filtered URLs', () => {
    it('filters chrome:// URLs', () => {
      expect(shouldSaveUrl('chrome://extensions')).toBe(false);
      expect(shouldSaveUrl('chrome://settings')).toBe(false);
    });

    it('filters chrome-extension:// URLs', () => {
      expect(shouldSaveUrl('chrome-extension://abc123/popup.html')).toBe(false);
    });

    it('filters brave:// URLs', () => {
      expect(shouldSaveUrl('brave://settings')).toBe(false);
      expect(shouldSaveUrl('brave://extensions')).toBe(false);
    });

    it('filters about: URLs', () => {
      expect(shouldSaveUrl('about:blank')).toBe(false);
      expect(shouldSaveUrl('about:newtab')).toBe(false);
    });

    it('filters edge:// URLs', () => {
      expect(shouldSaveUrl('edge://settings')).toBe(false);
    });

    it('filters devtools:// URLs', () => {
      expect(shouldSaveUrl('devtools://devtools/bundled/inspector.html')).toBe(false);
    });
  });

  describe('handles edge cases', () => {
    it('returns false for null', () => {
      expect(shouldSaveUrl(null)).toBe(false);
    });

    it('returns false for undefined', () => {
      expect(shouldSaveUrl(undefined)).toBe(false);
    });

    it('returns false for empty string', () => {
      expect(shouldSaveUrl('')).toBe(false);
    });
  });
});

describe('FILTERED_URL_PREFIXES', () => {
  it('contains expected browser prefixes', () => {
    expect(FILTERED_URL_PREFIXES).toContain('chrome://');
    expect(FILTERED_URL_PREFIXES).toContain('brave://');
    expect(FILTERED_URL_PREFIXES).toContain('edge://');
    expect(FILTERED_URL_PREFIXES).toContain('about:');
  });

  it('contains extension and devtools prefixes', () => {
    expect(FILTERED_URL_PREFIXES).toContain('chrome-extension://');
    expect(FILTERED_URL_PREFIXES).toContain('devtools://');
  });
});

describe('formatDuration', () => {
  it('formats seconds correctly', () => {
    expect(formatDuration(5000)).toBe('5 seconds');
    expect(formatDuration(30000)).toBe('30 seconds');
    expect(formatDuration(59000)).toBe('59 seconds');
  });

  it('formats one minute correctly', () => {
    expect(formatDuration(60000)).toBe('1 minute');
    expect(formatDuration(90000)).toBe('1 minute');
  });

  it('formats multiple minutes correctly', () => {
    expect(formatDuration(120000)).toBe('2 minutes');
    expect(formatDuration(180000)).toBe('3 minutes');
    expect(formatDuration(300000)).toBe('5 minutes');
  });

  it('handles zero', () => {
    expect(formatDuration(0)).toBe('0 seconds');
  });

  it('rounds down partial seconds', () => {
    expect(formatDuration(5500)).toBe('5 seconds');
    expect(formatDuration(65999)).toBe('1 minute');
  });
});
