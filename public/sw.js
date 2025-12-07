// This is a basic service worker
self.addEventListener('install', (event) => {
  console.log('Service Worker installing.');
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker activating.');
});

self.addEventListener('fetch', (event) => {
  // This is a simple fetch handler that just fetches from the network.
  // For a real-world app, you'd want to implement caching strategies.
  event.respondWith(fetch(event.request));
});
