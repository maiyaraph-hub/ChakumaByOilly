// เก็บเฉพาะหน้าแอป (ไม่เก็บระบบ Google) — แก้เลขเวอร์ชันทุกครั้งที่อัปเดต index.html
const CACHE = 'chakuma-v7';
const SHELL = ['./', './index.html', './manifest.json', './icon-192.png', './icon-512.png', './apple-touch-icon.png', './favicon.png'];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (url.origin !== location.origin) return;           // ระบบ Google โหลดสดเสมอ
  e.respondWith(fetch(e.request).then(r => {             // มีเน็ต = เอาของใหม่, ไม่มีเน็ต = ใช้ของเก่า
    const copy = r.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); return r;
  }).catch(() => caches.match(e.request).then(m => m || caches.match('./index.html'))));
});
