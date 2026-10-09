const CACHE = 'conditions-v1';
const PRECACHE = ['02-final.html', '02-offline.html', '../../../assets/style.css'];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(PRECACHE)));
});

self.addEventListener('activate', (event) => {
  // Remove caches from older versions of this worker
  event.waitUntil(caches.keys().then((keys) => Promise.all(
    keys.filter((key) => key.startsWith('conditions') && key !== CACHE).map((key) => caches.delete(key)),
  )));
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;
  if (request.mode === 'navigate') {
    // Pages: network first, then the saved copy, then the offline page
    event.respondWith(fetch(request).catch(async () => (await caches.match(request)) || caches.match('02-offline.html')));
    return;
  }
  // Styles and other files: the saved copy first
  event.respondWith(caches.match(request).then((cached) => cached || fetch(request)));
});
