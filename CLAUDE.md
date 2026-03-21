# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A collection of kid-friendly, dependency-free mini games published as a PWA to GitHub Pages. Each game is a **single self-contained HTML file** with inline CSS and JavaScript — no build system, no package manager, no external dependencies.

## Architecture

- **Single-file games**: Each game (`block-drop.html`, `maths-quest.html`) contains all markup, styles, and logic in one file. Games use Canvas 2D for rendering, Web Audio API for sound, and `localStorage` for persistence.
- **Home page**: `index.html` is the launcher with game cards, screenshot gallery, PWA install prompt, and share functionality.
- **Service worker**: `worker.js` caches all assets for offline use. Uses a versioned `CACHE_NAME` (e.g., `mini-games-v12`) — **bump this version whenever any cached file changes** so users get updates.
- **PWA manifest**: `manifest.webmanifest` defines the installable app metadata.

## Key Conventions

- **Modern web standards**: Use modern CSS (nested selectors, `@layer`, custom properties, `dialog` element, etc.) and HTML5 best practices. No transpilation or polyfills.
- **No frameworks**: Avoid React, Vue, etc. State management uses a lightweight reactive state class defined locally in each game file.

## Deployment

Push to `main` branch — GitHub Pages serves automatically. After any content change, remember to bump the `CACHE_NAME` version in `worker.js`.
