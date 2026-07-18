const CACHE_NAME = 'siren-shell-v4';
const RUNTIME_CACHE = 'siren-runtime-v4';
const scopeUrl = new URL(self.registration.scope);
const APP_SHELL = [
  scopeUrl.href,
  new URL('index.html', scopeUrl).href,
  new URL('manifest.webmanifest', scopeUrl).href,
  new URL('logo.svg', scopeUrl).href
];

const canCache = (request, response) => {
  return request.url.startsWith(self.location.origin) && response && response.ok;
};

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames
          .filter((cacheName) => cacheName !== CACHE_NAME && cacheName !== RUNTIME_CACHE)
          .map((cacheName) => caches.delete(cacheName))
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;

  if (request.method !== 'GET' || !request.url.startsWith(self.location.origin)) return;

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then(async (response) => {
          if (canCache(request, response)) {
            const cache = await caches.open(RUNTIME_CACHE);
            await cache.put(request, response.clone());
          }
          return response;
        })
        .catch(() => caches.match(new URL('index.html', scopeUrl).href))
    );
    return;
  }

  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) return cachedResponse;

      return fetch(request).then(async (response) => {
        if (canCache(request, response)) {
          const cache = await caches.open(RUNTIME_CACHE);
          await cache.put(request, response.clone());
        }
        return response;
      });
    })
  );
});
