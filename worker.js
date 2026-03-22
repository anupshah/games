// worker.js - Service Worker for Mini Games PWA
// Caches all static assets for offline use and updates cache on new deploy

const CACHE_NAME = 'mini-games-v15';

// Dynamically determine base path from service worker location to support
// localhost vs GitHub Pages deployment without hardcoding paths
const getBasePath = () => {
  const pathname = self.location.pathname;
  return pathname.substring(0, pathname.lastIndexOf('/') + 1);
};

const basePath = getBasePath();

const ASSETS = [
  basePath,
  basePath + 'index.html',
  basePath + 'block-drop.html',
  basePath + 'maths-quest.html',
  basePath + 'manifest.webmanifest',
  basePath + 'worker.js',
  basePath + 'icon.svg',
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;

      // For navigation requests (HTML pages), try the URL with index.html appended
      // This handles cases like /games/ resolving to /games/index.html
      if (event.request.mode === 'navigate') {
        const url = new URL(event.request.url);
        if (url.pathname.endsWith('/')) {
          const indexMatch = caches.match(url.pathname + 'index.html');
          if (indexMatch) return indexMatch;
        }
      }

      return fetch(event.request).catch(() => {
        // If offline and we have no cache match, serve index.html as a fallback
        // for navigation requests so the app shell loads instead of a browser error
        if (event.request.mode === 'navigate') {
          return caches.match(basePath + 'index.html');
        }
      });
    })
  );
});
