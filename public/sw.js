// Service Worker for PWA with proper cache handling
const CACHE_NAME = 'plantopia-v2';
const STATIC_CACHE = 'plantopia-static-v2';

// URLs to cache (only essential pages, not static assets)
const urlsToCache = [
  '/',
  '/login',
  '/signup',
  '/dashboard',
  '/manifest.json',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && cacheName !== STATIC_CACHE) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  // Handle Next.js static assets differently
  if (event.request.url.includes('/_next/static/')) {
    event.respondWith(
      caches.open(STATIC_CACHE).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response) {
            // Check if it's a CSS file and if it exists
            if (event.request.url.includes('.css')) {
              return fetch(event.request).then((fetchResponse) => {
                if (fetchResponse.ok) {
                  cache.put(event.request, fetchResponse.clone());
                  return fetchResponse;
                }
                return response;
              }).catch(() => response);
            }
            return response;
          }
          
          return fetch(event.request).then((fetchResponse) => {
            if (fetchResponse.ok) {
              cache.put(event.request, fetchResponse.clone());
            }
            return fetchResponse;
          });
        });
      })
    );
  } else {
    // Handle other requests with network-first strategy
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Only cache successful responses
          if (response.status === 200) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          return caches.match(event.request);
        })
    );
  }
});

