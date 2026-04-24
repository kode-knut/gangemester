const CACHE_NAME = 'gangemester-v4';
const urlsToCache = [
    './',
    './index.html',
    './styles.css',
    './app.js',
    './manifest.json',
    './icon-192.png',
    './icon-512.png'
];

// Installer service worker og cache filer
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Cache åpnet');
                return cache.addAll(urlsToCache);
            })
    );
});

// Serve cached content når offline
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Cache hit - returner response
                if (response) {
                    return response;
                }
                return fetch(event.request);
            }
        )
    );
});

// Oppdater service worker
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Sletter gammel cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
