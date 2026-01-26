# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Keyboard shortcut: Alt+Shift+S (Option+Shift+S on macOS)
- System notifications showing tab and window count on save
- Duplicate save protection: prompts user if saving within 2 minutes of last save
- Unit tests for utility functions

### Changed

- Refactored pure functions into separate utils module
- Empty folders are now cleaned up when all tabs are filtered out

## [1.0.0] - 2026-01-26

### Added

- One-click saving of all open tabs to bookmarks
- Automatic timestamped folder creation (e.g., "Tabs - Jan 26, 2026 3:45 PM")
- Multi-window support with separate subfolders per window
- Filtering of internal browser pages (chrome://, brave://, etc.)
- Visual feedback via toolbar badge (checkmark on success, exclamation on error)
- Support for Brave and Chrome browsers
