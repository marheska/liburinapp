const CACHE_NAME = 'liburin-app-shell-v1';
const APP_SHELL = [
  './',
  './index.html',
  './src/public/favicon.png',
  './src/public/manifest.json',
  './src/styles/styles.css',
  './src/styles/responsives.css',
  './src/scripts/index.js',
  // Tambahkan file statis lain jika perlu
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(APP_SHELL))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      )
    )
  );
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request).then(response => {
      return (
        response ||
        fetch(event.request).catch(() =>
          caches.match('./index.html')
        )
      );
    })
  );
});

self.addEventListener('push', function(event) {
  const data = event.data ? event.data.json() : {};
  const title = data.title || 'Libur.in Notifikasi';
  const options = {
    body: data.body || 'Ada cerita liburan baru!',
    icon: './favicon.png',
    data: data.url || './',
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data)
  );
});
