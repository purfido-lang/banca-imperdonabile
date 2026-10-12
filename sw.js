/* Banca Imperdonabile: prima prova la rete (cosi' gli aggiornamenti arrivano subito),
   se sei offline usa la copia salvata. I dati non passano di qui: restano nel telefono. */
var CACHE = 'bi-v1';
self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(['./', 'manifest.json', 'icon-192.png', 'icon-512.png']); }));
  self.skipWaiting();
});
self.addEventListener('activate', function (e) { e.waitUntil(self.clients.claim()); });
self.addEventListener('fetch', function (e) {
  var req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;
  e.respondWith(fetch(req).then(function (res) {
    var copy = res.clone();
    caches.open(CACHE).then(function (c) { c.put(req, copy); });
    return res;
  }).catch(function () { return caches.match(req).then(function (r) { return r || caches.match('./'); }); }));
});
