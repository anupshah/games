// worker.js - Service Worker for Mini Games PWA
// Caches all static assets for offline use and updates cache on new deploy

const CACHE_NAME = 'mini-games-v10';

// Dynamically determine base path from service worker location to support
// localhost vs GitHub Pages deployment without hardcoding paths
const getBasePath = () => {
  const pathname = self.location.pathname;
  return pathname.substring(0, pathname.lastIndexOf('/') + 1);
};

const basePath = getBasePath();

const ASSETS = [
  basePath + 'index.html',
  basePath + 'block-drop.html',
  basePath + 'maths-quest.html',
  basePath + 'manifest.webmanifest',
  basePath + 'worker.js',
  basePath + 'icon.svg',
  // Add screenshots and icons as needed
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
    caches.match(event.request).then(response =>
      response || fetch(event.request).then(fetchRes => {
        // Optionally cache new requests here
        return fetchRes;
      })
    )
  );
});
