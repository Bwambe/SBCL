// Service worker de SEPPO BCL : garde l'app en mémoire pour qu'elle marche hors ligne.
// Quand tu modifies un fichier de l'app, change le numéro de VERSION pour forcer la mise à jour.
const VERSION = 'seppo-bcl-v1';
const FILES = [
  "./",
  "./icon-192.png",
  "./icon-512.png",
  "./icon-maskable-512.png",
  "./index.html",
  "./mammoth.browser.min.js",
  "./manifest.json",
  "./pdf.min.js",
  "./pdf.worker.min.js"
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(VERSION).then(cache => cache.addAll(FILES)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request, { ignoreSearch: true }).then(hit => {
      if (hit) return hit;
      return fetch(event.request).catch(() => {
        if (event.request.mode === 'navigate') return caches.match('./index.html');
      });
    })
  );
});
