const CACHE_NAME = 'couvertures-aldo-v1.2.0';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  // Ajoutez ici d'autres ressources si nécessaire
];

// Installation du Service Worker
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Cache ouvert');
        return cache.addAll(urlsToCache);
      })
  );
});

// Activation du Service Worker
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheName !== CACHE_NAME) {
            console.log('Suppression de l\'ancien cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Interception des requêtes
self.addEventListener('fetch', function(event) {
  // Ne pas mettre en cache les requêtes vers l'API météo
  if (event.request.url.includes('open-meteo.com')) {
    return fetch(event.request);
  }

  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Retourne la réponse en cache ou fetch la requête
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});