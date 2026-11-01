/* Parand Pastry: offline shell.
   Code and pages: network first (a redeploy is never hidden behind a stale cache), cache as fallback.
   Images and the font: cache first. Video range requests go straight to the network. */
const V = 'pp-v1';
const SHELL = [
  './', 'index.html', 'manifest.webmanifest', 'css/app.css?v=1',
  'js/app.js?v=1', 'js/ui.js', 'js/nav.js', 'js/store.js', 'js/data.js', 'js/icons.js', 'js/mark.js',
  'assets/fonts/IRANYekanX-FaNum-VF.woff2', 'assets/brand/mark.svg', 'assets/brand/alpha-black.png', 'assets/brand/alpha-white.png',
  'assets/icons/icon-192.png', 'assets/icons/apple-touch-icon.png', 'assets/media/hero-poster.webp',
  'assets/img/croissant-oreo-480.webp', 'assets/img/croissant-strawberry-480.webp', 'assets/img/croissant-lotus-480.webp',
  'assets/img/croissant-redvelvet-480.webp', 'assets/img/croissant-black-480.webp', 'assets/img/cake-vintage-480.webp',
  'assets/img/bento-bear-480.webp', 'assets/img/mini-flower-480.webp', 'assets/img/cookie-brownie-480.webp',
];
self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(V).then((c) => c.addAll(SHELL)).catch(() => {}).then(() => self.skipWaiting()));
});
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== V).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', (e) => {
  const r = e.request;
  const u = new URL(r.url);
  if (r.method !== 'GET' || u.origin !== location.origin) return;
  if (r.headers.has('range') || u.pathname.endsWith('.mp4')) return;
  const code = /\.(js|css|html|webmanifest)$|\/$/.test(u.pathname);
  if (code) {
    e.respondWith(fetch(r, { cache: 'no-cache' }).then((res) => {
      if (res.ok) { const copy = res.clone(); caches.open(V).then((c) => c.put(r, copy)); }
      return res;
    }).catch(() => caches.match(r).then((m) => m || caches.match('index.html'))));
    return;
  }
  e.respondWith(caches.match(r).then((m) => m || fetch(r).then((res) => {
    if (res.ok && res.type === 'basic') { const copy = res.clone(); caches.open(V).then((c) => c.put(r, copy)); }
    return res;
  })));
});
