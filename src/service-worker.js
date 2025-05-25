const CACHE_NAME = 'liburin-app-shell-v1';
const APP_SHELL = [
  '/',
  '/index.html',
  '/manifest.json',
  '/public/favicon.png',
  '/public/favicon.ico',
  '/public/images/logo.png',
  '/styles/styles.css',
  '/styles/responsives.css',
  // Tambahkan file statis lain jika perlu
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keyList) =>
      Promise.all(keyList.map((key) => {
        if (key !== CACHE_NAME) {
          return caches.delete(key);
        }
      }))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request).catch(() => {
        // Fallback untuk halaman utama jika offline
        if (event.request.mode === 'navigate') {
          return caches.match('/index.html');
        }
      });
    })
  );
});

self.addEventListener('push', function(event) {
  const data = event.data ? event.data.json() : {};
  const title = data.title || 'Notifikasi Baru';
  const options = {
    body: data.body || 'Anda memiliki notifikasi baru.',
    icon: '/src/public/favicon.png',
    badge: '/src/public/favicon.ico',
    data: data.url || '/'
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data)
  );
});
