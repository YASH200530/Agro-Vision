const CACHE_NAME = 'agrovision-cache-v1';
const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/favicon.svg',
  '/manifest.webmanifest'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(
      keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
    ))
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Network-first for API calls
  if (request.url.includes('/api/')) {
    event.respondWith(
      fetch(request)
        .then((res) => {
          // optionally update cache
          return res;
        })
        .catch(() => caches.match(request))
    );
    return;
  }

  // Cache-first for navigation and static assets
  event.respondWith(
    caches.match(request).then((cached) => cached || fetch(request).then((res) => {
      // Cache fetched files (but ignore opaque responses)
      if (res && res.type !== 'opaque' && request.method === 'GET') {
        const resClone = res.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(request, resClone));
      }
      return res;
    }).catch(() => caches.match('/index.html')))
  );
});
