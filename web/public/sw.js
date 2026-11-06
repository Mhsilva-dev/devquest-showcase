// Service worker mínimo: deixa o app instalável. Página e API sempre vêm da rede (nunca uma versão velha
// depois de um deploy); só os ícones ficam em cache. Mudar a versão força os aparelhos a baixarem ícones novos.
const CACHE = 'devquest-static-v1';
const CACHEABLE = ['/icons/icon-192.png', '/icons/icon-512.png', '/icons/icon-maskable-192.png', '/icons/icon-maskable-512.png', '/icons/apple-touch-icon.png'];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(caches.open(CACHE).then((c) => c.addAll(CACHEABLE)));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(caches.keys()
    .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
    .then(() => self.clients.claim()));
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  if (CACHEABLE.includes(url.pathname)) event.respondWith(caches.match(event.request).then((hit) => hit || fetch(event.request)));
  // Todo o resto: rede
});
