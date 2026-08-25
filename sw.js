/* DreyBird service worker — hand-rolled, no dependencies.
   Bump CACHE to ship an update; the old cache is dropped on activate. */

const CACHE = 'dreybird-v2';   // bumped when the app shell changes
const RUNTIME = 'dreybird-runtime-v1';

const SHELL = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-maskable-512.png',
  './icons/apple-touch-icon-180.png'
];

const FONT_HOSTS = ['fonts.googleapis.com', 'fonts.gstatic.com'];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE)
      .then(c => c.addAll(SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(names => Promise.all(
        names.filter(n => n !== CACHE && n !== RUNTIME).map(n => caches.delete(n))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);

  // The pixel typeface: serve what we have, refresh in the background.
  if (FONT_HOSTS.includes(url.hostname)) {
    event.respondWith(staleWhileRevalidate(req));
    return;
  }

  if (url.origin !== self.location.origin) return;

  // Any navigation inside our scope resolves to the game itself.
  if (req.mode === 'navigate') {
    event.respondWith(
      caches.match('./index.html', { ignoreSearch: true })
        .then(hit => hit || fetch(req).catch(() => caches.match('./')))
    );
    return;
  }

  event.respondWith(cacheFirst(req));
});

function cacheFirst(req) {
  return caches.match(req, { ignoreSearch: true }).then(hit => {
    const network = fetch(req).then(res => {
      if (res && res.ok) {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(req, copy));
      }
      return res;
    });
    return hit || network;
  });
}

function staleWhileRevalidate(req) {
  return caches.open(RUNTIME).then(cache =>
    cache.match(req).then(hit => {
      const network = fetch(req)
        .then(res => {
          // Opaque font responses are cacheable and still usable.
          if (res && (res.ok || res.type === 'opaque')) cache.put(req, res.clone());
          return res;
        })
        .catch(() => hit);
      return hit || network;
    })
  );
}
