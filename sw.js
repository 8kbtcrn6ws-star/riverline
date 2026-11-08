'use strict';
importScripts('./precache.js');
const PREFIX='riverline-protected-',CACHE=PREFIX+RIVERLINE_PROTECTED.version,ROOT=new URL('./',self.location.href),INDEX=new URL('index.html',ROOT).href,KNOWN=new Set(RIVERLINE_PROTECTED.urls.map(u=>new URL(u,ROOT).href));
self.addEventListener('install',event=>event.waitUntil((async()=>{try{const cache=await caches.open(CACHE);await cache.addAll(RIVERLINE_PROTECTED.urls.map(u=>new Request(new URL(u,ROOT),{cache:'reload'})));}catch(error){await caches.delete(CACHE);throw error;}})()));
self.addEventListener('activate',event=>event.waitUntil((async()=>{for(const name of await caches.keys())if(name.startsWith(PREFIX)&&name!==CACHE)await caches.delete(name);await self.clients.claim();})()));
self.addEventListener('message',event=>{if(event.data?.type==='SKIP_WAITING')self.skipWaiting();});
self.addEventListener('fetch',event=>{const r=event.request,u=new URL(r.url);if(r.method!=='GET'||u.origin!==ROOT.origin||!u.pathname.startsWith(ROOT.pathname)||u.searchParams.has('check'))return;if(r.mode==='navigate'){event.respondWith((async()=>{const cache=await caches.open(CACHE);return await cache.match(INDEX)||fetch(r);})());return;}u.search='';if(KNOWN.has(u.href))event.respondWith((async()=>{const cache=await caches.open(CACHE);return await cache.match(u.href)||fetch(r);})());});
