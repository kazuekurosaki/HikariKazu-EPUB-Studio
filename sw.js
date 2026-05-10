const CACHE_NAME = 'hikari-v7-final';

// Daftar aset yang akan dikunci di memori perangkat untuk akses offline
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js',
  'https://cdn.tailwindcss.com'
];

// Tahap Install: Menyimpan semua aset ke dalam cache
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Hikari Engine: Caching assets...');
        return cache.addAll(ASSETS_TO_CACHE);
      })
      .then(() => self.skipWaiting())
  );
});

// Tahap Aktivasi: Menghapus cache versi lama jika ada pembaruan script
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Hikari Engine: Clearing old cache...');
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Tahap Fetch: Mengambil data dari cache saat offline, atau dari internet saat online
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Jika ada di cache, kirim file dari cache (Instan)
        if (response) {
          return response;
        }
        // Jika tidak ada, ambil dari jaringan
        return fetch(event.request);
      })
  );
});
