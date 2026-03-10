/**
 * Krypto-Bot v5.0 — Service Worker
 * Handles: Offline caching, background sync, push notifications
 */

const CACHE_NAME = 'kryptobot-v5-cache-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
];

// ============================================================
// INSTALL — Cache core assets
// ============================================================
self.addEventListener('install', (event) => {
  console.log('[SW] Installing Service Worker...');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Caching core assets');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// ============================================================
// ACTIVATE — Clean up old caches
// ============================================================
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating Service Worker...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => {
            console.log('[SW] Deleting old cache:', name);
            return caches.delete(name);
          })
      );
    })
  );
  self.clients.claim();
});

// ============================================================
// FETCH — Serve from cache, fallback to network
// ============================================================
self.addEventListener('fetch', (event) => {
  // Skip WebSocket requests
  if (event.request.url.startsWith('ws://') || event.request.url.startsWith('wss://')) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        // Return cached version, but also update cache in background
        event.waitUntil(
          fetch(event.request).then((response) => {
            if (response && response.status === 200) {
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(event.request, response);
              });
            }
          }).catch(() => {})
        );
        return cachedResponse;
      }

      return fetch(event.request).then((response) => {
        // Cache new successful responses
        if (response && response.status === 200 && response.type === 'basic') {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return response;
      }).catch(() => {
        // Offline fallback
        if (event.request.destination === 'document') {
          return caches.match('/index.html');
        }
      });
    })
  );
});

// ============================================================
// PUSH NOTIFICATIONS — Receive from bot server
// ============================================================
self.addEventListener('push', (event) => {
  let data = { title: 'Krypto-Bot v5.0', body: 'Neue Benachrichtigung', icon: '/icons/icon-192x192.png' };

  if (event.data) {
    try {
      data = { ...data, ...event.data.json() };
    } catch (e) {
      data.body = event.data.text();
    }
  }

  const options = {
    body: data.body,
    icon: data.icon || '/icons/icon-192x192.png',
    badge: '/icons/icon-96x96.png',
    vibrate: [100, 50, 100],
    data: data.url || '/',
    actions: data.actions || [
      { action: 'open', title: 'Dashboard öffnen' },
      { action: 'dismiss', title: 'Schließen' },
    ],
    tag: data.tag || 'kryptobot-notification',
    renotify: true,
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'dismiss') return;

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // Focus existing window if open
      for (const client of clientList) {
        if (client.url.includes('/index.html') && 'focus' in client) {
          return client.focus();
        }
      }
      // Otherwise open new window
      return clients.openWindow(event.notification.data || '/');
    })
  );
});

// ============================================================
// BACKGROUND SYNC — Retry failed actions when back online
// ============================================================
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-bot-state') {
    console.log('[SW] Background sync triggered');
    // Can be used to retry sending commands to bot
  }
});

console.log('[SW] Service Worker loaded');
