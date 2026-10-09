// Bump the version whenever a cached file changes: the new worker installs a new cache
const VERSION = 'v1';
const CACHE = `packing-list-${VERSION}`;
const PRECACHE = [
  './',
  'offline.html',
  'manifest.webmanifest',
  'icon.svg',
  'icon-192.png',
  '../../../assets/style.css',
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(PRECACHE)));
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    for (const key of await caches.keys()) {
      if (key.startsWith('packing-list-') && key !== CACHE) await caches.delete(key);
    }
    await self.clients.claim();
  })());
});

self.addEventListener('message', (event) => {
  if (event.data === 'skip-waiting') self.skipWaiting();
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET' || new URL(request.url).origin !== location.origin) return;

  if (request.mode === 'navigate') {
    // Pages: try the network first so they stay fresh, then the cache, then the offline page
    event.respondWith((async () => {
      try {
        const response = await fetch(request);
        const cache = await caches.open(CACHE);
        cache.put(request, response.clone());
        return response;
      } catch {
        return (await caches.match(request)) || caches.match('offline.html');
      }
    })());
    return;
  }

  // Everything else: the cache first, the network as a fallback
  event.respondWith(caches.match(request).then((cached) => cached || fetch(request)));
});
