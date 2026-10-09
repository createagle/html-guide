// It saves the page when it installs... but never uses the copy
self.addEventListener('install', (event) => {
  event.waitUntil(caches.open('conditions').then((cache) => cache.add('02-start.html')));
});

self.addEventListener('fetch', (event) => {
  event.respondWith(fetch(event.request));
});
