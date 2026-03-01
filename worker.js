// worker.js - Service Worker for Mini Games PWA
// Caches all static assets for offline use and updates cache on new deploy

const CACHE_NAME = 'mini-games-v4';
const ASSETS = [
  '',
  'index.html',
  'block-drop.html',
  'maths-quest.html',
  'manifest.webmanifest',
  'worker.js',
  'icon.svg',
  // Add screenshots and icons as needed
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(ASSETS.map(path => '/games/' + path));
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
