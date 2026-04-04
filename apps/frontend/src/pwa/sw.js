/**
 * Smart Fashion Styling - Service Worker
 * Handles offline functionality, caching, and background sync
 */

const CACHE_NAME = 'smart-fashion-v1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json'
];

// Install event - cache static assets
self.addEventListener('install', event => {
  console.log('[Service Worker] Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('[Service Worker] Caching static assets');
      return cache.addAll(STATIC_ASSETS).catch(err => {
        console.error('[Service Worker] Error caching static assets:', err);
      });
    })
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  console.log('[Service Worker] Activating...');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('[Service Worker] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event - implement caching strategies
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // API requests - Network First strategy
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request)
        .then(response => {
          if (!response || response.status !== 200) {
            return response;
          }
          // Clone the response
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(request, responseToCache);
          });
          return response;
        })
        .catch(() => {
          // Return cached response if network fails
          return caches.match(request).then(response => {
            if (response) {
              console.log('[Service Worker] Serving from cache:', url.pathname);
              return response;
            }
            // Return offline page if available
            return caches.match('/index.html');
          });
        })
    );
  }
  // Images - Cache First strategy
  else if (request.destination === 'image') {
    event.respondWith(
      caches.match(request).then(response => {
        return response || fetch(request).then(response => {
          if (!response || response.status !== 200) {
            return response;
          }
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(request, responseToCache);
          });
          return response;
        }).catch(() => {
          const placeholder = new Response(
            '<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect fill="#ddd"/></svg>',
            { headers: { 'Content-Type': 'image/svg+xml' } }
          );
          return placeholder;
        });
      })
    );
  }
  // Static assets (CSS, JS) - Cache First strategy
  else if (
    request.destination === 'style' ||
    request.destination === 'script' ||
    url.pathname.match(/\.(css|js|woff2?|ttf|eot)$/)
  ) {
    event.respondWith(
      caches.match(request).then(response => {
        return response || fetch(request).then(response => {
          if (!response || response.status !== 200) {
            return response;
          }
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(request, responseToCache);
          });
          return response;
        }).catch(() => {
          console.log('[Service Worker] Failed to fetch:', url.pathname);
          return caches.match('/index.html');
        });
      })
    );
  }
  // HTML documents - Network First strategy
  else if (request.destination === 'document' || request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then(response => {
          if (!response || response.status !== 200) {
            return response;
          }
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(request, responseToCache);
          });
          return response;
        })
        .catch(() => {
          return caches.match(request).then(response => {
            return response || caches.match('/index.html');
          });
        })
    );
  }
  // Default - Network First
  else {
    event.respondWith(
      fetch(request)
        .then(response => {
          if (!response || response.status !== 200) {
            return response;
          }
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(request, responseToCache);
          });
          return response;
        })
        .catch(() => {
          return caches.match(request);
        })
    );
  }
});

// Background sync for offline actions
self.addEventListener('sync', event => {
  console.log('[Service Worker] Background sync triggered:', event.tag);
  
  if (event.tag === 'sync-profile-updates') {
    event.waitUntil(syncProfileUpdates());
  }
});

// Push notifications
self.addEventListener('push', event => {
  if (!event.data) return;
  
  const data = event.data.json();
  const options = {
    body: data.body,
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-192x192.png',
    tag: data.tag || 'notification',
    requireInteraction: data.requireInteraction || false
  };
  
  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then(clientList => {
      for (let i = 0; i < clientList.length; i++) {
        const client = clientList[i];
        if (client.url === '/' && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow('/');
      }
    })
  );
});

// Periodic background sync
self.addEventListener('periodicsync', event => {
  console.log('[Service Worker] Periodic sync triggered:', event.tag);
  
  if (event.tag === 'sync-recommendations') {
    event.waitUntil(syncRecommendations());
  }
});

/**
 * Helper function - Sync profile updates
 */
async function syncProfileUpdates() {
  try {
    const pendingList = await getCacheData('pending-profile-updates');
    if (pendingList && pendingList.length > 0) {
      for (const update of pendingList) {
        await fetch('/api/v1/user/profile', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(update)
        });
      }
      // Clear pending list
      await clearCacheData('pending-profile-updates');
      // Notify user
      await self.registration.showNotification('Profile Synced', {
        body: 'Your profile changes have been saved.',
        icon: '/icons/icon-192x192.png'
      });
    }
  } catch (error) {
    console.error('[Service Worker] Error syncing profile:', error);
  }
}

/**
 * Helper function - Sync recommendations
 */
async function syncRecommendations() {
  try {
    const response = await fetch('/api/v1/recommendations');
    const data = await response.json();
    // Cache recommendations
    const cache = await caches.open(CACHE_NAME);
    cache.put('/api/v1/recommendations', new Response(JSON.stringify(data)));
  } catch (error) {
    console.error('[Service Worker] Error syncing recommendations:', error);
  }
}

/**
 * Helper function - Get cache data
 */
async function getCacheData(key) {
  try {
    const cache = await caches.open(CACHE_NAME);
    const response = await cache.match(`/cache/${key}`);
    return response ? response.json() : null;
  } catch (error) {
    console.error('[Service Worker] Error getting cache data:', error);
    return null;
  }
}

/**
 * Helper function - Clear cache data
 */
async function clearCacheData(key) {
  try {
    const cache = await caches.open(CACHE_NAME);
    await cache.delete(`/cache/${key}`);
  } catch (error) {
    console.error('[Service Worker] Error clearing cache data:', error);
  }
}

console.log('[Service Worker] Loaded successfully');
