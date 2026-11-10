'use strict';
const VERSION = 'v0.1.2';
// Scope-specific cache name so sibling apps on the same origin never delete each other's caches.
const PREFIX = 'bjj-notes:' + self.registration.scope + ':';
const CACHE = PREFIX + VERSION;
// Base-path independent: every asset is resolved against the registration scope (works at / and at /<repo>/)
const ASSETS = ['./', './index.html', './tokens.css', './components.css', './styles.css', './theme.js', './core.js', './db.js', './video.js', './graph.js', './app.js',
  './data/rei-seed.json', './data/layout.json', './manifest.webmanifest', './icons/icon-192.png', './icons/icon-512.png', './icons/apple-touch-icon.png', './icons/maskable-512.png'];
self.addEventListener('install', event => { event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(ASSETS.map(p => new Request(new URL(p, self.registration.scope).href, { cache: 'reload' }))))); });
// skipWaiting only when the user taps 「立即更新」
self.addEventListener('message', event => { if (event.data && event.data.type === 'SKIP_WAITING') self.skipWaiting(); });
self.addEventListener('activate', event => { event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k.startsWith(PREFIX) && k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  if (event.request.method !== 'GET' || url.origin !== self.location.origin || !url.href.startsWith(self.registration.scope)) return;
  const allowed = new Set(ASSETS.map(p => new URL(p, self.registration.scope).href));
  if (event.request.mode === 'navigate') event.respondWith(caches.open(CACHE).then(cache => cache.match(new URL('./index.html', self.registration.scope).href).then(hit => hit || fetch(event.request))));
  else if (allowed.has(url.href)) event.respondWith(caches.open(CACHE).then(cache => cache.match(event.request).then(hit => hit || fetch(event.request))));
});
