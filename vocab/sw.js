'use strict';
const VERSION = 'v1.1.0';
// Path-specific cache name prevents sibling apps on the same GitHub Pages origin
// from deleting each other's caches. Never cache lookup/translation requests.
const PREFIX='everyday-vocab:'+self.registration.scope+':';
const CACHE=PREFIX+VERSION;
const ASSETS=['./','./index.html','./styles.css','./phonics.js','./core.js','./app.js','./data/words.json','./manifest.webmanifest','./icons/icon-192.png','./icons/icon-512.png','./icons/apple-touch-icon.png','./icons/maskable-512.png'];
self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS.map(url=>new Request(url,{cache:'reload'})))));});
// No skipWaiting: a new worker takes over only after all old app windows close.
self.addEventListener('activate',event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith(PREFIX)&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',event=>{const url=new URL(event.request.url);if(event.request.method!=='GET'||url.origin!==self.location.origin||!url.href.startsWith(self.registration.scope))return;
 const allowed=new Set(ASSETS.map(p=>new URL(p,self.registration.scope).href));
 if(event.request.mode==='navigate')event.respondWith(caches.open(CACHE).then(cache=>cache.match('./index.html').then(hit=>hit||fetch(event.request))));
 else if(allowed.has(url.href))event.respondWith(caches.open(CACHE).then(cache=>cache.match(event.request).then(hit=>hit||fetch(event.request))));
});
