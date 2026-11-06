// Cache only an explicitly listed, same-origin application shell. No chats,
// credentials, API responses or third-party model downloads enter this cache.
const CACHE='olli-shell-v1';
const SHELL=['/','/index.html','/manifest.webmanifest','/src/app.js','/src/style.css','/src/assets/brand/olli-logo.svg','/src/assets/brand/favicon.svg','/src/assets/brand/app-192.png','/src/assets/brand/app-512.png',"/src/assets/icons/message-square.svg","/src/assets/icons/shopping-bag.svg","/src/assets/icons/plane.svg","/src/assets/icons/calendar-days.svg","/src/assets/icons/map.svg","/src/assets/icons/credit-card.svg","/src/assets/icons/mail.svg","/src/assets/icons/calendar.svg","/src/assets/icons/notebook.svg","/src/assets/icons/list-checks.svg","/src/assets/icons/smile.svg","/src/assets/icons/file-text.svg","/src/assets/icons/palette.svg","/src/assets/icons/bell.svg","/src/assets/icons/git-branch.svg"];
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(SHELL))));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith('olli-shell-')&&key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{
 const url=new URL(event.request.url);
 if(event.request.method!=='GET'||url.origin!==self.location.origin)return;
 if(event.request.mode==='navigate'){
  event.respondWith(fetch(event.request).catch(()=>caches.match('/index.html')));return;
 }
 if(!SHELL.includes(url.pathname)||url.search)return;
 event.respondWith(fetch(event.request).catch(()=>caches.match(url.pathname)));
});
