const CACHE_NAME = 'infinity-adega-cache-v1';
const ASSETS_TO_CACHE = [
  'index.html',
  'style.css',
  'script.js',
  'produtos.js',
  'manifest.json',
  'offline.html',
  'icons/icon-192.png',
  'icons/icon-512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS_TO_CACHE))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
    ))
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') {
    return;
  }

  if (request.mode === 'navigate' || (request.headers.get('accept')?.includes('text/html'))) {
    event.respondWith(
      fetch(request)
        .then(response => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(request, copy));
          return response;
        })
        .catch(() => caches.match('offline.html'))
    );
    return;
  }

  event.respondWith(
    caches.match(request).then(cacheResponse => cacheResponse || fetch(request).catch(() => caches.match('offline.html')))
  );
});